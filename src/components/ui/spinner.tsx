"use client";
import { cn } from "@/lib/cn";

export function Spinner({ size = 24, className }: { size?: number; className?: string }) {
  const dim = `${size}px`;
  return (
    <svg
      className={cn("animate-spin text-[color:var(--accent)]", className)}
      style={{ width: dim, height: dim }}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

