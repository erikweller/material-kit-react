'use client';

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import RouterLink from 'next/link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email(),
  password: z.string().min(6, { message: 'Password should be at least 6 characters' }),
  terms: z.boolean().refine((value) => value, 'You must accept the terms and conditions'),
});

type Values = z.infer<typeof schema>;

const defaultValues: Values = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  terms: false,
};

export function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Values>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: Values): Promise<void> => {
    setIsPending(true);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      setError('root', { type: 'server', message: data.error || 'Signup failed' });
      setIsPending(false);
      return;
    }

    const loginRes = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (loginRes?.error) {
      setError('root', { type: 'server', message: loginRes.error });
      setIsPending(false);
      return;
    }

    router.push('/user-info');
  };

  return (
    <Stack spacing={2}>
      <div>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
          Join CareVillage
        </Typography>
        <Typography sx={{ color: 'rgba(0, 0, 0, 0.7)' }}>
          Already have an account?{' '}
          <Link
            component={RouterLink}
            href={paths.auth.signIn}
            underline="hover"
            variant="subtitle2"
            className="text-teal-600"
            sx={{ color: '#233ea1' }}
          >
            Sign in
          </Link>
        </Typography>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormControl fullWidth error={Boolean(errors.firstName)}>
              <InputLabel>First name</InputLabel>
              <OutlinedInput {...field} label="First name" />
              {errors.firstName ? <FormHelperText>{errors.firstName.message}</FormHelperText> : null}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormControl fullWidth error={Boolean(errors.lastName)}>
              <InputLabel>Last name</InputLabel>
              <OutlinedInput {...field} label="Last name" />
              {errors.lastName ? <FormHelperText>{errors.lastName.message}</FormHelperText> : null}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <FormControl fullWidth error={Boolean(errors.email)}>
              <InputLabel>Email address</InputLabel>
              <OutlinedInput {...field} label="Email address" type="email" />
              {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <FormControl fullWidth error={Boolean(errors.password)}>
              <InputLabel>Password</InputLabel>
              <OutlinedInput {...field} label="Password" type="password" />
              {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
            </FormControl>
          )}
        />
        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <FormControl error={Boolean(errors.terms)}>
              <FormControlLabel
                control={<Checkbox {...field} />}
                label={
                  <>
                    I agree to the{' '}
                    <Link href="#" className="text-teal-600" sx={{ color: '#233ea1' }}>
                      terms and conditions
                    </Link>
                  </>
                }
              />
              {errors.terms ? <FormHelperText>{errors.terms.message}</FormHelperText> : null}
            </FormControl>
          )}
        />
        {errors.root ? <Alert severity="error">{errors.root.message}</Alert> : null}
        <Button type="submit" disabled={isPending} variant="contained" sx={{ background: '#233ea1' }} fullWidth>
          {isPending ? 'Signing up…' : 'Sign up'}
        </Button>
      </form>
    </Stack>
  );
}
