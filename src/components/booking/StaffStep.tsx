import { ANY_STAFF, STAFF } from "@/lib/config";
import { Avatar } from "../Badges";

interface StaffStepProps {
  serviceId: string;
  selected: string;
  onSelect: (id: string) => void;
}

export function StaffStep({ serviceId, selected, onSelect }: StaffStepProps) {
  const options = STAFF.filter((s) => s.serviceIds.includes(serviceId));
  const tile = (active: boolean) =>
    `flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
      active
        ? "border-violet-500 bg-violet-50 ring-4 ring-violet-500/10 dark:bg-violet-500/10"
        : "border-zinc-200 bg-white hover:border-violet-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-500/40"
    }`;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" onClick={() => onSelect(ANY_STAFF)} aria-pressed={selected === ANY_STAFF} className={tile(selected === ANY_STAFF)}>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg text-white" aria-hidden>
          ★
        </span>
        <span>
          <span className="block font-semibold text-zinc-900 dark:text-white">No preference</span>
          <span className="block text-sm text-zinc-500 dark:text-zinc-400">Most availability, first free professional</span>
        </span>
      </button>
      {options.map((p) => (
        <button key={p.id} type="button" onClick={() => onSelect(p.id)} aria-pressed={selected === p.id} className={tile(selected === p.id)}>
          <Avatar staff={p} />
          <span>
            <span className="block font-semibold text-zinc-900 dark:text-white">{p.name}</span>
            <span className="block text-sm text-zinc-500 dark:text-zinc-400">{p.role}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
