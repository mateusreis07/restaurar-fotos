import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const photos = await prisma.photo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  
  return NextResponse.json({ photos });
}
