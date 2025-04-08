// src/app/sign-up/page.tsx
'use client';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/user-info'); // Or open UserInfoModal after this
    } else {
      alert('Signup failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" mb={2}>
          Create your CareVillage account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Box mt={2}>
            <Button fullWidth variant="contained" type="submit">
              Sign Up
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
}
