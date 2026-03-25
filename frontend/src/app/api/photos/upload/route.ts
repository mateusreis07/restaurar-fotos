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

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
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
      data: { credits: user.credits - 1 }
    });

    // Replicate Integration (GFPGAN for Face Verification and Restoration)
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Detectar o Host dinamicamente priorizando o ambiente oficial da Vercel ou o cabeçalho da requisição
    const vercelUrl = process.env.VERCEL_URL;
    let host = vercelUrl ? `https://${vercelUrl}` : (req.headers.get('origin') || req.headers.get('host') || process.env.FRONTEND_URL || '');
    
    if (host && !host.startsWith('http')) host = `https://${host}`;
    
    const webhookUrl = `${host}/api/webhook/replicate?photoId=${photo.id}`;
    console.log(`[Replicate Webhook Target]: ${webhookUrl}`);

    try {
      console.log(`[Replicate] Dispatching GFPGAN with Webhook: ${webhookUrl}`);
      // Usando CodeFormer (Muito superior: restaura rosto, fundo e faz upscale real)
      const prediction = await replicate.predictions.create({
        version: "7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
        input: {
          image: uploadResult.secure_url,
          upscale: 2,
          face_upsample: true,
          background_enhance: true,
          codeformer_fidelity: 0.5
        },
        webhook: webhookUrl,
        webhook_events_filter: ["completed"]
      });
      console.log(`[Replicate] Predição iniciada com sucesso! ID: ${prediction.id} | Status: ${prediction.status}`);
    } catch (repError: any) {
      console.error("[Replicate] Falha ao disparar predição:", repError.message || repError);
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
