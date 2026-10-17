import type { WeeklyHours } from "./types";

export const BUSINESS = {
  name: "Lumière Studio",
  tagline: "Hair, beauty & wellness",
  address: "88 Rivington St, New York, NY 10002",
  phone: "+1 (212) 555-0186",
  email: "hello@lumiere.example",
  currency: "USD",
  refPrefix: "LUM",
  /** Minimum notice before an appointment can be booked. */
  leadMinutes: 60,
  /** Gap between selectable start times. */
  slotStep: 15,
  /** How far ahead customers can book. */
  maxDaysAhead: 60,
};

export type ServiceCategory = "Hair" | "Nails" | "Skin & Body";

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: number;
  price: number;
  description: string;
  icon: string;
}

export const SERVICES: Service[] = [
  { id: "haircut", name: "Haircut & Style", category: "Hair", duration: 45, price: 55, icon: "✂️", description: "Consultation, wash, precision cut and finish styled to suit you." },
  { id: "color", name: "Color & Highlights", category: "Hair", duration: 120, price: 140, icon: "🎨", description: "Full color, balayage or foils with toner and a gloss treatment." },
  { id: "blowout", name: "Signature Blowout", category: "Hair", duration: 30, price: 35, icon: "💨", description: "Wash and a long-lasting, voluminous blow-dry." },
  { id: "manicure", name: "Gel Manicure", category: "Nails", duration: 45, price: 38, icon: "💅", description: "Nail shaping, cuticle care and a chip-free gel finish." },
  { id: "pedicure", name: "Spa Pedicure", category: "Nails", duration: 60, price: 48, icon: "🦶", description: "Soak, exfoliation, massage and polish of your choice." },
  { id: "brows", name: "Brow Shaping", category: "Skin & Body", duration: 20, price: 22, icon: "✨", description: "Wax and tweeze to shape brows that frame your face." },
  { id: "facial", name: "Hydrating Facial", category: "Skin & Body", duration: 60, price: 85, icon: "🧖", description: "Deep cleanse, exfoliation, mask and hydration for glowing skin." },
  { id: "massage", name: "Relaxing Massage", category: "Skin & Body", duration: 60, price: 90, icon: "💆", description: "Full-body Swedish massage to melt away tension." },
];

export interface Staff {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  serviceIds: string[];
}

export const STAFF: Staff[] = [
  { id: "ava", name: "Ava Thompson", role: "Senior Stylist", initials: "AT", color: "#8b5cf6", serviceIds: ["haircut", "color", "blowout"] },
  { id: "liam", name: "Liam Carter", role: "Color Specialist", initials: "LC", color: "#0ea5e9", serviceIds: ["haircut", "color", "blowout"] },
  { id: "mia", name: "Mia Chen", role: "Nail Artist", initials: "MC", color: "#ec4899", serviceIds: ["manicure", "pedicure", "brows"] },
  { id: "jordan", name: "Jordan Reyes", role: "Esthetician & Massage", initials: "JR", color: "#10b981", serviceIds: ["facial", "massage", "brows"] },
];

/** Selecting this lets the system assign the first available professional. */
export const ANY_STAFF = "any";

const h = (hour: number) => hour * 60;

export const DEFAULT_HOURS: WeeklyHours = [
  { open: h(10), close: h(16) }, // Sun
  null, // Mon
  { open: h(9), close: h(19) }, // Tue
  { open: h(9), close: h(19) }, // Wed
  { open: h(9), close: h(20) }, // Thu
  { open: h(9), close: h(20) }, // Fri
  { open: h(9), close: h(17) }, // Sat
];

export function getService(id: string | null | undefined) {
  return SERVICES.find((s) => s.id === id);
}

export function getStaff(id: string | null | undefined) {
  return STAFF.find((s) => s.id === id);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: BUSINESS.currency, maximumFractionDigits: 0 }).format(value);
}

export function formatDuration(minutes: number) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return [hrs && `${hrs} hr`, mins && `${mins} min`].filter(Boolean).join(" ");
}
