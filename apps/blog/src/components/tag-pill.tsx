import Link from 'next/link';

export function TagPill({ tag, active = false }: { tag: string; active?: boolean }) {
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className={
        active
          ? 'inline-flex rounded-md border border-accent bg-accent/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-soft'
          : 'inline-flex rounded-md border border-border bg-bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle transition-colors hover:border-accent/60 hover:text-accent-soft'
      }
    >
      #{tag}
    </Link>
  );
}
