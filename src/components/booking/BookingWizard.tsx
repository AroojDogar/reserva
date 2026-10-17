"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ANY_STAFF, BUSINESS, getService } from "@/lib/config";
import { getSlots, pickStaff, type Slot } from "@/lib/slots";
import { actions, getState, useAppState } from "@/lib/store";
import { addDays, formatDate, todayISO } from "@/lib/time";
import type { Customer } from "@/lib/types";
import { btnPrimary, btnSecondary, card } from "@/lib/ui";
import { Calendar } from "./Calendar";
import { DetailsStep } from "./DetailsStep";
import { STEPS, Stepper } from "./Stepper";
import { ServiceStep } from "./ServiceStep";
import { StaffStep } from "./StaffStep";
import { Summary } from "./Summary";
import { TimeSlots } from "./TimeSlots";

const HEADINGS = [
  ["Choose a service", "What would you like to book today?"],
  ["Choose a professional", "Pick someone you love, or let us find the first available."],
  ["Pick a date & time", "Highlighted days have open slots."],
  ["Your details", "We'll send your confirmation here."],
];

export function BookingWizard({ initialService }: { initialService?: string }) {
  const router = useRouter();
  const state = useAppState();
  const preselected = getService(initialService)?.id ?? null;

  const [step, setStep] = useState(preselected ? 1 : 0);
  const [serviceId, setServiceId] = useState<string | null>(preselected);
  const [staffId, setStaffId] = useState(ANY_STAFF);
  const [date, setDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const slotsFor = (d: string) => (serviceId ? getSlots(state, d, serviceId, staffId) : []);
  const slots = date ? slotsFor(date) : [];
  // The chosen time can disappear if someone else books it in another tab.
  const selectedSlot = slot && slots.some((s) => s.start === slot.start) ? slot : null;

  function firstAvailableDate(service: string, staff: string) {
    const today = todayISO();
    for (let i = 0; i <= BUSINESS.maxDaysAhead; i++) {
      const d = addDays(today, i);
      if (getSlots(state, d, service, staff).length) return d;
    }
    return null;
  }

  function chooseService(id: string) {
    setServiceId(id);
    setStaffId(ANY_STAFF);
    setDate(null);
    setSlot(null);
    setStep(1);
  }

  function chooseStaff(id: string) {
    setStaffId(id);
    setSlot(null);
    setDate(serviceId ? firstAvailableDate(serviceId, id) : null);
    setStep(2);
  }

  function confirm(customer: Customer, notes: string) {
    if (!serviceId || !date || !selectedSlot) return;
    setSubmitting(true);
    setError("");
    const assigned = staffId === ANY_STAFF ? pickStaff(getState(), date, selectedSlot.staffIds) : staffId;
    const booking = actions.createBooking({ serviceId, staffId: assigned, date, start: selectedSlot.start, customer, notes });
    if (!booking) {
      setSubmitting(false);
      setSlot(null);
      setStep(2);
      setError("Sorry, that time was just taken. Please pick another slot.");
      return;
    }
    router.push(`/booking/${booking.ref}?new=1`);
  }

  const [heading, sub] = HEADINGS[step];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0">
        <Stepper current={step} onStepClick={setStep} />

        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-violet-600 dark:text-violet-400">
              Step {step + 1} of {STEPS.length}
            </p>
            <h1 className="mt-1 font-serif text-3xl text-zinc-900 dark:text-white">{heading}</h1>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">{sub}</p>
          </div>
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className={`${btnSecondary} shrink-0 !px-3 !py-2`}>
              ← Back
            </button>
          )}
        </div>

        <div className="mt-6">
          {step === 0 && <ServiceStep selected={serviceId} onSelect={chooseService} />}

          {step === 1 && serviceId && <StaffStep serviceId={serviceId} selected={staffId} onSelect={chooseStaff} />}

          {step === 2 && serviceId && (
            <div className="space-y-4">
              {error && (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300" role="alert">
                  {error}
                </p>
              )}
              <div className="grid gap-6 xl:grid-cols-2">
                <div className={`${card} p-5`}>
                  <Calendar
                    selected={date}
                    isAvailable={(d) => slotsFor(d).length > 0}
                    onSelect={(d) => {
                      setDate(d);
                      setSlot(null);
                    }}
                  />
                </div>
                <div className={`${card} p-5`}>
                  <p className="mb-4 font-semibold text-zinc-900 dark:text-white">
                    {date ? formatDate(date) : "Select a date"}
                  </p>
                  {date ? (
                    <TimeSlots slots={slots} selected={selectedSlot?.start ?? null} onSelect={setSlot} />
                  ) : (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">No availability in the next {BUSINESS.maxDaysAhead} days.</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => {
                    setError("");
                    setStep(3);
                  }}
                  className={`${btnPrimary} w-full sm:w-auto`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={`${card} p-5 sm:p-6`}>
              <DetailsStep submitting={submitting} error={error} onSubmit={confirm} />
            </div>
          )}
        </div>
      </div>

      <div>
        <Summary serviceId={serviceId} staffId={staffId} date={date} start={selectedSlot?.start ?? null} />
      </div>
    </div>
  );
}
