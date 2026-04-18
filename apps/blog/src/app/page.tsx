import { Container } from '@debybe/ui';
import { getPublishedPosts } from '@debybe/db';
import { PostCard } from '@/components/post-card';

export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts(50);

  return (
    <main>
      <Container size="lg" className="py-16 md:py-24">
        <header className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">
            debybe · blog
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-fg md:text-5xl">
            Architecture notes, written in public.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-fg-muted md:text-lg">
            Systems design, AI in production, reliability, and the practical edges of shipping
            software that operators depend on.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-border bg-bg-soft p-8 text-center text-fg-muted">
            No posts yet. Run{' '}
            <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-xs">
              pnpm seed:blog
            </code>{' '}
            to populate the database.
          </p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}
