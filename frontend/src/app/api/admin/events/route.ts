import { NextResponse } from "next/server";
import { getEvents } from "@/lib/events";
import { requireAdmin } from "@/lib/api-guards";

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