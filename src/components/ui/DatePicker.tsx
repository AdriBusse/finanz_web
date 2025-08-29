"use client";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "@/lib/cn";

export function DatePicker({
  value,
  onChange,
  className,
}: {
  value: Date | null | undefined;
  onChange: (date: Date) => void;
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

  const label = value ? formatDate(value) : "Select date";

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        className="flex h-11 w-full items-center justify-between rounded-md border border-default bg-muted px-4 text-left text-base"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="text-base">{label}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className="h-4 w-4 text-muted"><path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08z"/></svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-auto rounded-md border border-default bg-surface p-2 shadow-lg">
          <DayPicker
            mode="single"
            selected={value ?? undefined}
            onSelect={(d) => { if (d) { onChange(d); setOpen(false); } }}
            classNames={{
              caption: "text-sm text-muted",
              head_cell: "text-xs text-muted",
              day: "h-8 w-8 text-sm rounded-md hover:bg-[rgba(0,255,127,0.1)]",
              day_selected: "bg-accent text-black",
              day_today: "border border-default",
              months: "p-1",
            }}
          />
        </div>
      )}
    </div>
  );
}

function formatDate(d: Date) {
  // ISO-like short date, e.g., 2025-08-29
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
