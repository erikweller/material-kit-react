import { type AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './prisma';
import bcrypt from 'bcryptjs'; // Ensure you use this if passwords are hashed

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        // If passwords are hashed (recommended), use bcrypt
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // ✅ Return full user object to match expected `User` type
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = typeof user.id === 'string' ? parseInt(user.id) : user.id;
        token.accepted = user.accepted;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = typeof token.id === 'string' ? parseInt(token.id) : token.id;
        session.user.accepted = token.accepted;
      }
      return session;
    },
  },
  pages: {
    signIn: '/app/auth/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
