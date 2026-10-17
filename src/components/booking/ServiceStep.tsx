import { SERVICES, formatDuration, formatPrice } from "@/lib/config";

interface ServiceStepProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

export function ServiceStep({ selected, onSelect }: ServiceStepProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {SERVICES.map((s) => {
        const active = s.id === selected;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-pressed={active}
            className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition ${
              active
                ? "border-violet-500 bg-violet-50 ring-4 ring-violet-500/10 dark:bg-violet-500/10"
                : "border-zinc-200 bg-white hover:border-violet-300 hover:bg-violet-50/40 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-500/40"
            }`}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100/70 text-xl dark:bg-violet-500/15" aria-hidden>
              {s.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-zinc-900 dark:text-white">{s.name}</span>
                <span className="shrink-0 font-semibold text-zinc-900 dark:text-white">{formatPrice(s.price)}</span>
              </span>
              <span className="mt-0.5 block text-xs font-medium text-violet-600 dark:text-violet-400">
                {s.category} · {formatDuration(s.duration)}
              </span>
              <span className="mt-1.5 block text-sm leading-snug text-zinc-600 dark:text-zinc-400">{s.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
