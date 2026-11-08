import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getEvents, getEventBySlug } from "@/lib/events";
import { EventDetailClient } from "@/components/event-detail-client";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  // Only approved events are public. Pending/rejected submissions are previewable by admins only.
  if ((event.status ?? "approved") !== "approved") {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      notFound();
    }
  }

  const allEvents = await getEvents();
  const related = allEvents
    .filter(e => e.categorySlug === event.categorySlug && e.slug !== event.slug)
    .slice(0, 3);

  return (
    <main>
      <EventDetailClient event={event} relatedEvents={related} />
    </main>
  );
}
