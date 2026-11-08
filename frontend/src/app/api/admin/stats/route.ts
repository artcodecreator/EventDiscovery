import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/events";
import { requireAdmin } from "@/lib/api-guards";

export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const stats = await getAdminStats();
  return NextResponse.json({ data: stats });
}