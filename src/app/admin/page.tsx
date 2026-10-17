import type { Metadata } from "next";
import { ClientOnly, PageSkeleton } from "@/components/ClientOnly";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { container } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false },
};

export default function AdminPage() {
  return (
    <section className={`${container} py-10`}>
      <ClientOnly fallback={<PageSkeleton />}>
        <AdminDashboard />
      </ClientOnly>
    </section>
  );
}
