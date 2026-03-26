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
    console.log(`[Webhook Replicate] Recebido Status: ${payload.status} | PhotoId: ${photoId} | Colorize: ${colorize} | Animate: ${animate}`);

    // --- FUNÇÕES AUXILIARES DE CHAINING ---
    
    // Retry em caso de Rate Limit (429) do Replicate (comum em saldo baixo < $5)
    const callWithRetry = async (replicateCall: () => Promise<any>, retries = 4, delay = 12000) => {
      for (let i = 0; i <= retries; i++) {
        try {
          return await replicateCall();
        } catch (error: any) {
          const status = error.status || error.response?.status || (error.message?.includes('429') ? 429 : 0);
          console.warn(`[AI Chain] Tentativa ${i+1}/${retries+1} falhou (Status: ${status})`);
          
          if (status === 429 && i < retries) {
            console.warn(`[AI Chain] Aguardando ${delay}ms para tentar novamente...`);
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

    // Dispara a animação de alta qualidade (Kling v1.5 Pro)
    const triggerAnimation = async (imageUrl: string) => {
      const { origin } = new URL(req.url);
      const nextWebhookUrl = `${origin}/api/webhook/replicate?photoId=${photoId}`; 

      try {
        await callWithRetry(async () => {
          await replicate.predictions.create({
            version: "63a990e82809f01ded0ec0375e907870943aa01e7856c7c6455aae4bc30bb8fc", // kwaivgi/kling-v1.5-pro
            input: {
              prompt: "Extreme realistic video of the person in the photo blinking their eyes naturally, tilting their head slightly, and showing a soft, real smile. Static camera, stationary background, no camera movement.",
              negative_prompt: "camera movement, zoom, pan, tilt, sliding, blurry, robotic motion, distorted face, extra limbs, morphing",
              start_image: imageUrl,
              duration: 5,
              cfg_scale: 0.8
            },
            webhook: nextWebhookUrl,
            webhook_events_filter: ["completed"]
          });
        });
        console.log(`[AI Chain] Kling v1.5 disparado com sucesso para PhotoId: ${photoId}`);
        return NextResponse.json({ success: true, status: 'ANIMATING' }, { status: 200 });
      } catch (animError: any) {
        console.error(`[AI Chain] Erro ao disparar Kling: ${animError.message}`);
        // Fallback: Se o Kling falhar (ex: custo alto ou erro), finaliza com a imagem restaurada
        return await finalizeImage(imageUrl);
      }
    };

    // Quando o Replicate finaliza, envia o status 'succeeded' ou 'failed'
    if (payload.status === 'succeeded' && payload.output) {
      // Normalizar o output (pode vir como string ou array)
      const outputUrl = Array.isArray(payload.output) 
                          ? payload.output[payload.output.length - 1] 
                          : payload.output;

      if (!outputUrl) return NextResponse.json({ error: 'Nenhum output encontrado' });

      // Verificamos se o output é um vídeo (SadTalker) ou imagem (CodeFormer/DDColor)
      const isVideo = outputUrl.endsWith('.mp4') || outputUrl.endsWith('.mov');

      if (isVideo) {
        console.log(`[AI Chain] Recebido vídeo de animação. Finalizando...`);
        return await finalizeImage(outputUrl, true);
      } else {
        // É uma imagem (Restaurada ou Colorizada)
        console.log(`[AI Chain] Recebida imagem (Restauração/Cor). Verificando próximos passos...`);
        
        // SEMPRE salvamos a imagem restaurada intermediária para o usuário já ver algo
        await prisma.photo.update({
          where: { id: photoId! },
          data: { restoredUrl: outputUrl }
        });

        if (colorize) {
          console.log(`[AI Chain] Iniciando Passo de Colorização (DDColor)...`);
          const { origin } = new URL(req.url);
          const nextWebhookUrl = `${origin}/api/webhook/replicate?photoId=${photoId}${animate ? '&animate=true' : ''}`; 

          try {
            await callWithRetry(async () => {
              await replicate.predictions.create({
                version: "ca494ba129e44e45f661d6ece83c4c98a9a7c774309beca01429b58fce8aa695", // DDColor
                input: { image: outputUrl, model_size: "large" },
                webhook: nextWebhookUrl,
                webhook_events_filter: ["completed"]
              });
            });
            return NextResponse.json({ success: true, status: 'COLORIZING' });
          } catch (e: any) {
            console.error(`[AI Chain] Falha na cor: ${e.message}`);
            if (animate) return await triggerAnimation(outputUrl);
            return await finalizeImage(outputUrl);
          }
        }

        if (animate) {
          console.log(`[AI Chain] Iniciando Passo de Animação (SadTalker)...`);
          return await triggerAnimation(outputUrl);
        }

        // Se não houver mais passos, finaliza
        return await finalizeImage(outputUrl);
      }
    } else if (payload.status === 'failed' || payload.status === 'canceled') {
      console.error(`[AI Chain] Payload reportou falha ou cancelamento: ${payload.status}`);
      
      // Se a animação falhou mas já temos a imagem restaurada na DB, vamos marcar como COMPLETED
      const photo = await prisma.photo.findUnique({ where: { id: photoId! } });
      if (photo?.restoredUrl) {
         await prisma.photo.update({ where: { id: photoId! }, data: { status: 'COMPLETED' } });
         return NextResponse.json({ success: true, status: 'COMPLETED_FROM_RESTORED_FALLBACK' });
      }

      await prisma.photo.update({ where: { id: photoId! }, data: { status: 'FAILED' } });
      return NextResponse.json({ success: true, status: 'FAILED' });
    }

    return NextResponse.json({ success: true, status: payload.status });
  } catch (error) {
    console.error('Webhook Replicate Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
