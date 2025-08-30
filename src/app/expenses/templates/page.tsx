"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_EXPENSE_TRANSACTION_TEMPLATES } from "@/graphql/queries/templates/getExpenseTransactionTemplates";
import { CREATE_EXPENSE_TRANSACTION_TEMPLATE } from "@/graphql/mutations/templates/createExpenseTransactionTemplate";
import { UPDATE_EXPENSE_TRANSACTION_TEMPLATE } from "@/graphql/mutations/templates/updateExpenseTransactionTemplate";
import { DELETE_EXPENSE_TRANSACTION_TEMPLATE } from "@/graphql/mutations/templates/deleteExpenseTransactionTemplate";
import { GET_EXPENSE_CATEGORIES } from "@/graphql/queries/expenses/getExpenseCategories";
import type { ExpenseTransactionTemplate } from "@/graphql/types/expenseTemplate";
import type { ExpenseCategory } from "@/graphql/types/expenses";
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
import FAB from "@/components/ui/FAB";

type GetTemplatesData = { getExpenseTransactionTemplates: ExpenseTransactionTemplate[] };
type CategoriesData = { getExpenseCategories: ExpenseCategory[] };

const TemplateSchema = Yup.object({
  describtion: Yup.string().required("Required"),
  amount: Yup.number().required().min(0.01, "Must be > 0"),
  categoryId: Yup.string().nullable(),
});

