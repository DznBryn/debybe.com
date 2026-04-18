import type { Post } from '@debybe/db';
import { formatDate } from '@/lib/format';
import { TagPill } from './tag-pill';

export function PostHeader({ post }: { post: Post }) {
  return (
    <header className="mb-10 border-b border-border/60 pb-10">
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-fg-subtle">
        <time dateTime={post.publishedAt ?? ''}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingMinutes} min read</span>
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg md:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg">
        {post.excerpt}
      </p>
      {post.tags.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag}>
              <TagPill tag={tag} />
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
