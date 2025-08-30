"use client";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, refresh } = useAuth();
  return (
    <div className="mx-auto max-w-sm p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm
            onSuccess={async ({ user }) => {
              setUser({ id: user.id, username: user.username, email: user.email });
              await refresh();
              router.push("/dashboard");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
