'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'loading') return;

      if (status === 'unauthenticated') {
        console.debug('🔒 Not authenticated, redirecting to /auth/sign-in');
        router.replace('/auth/sign-in');
        return;
      }

      try {
        const res = await fetch('/api/me');
        const user = await res.json();

        console.debug('🧠 User from /api/me in AuthGuard:', user);

        const isAccepted = !!user.accepted;
        const hasConsultation = !!user.consultationScheduledAt;

        const isOnConsultationConfirmed = pathname === '/consultation-confirmed';
        const isOnZoom = pathname === '/zoom';
        const isOnDashboard = pathname.startsWith('/dashboard');

        // 🔁 Redirect logic
        if (!hasConsultation && !isOnConsultationConfirmed) {
          // User hasn't scheduled a consultation
          router.replace('/consultation-confirmed');
        } else if (!isAccepted && isOnDashboard) {
          // Block dashboard until accepted
          router.replace('/consultation-confirmed');
        } else if (isAccepted && (isOnConsultationConfirmed || isOnZoom)) {
          // If accepted, skip consultation-confirmed and zoom
          router.replace('/dashboard');
        }
        // Else: allow current page
      } catch (err) {
        console.error('❌ Failed to fetch /api/me in AuthGuard:', err);
        router.replace('/auth/sign-in');
      }
    };

    checkAuth();
  }, [status, pathname, router]);

  if (status === 'loading') {
    return null;
  }

  return <>{children}</>;
}
