import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('LOGIN API RECEIVED:', body);
    
    const { email, password } = body;

    if (!email || !password) {
      console.log('LOGIN ERROR: Missing fields', { email: !!email, password: !!password });
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('LOGIN ERROR: User not found', email);
      return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }

    // Check password
    if (user.password !== password) {
      console.log('LOGIN ERROR: Incorrect password', email);
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
    }

    console.log('LOGIN SUCCESS:', email);
    return NextResponse.json({ user });
  } catch (err) {
    console.error('LOGIN API FATAL ERROR:', err);
    return NextResponse.json({ error: 'Login failed internally' }, { status: 500 });
  }
}
