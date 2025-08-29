"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import type { MinimalUser } from "@/lib/auth";
import { cn } from "@/lib/cn";

export function MainNav({ user }: { user: MinimalUser | null }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const linkCls = (href: string, extra?: string) =>
    cn(
      "inline-flex h-10 items-center rounded-md px-4 hover:bg-muted",
      isActive(href) ? "text-[color:var(--accent)]" : "",
      extra
    );

  return (
    <nav className="ml-auto flex gap-3 text-base items-center">
      {user ? (
        <>
          <span className="text-muted hidden sm:inline">{user.username}</span>
          <Link href="/dashboard" className={linkCls("/dashboard")}>Dashboard</Link>
          <Link href="/expenses" className={linkCls("/expenses")}>Expenses</Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/login" className={linkCls("/login")}>Login</Link>
          <Link href="/register" className={linkCls("/register", "border border-default")}>Register</Link>
        </>
      )}
    </nav>
  );
}
