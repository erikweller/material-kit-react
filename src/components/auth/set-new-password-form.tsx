'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { useRouter } from 'next/navigation';

const schema = zod.object({
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { password: '' };

export default function SetNewPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: Values) => {
    setIsPending(true);

    const res = await fetch('/api/auth/set-new-password', {
      method: 'POST',
      body: JSON.stringify({ ...values, token }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Failed to reset password');
      setIsPending(false);
      return;
    }

    router.push('/auth/sign-in');
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
        Set new password
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>New password</InputLabel>
                <OutlinedInput {...field} type="password" label="New password" />
                {errors.password && (
                  <FormHelperText>{errors.password.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" disabled={isPending} variant="contained" sx={{ background: '#233ea1' }}>
            Save password
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
