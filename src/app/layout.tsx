'use client';
import '@/styles/global.css';
import * as React from 'react';
import type { Viewport } from 'next';
import Script from 'next/script';
import { SessionProvider } from 'next-auth/react';
import 'react-phone-number-input/style.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <head>
  <script
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCunVHZBsdwAGhw4D0Tt0z3qhqb0eIv5vk&libraries=places"
    async
    defer
  ></script>
</head>

      <body>
        <SessionProvider>
          <LocalizationProvider>
            <UserProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </UserProvider>
          </LocalizationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
