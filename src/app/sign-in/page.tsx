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

export default function SignInPage() {
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

    console.log('🧪 signIn result:', res);

    if (res?.ok) {
      // ✅ Fetch user info from /api/me
      const userRes = await fetch('/api/me');
      const user = await userRes.json();

      if (user?.accepted) {
        router.push('/dashboard');
      } else {
        router.push('/consultation-confirmed');
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
