"use client";
import * as React from "react";
import { CATEGORY_COLORS, CategoryColorOption } from "@/lib/category_colors";
import { cn } from "@/lib/cn";

export function ColorDropdown({
  value,
  onChange,
  options = CATEGORY_COLORS,
  className,
}: {
  value?: string | null;
  onChange: (hex: string) => void;
  options?: CategoryColorOption[];
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = options.find((o) => o.hex.toLowerCase() === (value ?? "").toLowerCase());

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        className="flex h-10 w-full items-center justify-between rounded-md border border-default bg-muted px-3"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded-full border" style={{ backgroundColor: selected?.hex ?? "#555" }} aria-hidden />
          <span className="text-sm text-muted">{selected ? "" : "Select color"}</span>
        </span>
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-4 w-4 text-muted"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/></svg>
      </button>
      {open && (
        <div role="listbox" className="absolute z-50 mt-1 w-full rounded-md border border-default bg-surface p-2 shadow-lg grid grid-cols-8 gap-2">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              className={cn(
                "h-6 w-6 rounded-full border transition",
                o.hex.toLowerCase() === (value ?? "").toLowerCase() ? "ring-2 ring-accent" : ""
              )}
              style={{ backgroundColor: o.hex }}
              onClick={() => {
                onChange(o.hex);
                setOpen(false);
              }}
            >
              <span className="sr-only">{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

