"use client";

import { actions } from "@/lib/store";
import { WEEKDAYS, formatTime, timeOptions } from "@/lib/time";
import type { WeeklyHours } from "@/lib/types";
import { card, input } from "@/lib/ui";

const ORDER = [1, 2, 3, 4, 5, 6, 0];
// 6:00 AM – 11:30 PM in 30-minute steps.
const TIMES = timeOptions(30).filter((t) => t >= 6 * 60);

export function HoursEditor({ hours }: { hours: WeeklyHours }) {
  return (
    <div className={card}>
      <div className="border-b border-zinc-200 p-5 dark:border-zinc-800">
        <h2 className="font-semibold text-zinc-900 dark:text-white">Business hours</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Changes apply instantly to the booking page. Existing appointments are kept.
        </p>
      </div>
      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {ORDER.map((d) => {
          const h = hours[d];
          return (
            <li key={d} className="flex flex-wrap items-center gap-4 px-5 py-3">
              <label className="flex w-40 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={!!h}
                  onChange={(e) => actions.setHours(d, e.target.checked ? { open: 9 * 60, close: 17 * 60 } : null)}
                  className="peer sr-only"
                />
                <span className="relative h-6 w-10 rounded-full bg-zinc-300 transition peer-checked:bg-violet-600 peer-focus-visible:ring-4 peer-focus-visible:ring-violet-500/30 dark:bg-zinc-700 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:left-5" />
                <span className="font-medium text-zinc-900 dark:text-white">{WEEKDAYS[d]}</span>
              </label>
              {h ? (
                <div className="flex items-center gap-2">
                  <select
                    value={h.open}
                    onChange={(e) => {
                      const open = Number(e.target.value);
                      actions.setHours(d, { open, close: Math.max(h.close, open + 60) });
                    }}
                    className={`${input} !w-auto !py-1.5`}
                    aria-label={`${WEEKDAYS[d]} opening time`}
                  >
                    {TIMES.slice(0, -2).map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t)}
                      </option>
                    ))}
                  </select>
                  <span className="text-zinc-400">to</span>
                  <select
                    value={h.close}
                    onChange={(e) => actions.setHours(d, { ...h, close: Number(e.target.value) })}
                    className={`${input} !w-auto !py-1.5`}
                    aria-label={`${WEEKDAYS[d]} closing time`}
                  >
                    {TIMES.filter((t) => t >= h.open + 60).map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-zinc-400">Closed</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
