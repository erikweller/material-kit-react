// ✅ FILE: src/app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'user',
      },
    });

    // ✅ Return success without trying to call signIn here
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Signup Error]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
