import { NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { email } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'No user found' }, { status: 404 });
  }

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expires,
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: 'CareVillage <noreply@carevillage.io>',
    to: email,
    subject: 'Reset Your CareVillage Password',
    html: `
      <div style="font-family: sans-serif; color: #1d2e61; padding: 24px;">
        <h2 style="margin-bottom: 16px;">Reset Your Password</h2>
        <p style="margin-bottom: 16px;">Hi there,</p>
        <p style="margin-bottom: 16px;">
          We received a request to reset the password for your CareVillage account.
          If you made this request, click the button below to set a new password.
        </p>
        <p style="margin-bottom: 24px;">
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; background-color: #233ea1; color: white; text-decoration: none; border-radius: 6px;">
            Reset My Password
          </a>
        </p>
        <p style="margin-bottom: 16px; font-size: 14px; color: #555;">
          This link is valid for 1 hour. If you didn’t request a password reset, you can safely ignore this email.
        </p>
        <p style="margin-top: 32px; font-size: 14px; color: #888;">
          – The CareVillage Team
        </p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
