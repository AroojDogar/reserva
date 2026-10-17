"use client";

import Link from "next/link";
import { BUSINESS, formatDuration, formatPrice, getService, getStaff } from "@/lib/config";
import { downloadICS, googleCalendarUrl } from "@/lib/calendar";
import { actions, useAppState } from "@/lib/store";
import { daysBetween, formatDate, formatTime, nowMinutes, todayISO } from "@/lib/time";
import { btnDanger, btnPrimary, btnSecondary, card } from "@/lib/ui";
import { Avatar, StatusBadge } from "./Badges";

export function BookingDetails({ bookingRef, isNew }: { bookingRef: string; isNew: boolean }) {
  const { bookings } = useAppState();
  const booking = bookings.find((b) => b.ref === bookingRef.toUpperCase());

  if (!booking) {
    return (
      <div className={`${card} mx-auto max-w-lg p-8 text-center`}>
        <p className="text-4xl">🔍</p>
        <h1 className="mt-4 font-serif text-3xl text-zinc-900 dark:text-white">Booking not found</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          We couldn&apos;t find a booking with reference <strong>{bookingRef}</strong>.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/manage" className={btnSecondary}>
            Look up booking
          </Link>
          <Link href="/book" className={btnPrimary}>
            Book now
          </Link>
        </div>
      </div>
    );
  }

  const service = getService(booking.serviceId)!;
  const staff = getStaff(booking.staffId)!;
  const ahead = daysBetween(todayISO(), booking.date);
  const upcoming = booking.status === "confirmed" && (ahead > 0 || (ahead === 0 && booking.start > nowMinutes()));

  function cancel() {
    if (confirm("Cancel this appointment? This can't be undone.")) actions.setStatus(booking!.id, "cancelled");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        {isNew && booking.status === "confirmed" ? (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600 dark:bg-emerald-500/15">
              ✓
            </span>
            <h1 className="mt-5 font-serif text-4xl text-zinc-900 dark:text-white">You&apos;re booked!</h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              A confirmation has been sent to <strong className="text-zinc-900 dark:text-white">{booking.customer.email}</strong>.
            </p>
          </>
        ) : (
          <h1 className="font-serif text-4xl text-zinc-900 dark:text-white">Your booking</h1>
        )}
      </div>

      <div className={`${card} mt-8 overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500">Reference</p>
            <p className="font-mono text-lg font-bold tracking-wider text-zinc-900 dark:text-white">{booking.ref}</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-2xl dark:bg-violet-500/15" aria-hidden>
              {service.icon}
            </span>
            <div className="flex-1">
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">{service.name}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {formatDuration(service.duration)} · {formatPrice(booking.price)}
              </p>
            </div>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <dt className="text-xs text-zinc-500">When</dt>
              <dd className="mt-1 font-semibold text-zinc-900 dark:text-white">{formatDate(booking.date)}</dd>
              <dd className="text-sm text-zinc-600 dark:text-zinc-300">
                {formatTime(booking.start)} – {formatTime(booking.end)}
              </dd>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
              <dt className="text-xs text-zinc-500">With</dt>
              <dd className="mt-1 flex items-center gap-2 font-semibold text-zinc-900 dark:text-white">
                <Avatar staff={staff} size="sm" /> {staff.name}
              </dd>
              <dd className="text-sm text-zinc-600 dark:text-zinc-300">{staff.role}</dd>
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 sm:col-span-2 dark:bg-zinc-800/50">
              <dt className="text-xs text-zinc-500">Where</dt>
              <dd className="mt-1 font-semibold text-zinc-900 dark:text-white">{BUSINESS.name}</dd>
              <dd className="text-sm text-zinc-600 dark:text-zinc-300">{BUSINESS.address}</dd>
            </div>
          </dl>

          {booking.notes && (
            <p className="rounded-xl border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
              <span className="font-semibold">Your notes:</span> {booking.notes}
            </p>
          )}

          {upcoming && (
            <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              <a href={googleCalendarUrl(booking)} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                📅 Google Calendar
              </a>
              <button type="button" onClick={() => downloadICS(booking)} className={btnSecondary}>
                ⬇ Apple / Outlook (.ics)
              </button>
              <button type="button" onClick={cancel} className={`${btnDanger} sm:ml-auto`}>
                Cancel booking
              </button>
            </div>
          )}
          {booking.status === "cancelled" && (
            <p className="rounded-xl bg-zinc-100 p-4 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              This appointment was cancelled. We&apos;d love to see you another time.
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/book?service=${service.id}`} className={btnPrimary}>
          {booking.status === "cancelled" ? "Book again" : "Book another appointment"}
        </Link>
        <Link href="/" className={btnSecondary}>
          Back to home
        </Link>
      </div>
      <p className="mt-6 text-center text-xs text-zinc-500">Save your reference. You&apos;ll need it to manage this booking.</p>
    </div>
  );
}
