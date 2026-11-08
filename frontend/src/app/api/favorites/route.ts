import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleFavorite, getEventById } from "@/lib/events";
import { readJsonObject, parseEventId, badRequest, notFoundJson } from "@/lib/api-guards";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required to bookmark events." }, { status: 401 });

  const body = await readJsonObject(request);
  if (!body) return badRequest("Invalid request body.");

  const eventId = parseEventId(body.eventId || body.eventDocumentId || body.documentId || body.id);
  if (eventId === null) return badRequest("Event ID required");

  const base = process.env.STRAPI_URL;
  if (base && session.strapiToken && session.strapiToken !== "demo-jwt-token") {
    try {
      const upstream = await fetch(`${base}/api/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.strapiToken}`
        },
        body: JSON.stringify({ eventDocumentId: eventId }),
        cache: "no-store"
      });
      if (upstream.ok) {
        return NextResponse.json(await upstream.json(), { status: upstream.status });
      }
    } catch {
      // fallback
    }
  }

  const event = await getEventById(eventId);
  if (!event || (event.status ?? "approved") !== "approved") return notFoundJson("Event not found.");

  const result = await toggleFavorite(session.user.id || "1", eventId);
  return NextResponse.json({
    data: {
      success: true,
      bookmarked: result.bookmarked,
      message: result.bookmarked ? "Event added to bookmarks!" : "Event removed from bookmarks."
    }
  });
}
