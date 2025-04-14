'use client';
import * as React from "react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';



interface Props {
  children: React.ReactNode;
}

export function AcceptedGuard({ children }: Props) {
  const { status } = useSession();
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAccepted = async () => {
      const res = await fetch('/api/me');
      if (res.ok) {
        const user = await res.json();
        setAccepted(user.accepted);
        if (!user.accepted) {
          router.replace('/consultation-confirmed');
        }
      } else {
        console.error('Error fetching user info');
        router.replace('/auth/sign-in');
      }
    };

    if (status === 'authenticated') {
      fetchAccepted();
    }

    if (status === 'unauthenticated') {
      router.replace('/auth/sign-in');
    }
  }, [status, router]);

  if (status === 'loading' || accepted === null) {
    return null;
  }

  return <>{children}</>;
}
