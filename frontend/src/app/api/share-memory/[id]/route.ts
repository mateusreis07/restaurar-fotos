import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'ID da memória ausente.' }, { status: 400 });
    }

    const sharedMemory = await prisma.sharedMemory.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!sharedMemory || sharedMemory.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Memória não encontrada ou link inativo.' }, { status: 404 });
    }

    // Verificar expiração
    if (sharedMemory.expiresAt && new Date() > sharedMemory.expiresAt) {
      return NextResponse.json({ error: 'Este link de memória expirou.' }, { status: 410 });
    }

    // Buscar detalhes das fotos
    const photos = await prisma.photo.findMany({
      where: {
        id: { in: sharedMemory.fileIds }
      }
    });

    // Incrementar contador de acessos (opcionalmente async/background)
    await prisma.sharedMemory.update({
      where: { id },
      data: { accessCount: { increment: 1 } }
    });

    return NextResponse.json({
      recipientName: sharedMemory.recipientName,
      message: sharedMemory.message,
      senderName: sharedMemory.user.name || sharedMemory.user.email,
      photos: photos.map(p => ({
        id: p.id,
        url: p.restoredUrl || p.originalUrl,
        animatedUrl: p.animatedUrl,
        type: p.animatedUrl ? 'video' : 'image'
      })),
      createdAt: sharedMemory.createdAt
    });
  } catch (err) {
    console.error('Error fetching shared memory:', err);
    return NextResponse.json({ error: 'Erro interno ao buscar memória.' }, { status: 500 });
  }
}
