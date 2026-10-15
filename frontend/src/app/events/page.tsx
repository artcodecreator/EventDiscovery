import { getEvents, getCategories } from "@/lib/events";
import { EventsExplorer } from "@/components/events-explorer";

export const dynamic = "force-dynamic";

export default async function EventsPage({
  searchParams
}: {
  searchParams: Promise<{ search?: string; category?: string; city?: string; view?: string }>;
}) {
  const p = await searchParams;
  const [allEvents, allCategories] = await Promise.all([
    getEvents({ includePending: false }),
    getCategories()
  ]);

  return (
    <main>
      <EventsExplorer
        initialEvents={allEvents}
        categories={allCategories}
        initialView={p.view || "grid"}
        initialCategory={p.category || ""}
        initialCity={p.city || ""}
        initialSearch={p.search || ""}
      />
    </main>
  );
}
