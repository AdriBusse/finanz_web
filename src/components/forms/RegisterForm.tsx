"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getApolloClient } from "@/graphql/client";
import { loginMutation, signupMutation, startSession } from "@/lib/auth-api";
import type { LoginType } from "@/graphql/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RegisterSchema = Yup.object({
  username: Yup.string().min(3, "Too short").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

export function RegisterForm({ onSuccess }: { onSuccess?: (payload: LoginType) => void }) {
  const client = getApolloClient();
  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        try {
          await signupMutation({ data: values }, client);
          const { token, user } = await loginMutation({ username: values.username, password: values.password }, client);
          await startSession(token, { id: user.id, username: user.username, email: user.email });
          await client.clearStore();
          onSuccess?.({ token, user });
        } catch (e: any) {
          setStatus(e?.message ?? "Registration failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ errors, touched, isSubmitting, status }) => (
        <Form className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Field id="username" name="username" as={Input} />
            {touched.username && errors.username && (
              <p className="text-sm text-red-600">{errors.username}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Field id="email" name="email" type="email" as={Input} />
            {touched.email && errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Field id="password" name="password" type="password" as={Input} />
            {touched.password && errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          {status && <p className="text-sm text-red-600">{status}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Sign up"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
