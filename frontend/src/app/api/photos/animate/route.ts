import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Replicate from 'replicate';

export async function POST(req: Request) {
  try {
    const { photoId, userId } = await req.json();

    if (!photoId || !userId) {
      return NextResponse.json({ error: 'Missing photoId or userId' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const photo = await prisma.photo.findUnique({ where: { id: photoId } });

    if (!user || !photo) {
      return NextResponse.json({ error: 'User or Photo not found' }, { status: 404 });
    }

    // Credits: 4 for animation
    if (user.credits < 4) {
      return NextResponse.json({ error: 'Créditos insuficientes (4 créditos necessários).' }, { status: 403 });
    }

    // Deduct credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 4 } }
    });

    // Mark as processing and NOT refunded yet for this session
    await prisma.photo.update({
      where: { id: photoId },
      data: { status: 'PROCESSING', isRefunded: false }
    });

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const { origin } = new URL(req.url);
    // Note: We trigger with animate=true. The webhook will handle captioning -> animation chain.
    const webhookUrl = `${origin}/api/webhook/replicate?photoId=${photoId}&animate=true`;

    const imageUrl = photo.restoredUrl || photo.originalUrl;

    console.log(`[Animate] Triggering animation for existing photo: ${photoId}`);
    
    // We start by triggering moondream captioning (which then triggers MiniMax)
    await replicate.predictions.create({
        version: "72ccb656353c348c1385df54b237eeb7bfa874bf11486cf0b9473e691b662d31", // Moondream2
        input: { 
          image: imageUrl, 
          prompt: "Describe this person's appearance, age and facial expression in one short, clear sentence starting with 'A portrait of...'. Be objective."
        },
        webhook: `${origin}/api/webhook/replicate?photoId=${photoId}&step=animating&animate=true`,
        webhook_events_filter: ["completed"]
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Animate Route Error]:', error);
    return NextResponse.json({ error: 'Failed to start animation' }, { status: 500 });
  }
}
