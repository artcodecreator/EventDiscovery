import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserRsvps, getUserFavorites } from "@/lib/events";
import { UserDashboardClient } from "@/components/user-dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?next=/dashboard");
  }

  const userId = session.user.id || "1";
  const [rsvps, favorites] = await Promise.all([
    getUserRsvps(userId),
    getUserFavorites(userId)
  ]);

  return (
    <UserDashboardClient
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role
      }}
      initialRsvps={rsvps}
      initialFavorites={favorites}
    />
  );
}
