"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_EXPENSE_CATEGORIES } from "@/graphql/queries/expenses/getExpenseCategories";
import { CREATE_EXPENSE_CATEGORY } from "@/graphql/mutations/expenses/createExpenseCategory";
import { UPDATE_EXPENSE_CATEGORY } from "@/graphql/mutations/expenses/updateExpenseCategory";
import { DELETE_EXPENSE_CATEGORY } from "@/graphql/mutations/expenses/deleteExpenseCategory";
import type { ExpenseCategory } from "@/graphql/types/expenses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategoryMetadata } from "@/state/CategoryMetadataContext";
import { hexToRgba } from "@/lib/color";
import { Spinner } from "@/components/ui/spinner";
import { BackButton } from "@/components/ui/back-button";
import { ColorDropdown } from "@/components/forms/ColorDropdown";
import FAB from "@/components/ui/FAB";

type CategoriesData = { getExpenseCategories: ExpenseCategory[] };

const CategorySchema = Yup.object({
  name: Yup.string().required("Required"),
  color: Yup.string().nullable(),
  icon: Yup.string().nullable(),
});

export default function ExpenseCategoriesPage() {
  const { icons, getIconByKeyword } = useCategoryMetadata();
  const { data, loading, error } = useQuery<CategoriesData>(GET_EXPENSE_CATEGORIES);
  const [createMutation] = useMutation(CREATE_EXPENSE_CATEGORY);
  const [updateMutation] = useMutation(UPDATE_EXPENSE_CATEGORY);
  const [deleteMutation] = useMutation(DELETE_EXPENSE_CATEGORY);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editing, setEditing] = useState<ExpenseCategory | null>(null);

  return (
    <div className="p-6">
      <div className="mx-auto w-full max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <BackButton />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Categories</h1>
          <Button variant="accent2" onClick={() => setOpenCreate(true)}>New Category</Button>
        </div>
        {loading && (
          <div className="py-8 flex items-center justify-center">
            <Spinner size={28} />
          </div>
        )}
        {error && <div className="text-red-500">Failed to load categories</div>}
        <Card>
          <CardContent>
            <div className="space-y-2">
              {(data?.getExpenseCategories ?? []).map((c) => {
                const color = c.color ?? '#555';
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2"
                    style={{ borderColor: color, background: hexToRgba(color, 0.08) }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base" aria-hidden>{getIconByKeyword(c.icon ?? 'other')}</span>
                      <div className="font-medium">{c.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Edit category"
                        className="text-blue-400 hover:text-blue-300 hover:bg-[rgba(30,64,175,0.15)]"
                        onClick={() => { setEditing(c); setOpenEdit(true); }}
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                          <path d="M4 15.5V20h4.5L19 9.5l-4.5-4.5L4 15.5ZM21.7 6.04a1 1 0 0 0 0-1.41l-2.33-2.33a1 1 0 0 0-1.41 0l-1.59 1.59 3.74 3.74 1.59-1.59Z"/>
                        </svg>
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete category"
                        className="text-red-400 hover:text-red-300 hover:bg-[rgba(127,29,29,0.15)]"
                        onClick={async () => {
                          if (!confirm('Delete this category?')) return;
                          await deleteMutation({
                            variables: { id: c.id },
                            optimisticResponse: { deleteExpenseCategory: true },
                            update: (cache) => {
                              const existing = cache.readQuery<CategoriesData>({ query: GET_EXPENSE_CATEGORIES });
                              if (!existing) return;
                              cache.writeQuery<CategoriesData>({
                                query: GET_EXPENSE_CATEGORIES,
                                data: { getExpenseCategories: (existing.getExpenseCategories || []).filter(x => x.id !== c.id) },
                              });
                            },
                          });
                        }}
                      >
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                          <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9Zm2 2h2v1h-2V5Zm-3 4a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Zm5 0a1 1 0 1 1 2 0v9a1 1 0 1 1-2 0V9Z"/>
                        </svg>
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Category */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogHeader><DialogTitle>Create Category</DialogTitle></DialogHeader>
        <DialogContent>
          <Formik
            initialValues={{ name: '', color: '', icon: '' }}
            validationSchema={CategorySchema}
            onSubmit={async (values, { setSubmitting, resetForm, setStatus }) => {
              try {
                await createMutation({
                  variables: { name: values.name, color: values.color || null, icon: values.icon || null },
                  update: (cache, { data: resp }) => {
                    if (!resp?.createExpenseCategory) return;
                    const existing = cache.readQuery<CategoriesData>({ query: GET_EXPENSE_CATEGORIES });
                    cache.writeQuery<CategoriesData>({
                      query: GET_EXPENSE_CATEGORIES,
                      data: { getExpenseCategories: [
                        ...(existing?.getExpenseCategories ?? []),
                        resp.createExpenseCategory,
                      ] },
                    });
                  },
                });
                resetForm();
                setOpenCreate(false);
                // Apollo cache update keeps UI in sync without refetch
              } catch (e: any) {
                setStatus(e?.message ?? 'Create failed');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting, status }) => (
              <Form className="space-y-3">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Field id="name" name="name" as={Input} />
                  {touched.name && errors.name && <p className="text-sm text-red-500">{errors.name as any}</p>}
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Field name="color">
                    {({ field, form }: any) => (
                      <ColorDropdown value={field.value} onChange={(hex) => form.setFieldValue(field.name, hex)} />
                    )}
                  </Field>
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Field id="icon" name="icon" as="select" className="mt-1 block w-full rounded-md border border-default bg-muted px-3 py-2 text-sm">
                    <option value="">— None —</option>
                    {icons.map((opt) => (
                      <option key={opt.keyword} value={opt.keyword}>{opt.icon}</option>
                    ))}
                  </Field>
                </div>
                {status && <p className="text-sm text-red-500">{status}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setOpenCreate(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>Create</Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Edit Category */}
      <Dialog open={openEdit} onOpenChange={(v) => { setOpenEdit(v); if (!v) setEditing(null); }}>
        <DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
        <DialogContent>
          <Formik
            enableReinitialize
            initialValues={{ name: editing?.name ?? '', color: editing?.color ?? '', icon: editing?.icon ?? '' }}
            validationSchema={CategorySchema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              try {
                if (!editing) return;
                await updateMutation({
                  variables: { id: editing.id, name: values.name, color: values.color || null, icon: values.icon || null },
                  update: (cache, { data: resp }) => {
                    const updated = resp?.updateExpenseCategory;
                    if (!updated) return;
                    const existing = cache.readQuery<CategoriesData>({ query: GET_EXPENSE_CATEGORIES });
                    if (!existing) return;
                    cache.writeQuery<CategoriesData>({
                      query: GET_EXPENSE_CATEGORIES,
                      data: { getExpenseCategories: existing.getExpenseCategories.map((x) => x.id === updated.id ? updated : x) },
                    });
                  },
                });
                setOpenEdit(false);
                setEditing(null);
              } catch (e: any) {
                setStatus(e?.message ?? 'Update failed');
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting, status }) => (
              <Form className="space-y-3">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Field id="name" name="name" as={Input} />
                  {touched.name && errors.name && <p className="text-sm text-red-500">{errors.name as any}</p>}
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Field name="color">
                    {({ field, form }: any) => (
                      <ColorDropdown value={field.value} onChange={(hex) => form.setFieldValue(field.name, hex)} />
                    )}
                  </Field>
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Field id="icon" name="icon" as="select" className="mt-1 block w-full rounded-md border border-default bg-muted px-3 py-2 text-sm">
                    <option value="">— None —</option>
                    {icons.map((opt) => (
                      <option key={opt.keyword} value={opt.keyword}>{opt.icon}</option>
                    ))}
                  </Field>
                </div>
                {status && <p className="text-sm text-red-500">{status}</p>}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => { setOpenEdit(false); setEditing(null); }}>Cancel</Button>
                  <Button type="submit" disabled={isSubmitting}>Save</Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      <FAB ariaLabel="New category" title="New category" onClick={() => setOpenCreate(true)} />
    </div>
  );
}
