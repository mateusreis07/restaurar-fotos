import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 });

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: {
          id: true,
          email: true,
          name: true,
          credits: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('AUTH ME ERROR:', err);
    return NextResponse.json({ error: 'Erro ao validar sessão' }, { status: 500 });
  }
}
