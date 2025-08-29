"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange(open: boolean): void; children: React.ReactNode }) {
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="absolute inset-0 grid place-items-center p-4" onClick={() => onOpenChange(false)}>
        <div className="w-full max-w-md rounded-xl border border-default bg-surface shadow-lg" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-4 border-b border-default", className)}>{children}</div>;
}
export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}
export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-4 space-y-4", className)}>{children}</div>;
}
