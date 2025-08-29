import { NextResponse } from "next/server";
import { getAccessTokenFromCookies } from "@/lib/auth";

const TARGET = process.env.NEXT_PUBLIC_GRAPHQL_HTTP as string | undefined;

async function proxyGraphQL(req: Request) {
  if (!TARGET) {
    return NextResponse.json({ error: "GraphQL URL not configured" }, { status: 500 });
  }
  const token = getAccessTokenFromCookies();
  const body = await req.text();
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (token) headers["authorization"] = `Bearer ${token}`;

  const upstream = await fetch(TARGET, {
    method: "POST",
    headers,
    body,
    // server-to-server; no browser credentials
  });

  const text = await upstream.text();
  const res = new NextResponse(text, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
  });
  return res;
}

export async function POST(req: Request) {
  return proxyGraphQL(req);
}

