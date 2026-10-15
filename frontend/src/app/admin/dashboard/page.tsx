import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getEvents, getAdminStats } from "@/lib/events";
import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { initialUsers } from "@/app/api/admin/users/route";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/admin/dashboard");
  }
  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const [events, stats] = await Promise.all([
    getEvents({ includePending: true }),
    getAdminStats()
  ]);

  return (
    <AdminDashboardClient
      initialEvents={events}
      initialStats={stats}
      initialUsers={initialUsers}
    />
  );
}
