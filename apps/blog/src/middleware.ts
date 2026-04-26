import { withAuth } from 'next-auth/middleware';
import { getAllowedGithubLogin } from '@/lib/auth';

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token }) => token?.githubLogin === getAllowedGithubLogin(),
    },
  },
);

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
