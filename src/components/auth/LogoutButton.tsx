import * as React from 'react'

import { signOut } from 'next-auth/react';
import { Button } from '@mui/material';

'use client';

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
