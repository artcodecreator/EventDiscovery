import { factories } from "@strapi/strapi";
const UID = "api::favorite.favorite";
export default factories.createCoreController(UID, ({ strapi }) => ({
  async toggle(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();
    const { eventDocumentId } = ctx.request.body ?? {};
    const event = eventDocumentId && await strapi.documents("api::event.event").findOne({ documentId: eventDocumentId });
    if (!event) return ctx.badRequest("A valid eventDocumentId is required");
    const existing = await strapi.db.query(UID).findOne({ where: { user: { id: user.id }, event: { id: event.id } } });
    if (existing) {
      await strapi.db.query(UID).delete({ where: { id: existing.id } });
      return ctx.send({ isFavorite: false });
    }
    await strapi.db.query(UID).create({ data: { user: user.id, event: event.id } });
    return ctx.send({ isFavorite: true }, 201);
  },
  async mine(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized();
    const data = await strapi.db.query(UID).findMany({ where: { user: { id: user.id } }, populate: { event: { populate: ["category", "coverImage"] } }, orderBy: { createdAt: "desc" } });
    return ctx.send({ data });
  }
}));
