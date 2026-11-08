import { NextResponse } from "next/server";
import { getCategoriesStore, createCategory, updateCategory, deleteCategory, getEvents } from "@/lib/events";
import { requireAdmin, readJsonObject, badRequest, notFoundJson } from "@/lib/api-guards";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().max(80).optional(),
  icon: z.string().trim().max(50).optional(),
  color: z.string().trim().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Must be a valid hex color code").optional(),
  description: z.string().trim().max(500).optional()
});

export async function GET() {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const cats = getCategoriesStore();
  const events = await getEvents({ includePending: true });

  const withCounts = cats.map(c => {
    const eventCount = events.filter(e => e.categorySlug === c.slug || String(e.categoryId) === String(c.id)).length;
    return { ...c, eventCount };
  });

  return NextResponse.json({ data: withCounts });
}

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const body = await readJsonObject(request);
  if (!body) return badRequest("Invalid request body.");

  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return badRequest(`Invalid category details: ${issue ? issue.message : "check required fields"}`);
  }

  const created = await createCategory(parsed.data);
  return NextResponse.json({ success: true, data: created, message: `Category '${created.name}' created successfully!` }, { status: 201 });
}

export async function PATCH(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const body = await readJsonObject(request);
  if (!body || (!body.id && !body.slug)) return badRequest("Category ID or slug required.");

  const target = (body.id || body.slug) as string | number;
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) return badRequest("Invalid update payload.");

  const updated = await updateCategory(target, parsed.data);
  if (!updated) return notFoundJson("Category not found.");

  return NextResponse.json({ success: true, data: updated, message: `Category '${updated.name}' updated successfully!` });
}

export async function DELETE(request: Request) {
  const guard = await requireAdmin();
  if ("response" in guard) return guard.response;

  const url = new URL(request.url);
  const qId = url.searchParams.get("id");
  const qSlug = url.searchParams.get("slug");
  const body = await readJsonObject(request);
  const target = (qId || qSlug || body?.id || body?.slug) as string | number;
  if (!target) return badRequest("Category ID or slug required.");

  const result = await deleteCategory(target);

  if (!result.success) {
    return NextResponse.json({ error: result.error || "Cannot delete category." }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Category deleted successfully." });
}
