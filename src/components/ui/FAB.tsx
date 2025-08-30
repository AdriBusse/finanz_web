"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import React from "react";

type FABProps = {
  onClick: () => void;
  ariaLabel: string;
  title?: string;
  className?: string;
};

export function FAB({ onClick, ariaLabel, title, className }: FABProps) {
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const handleClick = () => {
    const el = btnRef.current;
    if (el) {
      const r = el.getBoundingClientRect();
      (window as any).__fabRect = { x: r.left, y: r.top, w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    }
    onClick();
  };
  return (
    <Button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      className={cn(
        "fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full p-0 shadow-lg",
        className
      )}
    >
      <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M10.5 3.5c0-.55.45-1 1-1s1 .45 1 1v8h8c.55 0 1 .45 1 1s-.45 1-1 1h-8v8c0 .55-.45 1-1 1s-1-.45-1-1v-8h-8c-.55 0-1-.45-1-1s.45-1 1-1h8v-8Z" />
      </svg>
      <span className="sr-only">{ariaLabel}</span>
    </Button>
  );
}

export default FAB;
