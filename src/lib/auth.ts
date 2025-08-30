import { cookies } from "next/headers";

const TOKEN_COOKIE = "finanz_at";
const USER_COOKIE = "finanz_user"; // minimal non-sensitive user snapshot

export type MinimalUser = {
  id: string;
  username: string;
  email?: string | null;
};

async function readCookie(name: string): Promise<string | null> {
  // Next 15 requires awaiting cookies(); older versions return a sync object.
  const jar: any = await (cookies() as any);
  let v: any = null;
  if (jar && typeof jar.get === "function") {
    v = jar.get(name);
  }
  if (!v) return null;
  if (typeof v === "string") return v;
  if (typeof v === "object" && typeof v.value === "string") return v.value;
  return null;
}

export async function getAccessTokenFromCookies(): Promise<string | null> {
  return readCookie(TOKEN_COOKIE);
}

export async function parseUserCookie(): Promise<MinimalUser | null> {
  const raw = await readCookie(USER_COOKIE);
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
