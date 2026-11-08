import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateUserProfile } from "@/lib/users";
import { readJsonObject, badRequest } from "@/lib/api-guards";

async function handleProfileUpdate(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const body = await readJsonObject(request);
  if (!body) return badRequest("Invalid request body.");

  const base = process.env.STRAPI_URL;
  if (base && session.strapiToken && session.strapiToken !== "demo-jwt-token") {
    try {
      const upstream = await fetch(`${base}/api/users/me/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.strapiToken}`
        },
        body: JSON.stringify(body),
        cache: "no-store"
      });
      if (upstream.ok) {
        return NextResponse.json(await upstream.json(), { status: upstream.status });
      }
    } catch {
      // fallback
    }
  }

  const updated = updateUserProfile(session.user.id || session.user.email || "1", body as any);
  return NextResponse.json({
    data: updated,
    message: "Profile updated successfully! 🇵🇰"
  });
}

export async function POST(request: Request) {
  return handleProfileUpdate(request);
}

export async function PATCH(request: Request) {
  return handleProfileUpdate(request);
}
