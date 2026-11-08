import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createEventSubmission } from "@/lib/events";
import { readJsonObject, eventSubmissionSchema, badRequest } from "@/lib/api-guards";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required to submit an event." }, { status: 401 });

  const body = await readJsonObject(request);
  if (!body) return badRequest("Invalid request body.");

  // Whitelist + validate. Unknown keys (status, featured, slug, ...) are dropped so
  // a client can never self-approve or feature a submission.
  const parsed = eventSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return badRequest(`Invalid event details${first ? ` (${first.path.join(".") || "payload"}: ${first.message})` : "."}`);
  }
  const payload = parsed.data;

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
