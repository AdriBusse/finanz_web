"use client";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { MinimalUser } from "@/lib/auth";

type AuthContextValue = {
  user: MinimalUser | null;
  setUser: (u: MinimalUser | null) => void;
  refresh: () => Promise<void>;
  authenticated: boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ initialUser, children }: { initialUser: MinimalUser | null; children: React.ReactNode }) {
  const [user, setUser] = useState<MinimalUser | null>(initialUser);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/session", { method: "GET" });
      if (!res.ok) return;
      const data = (await res.json()) as { authenticated: boolean; user?: MinimalUser | null };
      setUser(data.authenticated ? (data.user ?? null) : null);
    } catch {
      // ignore
    }
  }, []);

  // Revalidate on visibility to keep in sync
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener("visibilitychange", onFocus);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("visibilitychange", onFocus);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  const value = useMemo<AuthContextValue>(() => ({ user, setUser, refresh, authenticated: !!user }), [user, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

