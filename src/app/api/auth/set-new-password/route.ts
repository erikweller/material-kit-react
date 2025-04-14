import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const schema = z.object({
  token: z.string().uuid(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const { token, password } = parsed.data;

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.expires < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: {
      password: await hash(password, 10),
    },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ success: true });
}
