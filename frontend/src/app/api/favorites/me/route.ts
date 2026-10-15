import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserFavorites } from "@/lib/events";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const base = process.env.STRAPI_URL;
  if (base && session.strapiToken && session.strapiToken !== "demo-jwt-token") {
    try {
      const upstream = await fetch(`${base}/api/favorites/me`, {
        headers: { Authorization: `Bearer ${session.strapiToken}` },
        cache: "no-store"
      });
      if (upstream.ok) {
        return NextResponse.json(await upstream.json());
      }
    } catch {
      // fallback
    }
  }

  const favs = await getUserFavorites(session.user.id || "1");
  return NextResponse.json({ data: favs });
}
