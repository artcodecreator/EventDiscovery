import { NextResponse } from "next/server";
import { deleteEvent } from "@/lib/events";
import { requireAdmin, readJsonObject, parseEventId, badRequest, notFoundJson } from "@/lib/api-guards";

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const body = await readJsonObject(request);
  const id = parseEventId(body?.id);
  if (id === null) return badRequest("Event ID required");

  try {
    const success = await deleteEvent(id);
    if (!success) return notFoundJson("Event not found");
    return NextResponse.json({ success, message: "Event deleted." });
  } catch {
    return NextResponse.json({ error: "FAILEvent deleted." }, { status: 500 });
  }
}