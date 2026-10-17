import type { ReactNode } from "react";
import { ANY_STAFF, formatDuration, formatPrice, getService, getStaff } from "@/lib/config";
import { formatDate, formatTime } from "@/lib/time";
import { card } from "@/lib/ui";
import { Avatar } from "../Badges";

interface SummaryProps {
  serviceId: string | null;
  staffId: string;
  date: string | null;
  start: number | null;
}

export function Summary({ serviceId, staffId, date, start }: SummaryProps) {
  const service = getService(serviceId);
  const staff = getStaff(staffId);

  const row = (term: string, value: ReactNode) => (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-sm text-zinc-500 dark:text-zinc-400">{term}</dt>
      <dd className="text-right text-sm font-medium text-zinc-900 dark:text-white">{value}</dd>
    </div>
  );

  return (
    <aside className={`${card} p-5 lg:sticky lg:top-24`}>
      <h2 className="font-serif text-xl text-zinc-900 dark:text-white">Your appointment</h2>
      {service ? (
        <dl className="mt-2 divide-y divide-zinc-100 dark:divide-zinc-800">
          {row("Service", `${service.icon} ${service.name}`)}
          {row(
            "With",
            staff ? (
              <span className="inline-flex items-center gap-2">
                <Avatar staff={staff} size="sm" /> {staff.name}
              </span>
            ) : staffId === ANY_STAFF ? (
              "First available"
            ) : (
              "—"
            ),
          )}
          {row("Date", date ? formatDate(date, { weekday: "short", month: "short", day: "numeric" }) : "—")}
          {row("Time", start !== null ? `${formatTime(start)} – ${formatTime(start + service.duration)}` : "—")}
          {row("Duration", formatDuration(service.duration))}
          <div className="flex items-center justify-between pt-4">
            <dt className="font-semibold text-zinc-900 dark:text-white">Total</dt>
            <dd className="font-serif text-2xl text-zinc-900 dark:text-white">{formatPrice(service.price)}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Select a service to get started.</p>
      )}
    </aside>
  );
}
