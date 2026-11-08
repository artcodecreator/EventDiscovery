import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleRsvp, cancelRsvp, getEventById } from "@/lib/events";
import { readJsonObject, parseEventId, parseTicketsCount, badRequest, notFoundJson } from "@/lib/api-guards";

async function approvedEventExists(id: string | number) {
  const event = await getEventById(id);
  return Boolean(event && (event.status ?? "approved") === "approved");
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required to get passes." }, { status: 401 });

  const body = await readJsonObject(request);
  if (!body) return badRequest("Invalid request body.");

  const eventId = parseEventId(body.eventId || body.eventDocumentId || body.documentId || body.id);
  if (eventId === null) return badRequest("Event ID required");

  const ticketsCount = parseTicketsCount(body.ticketsCount);
  if (ticketsCount === null) return badRequest("Tickets must be a whole number between 1 and 10.");

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

  if (!(await approvedEventExists(eventId))) return notFoundJson("Event not found.");

  try {
    const result = await toggleRsvp(session.user.id || "1", eventId, ticketsCount);
    return NextResponse.json({
      data: {
        success: true,
        active: result.active,
        ticketsCount: result.ticketsCount,
        message: result.active ? "Pass booked successfully!" : "Pass cancelled."
      }
    });
  } catch (err: any) {
    return badRequest(err?.message || "Could not reserve pass.");
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await readJsonObject(request);
  if (!body) return badRequest("Invalid request body.");

  const eventId = parseEventId(body.eventId || body.eventDocumentId || body.id);
  if (eventId === null) return badRequest("Event ID required");

  // DELETE must only ever cancel an existing pass (never create one).
  await cancelRsvp(session.user.id || "1", eventId);
  return NextResponse.json({ data: { success: true, active: false, message: "Pass cancelled." } });
}
