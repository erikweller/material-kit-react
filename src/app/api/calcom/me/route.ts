// src/app/api/calcom/me/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.CALCOM_API_KEY;

  const res = await fetch(`https://api.cal.com/v2/users/me?apiKey=${apiKey}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
