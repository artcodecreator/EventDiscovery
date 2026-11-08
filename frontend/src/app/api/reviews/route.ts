import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addReview, getEventById } from "@/lib/events";
import { readJsonObject, parseEventId, reviewSchema, badRequest, notFoundJson } from "@/lib/api-guards";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required to submit a review." }, { status: 401 });

  const body = await readJsonObject(request);
  if (!body) return badRequest("Invalid request body.");

  const targetId = parseEventId(body.eventId || body.eventDocumentId);
  if (targetId === null) return badRequest("Event ID required");

  const parsed = reviewSchema.safeParse({ rating: body.rating, comment: body.comment });
  if (!parsed.success) {
    return badRequest("Please provide a rating from 1 to 5 and a comment of up to 1000 characters.");
  }
  const { rating, comment } = parsed.data;

  const base = process.env.STRAPI_URL;
  if (base && session.strapiToken && session.strapiToken !== "demo-jwt-token") {
    try {
      const upstream = await fetch(`${base}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.strapiToken}`
        },
        body: JSON.stringify({ data: { event: targetId, rating, comment } }),
        cache: "no-store"
      });
      if (upstream.ok) {
        return NextResponse.json(await upstream.json(), { status: upstream.status });
      }
    } catch {
      // fallback
    }
  }

  const event = await getEventById(targetId);
  if (!event || (event.status ?? "approved") !== "approved") return notFoundJson("Event not found.");

  const newRev = await addReview(targetId, {
    rating,
    comment,
    userName: session.user.name || "Community Attendee"
  });

  return NextResponse.json({
    data: newRev,
    message: "Thank you! Your review has been published."
  });
}
