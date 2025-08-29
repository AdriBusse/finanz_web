"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GET_EXPENSES } from "@/graphql/queries/expenses/getExpenses";
import { CREATE_EXPENSE } from "@/graphql/mutations/expenses/createExpense";
import { DELETE_EXPENSE } from "@/graphql/mutations/expenses/deleteExpense";
import type { Expense } from "@/graphql/types/expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { formatAmount } from "@/lib/currency";
import { Spinner } from "@/components/ui/spinner";
import { BackButton } from "@/components/ui/back-button";
import { useMutation, useQuery } from "@apollo/client/react";

type GetExpensesData = { getExpenses: Expense[] };

const ExpenseSchema = Yup.object({
  title: Yup.string().required("Required"),
  currency: Yup.string().max(8).nullable(),
  monthlyRecurring: Yup.boolean().default(false),
  spendingLimit: Yup.number().integer().min(0).nullable(),
});

export default function ExpensesPage() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery<GetExpensesData>(GET_EXPENSES, { variables: { archived: false, order: "DESC" } });
  const [createExpense] = useMutation(CREATE_EXPENSE);
  const [deleteExpense] = useMutation(DELETE_EXPENSE);
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <BackButton />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Expenses</h1>
          <div className="flex gap-2">
            <Link href="/expenses/categories" className="inline-flex h-10 items-center rounded-md px-4 text-sm font-medium bg-[color:var(--accent2)] text-[color:var(--accent2-foreground)] hover:opacity-90">Categories</Link>
            <Button onClick={() => setOpen(true)}>New Expense</Button>
          </div>
        </div>
        {loading && (
          <div className="py-8 flex items-center justify-center">
            <Spinner size={28} />
          </div>
        )}
        {error && <div className="text-red-500">Failed to load expenses</div>}
        <div className="space-y-3">
          {data?.getExpenses?.map((e) => (
            <Card
              key={e.id}
              onClick={() => router.push(`/expenses/${e.id}`)}
              className="cursor-pointer hover:border-[color:var(--accent2)] transition-colors"
              role="button"
              aria-label={`Open expense ${e.title}`}
            >
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{e.title}</CardTitle>
                <div className="flex gap-1">
                  <Link
                    href={`/expenses/${e.id}`}
                    title="Open expense"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-blue-400 hover:text-blue-300 hover:bg-[rgba(30,64,175,0.15)]"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M13.5 5a1 1 0 0 0 0 2h3.086l-9.293 9.293a1 1 0 0 0 1.414 1.414L18 8.414V11.5a1 1 0 1 0 2 0v-6a1 1 0 0 0-1-1h-6.5Z"/>
                    </svg>
                    <span className="sr-only">Open</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Delete expense"
                    className="text-red-400 hover:text-red-300 hover:bg-[rgba(127,29,29,0.15)]"
                    onClick={async (ev) => {
                      ev.stopPropagation();
                      if (!confirm('Delete this expense?')) return;
                      await deleteExpense({ variables: { id: e.id } });
                      refetch();
                    }}
                  >
                    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9Zm2 2h2v1h-2V5Zm-3 4a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Zm5 0a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Z"/>
                    </svg>
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">Sum: {formatAmount(e.sum, e.currency)}</div>
                {e.spendingLimit != null && (
                  <div className="text-sm">Limit: {formatAmount(e.spendingLimit, e.currency)}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Create Expense</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <Formik
            initialValues={{ title: "", currency: "", monthlyRecurring: false, spendingLimit: "" as any }}
            validationSchema={ExpenseSchema}
            onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
              try {
                const spending = values.spendingLimit === "" ? null : Number(values.spendingLimit);
                const spendingInt = spending == null ? null : Math.max(0, Math.trunc(spending));
                await createExpense({ variables: { title: values.title, currency: values.currency || null, monthlyRecurring: values.monthlyRecurring, spendingLimit: spendingInt } });
                resetForm();
                setOpen(false);
                refetch();
              } catch (e: any) {
                setStatus(e?.message ?? "Create failed");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting, status }) => (
              <Form className="space-y-3">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Field id="title" name="title" as={Input} />
                  {touched.title && errors.title && <p className="text-sm text-red-500">{errors.title as any}</p>}
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Field id="currency" name="currency" as={Input} placeholder="e.g. EUR, USD" />
                </div>
                <div>
                  <Label htmlFor="spendingLimit">Spending Limit</Label>
                  <Field id="spendingLimit" name="spendingLimit" as={Input} type="number" min="0" />
                </div>
                <div className="flex items-center gap-2">
                  <Field id="monthlyRecurring" name="monthlyRecurring" type="checkbox" className="h-4 w-4" />
                  <Label htmlFor="monthlyRecurring">Monthly recurring</Label>
                </div>
                {status && <p className="text-sm text-red-500">{status}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>Create</Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
}