export default function ExpenseTemplatesPage() {
  const router = useRouter();
  const { data, loading, error } = useQuery<GetTemplatesData>(GET_EXPENSE_TRANSACTION_TEMPLATES);
  const { data: catData } = useQuery<CategoriesData>(GET_EXPENSE_CATEGORIES);
  const [createTemplate] = useMutation(CREATE_EXPENSE_TRANSACTION_TEMPLATE);
  const [updateTemplate] = useMutation(UPDATE_EXPENSE_TRANSACTION_TEMPLATE);
  const [deleteTemplate] = useMutation(DELETE_EXPENSE_TRANSACTION_TEMPLATE);
  const [openNew, setOpenNew] = useState(false);
  const [editTmpl, setEditTmpl] = useState<ExpenseTransactionTemplate | null>(null);

  const categories = catData?.getExpenseCategories ?? [];

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <BackButton />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Expense Templates</h1>
          <div className="flex gap-2">
            <Button onClick={() => setOpenNew(true)}>New Template</Button>
          </div>
        </div>
        {loading && (
          <div className="py-8 flex items-center justify-center">
            <Spinner size={28} />
          </div>
        )}
        {error && <div className="text-red-500">Failed to load templates</div>}
        <div className="space-y-3">
          {data?.getExpenseTransactionTemplates?.map((t) => (
            <Card key={t.id} className="border-default">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="font-medium">{t.describtion}</span>
                  <span className="text-xs text-muted">
                    {t.category ? t.category.name : "No category"}
                  </span>
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Edit template"
                    className="text-blue-400 hover:text-blue-300 hover:bg-[rgba(30,64,175,0.15)]"
                    onClick={() => setEditTmpl(t)}
                  >
                    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M4 15.5V20h4.5L19 9.5l-4.5-4.5L4 15.5ZM21.7 6.04a1 1 0 0 0 0-1.41l-2.33-2.33a1 1 0 0 0-1.41 0l-1.59 1.59 3.74 3.74 1.59-1.59Z"/>
                    </svg>
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Delete template"
                    className="text-red-400 hover:text-red-300 hover:bg-[rgba(127,29,29,0.15)]"
                    onClick={async () => {
                      const ok = window.confirm("Delete this template? This cannot be undone.");
                      if (!ok) return;
                      await deleteTemplate({
                        variables: { id: t.id },
                        optimisticResponse: { deleteExpenseTransactionTemplate: true },
                        update: (cache) => {
                          const existing = cache.readQuery<GetTemplatesData>({ query: GET_EXPENSE_TRANSACTION_TEMPLATES });
                          if (!existing) return;
                          cache.writeQuery<GetTemplatesData>({
                            query: GET_EXPENSE_TRANSACTION_TEMPLATES,
                            data: { getExpenseTransactionTemplates: existing.getExpenseTransactionTemplates.filter(x => x.id !== t.id) },
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
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted">Created {new Date(t.createdAt).toLocaleDateString()}</div>
                <div className="text-sm font-medium tabular-nums">{formatAmount(t.amount, undefined)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* New Template */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogHeader>
          <DialogTitle>Create Template</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <Formik
            initialValues={{ describtion: "", amount: "" as any, categoryId: "" }}
            validationSchema={TemplateSchema}
            onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
              try {
                await createTemplate({
                  variables: { describtion: values.describtion, amount: Number(values.amount), categoryId: values.categoryId || null },
                  update: (cache, { data: resp }) => {
                    const created = resp?.createExpenseTransactionTemplate;
                    if (!created) return;
                    const existing = cache.readQuery<GetTemplatesData>({ query: GET_EXPENSE_TRANSACTION_TEMPLATES });
                    cache.writeQuery<GetTemplatesData>({
                      query: GET_EXPENSE_TRANSACTION_TEMPLATES,
                      data: { getExpenseTransactionTemplates: existing ? [created, ...existing.getExpenseTransactionTemplates] : [created] },
                    });
                  },
                });
                resetForm();
                setOpenNew(false);
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
                  <Label htmlFor="amount">Amount</Label>
                  <Field id="amount" name="amount" as={Input} type="number" step="0.01" />
                </div>
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <Field as="select" id="categoryId" name="categoryId" className="mt-1 block w-full rounded-md bg-surface border border-default p-2">
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Field>
                </div>
                {status && <p className="text-sm text-red-500">{status}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpenNew(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>Create</Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Edit Template */}
      <Dialog open={!!editTmpl} onOpenChange={(v) => { if (!v) setEditTmpl(null); }}>
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>
        <DialogContent>
          {editTmpl && (
            <Formik
              enableReinitialize
              initialValues={{ describtion: editTmpl.describtion, amount: editTmpl.amount, categoryId: editTmpl.category?.id ?? "" }}
              validationSchema={TemplateSchema}
              onSubmit={async (values, { setSubmitting, setStatus }) => {
                try {
                  const resp = await updateTemplate({
                    variables: { id: editTmpl.id, describtion: values.describtion, amount: Number(values.amount), categoryId: values.categoryId || null },
                    update: (cache, { data: r }) => {
                      const updated = r?.updateExpenseTransactionTemplate;
                      if (!updated) return;
                      const existing = cache.readQuery<GetTemplatesData>({ query: GET_EXPENSE_TRANSACTION_TEMPLATES });
                      if (!existing) return;
                      cache.writeQuery<GetTemplatesData>({
                        query: GET_EXPENSE_TRANSACTION_TEMPLATES,
                        data: {
                          getExpenseTransactionTemplates: existing.getExpenseTransactionTemplates.map(x => x.id === updated.id ? updated : x),
                        },
                      });
                    },
                  });
                  setEditTmpl(null);
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
                    <Label htmlFor="amount">Amount</Label>
                    <Field id="amount" name="amount" as={Input} type="number" step="0.01" />
                  </div>
                  <div>
                    <Label htmlFor="categoryId">Category</Label>
                    <Field as="select" id="categoryId" name="categoryId" className="mt-1 block w-full rounded-md bg-surface border border-default p-2">
                      <option value="">No category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Field>
                  </div>
                  {status && <p className="text-sm text-red-500">{status}</p>}
                  <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="ghost" onClick={() => setEditTmpl(null)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>Save</Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </DialogContent>
      </Dialog>
      <FAB ariaLabel="New template" title="New template" onClick={() => setOpenNew(true)} />
    </div>
  );
}
