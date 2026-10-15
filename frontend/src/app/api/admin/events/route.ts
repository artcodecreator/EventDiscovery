import { NextResponse } from "next/server";
import { getEvents } from "@/lib/events";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const category = searchParams.get("category") || undefined;
  const city = searchParams.get("city") || undefined;

  const events = await getEvents({ includePending: true, search, category, city });
  return NextResponse.json({ data: events });
}
