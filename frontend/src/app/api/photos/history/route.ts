import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ error: 'Sessão expirada. Faça login novamente.' }, { status: 401 });
    }

    const photos = await prisma.photo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ photos });
  } catch (err) {
    console.error('Error fetching photo history:', err);
    return NextResponse.json({ error: 'Erro ao carregar histórico.' }, { status: 500 });
  }
}
