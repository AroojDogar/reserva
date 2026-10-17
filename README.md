# 📅 Reserva: Appointment Booking System

A complete online booking system for salons, spas, clinics and consultants, built with **Next.js**, **React**, **TypeScript** and **Tailwind CSS**.
Customers book in four quick steps, and staff manage everything from an admin dashboard.
The demo is set up for a fictional beauty studio, *Lumière Studio*.

## ✨ Features

### Customer booking flow

1. **Choose a service**: prices, durations and descriptions, grouped by category
2. **Choose a professional**: pick a specific person or **"No preference"** for the first available
3. **Pick a date & time**: month calendar showing only days with open slots, with times grouped into morning, afternoon and evening
4. **Enter details**: validated name, email and phone, plus optional notes

**Confirmation page** shows a booking reference, an **Add to Google Calendar** link, an **.ics download** (Apple Calendar / Outlook) and **self-service cancellation**.

### Smart availability engine

- Generates time slots from **business hours**, **service duration** and a 15-minute step
- **Prevents double-booking**: overlapping appointments for the same professional are blocked, and the slot is re-checked at confirmation
- **"No preference"** auto-assigns the free professional with the lightest schedule that day
- Respects a minimum booking notice (1 hour) and a 60-day booking window
- Closed days and fully booked days are disabled in the calendar

### Admin dashboard (`/admin`)

- KPIs: today's appointments, next 7 days, revenue this week, cancellation and no-show rate
- **Stacked bar chart** of the upcoming week per professional
- Bookings list with **today / upcoming / past / all** views, staff and status filters, and search by name, email, phone or reference
- Actions: **Complete**, **No-show**, **Cancel** and **Undo**
- **Business hours editor**: changes apply to the booking page instantly
- **Live sync across tabs**: a booking made in one tab appears in the dashboard immediately

### Also included

- **Manage booking** lookup by reference + email
- Light & dark mode (follows the system setting)
- Fully responsive, keyboard-accessible controls and ARIA labels

## 🛠️ Tech Stack

| Area      | Tech                                                          |
| --------- | ------------------------------------------------------------- |
| Framework | Next.js (App Router), React                                   |
| Language  | TypeScript                                                    |
| Styling   | Tailwind CSS, Google Fonts (Geist, Fraunces)                  |
| State     | `useSyncExternalStore` + `localStorage`, synced across tabs   |
| Tooling   | ESLint, npm                                                   |
| Hosting   | Vercel                                                        |

## 🚀 Getting Started

```bash
git clone https://github.com/AroojDogar/reserva.git
cd reserva
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo bookings are generated on first visit. Use **Reset demo data** in the admin to start over.

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Create a production build  |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |

## 🎨 Customising for a business

Everything business-specific lives in **`src/lib/config.ts`**: name, address, services, staff, default opening hours, currency, booking notice, slot interval and booking window.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page with services & team
│   ├── book/                 # 4-step booking wizard
│   ├── booking/[ref]/        # Confirmation / booking details
│   ├── manage/               # Look up a booking
│   └── admin/                # Staff dashboard
├── components/
│   ├── booking/              # Stepper, ServiceStep, StaffStep, Calendar, TimeSlots, DetailsStep, Summary
│   └── admin/                # StatsRow, WeekChart, BookingsTable, HoursEditor
└── lib/
    ├── config.ts             # Business, services, staff, hours
    ├── slots.ts              # Availability engine
    ├── store.ts              # Persistent store + actions
    ├── calendar.ts           # Google Calendar link & .ics export
    ├── demo.ts               # Deterministic demo data
    └── time.ts               # Date/time helpers
```

## 🏭 Going to production

This demo stores data in the browser so it runs anywhere with zero setup. For a real business:

- Replace `src/lib/store.ts` with API routes backed by a database (e.g. PostgreSQL + Prisma, or Supabase)
- Protect `/admin` with authentication (e.g. Auth.js or Clerk)
- Send confirmation and reminder emails/SMS (e.g. Resend, Twilio)
- Use signed links for booking pages instead of plain references
- Optionally take deposits with Stripe

## ☁️ Deploy

Import the repo on [Vercel](https://vercel.com/new) and click **Deploy**. No environment variables are needed.

## 📄 License

MIT
