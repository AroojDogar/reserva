import type { Metadata } from "next";
import { ManageLookup } from "@/components/ManageLookup";
import { BUSINESS } from "@/lib/config";
import { card, container } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Manage booking",
  description: "Find, add to calendar or cancel your appointment.",
};

export default function ManagePage() {
  return (
    <section className={`${container} py-12 sm:py-16`}>
      <div className="mx-auto max-w-md">
        <h1 className="text-center font-serif text-4xl text-zinc-900 dark:text-white">Manage your booking</h1>
        <p className="mt-3 text-center text-zinc-600 dark:text-zinc-400">
          Enter the reference from your confirmation to view, add to your calendar or cancel your appointment.
        </p>
        <div className={`${card} mt-8 p-6`}>
          <ManageLookup />
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          Lost your reference? Call us on <span className="font-medium text-zinc-700 dark:text-zinc-300">{BUSINESS.phone}</span>.
        </p>
      </div>
    </section>
  );
}
