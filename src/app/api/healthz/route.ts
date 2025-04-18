import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  console.log("🔥 ENV:", process.env.DATABASE_URL);

  try {
    const result = await prisma.user.findMany({
      take: 1,
    });
    console.log("🔥 DB Query Success:", result.length, "users");
  } catch (error) {
    console.error("❌ DB Query Failed:", error);
  }

  return new NextResponse('ok', { status: 200 });
}
