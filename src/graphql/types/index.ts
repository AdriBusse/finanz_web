// Minimal TypeScript types derived from the local GraphQL schema
// Focused on auth-related entities used by the app.

export type User = {
  id: string;
  username: string;
  email: string;
};

export type LoginType = {
  user: User;
  token: string;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export type MeQuery = { me: User | null };

