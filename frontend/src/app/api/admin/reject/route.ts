import { NextResponse } from "next/server";
import { rejectEvent } from "@/lib/events";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

    const success = await rejectEvent(id);
    return NextResponse.json({ success, message: "Event submission rejected." });
  } catch {
    return NextResponse.json({ error: "Failed to reject event" }, { status: 500 });
  }
}
