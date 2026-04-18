import { LegacyButton, Container, SocialIcons, type SocialLink } from '@debybe/ui';

const socials: SocialLink[] = [
  { label: 'GitHub', icon: 'github', href: 'https://github.com/DznBryn' },
  { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/' },
  { label: 'Email', icon: 'email', href: 'mailto:bryan@debybe.com' },
];

export function Contact() {
  return (
    <section id="contact" className="border-t border-border/60 py-20 md:py-28">
      <Container size="md">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">Contact</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Let&rsquo;s build something durable.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fg-muted">
              Open to senior frontend architecture and micro-frontend engagements. The fastest
              path is email — socials work too.
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <LegacyButton href="mailto:bryan@debybe.com" variant="primary">
              bryan@debybe.com
            </LegacyButton>
            <SocialIcons links={socials} />
          </div>
        </div>
      </Container>
    </section>
  );
}
