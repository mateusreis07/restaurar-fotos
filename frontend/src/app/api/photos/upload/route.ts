import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const userId = formData.get('userId') as string;

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'image/jpeg';
    const b64 = buffer.toString('base64');
    let dataURI = 'data:' + mimeType + ';base64,' + b64;
    
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'aura_recall/originals'
    });

    const photo = await prisma.photo.create({
      data: {
        userId,
        originalUrl: uploadResult.secure_url,
        status: 'PROCESSING'
      }
    });

    await prisma.user.update({
      where: { id: userId },
      data: { credits: user.credits - 1 }
    });

    // Mock AI background process (does not block Next.js response)
    setTimeout(async () => {
      const mockRestoredUrl = uploadResult.secure_url.replace('/upload/', '/upload/e_improve,e_sharpen,e_saturation:30/');
      await prisma.photo.update({
        where: { id: photo.id },
        data: { status: 'COMPLETED', restoredUrl: mockRestoredUrl }
      });
    }, 5000);

    return NextResponse.json({ photo, creditsLeft: user.credits - 1 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Upload process failed' }, { status: 500 });
  }
}
