import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16' as any
});

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });

  const body = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || '0', 10);

    if (userId && credits > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: credits } }
      });

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
  }

  return NextResponse.json({ received: true });
}
