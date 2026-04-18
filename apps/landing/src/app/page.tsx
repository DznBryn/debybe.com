import { Nav } from '@debybe/ui';
import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { About } from '@/components/about';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <>
      <Nav active="landing" />
      <main>
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
