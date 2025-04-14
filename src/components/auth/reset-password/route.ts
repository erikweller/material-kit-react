import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { randomBytes } from 'node:crypto';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  // 1. Find the user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // 2. Create a unique token
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

  // 3. Store it in the database
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expires,
    },
  });

  // 4. Send email with link
  const resend = new Resend(process.env.RESEND_API_KEY);

  const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'no-reply@carevillage.io',
    to: email,
    subject: 'Reset your CareVillage password',
    html: `
      <p>Hi ${user.firstName},</p>
      <p>Click the link below to reset your password. It will expire in 15 minutes:</p>
      <a href="${resetLink}" target="_blank">Reset Password</a>
    `,
  });

  return NextResponse.json({ success: true });
}
