// src/app/api/hello/route.ts or any entry point (e.g. /app/page.tsx if SSR)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    console.log('🌐 Attempting Prisma DB query...');
    const result = await prisma.user.findMany(); // or any harmless test query
    console.log('✅ DB connected! Result:', result);

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error('❌ Prisma error:', err);
    return new Response('Error connecting to DB', { status: 500 });
  }
}
