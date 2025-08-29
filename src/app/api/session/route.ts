import { NextResponse } from "next/server";
import { buildSessionCookies, clearAuthCookies, MinimalUser } from "@/lib/auth";

export async function POST(req: Request) {
  const { token, user, maxAge } = (await req.json()) as {
    token: string;
    user: MinimalUser;
    maxAge?: number;
  };
  if (!token || !user) {
    return NextResponse.json({ ok: false, error: "Missing token or user" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true });
  const cookies = buildSessionCookies({ token, user, maxAge });
  cookies.forEach((c) =>
    res.cookies.set(c.name, c.value, {
      httpOnly: (c as any).httpOnly,
      path: c.path,
      sameSite: c.sameSite,
      secure: (c as any).secure,
      maxAge: c.maxAge,
    })
  );
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  const cookies = clearAuthCookies();
  cookies.forEach((c) => res.cookies.set(c.name, c.value, { path: c.path, maxAge: c.maxAge }));
  return res;
}
