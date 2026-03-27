import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const photos = await prisma.photo.findMany({
    where: { userId },
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
