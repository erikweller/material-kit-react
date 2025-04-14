import * as React from 'react'

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
import Link from '@mui/material/Link';
import RouterLink from 'next/link';
import { paths } from '@/paths';

'use client';

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
         <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
                      Sign In To CareVillage
                    </Typography>
         <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{' '}
          <Link sx={{color:'#233ea1'}} component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
            Sign up
          </Link>
        </Typography>
        
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
          />
          <Box mt={1} textAlign="right">
          <Link
            component={RouterLink}
            href={paths.auth.resetPassword} // make sure this path exists
            underline="hover"
            variant="subtitle2"
            sx={{ color: '#233ea1' }}
          >
            Forgot password?
          </Link>
        </Box>
          {error ? <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert> : null}
          <Box mt={2}>
            <Button fullWidth variant="contained" type="submit" sx={{background:'#233ea1'}}>
              Sign In
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
