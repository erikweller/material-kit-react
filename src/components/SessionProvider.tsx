'use client';
import * as React from "react";
import { type ReactNode } from 'react';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';


export default function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
