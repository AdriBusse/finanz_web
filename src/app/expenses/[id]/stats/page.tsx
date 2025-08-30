"use client";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_EXPENSE } from "@/graphql/queries/expenses/getExpense";
import type { Expense, ExpenseTransaction } from "@/graphql/types/expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { BackButton } from "@/components/ui/back-button";
import { formatAmount } from "@/lib/currency";
import Link from "next/link";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  Legend as PieLegend,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as BarTooltip,
  Legend as BarLegend,
} from "recharts";

type GetExpenseData = { getExpense: Expense & { transactions: ExpenseTransaction[] } };

export default function ExpenseStatsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, loading, error } = useQuery<GetExpenseData>(GET_EXPENSE, { variables: { id } });
  const expense = data?.getExpense;

  const { byCategory, byDay } = useMemo(() => {
    const txs = expense?.transactions ?? [];
    // Group by category
    const catMap = new Map<string, { name: string; color: string; value: number }>();
    for (const t of txs) {
      const key = t.category?.id ?? "__nocat";
      const name = t.category?.name ?? "No category";
      const color = t.category?.color ?? "#6b7280"; // gray-500 default
      const prev = catMap.get(key) || { name, color, value: 0 };
      prev.value += t.amount;
      // keep first non-null color/name
      prev.name = prev.name || name;
      prev.color = prev.color || color;
      catMap.set(key, prev);
    }
    const byCategory = Array.from(catMap.values()).sort((a, b) => b.value - a.value);

    // Group by day (YYYY-MM-DD)
    const dayMap = new Map<string, number>();
    for (const t of txs) {
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dayMap.set(key, (dayMap.get(key) || 0) + t.amount);
    }
    const byDay = Array.from(dayMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([date, amount]) => ({ date, amount }));

    return { byCategory, byDay };
  }, [expense?.transactions]);

  if (loading) return <div className="p-6 flex items-center justify-center"><Spinner size={28} /></div>;
  if (error || !expense) return <div className="p-6 text-red-500">Failed to load stats</div>;

  const currency = expense.currency ?? undefined;

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <BackButton />
          <Link href={`/expenses/${expense.id}`} className="text-sm hover:text-[color:var(--accent2)]">Back to expense</Link>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Stats for {expense.title}</h1>
          <p className="text-sm text-muted">Breakdown by category and daily spend</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>By Category</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 360 }}>
            {byCategory.length === 0 ? (
              <div className="text-muted text-sm">No transactions to visualize.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {byCategory.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color || "#3b82f6"} />
                    ))}
                  </Pie>
                  <PieLegend verticalAlign="bottom" height={36} />
                  <PieTooltip
                    formatter={(value: any, _name: any) => [formatAmount(Number(value) || 0, currency), "Amount"]}
                    contentStyle={{ background: "#161a1f", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    labelStyle={{ color: "var(--muted-foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Spend</CardTitle>
          </CardHeader>
          <CardContent style={{ height: 360 }}>
            {byDay.length === 0 ? (
              <div className="text-muted text-sm">No transactions to visualize.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDay} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                  <BarLegend />
                  <BarTooltip
                    formatter={(value: any) => [formatAmount(Number(value) || 0, currency), "Amount"]}
                    contentStyle={{ background: "#161a1f", border: "1px solid var(--border)", color: "var(--foreground)" }}
                    labelStyle={{ color: "var(--muted-foreground)" }}
                  />
                  <Bar dataKey="amount" name="Amount" fill="var(--color-accent2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

