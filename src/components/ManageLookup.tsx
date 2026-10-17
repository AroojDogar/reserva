"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { findBooking } from "@/lib/store";
import { btnPrimary, input, label } from "@/lib/ui";

export function ManageLookup() {
  const router = useRouter();
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const ref = String(data.get("ref") ?? "");
    const email = String(data.get("email") ?? "").trim().toLowerCase();
    const booking = findBooking(ref);
    // Require the email too, so a guessed reference alone can't reveal someone's booking.
    if (!booking || booking.customer.email.toLowerCase() !== email) {
      setError("No booking matches that reference and email. Please check and try again.");
      return;
    }
    router.push(`/booking/${booking.ref}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="ref" className={label}>
          Booking reference
        </label>
        <input id="ref" name="ref" required placeholder="LUM-XXXXXX" className={`${input} font-mono uppercase`} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="email" className={label}>
          Email used for booking
        </label>
        <input id="email" name="email" type="email" required placeholder="jane@example.com" className={input} autoComplete="email" />
      </div>
      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className={`${btnPrimary} w-full !py-3`}>
        Find my booking
      </button>
    </form>
  );
}
