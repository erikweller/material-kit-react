'use client';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      try {
        // Wait for session to update
        await new Promise((r) => setTimeout(r, 200));

        const me = await fetch('/api/me');
        const user = await me.json();

        if (!me.ok || !user) {
          setError('Failed to load user profile.');
          return;
        }

        if (user.accepted === true) {
          router.push('/dashboard');
        } else {
          router.push('/consultation-confirmed');
        }
      } catch (err) {
        console.error('❌ Failed to get user info:', err);
        setError('Something went wrong. Please try again.');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" mb={2} color="black">
          Sign In to CareVillage
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box mt={2}>
            <Button fullWidth variant="contained" type="submit">
              Sign In
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
