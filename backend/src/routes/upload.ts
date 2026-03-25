import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '../lib/prisma';

const router = Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    // 1. Verify user credits
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.credits <= 0) {
      return res.status(403).json({ error: 'Insufficient credits' });
    }

    // 2. Upload original image to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'aura_recall/originals'
    });

    // 3. Create Photo record
    const photo = await prisma.photo.create({
      data: {
        userId,
        originalUrl: uploadResult.secure_url,
        status: 'PROCESSING'
      }
    });

    // 4. Deduct credit
    await prisma.user.update({
      where: { id: userId },
      data: { credits: user.credits - 1 }
    });

    // 5. Send to AI (Mocking for now, as requested for easy running)
    // To connect real AI like Replicate, you would use:
    // await replicate.run("tencentarc/gfpgan:92836...", { input: { img: uploadResult.secure_url } })
    simulateAiProcessing(photo.id, uploadResult.secure_url);

    res.json({ photo, creditsLeft: user.credits - 1 });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Something went wrong during upload' });
  }
});

router.get('/history/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId as string;
  const photos = await prisma.photo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ photos });
});

async function simulateAiProcessing(photoId: string, originalUrl: string) {
  // Simulates a 5-second AI process, then sets the restored URL to the original (or a sepia version via Cloudinary)
  setTimeout(async () => {
    // We use Cloudinary's effect to simulate a "restored" image for the MVP.
    // In production, replace this with the Replicate output URL.
    const mockRestoredUrl = originalUrl.replace('/upload/', '/upload/e_improve,e_sharpen,e_saturation:30/');
    
    await prisma.photo.update({
      where: { id: photoId },
      data: {
        status: 'COMPLETED',
        restoredUrl: mockRestoredUrl
      }
    });
  }, 5000);
}

export default router;
