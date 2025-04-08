// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      accepted: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: number;
    accepted: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    accepted: boolean;
  }
}
