import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const photoId = url.searchParams.get('photoId');
    const colorize = url.searchParams.get('colorize') === 'true';
    
    if (!photoId) {
      return NextResponse.json({ error: 'Missing photoId' }, { status: 400 });
    }

    const payload = await req.json();

    // Quando o Replicate finaliza, envia o status 'succeeded' ou 'failed'
    if (payload.status === 'succeeded' && payload.output) {
      // GFPGAN geralmente retorna array de URLs ou string output final.
      const restoredUrl = Array.isArray(payload.output) 
                          ? payload.output[payload.output.length - 1] 
                          : payload.output;

      if (restoredUrl) {
        // Se o usuário pediu colorização E ainda não fizemos (para evitar loop infinito)
        if (colorize) {
          console.log(`[AI Chain] Restaurado com CodeFormer. Agora iniciando Colorização (DeOldify)...`);
          const { origin } = new URL(req.url);
          const nextWebhookUrl = `${origin}/api/webhook/replicate?photoId=${photoId}`; // Sem o "&colorize=true" para que o próximo passo seja o Cloudinary

          // Função auxiliar para retry em caso de Rate Limit (429) do Replicate (comum em contas grátis)
          const callWithRetry = async (retries = 2, delay = 2000) => {
            for (let i = 0; i <= retries; i++) {
              try {
                await replicate.predictions.create({
                  version: "ca494ba129e44e45f661d6ece83c4c98a9a7c774309beca01429b58fce8aa695", // piddnad/ddcolor
                  input: {
                    image: restoredUrl,
                    model_size: "large"
                  },
                  webhook: nextWebhookUrl,
                  webhook_events_filter: ["completed"]
                });
                return true;
              } catch (error: any) {
                if (error.status === 429 && i < retries) {
                  console.warn(`[AI Chain] Rate limit (429). Tentando novamente em ${delay}ms... (Tentativa ${i+1}/${retries})`);
                  await new Promise(resolve => setTimeout(resolve, delay));
                  continue;
                }
                throw error;
              }
            }
          };

          try {
            await callWithRetry();
            return NextResponse.json({ success: true, status: 'COLORIZING' }, { status: 200 });
          } catch (colorError: any) {
            console.error(`[AI Chain] Falha definitiva ao disparar DDColor: ${colorError.message}`);
            // Se falhar a colorização, salva o resultado da restauração (CodeFormer) pelo menos!
            const uploadResult = await cloudinary.uploader.upload(restoredUrl, {
              folder: 'aura_recall/restored'
            });
            await prisma.photo.update({
              where: { id: photoId },
              data: { status: 'COMPLETED', restoredUrl: uploadResult.secure_url }
            });
            return NextResponse.json({ success: true, status: 'COMPLETED_WITHOUT_COLOR' }, { status: 200 });
          }
        }

        // Upload final para o Cloudinary para ter armazenamento permanente
        console.log(`[AI End] Processo finalizado. Fazendo upload permanente para Cloudinary...`);
        const uploadResult = await cloudinary.uploader.upload(restoredUrl, {
          folder: 'aura_recall/restored'
        });

        await prisma.photo.update({
          where: { id: photoId },
          data: { 
            status: 'COMPLETED',
            restoredUrl: uploadResult.secure_url
          }
        });
        return NextResponse.json({ success: true, status: 'COMPLETED' }, { status: 200 });
      }
    } else if (payload.status === 'failed' || payload.status === 'canceled') {
      await prisma.photo.update({
        where: { id: photoId },
        data: { status: 'FAILED' }
      });
      return NextResponse.json({ success: true, status: 'FAILED' }, { status: 200 });
    }

    // Apenas respondendo que recebemos outro tipo de atualizacao util (e.g. 'processing')
    return NextResponse.json({ success: true, status: payload.status }, { status: 200 });
  } catch (error) {
    console.error('Webhook Replicate Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
