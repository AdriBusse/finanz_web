"use client";
import { useQuery } from "@apollo/client/react";
import { getApolloClient } from "@/graphql/client";
import { useRouter } from "next/navigation";
import { ME_QUERY } from "@/graphql/queries/me";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import SpotlightCard from "@/components/ui/react-bits/SpotlightCard";
import { GET_SUMMARY } from "@/graphql/queries/summary/getSummary";
import { formatAmount } from "@/lib/currency";

export default function DashboardPage() {
  const client = getApolloClient();
  const router = useRouter();
  const { data, loading, error } = useQuery(ME_QUERY, { fetchPolicy: "cache-first" });
  const { data: summaryData } = useQuery(GET_SUMMARY, { fetchPolicy: "cache-first" });

  if (loading) return <div className="p-6 flex items-center justify-center"><Spinner size={28} /></div>;
  if (error) return <div className="p-6 text-red-600">Failed to load profile</div>;

  const user = data?.me;
  if (!user) {
    // Fallback: if token invalid, send back to login
    router.replace("/login");
    return null;
  }

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p>Welcome, <b>{user.username}</b></p>
        <div>
          <Link href="/expenses" className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground hover:opacity-90">Go to Expenses</Link>
        </div>
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SpotlightCard spotlightColor="rgba(57, 200, 20, 0.22)">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold">Latest expense</div>
              <div className="text-sm text-muted">
                {summaryData?.summary?.latestExpense?.title ?? "—"}
              </div>
              <div className="text-lg sm:text-xl font-semibold tabular-nums">
                {(() => {
                  const e = summaryData?.summary?.latestExpense;
                  if (!e) return "—";
                  return formatAmount(e.sum ?? 0, e.currency);
                })()}
              </div>
            </div>
          </SpotlightCard>

          <SpotlightCard spotlightColor="rgba(57, 200, 20, 0.22)">
            <div className="flex flex-col gap-1">
              <div className="text-sm text-muted">Last Transaction</div>
              <div className="text-lg sm:text-xl font-semibold tabular-nums">
                {(() => {
                  const t = summaryData?.summary?.todaySpent?.[0];
                  if (!t) return "No transaction today";
                  const curr = t.expense?.currency ?? null;
                  return formatAmount(t.amount ?? 0, curr);
                })()}
              </div>
              <div className="text-xs text-muted">
                {(() => {
                  const t = summaryData?.summary?.todaySpent?.[0];
                  return t ? (t.describtion || "Transaction") : "—";
                })()}
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
