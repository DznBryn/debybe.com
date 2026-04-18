import { type ReactElement } from 'react';
import { cn } from './lib/utils';

export interface SocialLink {
  label: string;
  href: string;
  icon: 'github' | 'x' | 'linkedin' | 'email' | 'rss';
}

const iconPaths: Record<SocialLink['icon'], ReactElement> = {
  github: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.953 0-1.094.39-1.989 1.029-2.689-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.69 0 3.849-2.339 4.697-4.566 4.945.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.021C22 6.484 17.523 2 12 2Z"
    />
  ),
  x: (
    <path d="M17.53 2.75h3.137l-6.854 7.844L22 21.25h-6.313l-4.94-6.464-5.66 6.464H1.95l7.332-8.392L1.5 2.75h6.47l4.466 5.904Zm-1.1 16.625h1.74L6.67 4.5H4.804Z" />
  ),
  linkedin: (
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.22 8h4.56v14H.22V8Zm7.54 0h4.37v1.93h.06c.61-1.15 2.1-2.37 4.33-2.37 4.63 0 5.48 3.05 5.48 7.02V22h-4.56v-6.21c0-1.48-.03-3.39-2.06-3.39-2.06 0-2.38 1.61-2.38 3.28V22H7.76V8Z" />
  ),
  email: (
    <path d="M2 4h20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 2v.01L12 13l10-6.99V6H2Zm0 2.243V18h20V8.243l-10 7-10-7Z" />
  ),
  rss: (
    <path d="M3.429 5.1v3.257c7.13 0 12.914 5.784 12.914 12.914H19.6C19.6 12.314 12.386 5.1 3.429 5.1Zm0 6.514v3.257a3.258 3.258 0 0 1 3.257 3.257H9.943A6.514 6.514 0 0 0 3.429 11.614ZM5.6 18.672a2.172 2.172 0 1 1-4.343 0 2.172 2.172 0 0 1 4.343 0Z" />
  ),
};

interface SocialIconsProps {
  links: SocialLink[];
  className?: string;
}

export function SocialIcons({ links, className }: SocialIconsProps) {
  return (
    <ul className={cn('flex items-center gap-2', className)}>
      {links.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            aria-label={link.label}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg-muted transition-colors hover:border-accent hover:text-accent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
            >
              {iconPaths[link.icon]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
