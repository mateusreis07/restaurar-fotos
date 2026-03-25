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
    const animate = url.searchParams.get('animate') === 'true';
    
    if (!photoId) {
      return NextResponse.json({ error: 'Missing photoId' }, { status: 400 });
    }

    const payload = await req.json();

    // --- FUNÇÕES AUXILIARES DE CHAINING ---
    
    // Retry em caso de Rate Limit (429) do Replicate (comum em contas grátis)
    const callWithRetry = async (replicateCall: () => Promise<any>, retries = 2, delay = 2000) => {
      for (let i = 0; i <= retries; i++) {
        try {
          await replicateCall();
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

    // Finaliza a imagem (salva no Cloudinary e DB)
    const finalizeImage = async (urlToUpload: string, isAnimatedVideo = false) => {
      console.log(`[AI End] Processo finalizado. Fazendo upload permanente para Cloudinary...`);
      const uploadResult = await cloudinary.uploader.upload(urlToUpload, {
        folder: 'aura_recall/restored',
        resource_type: isAnimatedVideo ? 'video' : 'image'
      });

      await prisma.photo.update({
        where: { id: photoId! },
        data: {
          restoredUrl: isAnimatedVideo ? undefined : uploadResult.secure_url,
          animatedUrl: isAnimatedVideo ? uploadResult.secure_url : undefined,
          status: 'COMPLETED'
        }
      });

      return NextResponse.json({ success: true, status: 'COMPLETED' }, { status: 200 });
    };

    // Dispara a animação (SadTalker)
    const triggerAnimation = async (imageUrl: string) => {
      const { origin } = new URL(req.url);
      const nextWebhookUrl = `${origin}/api/webhook/replicate?photoId=${photoId}`; 

      try {
        await callWithRetry(async () => {
          await replicate.predictions.create({
            version: "a519cc0cfebaaeade068b23899165a11ec76aaa1d2b313d40d214f204ec957a3", // cjwbw/sadtalker
            input: {
              source_image: imageUrl,
              driven_audio: "https://github.com/anars/blank-audio/raw/master/1-second-of-silence.mp3",
              use_eyeblink: true,
              still_mode: true,
              use_enhancer: true,
              facerender: "facevid2vid",
              size_of_image: 512,
              preprocess: "crop" 
            },
            webhook: nextWebhookUrl,
            webhook_events_filter: ["completed"]
          });
        });
        return NextResponse.json({ success: true, status: 'ANIMATING' }, { status: 200 });
      } catch (animError: any) {
        console.error(`[AI Chain] Erro ao disparar SadTalker: ${animError.message}`);
        return await finalizeImage(imageUrl);
      }
    };

    // Quando o Replicate finaliza, envia o status 'succeeded' ou 'failed'
    if (payload.status === 'succeeded' && payload.output) {
      // GFPGAN geralmente retorna array de URLs ou string output final.
      const restoredUrl = Array.isArray(payload.output) 
                          ? payload.output[payload.output.length - 1] 
                          : payload.output;

      if (restoredUrl && !restoredUrl.endsWith('.mp4') && !restoredUrl.endsWith('.mov')) {

        // Se o usuário pediu colorização E ainda não fizemos (para evitar loop infinito)
        if (colorize) {
          console.log(`[AI Chain] Restaurado com CodeFormer. Agora iniciando Colorização (DeOldify)...`);
          const { origin } = new URL(req.url);
          // O próximo webhook não terá colorize=true, mas pode ter animate=true
          const nextWebhookUrl = `${origin}/api/webhook/replicate?photoId=${photoId}${animate ? '&animate=true' : ''}`; 

          try {
            await callWithRetry(async () => {
              await replicate.predictions.create({
                version: "ca494ba129e44e45f661d6ece83c4c98a9a7c774309beca01429b58fce8aa695", // piddnad/ddcolor
                input: {
                  image: restoredUrl,
                  model_size: "large"
                },
                webhook: nextWebhookUrl,
                webhook_events_filter: ["completed"]
              });
            });
            return NextResponse.json({ success: true, status: 'COLORIZING' }, { status: 200 });
          } catch (colorError: any) {
            console.error(`[AI Chain] Falha definitiva ao disparar DDColor: ${colorError.message}`);
            // Fallback: Tenta animar mesmo sem cor se animate=true
            if (animate) {
               return await triggerAnimation(restoredUrl);
            }
            // Se não for para animar, finaliza com a imagem restaurada (sem cor)
            return await finalizeImage(restoredUrl);
          }
        }

        // --- PASSO 2: ANIMAÇÃO (SadTalker) ---
        // Se a colorização não foi pedida ou já foi concluída, e a animação foi pedida
        if (animate) {
            return await triggerAnimation(restoredUrl);
        }

        // --- PASSO FINAL: CLOUDINARY ---
        // Se nem colorização nem animação foram pedidas, ou se esta é a etapa final de um processo
        return await finalizeImage(restoredUrl);
      }
    } else if (payload.status === 'failed' || payload.status === 'canceled') {
      // Se o payload.output é um vídeo (SadTalker), então o photoId é o da imagem original
      // e o payload.output é o vídeo animado.
      const isAnimatedVideo = payload.output && (payload.output.endsWith('.mp4') || payload.output.endsWith('.mov'));

      if (isAnimatedVideo) {
        // Se falhou a animação, mas temos a imagem restaurada, finaliza com ela
        const photo = await prisma.photo.findUnique({ where: { id: photoId } });
        if (photo?.restoredUrl) {
          return await finalizeImage(photo.restoredUrl);
        }
      }

      await prisma.photo.update({
        where: { id: photoId },
        data: { status: 'FAILED' }
      });
      return NextResponse.json({ success: true, status: 'FAILED' }, { status: 200 });
    } else if (payload.status === 'succeeded' && payload.output && (payload.output.endsWith('.mp4') || payload.output.endsWith('.mov'))) {
      // Este bloco lida com o sucesso da animação (SadTalker)
      const animatedUrl = payload.output;
      return await finalizeImage(animatedUrl, true);
    }

    // Apenas respondendo que recebemos outro tipo de atualizacao util (e.g. 'processing')
    return NextResponse.json({ success: true, status: payload.status }, { status: 200 });
  } catch (error) {
    console.error('Webhook Replicate Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
