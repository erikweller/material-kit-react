import * as React from "react";
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { Layout } from '@/components/auth/layout';
import ResetPasswordForm from '@/components/auth/reset-password-form';
import SetNewPasswordForm from '@/components/auth/set-new-password-form';

export const metadata: Metadata = {
  title: `Reset password | Auth | ${config.site.name}`,
};

export default function Page({ searchParams }: { searchParams: { token?: string } }): React.JSX.Element {
  return (
    <Layout>
      <GuestGuard>
        {searchParams.token ? <SetNewPasswordForm token={searchParams.token} /> : <ResetPasswordForm />}
      </GuestGuard>
    </Layout>
  );
}
