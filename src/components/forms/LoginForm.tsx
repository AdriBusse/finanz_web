"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { getApolloClient } from "@/graphql/client";
import { loginMutation, startSession } from "@/lib/auth-api";
import type { LoginType } from "@/graphql/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginSchema = Yup.object({
  username: Yup.string().min(3, "Too short").required("Required"),
  password: Yup.string().min(6, "Too short").required("Required"),
});

export function LoginForm({ onSuccess }: { onSuccess?: (payload: LoginType) => void }) {
  const client = getApolloClient();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting, setStatus }) => {
        try {
          const { token, user } = await loginMutation(values, client);
          await startSession(token, { id: user.id, username: user.username, email: user.email });
          await client.clearStore();
          onSuccess?.({ token, user });
        } catch (e: any) {
          setStatus(e?.message ?? "Login failed");
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
            <Label htmlFor="password">Password</Label>
            <Field id="password" name="password" type="password" as={Input} />
            {touched.password && errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>
          {status && <p className="text-sm text-red-600">{status}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
