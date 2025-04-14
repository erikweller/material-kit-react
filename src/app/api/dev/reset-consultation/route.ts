import { NextResponse, type NextRequest } from 'next/server';

import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { email },
    data: {
      consultationZoomLink: '',
      consultationScheduledAt: null,
      calendlyRescheduleUrl: '',
      calendlyCancelUrl: '',
    },
  });

  return NextResponse.json({ success: true, user });
}
