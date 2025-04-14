// src/app/api/calcom/events/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.CALCOM_API_KEY;

  console.log('CALCOM_API_KEY inside route:', apiKey); // Debug

  const res = await fetch('https://api.cal.com/v1/event-types/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.text();
    return NextResponse.json({ error }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
