import express, { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16' as any
});

const PLANS = {
  plan_1: { credits: 10, amount: 2990 }, // R$ 29,90
  plan_2: { credits: 25, amount: 4990 }, // R$ 49,90
  plan_3: { credits: 60, amount: 8990 }, // R$ 89,90
};

router.post('/checkout', express.json(), async (req: Request, res: Response) => {
  const { userId, planId } = req.body; // e.g., 'price_10'
  
  if (!userId || !planId || !PLANS[planId as keyof typeof PLANS]) {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  const plan = PLANS[planId as keyof typeof PLANS];

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: `Pacote de ${plan.credits} Fotos - Aura Recall` },
            unit_amount: plan.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        userId,
        credits: plan.credits.toString()
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

// Stripe Webhook
router.post('/', express.raw({type: 'application/json'}), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata.userId;
    const credits = parseInt(session.metadata.credits, 10);

    // Update user credits
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: credits } }
    });

    // Create transaction log
    await prisma.transaction.create({
      data: {
        userId,
        amount: session.amount_total || 0,
        creditsAdded: credits,
        stripeSessionId: session.id,
        status: 'COMPLETED'
      }
    });
  }

  res.json({ received: true });
});

export default router;
