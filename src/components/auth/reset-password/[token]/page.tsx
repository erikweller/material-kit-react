'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

import {
  Stack,
  Typography,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Alert,
} from '@mui/material';

const schema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type Values = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: Values) => {
    if (!token) {
      setError('Missing token');
      return;
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: values.password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Reset failed');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/auth/sign-in');
    }, 2000);
  };

  if (success) {
    return (
      <Stack spacing={2} alignItems="center">
        <Typography variant="h5" color="success.main">
          ✅ Password updated!
        </Typography>
        <Typography variant="body1">Redirecting to sign in...</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight="bold">
        Set a new password
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormControl error={!!errors.password}>
                <InputLabel>New Password</InputLabel>
                <OutlinedInput {...field} label="New Password" type="password" />
                {errors.password && (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" sx={{ background: '#233ea1' }}>
            Reset Password
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
