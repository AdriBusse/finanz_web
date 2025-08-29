"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { GET_EXPENSE } from "@/graphql/queries/expenses/getExpense";
import { UPDATE_EXPENSE } from "@/graphql/mutations/expenses/updateExpense";
import { CREATE_EXPENSE_TRANSACTION } from "@/graphql/mutations/expenses/createExpenseTransaction";
import { DELETE_EXPENSE_TRANSACTION } from "@/graphql/mutations/expenses/deleteExpenseTransaction";
import { UPDATE_EXPENSE_TRANSACTION } from "@/graphql/mutations/expenses/updateExpenseTransaction";
import { GET_EXPENSE_CATEGORIES } from "@/graphql/queries/expenses/getExpenseCategories";
import type { Expense, ExpenseTransaction, ExpenseCategory } from "@/graphql/types/expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader as ModalHeader, DialogTitle as ModalTitle } from "@/components/ui/dialog";
import { currencySymbol, formatAmount } from "@/lib/currency";
import { getIconByKeyword } from "@/lib/icon_mapper";
import { BackButton } from "@/components/ui/back-button";
import { useMutation, useQuery } from "@apollo/client/react";

type GetExpenseData = { getExpense: Expense & { transactions: ExpenseTransaction[] } };
type CategoriesData = { getExpenseCategories: ExpenseCategory[] };

const ExpenseEditSchema = Yup.object({
  title: Yup.string().required("Required"),
  currency: Yup.string().max(8).nullable(),
  monthlyRecurring: Yup.boolean().default(false),
  spendingLimit: Yup.number().integer().min(0).nullable(),
  archived: Yup.boolean().default(false),
});

const TxSchema = Yup.object({
  describtion: Yup.string().required("Required"),
  amount: Yup.number().required().min(0.01, "Must be > 0"),
  categoryId: Yup.string().nullable(),
});

function groupByDate(transactions: ExpenseTransaction[]) {
  const groups = new Map<string, ExpenseTransaction[]>();
  for (const t of transactions) {
    const d = new Date(t.createdAt);
    const key = d.getFullYear() + "-" + (String(d.getMonth() + 1).padStart(2, "0")) + "-" + String(d.getDate()).padStart(2, "0");
    const arr = groups.get(key) ?? [];
    arr.push(t);
    groups.set(key, arr);
  }
  return Array.from(groups.entries()).sort((a,b) => (a[0] < b[0] ? 1 : -1));
}

