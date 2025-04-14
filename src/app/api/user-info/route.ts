// ✅ FILE: src/app/api/user-info/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  console.log('🔥 SESSION:', session);

  if (!session?.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const email = session.user.email;

    const {
      age,
      gender,
      occupation,
      bestContactTime,
      caregivingRole,
      otherCaregivingRole,
      careRecipientAge,
      careRecipientCondition,
      challenges,
      communicationMethod,
      phoneNumber,
      interests,
      location,
      consultationZoomLink,
      consultationScheduledAt,
      calendlyRescheduleUrl,
      calendlyCancelUrl,
    } = body;

    const user = await prisma.user.update({
      where: { email },
      data: {
        age: age ? parseInt(age) : null,
        gender: gender ?? null,
        occupation: occupation ?? null,
        bestContactTime: bestContactTime ?? null,
        caregivingRole: caregivingRole === 'Other' ? otherCaregivingRole : caregivingRole,
        careRecipientAge: careRecipientAge ?? null,
        careRecipientCondition: careRecipientCondition ?? null,
        challenges: Array.isArray(challenges) ? challenges.flat() : [],
        communicationMethod: communicationMethod ?? null,
        phoneNumber: phoneNumber ?? null,
        interests: Array.isArray(interests) ? interests.flat() : [],
        location: location ?? null,
        consultationZoomLink: consultationZoomLink ?? null,
        consultationScheduledAt: consultationScheduledAt ? new Date(consultationScheduledAt) : null,
        calendlyRescheduleUrl: calendlyRescheduleUrl ?? null,
        calendlyCancelUrl: calendlyCancelUrl ?? null,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('[UserInfo Error]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
