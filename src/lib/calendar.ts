import { BUSINESS, getService, getStaff } from "./config";
import type { Booking } from "./types";

const pad = (n: number) => String(n).padStart(2, "0");

/** Floating local time in iCalendar format: 20261018T143000 */
function stamp(date: string, minutes: number) {
  return `${date.replace(/-/g, "")}T${pad(Math.floor(minutes / 60))}${pad(minutes % 60)}00`;
}

function details(b: Booking) {
  const service = getService(b.serviceId)?.name ?? "Appointment";
  const staff = getStaff(b.staffId)?.name ?? "";
  return {
    title: `${service} at ${BUSINESS.name}`,
    description: `With ${staff}. Booking reference: ${b.ref}. Need to make changes? Call ${BUSINESS.phone}.`,
  };
}

export function googleCalendarUrl(b: Booking) {
  const { title, description } = details(b);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${stamp(b.date, b.start)}/${stamp(b.date, b.end)}`,
    details: description,
    location: BUSINESS.address,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

function escapeICS(text: string) {
  return text.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

export function downloadICS(b: Booking) {
  const { title, description } = details(b);
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Reserva//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${b.ref}@reserva`,
    `DTSTAMP:${now}`,
    `DTSTART:${stamp(b.date, b.start)}`,
    `DTEND:${stamp(b.date, b.end)}`,
    `SUMMARY:${escapeICS(title)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    `LOCATION:${escapeICS(BUSINESS.address)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${b.ref}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
