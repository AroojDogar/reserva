"use client";

import { useState } from "react";
import { BUSINESS } from "@/lib/config";
import { addDays, monthGrid, parseISODate, todayISO } from "@/lib/time";

interface CalendarProps {
  selected: string | null;
  isAvailable: (date: string) => boolean;
  onSelect: (date: string) => void;
}

const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function Calendar({ selected, isAvailable, onSelect }: CalendarProps) {
  const today = todayISO();
  const first = parseISODate(selected ?? today);
  const [view, setView] = useState({ year: first.getFullYear(), month: first.getMonth() });

  const lastBookable = parseISODate(addDays(today, BUSINESS.maxDaysAhead));
  const now = parseISODate(today);
  const canPrev = view.year > now.getFullYear() || (view.year === now.getFullYear() && view.month > now.getMonth());
  const canNext =
    view.year < lastBookable.getFullYear() ||
    (view.year === lastBookable.getFullYear() && view.month < lastBookable.getMonth());

  const shift = (delta: number) =>
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const title = new Date(view.year, view.month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canPrev}
          className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="Previous month"
        >
          ‹
        </button>
        <p className="font-semibold text-zinc-900 dark:text-white" aria-live="polite">
          {title}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={!canNext}
          className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center" role="grid">
        {DAY_HEADERS.map((d) => (
          <span key={d} className="pb-2 text-xs font-medium text-zinc-400">
            {d}
          </span>
        ))}
        {monthGrid(view.year, view.month).map((date, i) => {
          if (!date) return <span key={`pad-${i}`} />;
          const available = isAvailable(date);
          const active = date === selected;
          return (
            <button
              key={date}
              type="button"
              disabled={!available}
              onClick={() => onSelect(date)}
              aria-pressed={active}
              aria-label={parseISODate(date).toDateString() + (available ? "" : ", unavailable")}
              className={`relative mx-auto flex aspect-square w-full max-w-11 items-center justify-center rounded-full text-sm font-medium transition ${
                active
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                  : available
                    ? "bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20"
                    : "cursor-not-allowed text-zinc-300 dark:text-zinc-700"
              }`}
            >
              {parseISODate(date).getDate()}
              {date === today && (
                <span className={`absolute bottom-1 h-1 w-1 rounded-full ${active ? "bg-white" : "bg-violet-500"}`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
