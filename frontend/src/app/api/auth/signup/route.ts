import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 400 });
    }

    // Create user
    // In a real production app, you should hash the password with bcrypt
    const user = await prisma.user.create({
      data: {
        email,
        password, // Ideally hashed
        name,
        credits: 0 // New users start with 0 credits
      }
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('SIGNUP ERROR:', err);
    return NextResponse.json({ error: 'Erro ao criar conta.' }, { status: 500 });
  }
}
