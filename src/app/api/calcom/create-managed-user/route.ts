// src/app/api/calcom/create-managed-user/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const platformToken = process.env.CALCOM_CLIENT_SECRET; // this is the JWT-style secret

  if (!platformToken) {
    return NextResponse.json({ error: 'Missing CALCOM_CLIENT_SECRET' }, { status: 500 });
  }

  const body = await req.json();
  const { name, email } = body;

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.cal.com/v2/platform/managed-users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${platformToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to create managed user:', data);
      return NextResponse.json({ error: data }, { status: res.status });
    }

    // Success — return access + refresh tokens + ID
    return NextResponse.json(data);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Unhandled error creating managed user:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
