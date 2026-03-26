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
    const step = url.searchParams.get('step');
    
    if (!photoId) {
      return NextResponse.json({ error: 'Missing photoId' }, { status: 400 });
    }

    const payload = await req.json();
    console.log(`[Webhook Replicate] Status: ${payload.status} | PhotoId: ${photoId} | Step: ${step} | Colorize: ${colorize} | Animate: ${animate}`);

    // --- FUNÇÕES AUXILIARES DE CHAINING ---
    
    // Retry em caso de Rate Limit (429) do Replicate
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
      console.log(`[AI End] Processo finalizado para PhotoId: ${photoId}`);
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

    // GERADOR DE PROMPT INTELIGENTE (Template Tarium Style)
    const generateSmartPrompt = (caption: string) => {
      // Remove o ponto final se houver
      const baseCaption = caption.replace(/\.$/, "");
      
      return `${baseCaption}. The person starts to move naturally. Subtle blinking, gentle facial expression changes, slight smile forming. Natural head movement and micro-expressions. Realistic human behavior, cinematic style. No camera movement, no zoom. Focus entirely on the subject's face and natural motion.`;
    };

    // Dispara a animação (MiniMax Video-01-Live) usando o caption gerado
    const triggerAnimation = async (imageUrl: string, caption: string) => {
      const { origin } = new URL(req.url);
      const nextWebhookUrl = `${origin}/api/webhook/replicate?photoId=${photoId}`; 
      const smartPrompt = generateSmartPrompt(caption);

      try {
        await callWithRetry(async () => {
          await replicate.predictions.create({
            version: "7574e16b8f1ad52c6332ecb264c0f132e555f46c222255a738131ec1bb614092", // MiniMax
            input: {
              prompt: smartPrompt,
              first_frame_image: imageUrl,
              prompt_optimizer: true
            },
            webhook: nextWebhookUrl,
            webhook_events_filter: ["completed"]
          });
        });
        console.log(`[AI Chain] MiniMax disparado com Prompt Inteligente para PhotoId: ${photoId}`);
        return NextResponse.json({ success: true, status: 'ANIMATING' });
      } catch (e: any) {
        console.error(`[AI Chain] Erro MiniMax: ${e.message}`);
        return await finalizeImage(imageUrl);
      }
    };

    // Dispara a análise da imagem para gerar o prompt (AI Vision)
    const triggerCaptioning = async (imageUrl: string) => {
      const { origin } = new URL(req.url);
      const nextWebhookUrl = `${origin}/api/webhook/replicate?photoId=${photoId}&step=animating`; 

      try {
        await callWithRetry(async () => {
          await replicate.predictions.create({
            version: "72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31", // Moondream2 (Fast)
            input: { 
              image: imageUrl, 
              prompt: "Describe this person's appearance, age and facial expression in one short, clear sentence starting with 'A portrait of...'. Be objective."
            },
            webhook: nextWebhookUrl,
            webhook_events_filter: ["completed"]
          });
        });
        console.log(`[AI Chain] AI Vision (Moondream2) disparado para PhotoId: ${photoId}`);
        return NextResponse.json({ success: true, status: 'CAPTIONING' });
      } catch (e: any) {
        console.error(`[AI Chain] Erro Vision: ${e.message}`);
        // Se falhar a visão, tenta animar com prompt genérico
        return await triggerAnimation(imageUrl, "A realistic human portrait");
      }
    };

    // --- LÓGICA PRINCIPAL DO WEBHOOK ---

    if (payload.status === 'succeeded' && payload.output) {
      const outputUrl = Array.isArray(payload.output) 
                          ? payload.output[payload.output.length - 1] 
                          : payload.output;

      if (!outputUrl) return NextResponse.json({ error: 'Nenhum output' });

      // CASO 1: Recebemos o Caption (Step: animating)
      if (step === 'animating') {
        const caption = typeof payload.output === 'string' ? payload.output : payload.output.toString();
        // Precisamos da imagem restaurada que serviu de input para a visão
        const photo = await prisma.photo.findUnique({ where: { id: photoId! } });
        const imageUrl = photo?.restoredUrl || outputUrl; // Fallback
        
        console.log(`[AI Chain] Vision concluída: "${caption}". Iniciando MiniMax...`);
        return await triggerAnimation(imageUrl, caption);
      }

      // CASO 2: Recebemos um Vídeo (Final da Chain)
      const isVideo = outputUrl.endsWith('.mp4') || outputUrl.endsWith('.mov') || outputUrl.includes('video');
      if (isVideo) {
        return await finalizeImage(outputUrl, true);
      }

      // CASO 3: Recebemos uma Imagem (Restaurada ou Colorizada)
      console.log(`[AI Chain] Recebida imagem. Verificando próximos passos...`);
      
      // Salva progresso intermediário
      await prisma.photo.update({
        where: { id: photoId! },
        data: { restoredUrl: outputUrl }
      });

      // Fluxo de Colorização
      if (colorize && !url.searchParams.get('colorized')) {
        console.log(`[AI Chain] Iniciando Colorização...`);
        const { origin } = new URL(req.url);
        const nextWebhookUrl = `${origin}/api/webhook/replicate?photoId=${photoId}&animate=${animate}&colorized=true`; 

        try {
          await callWithRetry(async () => {
            await replicate.predictions.create({
              version: "ca494ba129e44e45f661d6ece83c4c98a9a7c774309beca01429b58fce8aa695",
              input: { image: outputUrl, model_size: "large" },
              webhook: nextWebhookUrl,
              webhook_events_filter: ["completed"]
            });
          });
          return NextResponse.json({ success: true, status: 'COLORIZING' });
        } catch (e: any) {
          console.error(`[AI Chain] Erro cor: ${e.message}`);
          if (animate) return await triggerCaptioning(outputUrl);
          return await finalizeImage(outputUrl);
        }
      }

      // Fluxo de Animação (começa com Captioning)
      if (animate) {
        return await triggerCaptioning(outputUrl);
      }

      return await finalizeImage(outputUrl);

    } else if (payload.status === 'failed' || payload.status === 'canceled') {
      console.error(`[AI Chain] Falha: ${payload.status}`);
      const photo = await prisma.photo.findUnique({ where: { id: photoId! } });
      
      if (photo?.restoredUrl) {
         await prisma.photo.update({ where: { id: photoId! }, data: { status: 'COMPLETED' } });
         return NextResponse.json({ success: true, status: 'COMPLETED_FALLBACK' });
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
