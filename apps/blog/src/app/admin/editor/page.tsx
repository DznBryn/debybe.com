import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Container } from '@debybe/ui';
import { getServerSession } from 'next-auth';
import { BlogArticleEditor } from '@/components/blog-article-editor';
import { authOptions, getAllowedGithubLogin } from '@/lib/auth';

export const metadata = {
  title: 'Blog Editor',
};

export default async function BlogEditorPage() {
  const session = await getServerSession(authOptions);
  const githubLogin = session?.user?.githubLogin?.toLowerCase();
  if (!githubLogin) {
    redirect('/api/auth/signin/github?callbackUrl=/admin/editor');
  }
  if (githubLogin !== getAllowedGithubLogin()) {
    redirect('/');
  }

  return (
    <main>
      <Container size="lg" className="py-12 md:py-16">
        <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-bg-soft p-3">
          <p className="text-sm text-fg-muted">Signed in as @{githubLogin}</p>
          <Link
            href="/api/auth/signout"
            className="rounded-md border border-border px-3 py-1.5 text-xs text-fg hover:border-accent"
          >
            Sign out
          </Link>
        </div>
        <BlogArticleEditor />
      </Container>
    </main>
  );
}
