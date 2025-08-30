"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { cn } from "@/lib/cn";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";

export function MainNav() {
  const { user } = useAuth();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const detailsRef = useRef<HTMLDetailsElement | null>(null);

  // Close dropdown on outside click, Escape, or route change
  useEffect(() => {
    const onDocPointer = (e: Event) => {
      const d = detailsRef.current;
      if (!d || !d.open) return;
      if (!d.contains(e.target as Node)) d.open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const d = detailsRef.current;
        if (d?.open) d.open = false;
      }
    };
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer, { passive: true } as any);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer as any);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (detailsRef.current?.open) detailsRef.current.open = false;
  }, [pathname]);

  const linkCls = (href: string, extra?: string) =>
    cn(
      "inline-flex h-10 items-center rounded-md px-4 hover:bg-muted",
      isActive(href) ? "text-[color:var(--accent)]" : "",
      extra
    );

  return (
    <nav className="ml-auto flex gap-3 text-base items-center w-full sm:w-auto justify-end">
      {user ? (
        <>
          {/* Avatar + dropdown menu (shown on all sizes); inline nav items removed */}
          <details ref={detailsRef} className="relative" role="menu" aria-label="User menu">
            <summary
              className="list-none cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 ring-accent rounded-full"
              aria-haspopup="menu"
              aria-expanded="false"
            >
              <div className="relative inline-flex">
                <div
                  className="h-9 w-9 rounded-full bg-muted text-foreground/90 flex items-center justify-center font-medium uppercase border border-default hover:border-[color:var(--accent)] transition-colors"
                  aria-label={user.username}
                >
                  {user.username?.[0] ?? "?"}
                </div>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border border-default bg-surface grid place-items-center text-muted">
                  {/* Chevron-down icon */}
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.169l3.71-3.94a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.01-1.06z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </summary>
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-default bg-surface shadow-lg p-1 z-50">
              <div className="px-3 py-2 text-sm text-muted border-b border-default truncate" aria-disabled>
                {user.username}
              </div>
              <Link
                href="/dashboard"
                className={cn(
                  "block px-3 py-2 rounded hover:bg-muted text-sm",
                  isActive("/dashboard") && "text-[color:var(--accent)]"
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/expenses"
                className={cn(
                  "block px-3 py-2 rounded hover:bg-muted text-sm",
                  isActive("/expenses") && "text-[color:var(--accent)]"
                )}
              >
                Expenses
              </Link>
              <div className="px-1 py-1">
                <LogoutButton className="w-full justify-start px-2" />
              </div>
            </div>
          </details>
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
