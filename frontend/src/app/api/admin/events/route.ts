import { NextResponse } from "next/server";
import { getEvents, updateEvent } from "@/lib/events";
import { requireAdmin, readJsonObject, parseEventId, badRequest, notFoundJson } from "@/lib/api-guards";

export async function GET(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const city = searchParams.get("city") || undefined;

  const events = await getEvents({ includePending: true, search, category, city });
  return NextResponse.json({ data: events });
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const body = await readJsonObject(request);
  if (!body) return badRequest("Invalid request body.");

  const id = parseEventId(body.id || body.eventId);
  if (id === null) return badRequest("Event ID required.");

  try {
    const updated = await updateEvent(id, body as any);
    if (!updated) return notFoundJson("Event not found.");
    return NextResponse.json({ success: true, data: updated, message: `Event '${updated.title}' updated successfully!` });
  } catch {
    return NextResponse.json({ error: "Failed to update event." }, { status: 500 });
  }
}
