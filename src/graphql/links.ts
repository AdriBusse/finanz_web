"use client";
import { onError } from "@apollo/client/link/error";
import { createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Always call our Next.js API proxy to avoid CORS and keep httpOnly tokens server-side.
export const httpLink = createHttpLink({ uri: "/api/graphql", credentials: "include" });

export const authLink = setContext((_, { headers }) => {
  // Client-side only: read token from cookie to attach Authorization
  let token = "";
  if (typeof document !== "undefined") {
    const m = document.cookie.match(/(?:^|; )finanz_at=([^;]+)/);
    token = m ? decodeURIComponent(m[1]) : "";
  }
  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (process.env.NODE_ENV !== "production") {
    if (graphQLErrors) {
      // eslint-disable-next-line no-console
      graphQLErrors.forEach(({ message, path }) => console.warn("GraphQL error:", message, path));
    }
    if (networkError) {
      // eslint-disable-next-line no-console
      console.warn("Network error:", networkError);
    }
  }
});
