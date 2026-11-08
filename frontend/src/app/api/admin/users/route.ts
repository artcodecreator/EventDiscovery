import { NextResponse } from "next/server";
import { getUsersStore, updateUserRoleStatus, deleteUser } from "@/lib/users";
import { requireAdmin, readJsonObject, badRequest, notFoundJson } from "@/lib/api-guards";

export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;
  return NextResponse.json({ data: getUsersStore() });
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const body = await readJsonObject(request);
  if (!body || !body.id) return badRequest("User ID required.");

  try {
    const updated = updateUserRoleStatus(String(body.id), {
      role: body.role as "user" | "admin" | undefined,
      status: body.status as "active" | "suspended" | undefined
    });
    if (!updated) return notFoundJson("User not found.");
    return NextResponse.json({ success: true, data: updated, message: `User '${updated.name}' updated successfully.` });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to update user." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const url = new URL(request.url);
  const qId = url.searchParams.get("id");
  const body = await readJsonObject(request);
  const id = qId || body?.id;
  if (!id) return badRequest("User ID required.");

  try {
    const success = deleteUser(String(id));
    if (!success) return notFoundJson("User not found.");
    return NextResponse.json({ success: true, message: "User account deleted successfully." });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to delete user." }, { status: 400 });
  }
}
