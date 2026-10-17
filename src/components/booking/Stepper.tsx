export const STEPS = ["Service", "Professional", "Date & time", "Your details"];

interface StepperProps {
  current: number;
  /** Highest step the user may jump back to. */
  onStepClick: (step: number) => void;
}

export function Stepper({ current, onStepClick }: StepperProps) {
  return (
    <ol className="flex items-center gap-2" aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              disabled={!done}
              onClick={() => onStepClick(i)}
              aria-current={active ? "step" : undefined}
              className="flex items-center gap-2 disabled:cursor-default"
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                  active
                    ? "bg-violet-600 text-white ring-4 ring-violet-600/15"
                    : done
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                      : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={`hidden text-sm font-medium lg:inline ${
                  active ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span className={`h-px flex-1 ${done ? "bg-violet-400" : "bg-zinc-200 dark:bg-zinc-800"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
