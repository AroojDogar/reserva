import type { Staff } from "@/lib/config";
import type { BookingStatus } from "@/lib/types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  confirmed: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  cancelled: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  "no-show": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

export function Avatar({ staff, size = "md" }: { staff: Staff; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-7 w-7 text-[10px]", md: "h-10 w-10 text-xs", lg: "h-14 w-14 text-base" };
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ${sizes[size]}`}
      style={{ background: staff.color }}
      aria-hidden
    >
      {staff.initials}
    </span>
  );
}
