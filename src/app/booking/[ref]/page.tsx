import type { Metadata } from "next";
import { BookingDetails } from "@/components/BookingDetails";
import { ClientOnly, PageSkeleton } from "@/components/ClientOnly";
import { container } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Your booking",
  robots: { index: false },
};

export default async function BookingPage({ params, searchParams }: PageProps<"/booking/[ref]">) {
  const { ref } = await params;
  const { new: isNew } = await searchParams;

  return (
    <section className={`${container} py-12 sm:py-16`}>
      <ClientOnly fallback={<PageSkeleton />}>
        <BookingDetails bookingRef={decodeURIComponent(ref)} isNew={isNew === "1"} />
      </ClientOnly>
    </section>
  );
}
