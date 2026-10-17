import { STAFF } from "@/lib/config";
import { addDays, formatDate, todayISO } from "@/lib/time";
import type { Booking } from "@/lib/types";
import { card } from "@/lib/ui";

/** Stacked bars of confirmed appointments per professional for the next 7 days. */
export function WeekChart({ bookings }: { bookings: Booking[] }) {
  const today = todayISO();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const data = days.map((date) => {
    const dayBookings = bookings.filter((b) => b.date === date && b.status === "confirmed");
    return { date, total: dayBookings.length, byStaff: STAFF.map((s) => dayBookings.filter((b) => b.staffId === s.id).length) };
  });
  const max = Math.max(4, ...data.map((d) => d.total));

  return (
    <div className={`${card} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold text-zinc-900 dark:text-white">Upcoming week</h2>
        <ul className="flex flex-wrap gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          {STAFF.map((s) => (
            <li key={s.id} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} /> {s.name.split(" ")[0]}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 flex h-40 items-end gap-2 sm:gap-4">
        {data.map((d) => (
          <div key={d.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-xs font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">{d.total || ""}</span>
            <div
              className="flex w-full max-w-12 flex-col-reverse overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800"
              style={{ height: `${Math.max(4, (d.total / max) * 100)}%` }}
              title={`${formatDate(d.date)}: ${d.total} appointments`}
            >
              {d.byStaff.map((count, i) =>
                count ? <span key={STAFF[i].id} style={{ flexGrow: count, background: STAFF[i].color }} /> : null,
              )}
            </div>
            <span className={`text-xs ${d.date === today ? "font-bold text-violet-600 dark:text-violet-400" : "text-zinc-500"}`}>
              {d.date === today ? "Today" : formatDate(d.date, { weekday: "short" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
