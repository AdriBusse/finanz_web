"use client";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/forms/LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-sm p-6">
      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={() => router.push("/dashboard")} />
        </CardContent>
      </Card>
    </div>
  );
}
