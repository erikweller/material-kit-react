'use client';
import * as React from "react";
import { Button } from '@mui/material';
import { signOut } from 'next-auth/react';


export function LogoutButton() {
  return (
    <Button variant="outlined" color="error" onClick={() => signOut({ callbackUrl: '/' })}>
      Logout
    </Button>
  );
}
