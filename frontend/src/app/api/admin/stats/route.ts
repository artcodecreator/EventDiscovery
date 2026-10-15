import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAdminStats } from "@/lib/events";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    // Return stats for demo/admin
  }
  const stats = await getAdminStats();
  return NextResponse.json({ data: stats });
}
