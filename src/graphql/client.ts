"use client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { authLink, errorLink, httpLink } from "./links";

let client: ApolloClient<any> | null = null;

export function getApolloClient() {
  if (client) return client;
  client = new ApolloClient({
    link: authLink.concat(errorLink).concat(httpLink),
    cache: new InMemoryCache(),
    connectToDevTools: process.env.NODE_ENV !== "production",
  });
  return client;
}

