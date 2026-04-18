import { Container } from '@debybe/ui';

export function About() {
  return (
    <section id="about" className="border-t border-border/60 py-20 md:py-28">
      <Container size="md">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-fg-subtle">About</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Scalable Frontend Architecture & Systems Design
        </h2>
        <p className="mt-6 text-base leading-relaxed text-fg-muted md:text-lg">
          Senior Full-Stack JavaScript Engineer focused on frontend architecture and scalable systems. Builds TypeScript-first, component-driven platforms using React, Next.js (App Router), React Native, and Remix, emphasizing performance, maintainability, and long-term scalability
        </p>
        <p className="mt-4 text-base leading-relaxed text-fg-muted md:text-lg">
          Designs modular and distributed frontend architectures, including micro-frontends, server-driven UI, and SSR/ISR strategies. Experienced in translating complex data models into high-performance, accessible interfaces using Redux Toolkit, RTK Query, GraphQL, and REST APIs, with integrations across Shopify Plus, Sanity CMS, and headless ecosystems
        </p>
        <p className="mt-4 text-base leading-relaxed text-fg-muted md:text-lg">
          Operates across the full stack with Node.js (Express), Python (FastAPI), and cloud platforms (AWS, Vercel, Railway), supporting microservices, CI/CD, and Docker-based workflows. Strong focus on performance optimization, testing (Jest, Cypress, Playwright), accessibility (WCAG), and developer experience to deliver resilient, production-grade systems
        </p>
      </Container>
    </section>
  );
}
