"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { STAFF, formatPrice, getService, getStaff } from "@/lib/config";
import { actions } from "@/lib/store";
import { formatDate, formatTime, todayISO } from "@/lib/time";
import type { Booking, BookingStatus } from "@/lib/types";
import { card, input } from "@/lib/ui";
import { Avatar, StatusBadge } from "../Badges";

type Range = "today" | "upcoming" | "past" | "all";
const PAGE = 40;

const select = `${input} !w-auto !py-2`;

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [range, setRange] = useState<Range>("upcoming");
  const [staff, setStaff] = useState("all");
  const [status, setStatus] = useState<"all" | BookingStatus>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);

  const filtered = useMemo(() => {
    const today = todayISO();
    const q = query.trim().toLowerCase();
    const list = bookings.filter((b) => {
      if (range === "today" && b.date !== today) return false;
      if (range === "upcoming" && b.date < today) return false;
      if (range === "past" && b.date >= today) return false;
      if (staff !== "all" && b.staffId !== staff) return false;
      if (status !== "all" && b.status !== status) return false;
      if (q && ![b.customer.name, b.customer.email, b.customer.phone, b.ref].some((v) => v.toLowerCase().includes(q))) return false;
      return true;
    });
    const dir = range === "past" || range === "all" ? -1 : 1;
    return list.sort((a, b) => dir * (a.date.localeCompare(b.date) || a.start - b.start));
  }, [bookings, range, staff, status, query]);

  const visible = filtered.slice(0, limit);
  const groups = new Map<string, Booking[]>();
  for (const b of visible) groups.set(b.date, [...(groups.get(b.date) ?? []), b]);

  function act(b: Booking, next: BookingStatus, ask?: string) {
    if (!ask || confirm(ask)) actions.setStatus(b.id, next);
  }

  return (
    <div className={card}>
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800" role="tablist" aria-label="Date range">
          {(["today", "upcoming", "past", "all"] as const).map((r) => (
            <button
              key={r}
              role="tab"
              aria-selected={range === r}
              onClick={() => {
                setRange(r);
                setLimit(PAGE);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                range === r ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <select value={staff} onChange={(e) => setStaff(e.target.value)} className={select} aria-label="Filter by professional">
          <option value="all">All staff</option>
          {STAFF.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={select} aria-label="Filter by status">
          <option value="all">Any status</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, phone or ref…"
          className={`${input} !py-2 min-w-0 flex-1 basis-56`}
        />
      </div>

      {filtered.length === 0 ? (
        <p className="p-10 text-center text-sm text-zinc-500 dark:text-zinc-400">No bookings match these filters.</p>
      ) : (
        <div>
          {[...groups.entries()].map(([date, items]) => (
            <section key={date}>
              <h3 className="flex justify-between bg-zinc-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900/60 dark:text-zinc-400">
                <span>{date === todayISO() ? `Today · ${formatDate(date, { month: "short", day: "numeric" })}` : formatDate(date, { weekday: "short", month: "short", day: "numeric" })}</span>
                <span>{items.length} booking{items.length > 1 ? "s" : ""}</span>
              </h3>
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {items.map((b) => {
                  const service = getService(b.serviceId)!;
                  const pro = getStaff(b.staffId)!;
                  return (
                    <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-sm">
                      <span className="w-36 shrink-0 font-semibold tabular-nums text-zinc-900 dark:text-white">
                        {formatTime(b.start)} – {formatTime(b.end)}
                      </span>
                      <div className="min-w-40 flex-1">
                        <p className="font-medium text-zinc-900 dark:text-white">{b.customer.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {service.icon} {service.name} ·{" "}
                          <Link href={`/booking/${b.ref}`} className="font-mono hover:text-violet-600">
                            {b.ref}
                          </Link>
                        </p>
                      </div>
                      <span className="flex w-36 items-center gap-2 text-zinc-700 dark:text-zinc-300">
                        <Avatar staff={pro} size="sm" /> {pro.name.split(" ")[0]}
                      </span>
                      <span className="w-14 text-right font-medium tabular-nums text-zinc-900 dark:text-white">{formatPrice(b.price)}</span>
                      <span className="w-24">
                        <StatusBadge status={b.status} />
                      </span>
                      <span className="ml-auto flex gap-1">
                        {b.status === "confirmed" ? (
                          <>
                            <ActionButton label="Complete" tone="emerald" onClick={() => act(b, "completed")} />
                            <ActionButton label="No-show" tone="amber" onClick={() => act(b, "no-show")} />
                            <ActionButton label="Cancel" tone="rose" onClick={() => act(b, "cancelled", `Cancel ${b.customer.name}'s booking?`)} />
                          </>
                        ) : b.status !== "cancelled" ? (
                          <ActionButton label="Undo" tone="zinc" onClick={() => act(b, "confirmed")} />
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {filtered.length > limit && (
            <div className="border-t border-zinc-200 p-3 text-center dark:border-zinc-800">
              <button onClick={() => setLimit((l) => l + PAGE)} className="text-sm font-semibold text-violet-600 hover:underline dark:text-violet-400">
                Show more ({filtered.length - limit} remaining)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const TONES = {
  emerald: "text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10",
  amber: "text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10",
  rose: "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10",
  zinc: "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
};

function ActionButton({ label, tone, onClick }: { label: string; tone: keyof typeof TONES; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${TONES[tone]}`}>
      {label}
    </button>
  );
}
