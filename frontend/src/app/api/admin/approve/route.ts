import { NextResponse } from "next/server";
import { approveEvent } from "@/lib/events";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

    const success = await approveEvent(id);
    return NextResponse.json({ success, message: "Event approved successfully!" });
  } catch {
    return NextResponse.json({ error: "Failed to approve event" }, { status: 500 });
  }
}
