import { Container, siteUrls } from '@debybe/ui';

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <Container size="lg">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            © {new Date().getFullYear()} debybe
          </p>
          <nav className="flex items-center gap-4 text-xs text-fg-muted">
            <a href="#projects" className="hover:text-fg">
              Projects
            </a>
            <a href="#about" className="hover:text-fg">
              About
            </a>
            <a href={siteUrls.blog} className="hover:text-fg">
              Blog
            </a>
            <a href="#contact" className="hover:text-fg">
              Contact
            </a>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