export default function ExpenseDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, loading, error, refetch } = useQuery<GetExpenseData>(GET_EXPENSE, { variables: { id } });
  const { data: catData } = useQuery<CategoriesData>(GET_EXPENSE_CATEGORIES);
  const [updateExpense] = useMutation(UPDATE_EXPENSE);
  const [createTx] = useMutation(CREATE_EXPENSE_TRANSACTION);
  const [deleteTx] = useMutation(DELETE_EXPENSE_TRANSACTION);
  const [updateTx] = useMutation(UPDATE_EXPENSE_TRANSACTION);

  const expense = data?.getExpense;
  const categories = catData?.getExpenseCategories ?? [];
  const grouped = useMemo(() => groupByDate(expense?.transactions ?? []), [expense?.transactions]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openTx, setOpenTx] = useState(false);
  const [openEditTx, setOpenEditTx] = useState(false);
  const [editingTx, setEditingTx] = useState<ExpenseTransaction | null>(null);

  if (loading) return <div className="p-6 flex items-center justify-center"><Spinner size={28} /></div>;
  if (error || !expense) return <div className="p-6 text-red-500">Failed to load expense</div>;

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-baseline gap-4">
          <h1 className="text-xl font-semibold">{expense.title}</h1>
          <div className="text-2xl font-semibold tabular-nums">{formatAmount(expense.sum, expense.currency)}</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenEdit(true)}>Edit Expense</Button>
          <Button onClick={() => setOpenTx(true)}>New Transaction</Button>
        </div>
      </div>
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 py-4">
          <div>
            <div className="text-sm text-muted">Recurring</div>
            <div>{expense.monthlyRecurring ? "Yes" : "No"}</div>
          </div>
          <div>
            <div className="text-sm text-muted">Spending limit</div>
            <div>{expense.spendingLimit != null ? formatAmount(expense.spendingLimit, expense.currency) : "-"}</div>
          </div>
          <div>
            <div className="text-sm text-muted">Total sum</div>
            <div className="tabular-nums">{formatAmount(expense.sum, expense.currency)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Expense Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <ModalHeader><ModalTitle>Edit Expense</ModalTitle></ModalHeader>
        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={{
              title: expense.title,
              currency: expense.currency || "",
              monthlyRecurring: expense.monthlyRecurring,
              spendingLimit: expense.spendingLimit ?? "",
              archived: expense.archived,
            }}
            validationSchema={ExpenseEditSchema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              try {
                const spending = values.spendingLimit === "" ? null : Number(values.spendingLimit);
                await updateExpense({ variables: { id: expense.id, title: values.title, currency: values.currency || null, monthlyRecurring: values.monthlyRecurring, spendingLimit: spending, archived: values.archived } });
                await refetch();
                setOpenEdit(false);
              } catch (e: any) {
                setStatus(e?.message ?? "Update failed");
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
                  <Field id="currency" name="currency" as={Input} />
                </div>
                <div>
                  <Label htmlFor="spendingLimit">Spending Limit</Label>
                  <Field id="spendingLimit" name="spendingLimit" as={Input} type="number" min="0" />
                </div>
                <div className="flex items-center gap-2">
                  <Field id="monthlyRecurring" name="monthlyRecurring" type="checkbox" className="h-4 w-4" />
                  <Label htmlFor="monthlyRecurring">Monthly recurring</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Field id="archived" name="archived" type="checkbox" className="h-4 w-4" />
                  <Label htmlFor="archived">Archived</Label>
                </div>
                {status && <p className="text-sm text-red-500">{status}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpenEdit(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>Save</Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* New Transaction Modal */}
      <Dialog open={openTx} onOpenChange={setOpenTx}>
        <ModalHeader><ModalTitle>New Transaction</ModalTitle></ModalHeader>
        <DialogContent>
          <Formik
            initialValues={{ describtion: "", amount: "" as any, categoryId: "" }}
            validationSchema={TxSchema}
            onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
              try {
                await createTx({ variables: { expenseId: expense.id, describtion: values.describtion, amount: Number(values.amount), categoryId: values.categoryId || null } });
                resetForm();
                await refetch();
                setOpenTx(false);
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
                  <Label htmlFor="describtion">Description</Label>
                  <Field id="describtion" name="describtion" as={Input} />
                  {touched.describtion && errors.describtion && <p className="text-sm text-red-500">{errors.describtion as any}</p>}
                </div>
                <div>
                  <Label htmlFor="amount">Amount ({currencySymbol(expense.currency)})</Label>
                  <Field id="amount" name="amount" as={Input} type="number" step="0.01" />
                </div>
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Field as="select" id="categoryId" name="categoryId" className="mt-1 block w-full rounded-md border border-default bg-muted px-3 py-2 text-sm">
                    <option value="">— None —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Field>
                </div>
                {status && <p className="text-sm text-red-500">{status}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpenTx(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>Add</Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Modal */}
      <Dialog open={openEditTx} onOpenChange={(v) => { setOpenEditTx(v); if (!v) setEditingTx(null); }}>
        <ModalHeader><ModalTitle>Edit Transaction</ModalTitle></ModalHeader>
        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={{
              describtion: editingTx?.describtion ?? "",
              amount: (editingTx?.amount != null ? String(editingTx.amount) : "") as any,
              categoryId: editingTx?.category?.id ?? "",
            }}
            validationSchema={TxSchema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              try {
                if (!editingTx) return;
                await updateTx({ variables: { transactionId: editingTx.id, describtion: values.describtion, amount: Number(values.amount), categoryId: values.categoryId || null } });
                await refetch();
                setOpenEditTx(false);
                setEditingTx(null);
              } catch (e: any) {
                setStatus(e?.message ?? "Update failed");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting, status }) => (
              <Form className="space-y-3">
                <div>
                  <Label htmlFor="describtion">Description</Label>
                  <Field id="describtion" name="describtion" as={Input} />
                  {touched.describtion && errors.describtion && <p className="text-sm text-red-500">{errors.describtion as any}</p>}
                </div>
                <div>
                  <Label htmlFor="amount">Amount ({currencySymbol(expense.currency)})</Label>
                  <Field id="amount" name="amount" as={Input} type="number" step="0.01" />
                </div>
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Field as="select" id="categoryId" name="categoryId" className="mt-1 block w-full rounded-md border border-default bg-muted px-3 py-2 text-sm">
                    <option value="">— None —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Field>
                </div>
                {status && <p className="text-sm text-red-500">{status}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => { setOpenEditTx(false); setEditingTx(null); }}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>Save</Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {grouped.length === 0 && <div className="text-muted">No transactions yet.</div>}
          {grouped.map(([day, items]) => (
            <div key={day} className="space-y-2">
              <div className="text-sm text-muted">{day}</div>
              <div className="divide-y divide-[color:var(--border)] border border-default rounded-md">
                {items.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3">
                    <div>
                      <div className="font-medium">{t.describtion}</div>
                      <div className="text-xs text-muted flex items-center gap-1">
                        {t.category ? <span aria-hidden>{getIconByKeyword(t.category.icon ?? 'other')}</span> : null}
                        <span>{t.category?.name ?? "No category"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="tabular-nums">{formatAmount(t.amount, expense.currency)}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit transaction"
                        className="text-blue-400 hover:text-blue-300 hover:bg-[rgba(30,64,175,0.15)]"
                        onClick={() => { setEditingTx(t); setOpenEditTx(true); }}
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                          <path d="M4 15.5V20h4.5L19 9.5l-4.5-4.5L4 15.5ZM21.7 6.04a1 1 0 0 0 0-1.41l-2.33-2.33a1 1 0 0 0-1.41 0l-1.59 1.59 3.74 3.74 1.59-1.59Z"/>
                        </svg>
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete transaction"
                        className="text-red-400 hover:text-red-300 hover:bg-[rgba(127,29,29,0.15)]"
                        onClick={async () => {
                          const ok = window.confirm("Delete this transaction? This cannot be undone.");
                          if (!ok) return;
                          await deleteTx({ variables: { id: t.id } });
                          await refetch();
                        }}
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                          <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9Zm2 2h2v1h-2V5Zm-3 4a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Zm5 0a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Z"/>
                        </svg>
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
import { Spinner } from "@/components/ui/spinner";
