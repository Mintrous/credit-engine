import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/graphql';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: BASE_URL,
  }),
  cache: new InMemoryCache(),
});

