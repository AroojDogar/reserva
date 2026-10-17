import type { Slot } from "@/lib/slots";
import { formatTime } from "@/lib/time";

interface TimeSlotsProps {
  slots: Slot[];
  selected: number | null;
  onSelect: (slot: Slot) => void;
}

const PERIODS = [
  { label: "Morning", from: 0, to: 12 * 60 },
  { label: "Afternoon", from: 12 * 60, to: 17 * 60 },
  { label: "Evening", from: 17 * 60, to: 24 * 60 },
];

export function TimeSlots({ slots, selected, onSelect }: TimeSlotsProps) {
  if (slots.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        No times left on this day. Please choose another date.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {PERIODS.map((p) => {
        const items = slots.filter((s) => s.start >= p.from && s.start < p.to);
        if (items.length === 0) return null;
        return (
          <div key={p.label}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {p.label} <span className="font-normal normal-case">· {items.length} slots</span>
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {items.map((s) => {
                const active = s.start === selected;
                return (
                  <button
                    key={s.start}
                    type="button"
                    onClick={() => onSelect(s)}
                    aria-pressed={active}
                    className={`rounded-lg border px-2 py-2 text-sm font-medium tabular-nums transition ${
                      active
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-violet-400 hover:text-violet-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-violet-500"
                    }`}
                  >
                    {formatTime(s.start)}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
