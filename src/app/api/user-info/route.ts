// ✅ FILE: src/app/api/user-info/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  console.log('🔥 SESSION:', session);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const email = session.user.email;

    const user = await prisma.user.update({
      where: { email },
      data: {
        age: body.age ? parseInt(body.age) : null,
        caregivingRole:
          body.caregivingRole === 'Other' ? body.otherCaregivingRole : body.caregivingRole,
        careRecipientAge: body.careRecipientAge ?? null,
        challenges: Array.isArray(body.challenges) ? body.challenges.flat() : [],
        communicationMethod: body.communicationMethod ?? null,
        interests: Array.isArray(body.interests) ? body.interests.flat() : [],
        location: body.location ?? null,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error('[UserInfo Error]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
