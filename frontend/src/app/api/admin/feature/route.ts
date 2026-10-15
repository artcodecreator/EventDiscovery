import { NextResponse } from "next/server";
import { toggleFeatured } from "@/lib/events";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

    const isFeatured = await toggleFeatured(id);
    return NextResponse.json({ success: true, isFeatured, message: isFeatured ? "Event marked as featured!" : "Event removed from featured." });
  } catch {
    return NextResponse.json({ error: "Failed to toggle featured status" }, { status: 500 });
  }
}
