import { ANY_STAFF, BUSINESS, STAFF, getService } from "./config";
import { daysBetween, nowMinutes, todayISO, weekdayOf } from "./time";
import type { AppState, Booking } from "./types";

export interface Slot {
  start: number;
  /** Professionals who are free for the whole appointment at this time. */
  staffIds: string[];
}

function overlaps(b: Booking, start: number, end: number) {
  return b.start < end && start < b.end;
}

export function isStaffFree(state: AppState, staffId: string, date: string, start: number, end: number) {
  return !state.bookings.some(
    (b) => b.status !== "cancelled" && b.staffId === staffId && b.date === date && overlaps(b, start, end),
  );
}

export function getSlots(state: AppState, date: string, serviceId: string, staffChoice: string): Slot[] {
  const service = getService(serviceId);
  if (!service) return [];

  const ahead = daysBetween(todayISO(), date);
  if (ahead < 0 || ahead > BUSINESS.maxDaysAhead) return [];

  const hours = state.hours[weekdayOf(date)];
  if (!hours) return [];

  const staff = STAFF.filter(
    (s) => s.serviceIds.includes(serviceId) && (staffChoice === ANY_STAFF || s.id === staffChoice),
  );
  const earliest = ahead === 0 ? nowMinutes() + BUSINESS.leadMinutes : 0;

  const slots: Slot[] = [];
  for (let t = hours.open; t + service.duration <= hours.close; t += BUSINESS.slotStep) {
    if (t < earliest) continue;
    const free = staff.filter((s) => isStaffFree(state, s.id, date, t, t + service.duration)).map((s) => s.id);
    if (free.length) slots.push({ start: t, staffIds: free });
  }
  return slots;
}

/** Pick the free professional with the fewest bookings that day, to spread the workload. */
export function pickStaff(state: AppState, date: string, candidates: string[]): string {
  const load = (id: string) =>
    state.bookings.filter((b) => b.staffId === id && b.date === date && b.status !== "cancelled").length;
  return [...candidates].sort((a, b) => load(a) - load(b))[0];
}
