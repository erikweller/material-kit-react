'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { AcceptedGuard } from '@/components/auth/accepted-guard';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AcceptedGuard>{children}</AcceptedGuard>
    </AuthGuard>
  );
}
