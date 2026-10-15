import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createEventSubmission } from "@/lib/events";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required to submit an event." }, { status: 401 });

  const payload = await request.json();

  const base = process.env.STRAPI_URL;
  if (base && session.strapiToken && session.strapiToken !== "demo-jwt-token") {
    try {
      const upstream = await fetch(`${base}/api/events/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.strapiToken}`
        },
        body: JSON.stringify({ data: payload }),
        cache: "no-store"
      });
      if (upstream.ok) {
        return NextResponse.json(await upstream.json(), { status: upstream.status });
      }
    } catch {
      // fallback
    }
  }

  const created = await createEventSubmission(payload);
  return NextResponse.json({
    data: created,
    message: "Event submitted successfully! It is now in pending review for admin approval."
  });
}
