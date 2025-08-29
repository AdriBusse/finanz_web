import { ApolloClient } from "@apollo/client";
import { getApolloClient } from "@/graphql/client";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "@/graphql/mutations/auth";
import type { RegisterInput, LoginType, User } from "@/graphql/types";

export async function loginMutation(
  variables: { username: string; password: string },
  client?: ApolloClient<any>
): Promise<LoginType> {
  const usedClient = client ?? getApolloClient();
  const { data } = await usedClient.mutate<{ login: LoginType }>({
    mutation: LOGIN_MUTATION,
    variables,
  });
  if (!data?.login) throw new Error("Login failed");
  return data.login;
}

export async function signupMutation(
  variables: { data: RegisterInput },
  client?: ApolloClient<any>
): Promise<User> {
  const usedClient = client ?? getApolloClient();
  const { data } = await usedClient.mutate<{ signup: User }>({
    mutation: SIGNUP_MUTATION,
    variables,
  });
  if (!data?.signup) throw new Error("Signup failed");
  return data.signup;
}

export async function startSession(token: string, user: Pick<User, "id" | "username" | "email">) {
  const res = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, user }),
  });
  if (!res.ok) throw new Error("Could not start session");
}

export async function endSession() {
  await fetch("/api/session", { method: "DELETE" });
}

