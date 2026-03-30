
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserID ausente.' }, { status: 400 });
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
