import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId: urlUserId } = await params;
  const session = await auth();
  const sessionUserId = (session?.user as any)?.id;

  if (!sessionUserId || sessionUserId !== urlUserId) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const photos = await prisma.photo.findMany({
    where: { userId: urlUserId },
    select: {
      id: true,
      userId: true,
      originalUrl: true,
      restoredUrl: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      // @ts-ignore
      animatedUrl: true,
    },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ photos });
}
