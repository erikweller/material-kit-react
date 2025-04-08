import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import { compare } from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error('Missing credentials');

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) throw new Error('Invalid credentials');

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error('Invalid password');

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          accepted: user.accepted,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.accepted = user.accepted;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.accepted = token.accepted;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
