import { BUSINESS, DEFAULT_HOURS, SERVICES, STAFF } from "./config";
import { isStaffFree } from "./slots";
import { addDays, todayISO, weekdayOf } from "./time";
import type { AppState, Booking, BookingStatus } from "./types";

// Deterministic PRNG so the demo looks the same on every first visit.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  "Emma Wilson", "Olivia Brown", "Sophia Garcia", "Isabella Martinez", "Charlotte Davis", "Amelia Lopez",
  "Harper Clark", "Evelyn Lewis", "James Walker", "Benjamin Hall", "Lucas Young", "Henry King",
  "Grace Wright", "Chloe Scott", "Zoe Adams", "Nora Baker", "Leah Nelson", "Hannah Hill",
];

export function makeRef(random: () => number = Math.random): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return `${BUSINESS.refPrefix}-${Array.from({ length: 6 }, () => chars[Math.floor(random() * chars.length)]).join("")}`;
}

export function createDemoState(): AppState {
  const rand = mulberry32(7);
  const today = todayISO();
  const state: AppState = { bookings: [], hours: DEFAULT_HOURS };
  let n = 0;

  for (let offset = -21; offset <= 14; offset++) {
    const date = addDays(today, offset);
    const hours = DEFAULT_HOURS[weekdayOf(date)];
    if (!hours) continue;

    const target = 4 + Math.floor(rand() * 5);
    for (let attempt = 0; attempt < target * 4 && countOn(state, date) < target; attempt++) {
      const service = SERVICES[Math.floor(rand() * SERVICES.length)];
      const staffOptions = STAFF.filter((s) => s.serviceIds.includes(service.id));
      const staff = staffOptions[Math.floor(rand() * staffOptions.length)];
      const steps = Math.floor((hours.close - hours.open - service.duration) / 30);
      const start = hours.open + Math.floor(rand() * (steps + 1)) * 30;
      if (!isStaffFree(state, staff.id, date, start, start + service.duration)) continue;

      let status: BookingStatus = "confirmed";
      const roll = rand();
      if (offset < 0) status = roll < 0.08 ? "no-show" : roll < 0.18 ? "cancelled" : "completed";
      else if (roll < 0.08) status = "cancelled";

      const takenToday = new Set(state.bookings.filter((b) => b.date === date).map((b) => b.customer.name));
      const name = NAMES[Math.floor(rand() * NAMES.length)];
      if (takenToday.has(name)) continue;
      const booking: Booking = {
        id: `demo-${n++}`,
        ref: makeRef(rand),
        serviceId: service.id,
        staffId: staff.id,
        date,
        start,
        end: start + service.duration,
        price: service.price,
        customer: {
          name,
          email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
          phone: `+1 (917) 555-${String(1000 + Math.floor(rand() * 8999))}`,
        },
        notes: rand() < 0.2 ? "First visit" : "",
        status,
        createdAt: addDays(date, -3),
      };
      state.bookings.push(booking);
    }
  }
  return state;
}

function countOn(state: AppState, date: string) {
  return state.bookings.filter((b) => b.date === date).length;
}
