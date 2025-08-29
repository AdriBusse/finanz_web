"use client";
import * as React from "react";
import { cn } from "@/lib/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn("text-base font-medium leading-none", className)} {...props} />;
});
Label.displayName = "Label";
