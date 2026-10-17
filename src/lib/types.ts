export type BookingStatus = "confirmed" | "completed" | "cancelled" | "no-show";

export interface Customer {
  name: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  /** Human-friendly reference shown to the customer, e.g. LUM-7KQ2XD */
  ref: string;
  serviceId: string;
  staffId: string;
  /** Local date, YYYY-MM-DD */
  date: string;
  /** Minutes from midnight */
  start: number;
  end: number;
  price: number;
  customer: Customer;
  notes: string;
  status: BookingStatus;
  createdAt: string;
}

export interface DayHours {
  open: number;
  close: number;
}

/** Index 0 = Sunday … 6 = Saturday. `null` means closed. */
export type WeeklyHours = (DayHours | null)[];

export interface AppState {
  bookings: Booking[];
  hours: WeeklyHours;
}
