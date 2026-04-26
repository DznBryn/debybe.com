import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

export function getAllowedGithubLogin(): string {
  return (process.env.ADMIN_GITHUB_LOGIN ?? 'dznbryn').toLowerCase();
}

function getGithubProfileLogin(profile: unknown): string {
  if (!profile || typeof profile !== 'object') return '';
  const maybeLogin = (profile as { login?: unknown }).login;
  return typeof maybeLogin === 'string' ? maybeLogin.toLowerCase() : '';
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== 'github') return false;
      const login = getGithubProfileLogin(profile);
      return login === getAllowedGithubLogin();
    },
    async jwt({ token, account, profile }) {
      if (account?.provider === 'github') {
        const login = getGithubProfileLogin(profile);
        if (login) {
          token.githubLogin = login;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.githubLogin = typeof token.githubLogin === 'string' ? token.githubLogin : undefined;
      }
      return session;
    },
  },
};
