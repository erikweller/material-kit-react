// src/app/api/calcom/oauth/token/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const clientId = process.env.CALCOM_CLIENT_ID;
  const clientSecret = process.env.CALCOM_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error('Missing CALCOM_CLIENT_ID or CALCOM_CLIENT_SECRET');
    return NextResponse.json({ error: 'Missing credentials' }, { status: 500 });
  }

  try {
    const res = await fetch('https://auth.cal.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const text = await res.text(); // use text first
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    if (!res.ok) {
      console.error('Token fetch failed:', data);
      return NextResponse.json({ error: data }, { status: res.status });
    }

    console.log('✅ Got Cal.com token:', data);
    return NextResponse.json(data);
  } catch (err: unknown /* TODO: tighten type */) {
    console.error('❌ Error fetching token:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
