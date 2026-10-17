import Link from "next/link";
import { Avatar } from "@/components/Badges";
import { OpeningHours } from "@/components/OpeningHours";
import { BUSINESS, SERVICES, STAFF, formatDuration, formatPrice, type ServiceCategory } from "@/lib/config";
import { btnPrimary, btnSecondary, card, container } from "@/lib/ui";

const CATEGORIES: ServiceCategory[] = ["Hair", "Nails", "Skin & Body"];

const STEPS = [
  { title: "Choose a service", text: "Browse treatments with clear prices and durations." },
  { title: "Pick a time", text: "See real-time availability and choose your favourite professional." },
  { title: "You're booked", text: "Get an instant confirmation and add it to your calendar." },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute -top-40 left-1/2 -z-10 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-violet-300/40 via-fuchsia-200/30 to-amber-100/30 blur-3xl dark:from-violet-700/25 dark:via-fuchsia-700/15 dark:to-transparent" />
        <div className={`${container} grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr]`}>
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online booking, 24/7
            </p>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
              Look good. Feel better. <span className="italic text-violet-600 dark:text-violet-400">Book in seconds.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {BUSINESS.name} is a {BUSINESS.tagline.toLowerCase()} studio in New York. Choose your treatment, pick a
              stylist and reserve your spot without a single phone call.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className={`${btnPrimary} !px-6 !py-3`}>
                Book an appointment →
              </Link>
              <Link href="#services" className={`${btnSecondary} !px-6 !py-3`}>
                View services
              </Link>
            </div>
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["4.9★", "1,200+ reviews"],
                ["8", "Signature services"],
                ["< 60s", "To book online"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-serif text-3xl text-zinc-900 dark:text-white">{v}</dd>
                  <dd className="text-sm text-zinc-500 dark:text-zinc-400">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={`${card} p-6 sm:p-8`}>
            <h2 className="font-serif text-2xl text-zinc-900 dark:text-white">Opening hours</h2>
            <div className="mt-5">
              <OpeningHours />
            </div>
            <div className="mt-6 space-y-1 border-t border-zinc-200 pt-5 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              <p>📍 {BUSINESS.address}</p>
              <p>📞 {BUSINESS.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className={`${container} py-16`}>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Menu</p>
          <h2 className="mt-2 font-serif text-4xl text-zinc-900 dark:text-white">Services & prices</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Transparent pricing. No hidden fees. Pay at the studio after your visit.</p>
        </div>

        <div className="mt-10 space-y-10">
          {CATEGORIES.map((cat) => (
            <div key={cat}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{cat}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SERVICES.filter((s) => s.category === cat).map((s) => (
                  <article key={s.id} className={`${card} flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-xl dark:bg-violet-500/10" aria-hidden>
                        {s.icon}
                      </span>
                      <span className="font-serif text-2xl text-zinc-900 dark:text-white">{formatPrice(s.price)}</span>
                    </div>
                    <h4 className="mt-4 font-semibold text-zinc-900 dark:text-white">{s.name}</h4>
                    <p className="mt-1 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{s.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">⏱ {formatDuration(s.duration)}</span>
                      <Link
                        href={`/book?service=${s.id}`}
                        className="text-sm font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-400"
                      >
                        Book →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className={container}>
          <h2 className="text-center font-serif text-4xl text-zinc-900 dark:text-white">How it works</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 font-serif text-xl text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className={`${container} py-16`}>
        <h2 className="font-serif text-4xl text-zinc-900 dark:text-white">Meet the team</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAFF.map((p) => (
            <div key={p.id} className={`${card} flex items-center gap-4 p-5`}>
              <Avatar staff={p} size="lg" />
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">{p.name}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{p.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="font-serif text-4xl">Ready for your glow-up?</h2>
          <p className="mx-auto mt-3 max-w-lg text-violet-100">Free cancellation up to 24 hours before your appointment.</p>
          <Link href="/book" className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50">
            Book your appointment
          </Link>
        </div>
      </section>
    </>
  );
}
