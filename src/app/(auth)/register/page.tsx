"use client";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-sm p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm onSuccess={() => router.push("/dashboard")} />
        </CardContent>
      </Card>
    </div>
  );
}
