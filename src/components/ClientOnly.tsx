"use client";

import { useSyncExternalStore, type ReactNode } from "react";

const noopSubscribe = () => () => {};

/** True only after hydration, so browser-only data (localStorage, "now") never causes mismatches. */
export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

export function ClientOnly({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return useIsClient() ? children : fallback;
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden>
      <div className="h-8 w-56 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-4 w-80 max-w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid gap-4 pt-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}
