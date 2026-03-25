import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// For a simple SaaS, we will use basic user creation / mock auth since a proper JWT setup is complex.
// The frontend can pass the user email to simulate login.
router.post('/login', async (req, res) => {
  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    user = await prisma.user.create({
      data: { email, name: name || email.split('@')[0], credits: 1 } // Give 1 free credit
    });
  }

  res.json({ user });
});

router.get('/me/:userId', async (req, res) => {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

export default router;
