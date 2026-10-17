import type { Metadata } from "next";
import { ClientOnly, PageSkeleton } from "@/components/ClientOnly";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { container } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Book an appointment",
  description: "Choose a service, professional and time slot to book your appointment online.",
};

export default async function BookPage({ searchParams }: PageProps<"/book">) {
  const { service } = await searchParams;

  return (
    <section className={`${container} py-10 sm:py-14`}>
      <ClientOnly fallback={<PageSkeleton />}>
        <BookingWizard initialService={typeof service === "string" ? service : undefined} />
      </ClientOnly>
    </section>
  );
}
