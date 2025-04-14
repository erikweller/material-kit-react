import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, newTime } = await req.json();

    if (!email || !newTime) {
      return NextResponse.json({ error: 'Missing email or time' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { email },
      data: {
        consultationScheduledAt: new Date(newTime),
      },
    });

    console.log(`⏱️ Dev bump: ${email} set to ${new Date(newTime).toISOString()}`);

    return NextResponse.json({ success: true, updated });
  } catch (err) {
    console.error('❌ Error in dev update-scheduled-time:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
