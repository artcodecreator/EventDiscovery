import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";

/**
 * Server-side admin authorization for API routes.
 * Returns `{ session }` for admins, otherwise `{ response }` (401 / 403) that the
 * route must return immediately.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { response: NextResponse.json({ error: "Sign in required." }, { status: 401 }) } as const;
  }
  if (session.user.role !== "admin") {
    return { response: NextResponse.json({ error: "Administrator access required." }, { status: 403 }) } as const;
  }
  return { session } as const;
}

/** Parses a JSON object body. Returns null for malformed / non-object bodies. */
export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const badRequest = (message: string) => NextResponse.json({ error: message }, { status: 400 });
export const notFoundJson = (message: string) => NextResponse.json({ error: message }, { status: 404 });

const idSchema = z.union([z.string().trim().min(1).max(100), z.number().int().nonnegative()]);

/** Validates an event identifier coming from the client. */
export function parseEventId(value: unknown): string | number | null {
  const parsed = idSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

/** Ticket count for an RSVP: integer 1..10 (matches the UI stepper limits). */
export function parseTicketsCount(value: unknown): number | null {
  if (value === undefined || value === null) return 1;
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 10 ? value : null;
}

const optionalText = (max: number) => z.string().trim().max(max).optional();
const timeText = z.string().trim().regex(/^\d{2}:\d{2}(:\d{2})?$/);

export const eventSubmissionSchema = z.object({
  title: z.string().trim().min(3).max(120),
  category_id: optionalText(80),
  categorySlug: optionalText(80),
  category: optionalText(120),
  capacity: z.coerce.number().int().min(1).max(1000000).optional(),
  short_description: optionalText(300),
  full_description: optionalText(5000),
  description: optionalText(5000),
  event_date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).refine((d) => !Number.isNaN(Date.parse(d)), "Invalid date"),
  start_time: timeText.optional(),
  end_time: timeText.optional(),
  ticket_type: z.enum(["free", "paid"]).optional(),
  price: z.coerce.number().min(0).max(10000000).optional(),
  city: z.string().trim().min(1).max(60),
  venue_name: z.string().trim().min(1).max(150),
  address: optionalText(250),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  image: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === "" || /^https?:\/\//i.test(v), "Image must be an http(s) URL")
    .optional(),
  organizer_name: optionalText(120),
  organizer_email: z.union([z.literal(""), z.string().trim().email().max(160)]).optional(),
  organizer_phone: optionalText(40)
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(1000)
});

