import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16' as any
});

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    console.error('[Stripe Webhook] Missing signature');
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  const body = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Processing event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const credits = parseInt(session.metadata?.credits || '0', 10);

    if (userId && credits > 0) {
      try {
        // IDEMPOTENCIA: Verifica se esta sessão já foi processada
        const existingTx = await prisma.transaction.findUnique({
          where: { stripeSessionId: session.id }
        });

        if (existingTx) {
          console.log(`[Stripe Webhook] SESSÃO JÁ PROCESSADA: ${session.id}. Pulando créditos duplicados.`);
          return NextResponse.json({ received: true, status: 'ALREADY_PROCESSED' });
        }

        // TRANSAÇÃO ATÔMICA: Garante que os créditos e o log da transação ocorram juntos
        await prisma.$transaction(async (tx) => {
          // 1. Atualizar créditos do usuário
          await tx.user.update({
            where: { id: userId },
            data: { credits: { increment: credits } }
          });

          // 2. Criar registro da transação (stripeSessionId é único no schema)
          await tx.transaction.create({
            data: {
              userId,
              amount: session.amount_total || 0,
              creditsAdded: credits,
              stripeSessionId: session.id,
              status: 'COMPLETED'
            }
          });
        });

        console.log(`[Stripe Webhook] SUCESSO: ${credits} créditos adicionados para UserID: ${userId}`);
      } catch (dbError: any) {
        console.error(`[Stripe Webhook] Erro de Banco de Dados: ${dbError.message}`);
        // Retornamos 500 para que a Stripe saiba que houve erro no servidor e tente novamente mais tarde
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    } else {
      console.warn(`[Stripe Webhook] Sessão incompleta ou sem metadados válidos. UserID: ${userId}, Credits: ${credits}`);
    }
  }

  return NextResponse.json({ received: true });
}
