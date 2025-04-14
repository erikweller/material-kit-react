import crypto from 'node:crypto';

import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { meetingNumber, role } = await req.json();

  const sdkKey = process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!;
  const sdkSecret = process.env.ZOOM_SDK_SECRET!;

  const iat = Math.round(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60;

  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    sdkKey,
    mn: meetingNumber,
    role,
    iat,
    exp,
    appKey: sdkKey,
    tokenExp: exp,
  };

  const base64 = (obj: unknown /* TODO: tighten type */) =>
    Buffer.from(JSON.stringify(obj)).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

  const signatureData = `${base64(header)}.${base64(payload)}`;
  const hash = crypto
    .createHmac('sha256', sdkSecret)
    .update(signatureData)
    .digest('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const signature = `${signatureData}.${hash}`;

  return NextResponse.json({ signature, password: '' });
}
