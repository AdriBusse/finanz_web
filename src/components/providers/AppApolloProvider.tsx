"use client";
import { ReactNode } from "react";
import { getApolloClient } from "@/graphql/client";
import { ApolloProvider } from "@apollo/client/react";

export function AppApolloProvider({ children }: { children: ReactNode }) {
  const client = getApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

