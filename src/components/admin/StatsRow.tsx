import { formatPrice } from "@/lib/config";
import { addDays, formatTime, nowMinutes, startOfWeek, todayISO } from "@/lib/time";
import type { Booking } from "@/lib/types";
import { card } from "@/lib/ui";

export function StatsRow({ bookings }: { bookings: Booking[] }) {
  const today = todayISO();
  const weekStart = startOfWeek(today);
  const weekEnd = addDays(weekStart, 6);
  const monthAgo = addDays(today, -30);
  const active = (b: Booking) => b.status === "confirmed" || b.status === "completed";

  const todays = bookings.filter((b) => b.date === today && active(b)).sort((a, b) => a.start - b.start);
  const nextToday = todays.find((b) => b.status === "confirmed" && b.start >= nowMinutes());
  const nextWeek = bookings.filter((b) => b.status === "confirmed" && b.date >= today && b.date <= addDays(today, 6)).length;
  const revenue = bookings
    .filter((b) => active(b) && b.date >= weekStart && b.date <= weekEnd)
    .reduce((sum, b) => sum + b.price, 0);
  const recent = bookings.filter((b) => b.date >= monthAgo && b.date <= today);
  const lost = recent.filter((b) => b.status === "cancelled" || b.status === "no-show").length;
  const lostRate = recent.length ? Math.round((lost / recent.length) * 100) : 0;

  const stats = [
    { label: "Today", value: todays.length, hint: nextToday ? `Next at ${formatTime(nextToday.start)}` : "No more today" },
    { label: "Next 7 days", value: nextWeek, hint: "Confirmed appointments" },
    { label: "Revenue this week", value: formatPrice(revenue), hint: "Completed + booked" },
    { label: "Cancellations", value: `${lostRate}%`, hint: `${lost} of ${recent.length} in last 30 days` },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className={`${card} p-4`}>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{s.label}</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">{s.value}</p>
          <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">{s.hint}</p>
        </div>
      ))}
    </div>
  );
}
