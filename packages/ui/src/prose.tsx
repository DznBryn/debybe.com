import { type HTMLAttributes } from 'react';
import { cn } from './lib/utils';

export function Prose({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'prose prose-invert max-w-none',
        'prose-headings:tracking-tight prose-headings:text-fg',
        'prose-p:text-fg-muted prose-li:text-fg-muted',
        'prose-a:text-accent hover:prose-a:text-accent-soft prose-a:no-underline hover:prose-a:underline',
        'prose-strong:text-fg',
        'prose-code:rounded prose-code:bg-bg-elevated prose-code:px-1 prose-code:py-0.5 prose-code:text-fg prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:border prose-pre:border-border prose-pre:bg-bg-soft',
        'prose-blockquote:border-l-accent prose-blockquote:text-fg-muted',
        'prose-hr:border-border',
        className,
      )}
      {...props}
    />
  );
}
