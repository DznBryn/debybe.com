import { LegacyButton, Container, siteUrls } from '@debybe/ui';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden />
      <Container size="lg" className="relative py-28 md:py-40">
        <div className="flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">
            Brian Demorcy&apos;s Portfolio Work
          </span>
          <h1 className="mt-6 text-display font-semibold leading-none">
            <span className="text-fg">debybe</span>
            <span className="text-accent">&co-lab</span>
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-fg-muted md:text-lg">
            Engineered interfaces, not just built UI. Scalable frontend architecture, micro-frontends, and TypeScript-first systems built with React, Next.js, Remix, and Redux Toolkit—optimized for performance, maintainability, and long-term evolution.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <LegacyButton href={siteUrls.blog} variant="primary">
              Read the blog
            </LegacyButton>
            <LegacyButton href="#contact" variant="outline">
              Get in touch
            </LegacyButton>
          </div>
          <span className="mt-14 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-subtle">
            scroll to learn more about my skills and experiences
          </span>
        </div>
      </Container>
    </section>
  );
}
