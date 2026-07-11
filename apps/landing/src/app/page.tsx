import { Nav } from '@debybe/ui';
import { createGraphqlClient, GET_API_HEALTH_QUERY, type HealthQueryResult } from '@debybe/graphql';
import { Hero } from '@/components/hero';
import { Projects } from '@/components/projects';
import { About } from '@/components/about';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';

async function getApiHealth(): Promise<string | null> {
  try {
    const client = createGraphqlClient();
    const { data } = await client.query<HealthQueryResult>({
      query: GET_API_HEALTH_QUERY,
    });
    return data?.health ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const apiStatus = await getApiHealth();

  return (
    <>
      <Nav active="landing" />
      <main>
        <Hero apiStatus={apiStatus} />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
