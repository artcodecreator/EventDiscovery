import { NextResponse } from "next/server";
import { initialUsers } from "@/lib/users";
import { requireAdmin } from "@/lib/api-guards";

export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  return NextResponse.json({ data: initialUsers });
}
