import { cookies } from "next/headers";

const TOKEN_COOKIE = "finanz_at";
const USER_COOKIE = "finanz_user"; // minimal non-sensitive user snapshot

export type MinimalUser = {
  id: string;
  username: string;
  email?: string | null;
};

export function getAccessTokenFromCookies(): string | null {
  const jar = cookies();
  return jar.get(TOKEN_COOKIE)?.value ?? null;
}

export function parseUserCookie(): MinimalUser | null {
  const jar = cookies();
  const raw = jar.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MinimalUser;
  } catch {
    return null;
  }
}

export function buildSessionCookies({
  token,
  user,
  maxAge = 60 * 60 * 24 * 7, // 7 days
}: {
  token: string;
  user: MinimalUser;
  maxAge?: number;
}) {
  return [
    {
      name: TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      maxAge,
    },
    {
      name: USER_COOKIE,
      value: JSON.stringify(user),
      httpOnly: false,
      path: "/",
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      maxAge,
    },
  ];
}

export function clearAuthCookies() {
  return [
    { name: TOKEN_COOKIE, value: "", path: "/", maxAge: 0 },
    { name: USER_COOKIE, value: "", path: "/", maxAge: 0 },
  ];
}

