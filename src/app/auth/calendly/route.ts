// FILE: src/app/auth/calendly/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code from Calendly' }, { status: 400 });
  }

  try {
    const res = await fetch('https://auth.calendly.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CALENDLY_CLIENT_ID,
        client_secret: process.env.CALENDLY_CLIENT_SECRET,
        code,
        redirect_uri: process.env.CALENDLY_REDIRECT_URI,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('❌ Failed to exchange code for token:', data);
      return NextResponse.json({ error: 'OAuth token exchange failed' }, { status: 500 });
    }

    console.log('🎉 Calendly OAuth Token Response:', data);

    // You can now save data.access_token somewhere (e.g., DB or session)
    return redirect('/dashboard');
  } catch (err) {
    console.error('❌ OAuth callback error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
