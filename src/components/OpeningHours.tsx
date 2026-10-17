"use client";

import { DEFAULT_HOURS } from "@/lib/config";
import { useAppState } from "@/lib/store";
import { WEEKDAYS, formatTime } from "@/lib/time";
import type { WeeklyHours } from "@/lib/types";
import { useIsClient } from "./ClientOnly";

// Monday-first display order.
const ORDER = [1, 2, 3, 4, 5, 6, 0];

function HoursList({ hours }: { hours: WeeklyHours }) {
  return (
    <ul className="space-y-2 text-sm">
      {ORDER.map((d) => {
        const h = hours[d];
        return (
          <li key={d} className="flex justify-between gap-6">
            <span className="text-zinc-600 dark:text-zinc-400">{WEEKDAYS[d]}</span>
            <span className={h ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}>
              {h ? `${formatTime(h.open)} – ${formatTime(h.close)}` : "Closed"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function LiveHours() {
  const { hours } = useAppState();
  return <HoursList hours={hours} />;
}

/** Shows the hours edited in the admin dashboard, falling back to defaults on the server. */
export function OpeningHours() {
  return useIsClient() ? <LiveHours /> : <HoursList hours={DEFAULT_HOURS} />;
}
