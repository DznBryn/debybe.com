import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { config as loadEnv } from 'dotenv';
import { resolvers, typeDefs } from '@debybe/graphql/server';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(currentDir, '..');

loadEnv({ path: path.join(appRoot, '.env.local') });
loadEnv({ path: path.join(appRoot, '.env') });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = Number(process.env.PORT ?? process.env.GRAPHQL_PORT ?? 4000);

const { url } = await startStandaloneServer(server, {
  listen: { host: '0.0.0.0', port },
});

console.log(`GraphQL API ready at ${url}`);
