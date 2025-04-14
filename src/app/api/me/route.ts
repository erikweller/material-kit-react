import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);

  console.log('🔐 Session from getServerSession:', session);

  if (!session?.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      age: true,
      caregivingRole: true,
      careRecipientAge: true,
      challenges: true,
      communicationMethod: true,
      consultationScheduledAt: true,
      consultationZoomLink: true,
      interests: true,
      location: true,
      accepted: true,
    },
  });

  if (!user) {
    console.warn('❌ No user found for email:', session.user.email);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  console.log('✅ Returning user from /api/me:', user);

  return NextResponse.json(user);
}
