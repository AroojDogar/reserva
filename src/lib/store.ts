"use client";

import { useSyncExternalStore } from "react";
import { getService } from "./config";
import { createDemoState, makeRef } from "./demo";
import { isStaffFree } from "./slots";
import type { AppState, Booking, BookingStatus, Customer, DayHours } from "./types";

const STORAGE_KEY = "reserva:v1";
const EMPTY: AppState = { bookings: [], hours: [] };

let state: AppState | null = null;
const listeners = new Set<() => void>();

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    // Unavailable or corrupted storage: start from demo data.
  }
  const demo = createDemoState();
  persist(demo);
  return demo;
}

function persist(next: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or quota exceeded: keep working in memory.
  }
}

export function getState(): AppState {
  if (!state) state = load();
  return state;
}

function setState(update: (prev: AppState) => AppState) {
  state = update(getState());
  persist(state);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep multiple tabs in sync, e.g. the admin dashboard sees new bookings instantly.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    state = load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getState, () => EMPTY);
}

export interface NewBooking {
  serviceId: string;
  staffId: string;
  date: string;
  start: number;
  customer: Customer;
  notes: string;
}

export const actions = {
  /** Returns the created booking, or null if the slot was taken in the meantime. */
  createBooking(input: NewBooking): Booking | null {
    const service = getService(input.serviceId);
    if (!service) return null;
    const end = input.start + service.duration;
    if (!isStaffFree(getState(), input.staffId, input.date, input.start, end)) return null;

    const booking: Booking = {
      ...input,
      id: crypto.randomUUID(),
      ref: makeRef(),
      end,
      price: service.price,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, bookings: [...s.bookings, booking] }));
    return booking;
  },
  setStatus(id: string, status: BookingStatus) {
    setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)) }));
  },
  setHours(weekday: number, hours: DayHours | null) {
    setState((s) => ({ ...s, hours: s.hours.map((h, i) => (i === weekday ? hours : h)) }));
  },
  resetDemo() {
    setState(() => createDemoState());
  },
};

export function findBooking(ref: string) {
  const needle = ref.trim().toUpperCase();
  return getState().bookings.find((b) => b.ref === needle);
}
