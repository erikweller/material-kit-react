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

import { authClient } from '@/lib/auth/client';

const schema = zod.object({
  email: zod.string().min(1, { message: 'Email is required' }).email(),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: '' };

export default function ResetPasswordForm(): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: Values) => {
    setIsPending(true);
    const { error } = await authClient.resetPassword(values);
    if (error) {
      setError('root', { type: 'server', message: error });
      setIsPending(false);
      return;
    }
    setSuccess(true);
    setIsPending(false);

    setTimeout(() => {
      router.push('/auth/sign-in');
    }, 2000);
  };

  if (success) {
    return (
      <Stack spacing={2} alignItems="center" textAlign="center">
        <div className="mail-container">
          <div className="mail-icon" />
        </div>
        <Typography variant="h5" fontWeight="bold" color="black">
          Reset Link Sent!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your password reset link has been sent to your email.
        </Typography>

        <style jsx>{`
          .mail-container {
            height: 60px;
            margin: 12px 0;
          }
          .mail-icon {
            width: 50px;
            height: 35px;
            background-color: #233ea1;
            clip-path: polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%);
            position: relative;
            animation: fly 1s ease-in-out infinite;
          }
          @keyframes fly {
            0% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            50% {
              transform: translateY(-10px) scale(1.05);
              opacity: 0.9;
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mt: 1 }}>
        Reset password
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 400, color: 'text.secondary', mt: '-12px' }}
      >
        Enter your email address and you’ll be sent a link to reset your password.
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
          <Button disabled={isPending} type="submit" variant="contained" sx={{ background: '#233ea1' }}>
            Send recovery link
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
