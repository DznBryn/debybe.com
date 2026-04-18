import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@debybe/ui';
import { getPostsByTag } from '@debybe/db';
import { PostCard } from '@/components/post-card';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `Posts tagged #${decoded}`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = await getPostsByTag(decoded, 50);
  if (posts.length === 0) notFound();

  return (
    <main>
      <Container size="lg" className="py-16 md:py-24">
        <Link
          href="/"
          className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle transition-colors hover:text-accent"
        >
          ← all posts
        </Link>
        <header className="mb-12">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">Tag</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
            #{decoded}
          </h1>
          <p className="mt-2 text-sm text-fg-muted">
            {posts.length} post{posts.length === 1 ? '' : 's'}
          </p>
        </header>
        <ul className="grid gap-4 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
