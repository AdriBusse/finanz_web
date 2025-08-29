"use client";
import { useQuery } from "@apollo/client/react";
import { getApolloClient } from "@/graphql/client";
import { useRouter } from "next/navigation";
import { ME_QUERY } from "@/graphql/queries/me";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function DashboardPage() {
  const client = getApolloClient();
  const router = useRouter();
  const { data, loading, error } = useQuery(ME_QUERY, { fetchPolicy: "cache-first" });

  if (loading) return <div className="p-6 flex items-center justify-center"><Spinner size={28} /></div>;
  if (error) return <div className="p-6 text-red-600">Failed to load profile</div>;

  const user = data?.me;
  if (!user) {
    // Fallback: if token invalid, send back to login
    router.replace("/login");
    return null;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p>Welcome, <b>{user.username}</b></p>
      <div>
        <Link href="/expenses" className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground hover:opacity-90">Go to Expenses</Link>
      </div>
    </div>
  );
}
