import { NextResponse } from "next/server";
import { toggleFeatured, getEventById } from "@/lib/events";
import { requireAdmin, readJsonObject, parseEventId, badRequest, notFoundJson } from "@/lib/api-guards";

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const body = await readJsonObject(request);
  const id = parseEventId(body?.id);
  if (id === null) return badRequest("Event ID required");

  try {
    if (!(await getEventById(id))) return notFoundJson("Event not found");
    const isFeatured = await toggleFeatured(id);
    return NextResponse.json({ success: true, isFeatured, message: isFeatured ? "Event marked as featured!" : "Event removed from featured." });
  } catch {
    return NextResponse.json({ error: "Failed to toggle featured status" }, { status: 500 });
  }
}