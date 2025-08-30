"use client";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/forms/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, refresh } = useAuth();
  return (
    <div className="mx-auto max-w-sm p-6">
      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm
            onSuccess={async ({ user }) => {
              setUser({ id: user.id, username: user.username, email: user.email });
              // Also sync with server in case of race conditions
              await refresh();
              router.push("/dashboard");
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
