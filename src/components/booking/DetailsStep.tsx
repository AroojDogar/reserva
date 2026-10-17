"use client";

import { useState, type FormEvent } from "react";
import { btnPrimary, input, label } from "@/lib/ui";
import type { Customer } from "@/lib/types";

type Errors = Partial<Record<keyof Customer, string>>;

interface DetailsStepProps {
  submitting: boolean;
  error: string;
  onSubmit: (customer: Customer, notes: string) => void;
}

export function DetailsStep({ submitting, error, onSubmit }: DetailsStepProps) {
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const customer: Customer = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
    };
    const found: Errors = {};
    if (customer.name.length < 2) found.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) found.email = "Please enter a valid email.";
    if (!/^[+()\d\s-]{7,20}$/.test(customer.phone)) found.phone = "Please enter a valid phone number.";
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(customer, String(data.get("notes") ?? "").trim());
  }

  const cls = (k: keyof Customer) => `${input} ${errors[k] ? "!border-rose-500" : ""}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="name" className={label}>
          Full name
        </label>
        <input id="name" name="name" autoComplete="name" placeholder="Jane Doe" className={cls("name")} aria-invalid={!!errors.name} />
        {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="jane@example.com" className={cls("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={label}>
            Phone
          </label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 555 123 4567" className={cls("phone")} aria-invalid={!!errors.phone} />
          {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <label htmlFor="notes" className={label}>
          Notes for your professional <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea id="notes" name="notes" rows={3} maxLength={300} placeholder="Allergies, inspiration photos, accessibility needs…" className={`${input} resize-y`} />
      </div>

      {error && (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-300" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className={`${btnPrimary} w-full !py-3`}>
        {submitting ? "Confirming…" : "Confirm booking"}
      </button>
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
        Free cancellation up to 24 hours before. You&apos;ll pay at the studio.
      </p>
    </form>
  );
}
