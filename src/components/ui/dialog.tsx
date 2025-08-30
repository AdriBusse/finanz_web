"use client";
import * as React from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/cn";

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange(open: boolean): void; children: React.ReactNode }) {
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;
    // animate from FAB rect if available
    const r: any = (window as any).__fabRect;
    const panelRect = panel.getBoundingClientRect();
    const panelCx = panelRect.left + panelRect.width / 2;
    const panelCy = panelRect.top + panelRect.height / 2;
    let from = { x: 0, y: 0, scale: 0.9, opacity: 0 } as any;
    if (r && typeof r.cx === "number" && typeof r.cy === "number") {
      from = { x: r.cx - panelCx, y: r.cy - panelCy, scale: 0.2, opacity: 0 };
    }
    gsap.fromTo(
      panel,
      { x: from.x, y: from.y, scale: from.scale, opacity: 0 },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.28, ease: "power2.out" }
    );
    gsap.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "power2.out" }
    );
    // clear after use
    (window as any).__fabRect = undefined;
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div ref={overlayRef} className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      <div className="absolute inset-0 grid place-items-center p-4" onClick={() => onOpenChange(false)}>
        <div ref={panelRef} className="w-full max-w-md rounded-xl border border-default bg-surface shadow-lg" onClick={(e) => e.stopPropagation()}>
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
  return <h3 className={cn("text-xl font-semibold", className)}>{children}</h3>;
}
export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-4 space-y-4", className)}>{children}</div>;
}
