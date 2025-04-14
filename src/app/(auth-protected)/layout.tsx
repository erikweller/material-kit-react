'use client';
import * as React from "react";

import { AcceptedGuard } from '@/components/auth/accepted-guard';
import { AuthGuard } from '@/components/auth/auth-guard';


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AcceptedGuard>{children}</AcceptedGuard>
    </AuthGuard>
  );
}
