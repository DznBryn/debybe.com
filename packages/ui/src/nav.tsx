import { cn } from './lib/utils';
import { siteUrls } from './site-urls';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

interface NavProps {
  brand?: string;
  links?: NavLink[];
  className?: string;
  active?: 'landing' | 'blog';
}

const defaultLinks = (active?: 'landing' | 'blog'): NavLink[] => [
  { label: 'Home', href: siteUrls.landing, external: active !== 'landing' },
  { label: 'Blog', href: siteUrls.blog, external: active !== 'blog' },
];

export function Nav({ brand = 'debybe', links, className, active }: NavProps) {
  const resolvedLinks = links ?? defaultLinks(active);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60',
        className,
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 md:px-8">
        <a
          href={siteUrls.landing}
          className="text-md font-semibold tracking-tight text-fg hover:text-accent"
        >
          {brand}
          <span className="text-accent">.</span>
        </a>
        <nav className="flex items-center gap-1">
          {resolvedLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-fg"
              {...(link.external ? { rel: 'noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
