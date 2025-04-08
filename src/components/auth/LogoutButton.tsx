'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@mui/material';

export function LogoutButton() {
  return (
    <Button
      variant="outlined"
      color="error"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      Logout
    </Button>
  );
}
