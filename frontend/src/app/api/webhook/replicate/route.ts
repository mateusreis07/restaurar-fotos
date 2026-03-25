import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const photoId = url.searchParams.get('photoId');
    
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
        await prisma.photo.update({
          where: { id: photoId },
          data: { 
            status: 'COMPLETED',
            restoredUrl: restoredUrl
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
