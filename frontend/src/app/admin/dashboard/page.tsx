import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getEvents, getAdminStats, getCategories, getAllReviews } from "@/lib/events";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { getUsersStore } from "@/lib/users";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/admin/dashboard");
  }
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const [events, stats, categories, reviews] = await Promise.all([
    getEvents({ includePending: true }),
    getAdminStats(),
    getCategories(),
    getAllReviews()
  ]);

  return (
    <AdminDashboardClient
      initialEvents={events}
      initialStats={stats}
      initialUsers={getUsersStore()}
      initialCategories={categories}
      initialReviews={reviews}
    />
  );
}
