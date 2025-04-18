import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  console.log("🔥 ENV - NODE_ENV:", process.env.NODE_ENV);
  console.log("🔥 ENV - APP_ENV:", process.env.APP_ENV);
  console.log("🔥 ENV - DATABASE_URL:", process.env.DATABASE_URL);

  try {
    const result = await prisma.user.findMany({
      take: 1,
    });
    console.log("✅ DB Query Success:", result.length, "user(s) found");
    return new NextResponse(JSON.stringify({
      status: 'ok',
      users: result.length,
    }), { status: 200 });
  } catch (error) {
    console.error("❌ DB Query Failed:", error);
    return new NextResponse(JSON.stringify({
      status: 'error',
      message: 'Database connection failed',
      error: String(error),
    }), { status: 500 });
  }
}
