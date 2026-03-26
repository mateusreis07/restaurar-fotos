import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16' as any
});

const PLANS = {
  plan_1: { credits: 12, amount: 2990 }, // 2 + 10 = 12
  plan_2: { credits: 25, amount: 4990 }, 
  plan_3: { credits: 72, amount: 8990 }, // 12 + 60 = 72
};

export async function POST(req: Request) {
  try {
    const { userId, planId } = await req.json();
    
    if (!userId || !planId || !PLANS[planId as keyof typeof PLANS]) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    // Read the HOST from the incoming request to compute the absolute return URL
    // Useful for Vercel without setting an explicit env var during dev/testing
    const host = req.headers.get('origin') || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
      success_url: `${host}/dashboard?success=true`,
      cancel_url: `${host}/pricing?canceled=true`,
      metadata: {
        userId,
        credits: plan.credits.toString()
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
