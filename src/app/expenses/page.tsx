"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GET_EXPENSES } from "@/graphql/queries/expenses/getExpenses";
import { CREATE_EXPENSE } from "@/graphql/mutations/expenses/createExpense";
import { GET_EXPENSE_TRANSACTION_TEMPLATES } from "@/graphql/queries/templates/getExpenseTransactionTemplates";
import type { ExpenseTransactionTemplate } from "@/graphql/types/expenseTemplate";
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
import FAB from "@/components/ui/FAB";

type GetExpensesData = { getExpenses: Expense[] };

const ExpenseSchema = Yup.object({
  title: Yup.string().required("Required"),
  currency: Yup.string().max(8).nullable(),
  monthlyRecurring: Yup.boolean().default(false),
  spendingLimit: Yup.number().integer().min(0).nullable(),
});

type GetTemplatesData = { getExpenseTransactionTemplates: ExpenseTransactionTemplate[] };

export default function ExpensesPage() {
  const router = useRouter();
  const variables = { archived: false, order: "DESC" as const };
  const { data, loading, error } = useQuery<GetExpensesData>(GET_EXPENSES, { variables });
  const [createExpense] = useMutation(CREATE_EXPENSE);
  const { data: templatesData } = useQuery<GetTemplatesData>(GET_EXPENSE_TRANSACTION_TEMPLATES);
  const [deleteExpense] = useMutation(DELETE_EXPENSE);
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <BackButton />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <nav
            role="group"
            aria-label="Expense options"
            className="flex w-full sm:inline-flex sm:w-auto rounded-md border border-default overflow-hidden text-center"
          >
            <Link
              href="/expenses/templates"
              className="inline-flex h-10 items-center justify-center px-3 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 ring-accent flex-1 sm:flex-none"
            >
              Templates
            </Link>
            <Link
              href="/expenses/categories"
              className="inline-flex h-10 items-center justify-center px-3 text-sm hover:bg-muted border-l border-default focus-visible:outline-none focus-visible:ring-2 ring-accent flex-1 sm:flex-none"
            >
              Categories
            </Link>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(true)}
              className="h-10 rounded-none px-3 text-sm border-l border-default hover:bg-muted focus-visible:ring-2 ring-accent flex-1 sm:flex-none"
            >
              New Expense
            </Button>
          </nav>
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
                    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
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
                      await deleteExpense({
                        variables: { id: e.id },
                        optimisticResponse: { deleteExpense: true },
                        update: (cache) => {
                          const existing = cache.readQuery<GetExpensesData>({ query: GET_EXPENSES, variables });
                          if (!existing) return;
                          cache.writeQuery<GetExpensesData>({
                            query: GET_EXPENSES,
                            variables,
                            data: { getExpenses: existing.getExpenses.filter((x) => x.id !== e.id) },
                          });
                        },
                      });
                    }}
                  >
                    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9Zm2 2h2v1h-2V5Zm-3 4a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Zm5 0a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Z"/>
                    </svg>
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="font-semibold">Sum:</span>{" "}
                  <span className="tabular-nums font-normal">{formatAmount(e.sum, e.currency)}</span>
                </div>
                {e.spendingLimit != null && (
                  <div className="text-xs text-muted">
                    <span>Limit:</span>{" "}
                    <span className="tabular-nums">{formatAmount(e.spendingLimit, e.currency)}</span>
                  </div>
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
            enableReinitialize
            initialValues={{ 
              title: "", 
              currency: "", 
              monthlyRecurring: false, 
              spendingLimit: "" as any,
              selectedTemplates: (templatesData?.getExpenseTransactionTemplates ?? []).map(t => t.id) as string[],
            }}
            validationSchema={ExpenseSchema}
            onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
              try {
                const allTemplateIds = (templatesData?.getExpenseTransactionTemplates ?? []).map(t => t.id);
                const includeIds: string[] = values.selectedTemplates || [];
                const skipTemplateIds = values.monthlyRecurring
                  ? allTemplateIds.filter(id => !includeIds.includes(id))
                  : undefined;
                const spending = values.spendingLimit === "" ? null : Number(values.spendingLimit);
                const spendingInt = spending == null ? null : Math.max(0, Math.trunc(spending));
                await createExpense({
                  variables: { title: values.title, currency: values.currency || null, monthlyRecurring: values.monthlyRecurring, spendingLimit: spendingInt, skipTemplateIds },
                  update: (cache, { data: resp }) => {
                    if (!resp?.createExpense) return;
                    const existing = cache.readQuery<GetExpensesData>({ query: GET_EXPENSES, variables });
                    if (!existing) return;
                    cache.writeQuery<GetExpensesData>({
                      query: GET_EXPENSES,
                      variables,
                      data: { getExpenses: [resp.createExpense, ...existing.getExpenses] },
                    });
                  },
                });
                resetForm();
                setOpen(false);
                // Apollo cache update keeps UI in sync without refetch
              } catch (e: any) {
                setStatus(e?.message ?? "Create failed");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting, status, values, setFieldValue }) => (
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
                  <Field id="monthlyRecurring" name="monthlyRecurring" type="checkbox" className="h-5 w-5" />
                  <Label htmlFor="monthlyRecurring">Monthly recurring</Label>
                </div>
                {values.monthlyRecurring && (
                  <div className="mt-2 space-y-2">
                    <div className="text-sm font-medium">Apply templates</div>
                    <div className="space-y-1">
                      {(templatesData?.getExpenseTransactionTemplates ?? []).map(t => {
                        const checked = values.selectedTemplates?.includes(t.id);
                        return (
                          <label key={t.id} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={!!checked}
                              onChange={(e) => {
                                const next = new Set(values.selectedTemplates || []);
                                if (e.target.checked) next.add(t.id); else next.delete(t.id);
                                setFieldValue('selectedTemplates', Array.from(next));
                              }}
                            />
                            <span className="flex-1">{t.describtion}</span>
                            <span className="tabular-nums text-muted">{formatAmount(t.amount)}</span>
                          </label>
                        );
                      })}
                      {!templatesData?.getExpenseTransactionTemplates?.length && (
                        <div className="text-xs text-muted">No templates available.</div>
                      )}
                    </div>
                  </div>
                )}
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
      <FAB ariaLabel="Create expense" title="Create expense" onClick={() => setOpen(true)} />
    </div>
  );
}
