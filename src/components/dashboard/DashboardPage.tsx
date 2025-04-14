import * as React from 'react'

import { signOut, useSession } from 'next-auth/react';
import { Button, Typography, Box, Container } from '@mui/material';

'use client';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <Typography>Loading...</Typography>;
  }

  console.log('📦 SESSION DATA:', session);

  if (!session) {
    return <Typography>Not authenticated</Typography>; // fallback, but you may be redirecting instead
  }

  return (
    <Container maxWidth="sm">
      <Box mt={8} textAlign="center">
        <Typography variant="h3" gutterBottom color="primary">
          Hello {session.user?.name || 'User'}!!
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => signOut({ callbackUrl: '/auth/sign-in' })}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}
