"use client";
import { Button } from "@/components/ui/button";

export function LogoutButton({ className }: { className?: string }) {
  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/session", { method: "DELETE" });
    } finally {
      // Force navigation to clear client state
      window.location.href = "/";
    }
  };
  return (
    <Button type="button" variant="ghost" className={className} onClick={onClick}>
      Logout
    </Button>
  );
}

