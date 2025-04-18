import { NextResponse } from 'next/server';

export async function GET() {
  console.log("🔥 ENV:", process.env.DATABASE_URL);
  return new NextResponse('ok', { status: 200 });
}
