"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BUSINESS } from "@/lib/config";
import { btnPrimary, container } from "@/lib/ui";

const LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/manage", label: "Manage booking" },
  { href: "/admin", label: "Admin" },
];

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 font-serif text-lg font-bold text-white">
        L
      </span>
      <span className="font-semibold tracking-tight text-zinc-900 dark:text-white">{BUSINESS.name}</span>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <nav className={`${container} flex h-16 items-center gap-4`} aria-label="Main">
        <Link href="/" aria-label={`${BUSINESS.name} home`}>
          <Logo />
        </Link>
        <ul className="ml-auto hidden items-center gap-6 text-sm font-medium md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`transition hover:text-violet-600 dark:hover:text-violet-400 ${
                  pathname === l.href ? "text-violet-600 dark:text-violet-400" : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/book" className={`${btnPrimary} ml-auto !px-4 !py-2 md:ml-0`}>
          Book now
        </Link>
      </nav>
      <ul className={`${container} flex gap-5 overflow-x-auto pb-3 text-sm font-medium md:hidden`}>
        {LINKS.map((l) => (
          <li key={l.href} className="shrink-0">
            <Link
              href={l.href}
              className={pathname === l.href ? "text-violet-600 dark:text-violet-400" : "text-zinc-600 dark:text-zinc-400"}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
