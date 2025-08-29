"use client";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/cn";

export type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  value: number; // 0..100
  status?: "normal" | "danger";
};

export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, status = "normal", ...props }, ref) => {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  const isDanger = status === "danger";
  const indicatorColor = isDanger ? "#fca5a5" : "var(--accent2)"; // pastel red vs accent2 blue

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-md border border-default bg-muted",
        className
      )}
      value={clamped}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full rounded-md transition-transform"
        style={{
          transform: `translateX(-${100 - clamped}%)`,
          backgroundColor: indicatorColor,
        }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = "Progress";

