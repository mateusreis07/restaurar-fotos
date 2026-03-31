import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import Replicate from 'replicate';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const userId = formData.get('userId') as string;
    const colorize = formData.get('colorize') === 'true';
    const animate = formData.get('animate') === 'true';

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    const creditsToDeduct = 1 + (animate ? 4 : 0);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user || user.credits < creditsToDeduct) {
      return NextResponse.json({ error: `Créditos insuficientes. Você precisa de ${creditsToDeduct} créditos para esta operação.` }, { status: 403 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'image/jpeg';
    const b64 = buffer.toString('base64');
    let dataURI = 'data:' + mimeType + ';base64,' + b64;
    
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'aura_recall/originals'
    });

    const photo = await prisma.photo.create({
      data: {
        userId,
        originalUrl: uploadResult.secure_url,
        status: 'PROCESSING'
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { credits: user.credits - creditsToDeduct }
    });

    // Replicate Integration (GFPGAN for Face Verification and Restoration)
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Detectar a URL base de forma infalível baseada na própria requisição atual
    const { origin } = new URL(req.url);
    const webhookUrl = `${origin}/api/webhook/replicate?photoId=${photo.id}${colorize ? '&colorize=true' : ''}${animate ? '&animate=true' : ''}`;

    try {
      const token = process.env.REPLICATE_API_TOKEN || '';
      console.log(`[Replicate] Iniciando pipeline de restauração (Token: ${token.substring(0, 5)}...)`);
      console.log(`[Replicate] Webhook Target: ${webhookUrl}`);
      // STEP 1: "Bringing Old Photos Back to Life" (Microsoft) - Remove arranhões, dobras e danos físicos
      const cleanupWebhookUrl = `${webhookUrl}&step=cleanup`;
      const prediction = await replicate.predictions.create({
        version: "c75db81db6cbd809d93cc3b7e7a088a351a3349c9fa02b6d393e35e0d51ba799", // Microsoft - Bringing Old Photos Back to Life
        input: {
          image: uploadResult.secure_url,
          HR: true // High Resolution mode com detecção de arranhões
        },
        webhook: cleanupWebhookUrl,
        webhook_events_filter: ["completed"]
      });
      console.log(`[Replicate] Step 1 (Limpeza de danos) iniciada! ID: ${prediction.id} | Status: ${prediction.status}`);
    } catch (repError: any) {
      console.error("[Replicate] Falha ao disparar predição:", repError.message || JSON.stringify(repError));
      // Se a IA der pau, vamos marcar a foto como FAILED para não ficar processando infinito!
      await prisma.photo.update({
        where: { id: photo.id },
        data: { status: 'FAILED' }
      });
    }

    return NextResponse.json({ photo, creditsLeft: user.credits - 1 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload process failed' }, { status: 500 });
  }
}
