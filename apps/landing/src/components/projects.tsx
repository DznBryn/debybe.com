import { Container } from '@debybe/ui';
import { projects } from '@/content/projects';

export function Projects() {
  return (
    <section id="projects" className="border-t border-border/60 py-20 md:py-28">
      <Container size="lg">
        <header className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">
              Selected Experiences
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
              Experiences
            </h2>
          </div>
        </header>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => {
            const isLink = Boolean(p.href);
            const Wrapper = isLink ? 'a' : 'div';
            return (
              <li key={p.title}>
                <Wrapper
                  {...(isLink ? { href: p.href, target: '_blank', rel: 'noreferrer' } : {})}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-bg-soft p-6 transition-colors hover:border-accent/60"
                >
                  <h3 className="text-lg font-medium text-fg group-hover:text-accent-soft">
                    {p.title}
                  </h3>
                  {p.role && (
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-fg-subtle">
                      {p.role}
                    </p>
                  )}
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{p.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5">
                    {p.stack.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md border border-border bg-bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </Wrapper>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
