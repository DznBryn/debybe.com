import Link from 'next/link';
import type { PublishedPostPreview } from '@debybe/graphql';
import { formatDate } from '@/lib/format';
import { TagPill } from './tag-pill';

export function PostCard({ post }: { post: PublishedPostPreview }) {
  return (
    <article className="group rounded-2xl border border-border bg-bg-soft p-6 transition-colors hover:border-accent/60">
      <Link href={`/${post.slug}`} className="block">
        <header className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.15em] text-fg-subtle">
          <time dateTime={post.publishedAt ?? ''}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </header>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-fg group-hover:text-accent-soft md:text-2xl">
          {post.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
      </Link>
      {post.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag}>
              <TagPill tag={tag} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
