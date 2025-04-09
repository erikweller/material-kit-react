'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';

import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { SetNewPasswordForm } from '@/components/auth/set-new-password-form';

export function ResetPasswordPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <Layout>
      <GuestGuard>
        {token ? (
          <SetNewPasswordForm token={token} />
        ) : (
          <ResetPasswordForm />
        )}
      </GuestGuard>
    </Layout>
  );
}
