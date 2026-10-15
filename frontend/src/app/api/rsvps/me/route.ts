import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserRsvps } from "@/lib/events";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const base = process.env.STRAPI_URL;
  if (base && session.strapiToken && session.strapiToken !== "demo-jwt-token") {
    try {
      const upstream = await fetch(`${base}/api/rsvps/me`, {
        headers: { Authorization: `Bearer ${session.strapiToken}` },
        cache: "no-store"
      });
      if (upstream.ok) {
        return NextResponse.json(await upstream.json());
      }
    } catch {
      // Fallback
    }
  }

  const rsvps = await getUserRsvps(session.user.id || "1");
  return NextResponse.json({ data: rsvps });
}
