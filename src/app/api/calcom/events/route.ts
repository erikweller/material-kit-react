// src/app/api/calcom/events/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.CALCOM_API_KEY;

  const res = await fetch('https://api.cal.com/v2/event-types', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Error fetching v2 event types:', data);
    return NextResponse.json({ error: data }, { status: res.status });
  }

  return NextResponse.json(data);
}
