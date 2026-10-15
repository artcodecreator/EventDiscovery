import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleRsvp } from "@/lib/events";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required to get passes." }, { status: 401 });

  const body = await request.json();
  const eventId = body.eventId || body.eventDocumentId || body.documentId || body.id;
  const ticketsCount = body.ticketsCount || 1;

  if (!eventId) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

  const base = process.env.STRAPI_URL;
  if (base && session.strapiToken && session.strapiToken !== "demo-jwt-token") {
    try {
      const upstream = await fetch(`${base}/api/rsvps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.strapiToken}`
        },
        body: JSON.stringify({ eventDocumentId: eventId, ticketsCount }),
        cache: "no-store"
      });
      if (upstream.ok) {
        return NextResponse.json(await upstream.json(), { status: upstream.status });
      }
    } catch {
      // fallback
    }
  }

  const result = await toggleRsvp(session.user.id || "1", eventId, ticketsCount);
  return NextResponse.json({
    data: {
      success: true,
      active: result.active,
      ticketsCount: result.ticketsCount,
      message: result.active ? "Pass booked successfully!" : "Pass cancelled."
    }
  });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await request.json();
  const eventId = body.eventId || body.eventDocumentId || body.id;
  if (!eventId) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

  const result = await toggleRsvp(session.user.id || "1", eventId);
  return NextResponse.json({ data: { success: true, active: false, message: "Pass cancelled." } });
}
