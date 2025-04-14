import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { encode } from 'next-auth/jwt';
import { cookies } from 'next/headers';

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

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'user',
      },
    });

    // ✅ Set session cookie manually
    const token = await encode({
      secret: process.env.NEXTAUTH_SECRET!,
      token: {
        email: newUser.email,
        sub: String(newUser.id),
        id: String(newUser.id), // ✅ match custom type
        accepted: false,        // ✅ required by your extended JWT
      },
    });

    cookies().set('next-auth.session-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Signup Error]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
