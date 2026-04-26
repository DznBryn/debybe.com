import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export function getGraphqlApiUrl(): string {
  return process.env.GRAPHQL_API_URL ?? 'http://localhost:4000/graphql';
}

export function createGraphqlClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: getGraphqlApiUrl(),
      fetchOptions: { cache: 'no-store' },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });
}
