// src/app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    CALCOM_API_KEY: process.env.CALCOM_API_KEY ?? '❌ NOT FOUND',
  });
}
