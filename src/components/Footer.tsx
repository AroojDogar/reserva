import { BUSINESS } from "@/lib/config";
import { container } from "@/lib/ui";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className={`${container} flex flex-col gap-2 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400`}>
        <p>
          © {new Date().getFullYear()} {BUSINESS.name} · {BUSINESS.address}
        </p>
        <p>
          Powered by <span className="font-semibold text-violet-600 dark:text-violet-400">Reserva</span>, a booking
          system demo
        </p>
      </div>
    </footer>
  );
}
