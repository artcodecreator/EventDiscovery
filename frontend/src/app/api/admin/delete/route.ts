import { NextResponse } from "next/server";
import { deleteEvent } from "@/lib/events";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

    const success = await deleteEvent(id);
    return NextResponse.json({ success, message: "Event deleted." });
  } catch {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
