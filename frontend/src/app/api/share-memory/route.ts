import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Sessão expirada. Faça login novamente.' }, { status: 401 });
    }

    const memories = await prisma.sharedMemory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ memories });
  } catch (err) {
    console.error('List memories error:', err);
    return NextResponse.json({ error: 'Erro ao buscar memórias compartilhadas.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;

    if (!userId) {
       return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { recipientName, message, fileIds, status, expiresAt } = await req.json();

    if (!recipientName || !fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
    }

    const memory = await prisma.sharedMemory.create({
      data: {
        userId, // ID Real da Sessão
        recipientName,
        message,
        fileIds,
        status: status || 'ACTIVE',
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: memory.id, 
      url: `/memory/${memory.id}` 
    });
  } catch (err) {
    console.error('Create memory error:', err);
    return NextResponse.json({ error: 'Erro ao criar memória compartilhada.' }, { status: 500 });
  }
}
