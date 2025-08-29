"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = React.useState(false);
  React.useEffect(() => {
    // history.length > 1 suggests a previous page in the stack
    if (typeof window !== "undefined") setCanGoBack(window.history.length > 1);
  }, []);
  if (!canGoBack) return null;
  return (
    <Button type="button" variant="ghost" size="sm" className={className} onClick={() => router.back()} title="Back">
      <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M10.828 4.586a2 2 0 0 1 0 2.828L8.242 10h11.09a2 2 0 1 1 0 4H8.242l2.586 2.586a2 2 0 1 1-2.828 2.828l-6-6a2 2 0 0 1 0-2.828l6-6a2 2 0 0 1 2.828 0Z"/>
      </svg>
      <span className="sr-only">Back</span>
    </Button>
  );
}

