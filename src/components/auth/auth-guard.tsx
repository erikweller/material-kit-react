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

      // Fetch /api/me for `accepted` status
      try {
        const res = await fetch('/api/me');
        const user = await res.json();

        console.debug('🧠 User from /api/me in AuthGuard:', user);

        // 🔁 Loop protection
        if (!user.accepted && pathname !== '/consultation-confirmed') {
          router.replace('/consultation-confirmed');
        } else if (user.accepted && pathname === '/consultation-confirmed') {
          router.replace('/dashboard');
        }
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
