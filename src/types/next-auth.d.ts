// src/types/next-auth.d.ts
import NextAuth, { type DefaultSession, type DefaultUser } from 'next-auth';
import { type JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // 🔄 Changed to string to match JWT `sub` and avoid TS conflicts
      accepted: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    accepted: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    accepted: boolean;
  }
}
