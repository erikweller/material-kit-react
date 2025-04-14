import * as React from 'react'

import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { type ReactNode } from 'react';

'use client';

export default function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
