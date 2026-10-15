import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addReview } from "@/lib/events";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required to submit a review." }, { status: 401 });

  const body = await request.json();
  const { eventId, eventDocumentId, rating, comment } = body;
  const targetId = eventId || eventDocumentId;

  if (!targetId || !rating || !comment) {
    return NextResponse.json({ error: "Missing rating or comment." }, { status: 400 });
  }

  const base = process.env.STRAPI_URL;
  if (base && session.strapiToken && session.strapiToken !== "demo-jwt-token") {
    try {
      const upstream = await fetch(`${base}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.strapiToken}`
        },
        body: JSON.stringify({ data: { event: targetId, rating: Number(rating), comment } }),
        cache: "no-store"
      });
      if (upstream.ok) {
        return NextResponse.json(await upstream.json(), { status: upstream.status });
      }
    } catch {
      // fallback
    }
  }

  const newRev = await addReview(targetId, {
    rating: Number(rating),
    comment,
    userName: session.user.name || "Community Attendee"
  });

  return NextResponse.json({
    data: newRev,
    message: "Thank you! Your review has been published."
  });
}
