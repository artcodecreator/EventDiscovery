import { NextResponse } from "next/server";
import { getAllReviews, deleteReview } from "@/lib/events";
import { requireAdmin, readJsonObject, badRequest, notFoundJson } from "@/lib/api-guards";

export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const reviews = await getAllReviews();
  return NextResponse.json({ data: reviews });
}

export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const url = new URL(request.url);
  const qEventId = url.searchParams.get("eventId");
  const qReviewId = url.searchParams.get("reviewId");
  const body = await readJsonObject(request);
  const eventId = qEventId || body?.eventId;
  const reviewId = qReviewId !== null ? qReviewId : body?.reviewId;

  if (!eventId || reviewId === undefined || reviewId === null) {
    return badRequest("Both eventId and reviewId are required.");
  }

  const success = await deleteReview(eventId as string | number, reviewId as string | number);
  if (!success) return notFoundJson("Review or event not found.");

  return NextResponse.json({ success: true, message: "Review deleted successfully." });
}
