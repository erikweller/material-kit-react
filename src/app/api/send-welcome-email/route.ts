import { NextResponse, type NextRequest } from 'next/server';

import { resend } from '@/lib/resend';

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();

  if (!email || !name) {
    return NextResponse.json({ error: 'Missing email or name' }, { status: 400 });
  }

  try {
    const data = await resend.emails.send({
      from: 'CareVillage <welcome@carevillage.com>',
      to: email,
      subject: 'Welcome to CareVillage',
      html: `
        <h1>Welcome to CareVillage, ${name}!</h1>
        <p>Thank you for signing up. We're excited to support you in your caregiving journey.</p>
        <p><strong>To log in:</strong> go to <a href="http://localhost:3001/login">carevillage.com/login</a> and use your email + password.</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
