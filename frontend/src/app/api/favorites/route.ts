import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleFavorite } from "@/lib/events";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required to bookmark events." }, { status: 401 });

  const body = await request.json();
  const eventId = body.eventId || body.eventDocumentId || body.documentId || body.id;
  if (!eventId) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

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

  const result = await toggleFavorite(session.user.id || "1", eventId);
  return NextResponse.json({
    data: {
      success: true,
      bookmarked: result.bookmarked,
      message: result.bookmarked ? "Event added to bookmarks!" : "Event removed from bookmarks."
    }
  });
}
