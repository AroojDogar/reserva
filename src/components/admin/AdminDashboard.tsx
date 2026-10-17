"use client";

import { useState } from "react";
import { actions, useAppState } from "@/lib/store";
import { formatDate, todayISO } from "@/lib/time";
import { btnSecondary } from "@/lib/ui";
import { BookingsTable } from "./BookingsTable";
import { HoursEditor } from "./HoursEditor";
import { StatsRow } from "./StatsRow";
import { WeekChart } from "./WeekChart";

type Tab = "bookings" | "hours";

export function AdminDashboard() {
  const { bookings, hours } = useAppState();
  const [tab, setTab] = useState<Tab>("bookings");

  function reset() {
    if (confirm("Replace all bookings and hours with fresh demo data?")) actions.resetDemo();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{formatDate(todayISO())}</p>
          <h1 className="font-serif text-4xl text-zinc-900 dark:text-white">Dashboard</h1>
        </div>
        <button onClick={reset} className={`${btnSecondary} !py-2`}>
          Reset demo data
        </button>
      </div>

      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        <strong>Demo mode:</strong> data is stored in this browser. Open the booking page in another tab and new
        appointments will appear here instantly. In production, this area sits behind staff login.
      </p>

      <StatsRow bookings={bookings} />

      <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800" role="tablist">
        {(
          [
            ["bookings", "Bookings"],
            ["hours", "Business hours"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
              tab === id
                ? "border-violet-600 text-violet-700 dark:text-violet-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "bookings" ? (
        <div className="space-y-6">
          <WeekChart bookings={bookings} />
          <BookingsTable bookings={bookings} />
        </div>
      ) : (
        <HoursEditor hours={hours} />
      )}
    </div>
  );
}
