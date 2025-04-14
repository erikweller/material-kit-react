import { NextResponse, type NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import { resend } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const payload = body.payload as {
      email: string;
      name?: string;
      scheduled_event: {
        location?: {
          join_url?: string;
        };
        start_time?: string;
      };
      reschedule_url?: string;
      cancel_url?: string;
    };

    const event = body.event;

    if (!payload) {
      console.error('❌ No payload in webhook');
      return NextResponse.json({ status: 'ignored' });
    }

    console.log('📩 Calendly webhook received:', JSON.stringify(payload, null, 2));
    console.log('🕒 Scheduled event:', JSON.stringify(payload?.scheduled_event, null, 2));

    const email = payload.email;
    const name = payload.name || 'there';
    const scheduledEvent = payload.scheduled_event;
    const joinUrl = scheduledEvent?.location?.join_url || null;
    const rescheduleUrl = payload.reschedule_url || null;
    const cancelUrl = payload.cancel_url || null;
    const scheduledTime = scheduledEvent?.start_time || null;

    if (!email || !joinUrl || !scheduledTime) {
      console.warn('⚠️ Missing email, Zoom join URL, or scheduled time');
      return NextResponse.json({ status: 'ignored' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      console.warn(`⚠️ No user found with email ${email}`);
      return NextResponse.json({ status: 'user not found' });
    }

    const user = await prisma.user.update({
      where: { email },
      data: {
        consultationZoomLink: joinUrl,
        consultationScheduledAt: new Date(scheduledTime),
        calendlyRescheduleUrl: rescheduleUrl,
        calendlyCancelUrl: cancelUrl,
      },
    });

    console.log(`✅ Zoom link saved for ${user.email}: ${joinUrl}`);
    console.log(`📆 Saved consultationScheduledAt: ${new Date(scheduledTime).toISOString()}`);

    const firstName = name.split(' ')[0] || 'there';
    await (resend.emails.send as (params: any) => Promise<any>)({
      from: 'CareVillage <info@carevillage.io>',
      to: email,
      subject: `Your Consultation is Confirmed!`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px;">
          <p>Hi ${firstName},</p>
          <p>Your CareVillage consultation has been confirmed.</p>
          <p><strong>Date & Time:</strong> ${new Date(scheduledTime).toLocaleString('en-US', {
            timeZone: 'America/New_York',
            dateStyle: 'full',
            timeStyle: 'short',
          })}</p>
          <p><strong>Zoom Meeting Link:</strong> <a href="${joinUrl}">${joinUrl}</a></p>
          <p>You can log in anytime here: <a href="https://carevillage.io/login">carevillage.io/login</a></p>
          <p>We look forward to connecting with you!<br/>—The CareVillage Team</p>
        </div>
      `,
    });

    console.log(`📧 Confirmation email sent to ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
