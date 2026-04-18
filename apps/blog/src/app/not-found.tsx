import Link from 'next/link';
import { Container } from '@debybe/ui';

export default function NotFound() {
  return (
    <main>
      <Container size="sm" className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Post not found.
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          The post you&rsquo;re looking for doesn&rsquo;t exist, is unpublished, or was moved.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-xl border border-border px-4 py-2 text-sm text-fg hover:border-accent hover:text-accent"
        >
          ← Back to all posts
        </Link>
      </Container>
    </main>
  );
}
