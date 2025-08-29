import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Welcome to Finanz</h1>
      <p>You are currently logged out.</p>
      <div className="flex gap-3">
        <Link href="/login" className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground hover:opacity-90">Login</Link>
        <Link href="/register" className="inline-flex h-10 items-center rounded-md border border-default px-4 text-sm font-medium hover:bg-muted">Register</Link>
      </div>
    </main>
  );
}
