import { factories } from "@strapi/strapi";
const UID = "api::rsvp.rsvp";
export default factories.createCoreController(UID, ({ strapi }) => ({
  async create(ctx) {
    const user=ctx.state.user;if(!user)return ctx.unauthorized();
    const {eventDocumentId,ticketsCount=1,notes=""}=ctx.request.body??{};
    if(!eventDocumentId)return ctx.badRequest("eventDocumentId is required");
    const event=await strapi.documents("api::event.event").findOne({documentId:eventDocumentId});
    if(!event)return ctx.notFound("Event not found");
    const existing=await strapi.db.query(UID).findOne({where:{user:{id:user.id},event:{id:event.id}}});
    const data={user:user.id,event:event.id,ticketsCount:Math.min(10,Math.max(1,Number(ticketsCount)||1)),notes:String(notes).slice(0,1000),status:"confirmed"};
    const record=existing?await strapi.db.query(UID).update({where:{id:existing.id},data}):await strapi.db.query(UID).create({data});
    return ctx.send({data:{id:record.id,status:record.status,ticketsCount:record.ticketsCount}},existing?200:201);
  },
  async mine(ctx) {
    const user=ctx.state.user;if(!user)return ctx.unauthorized();
    const data=await strapi.db.query(UID).findMany({where:{user:{id:user.id},status:"confirmed"},populate:{event:{populate:["category","coverImage"]}},orderBy:{createdAt:"desc"}});
    return ctx.send({data});
  },
  async cancel(ctx) {
    const user=ctx.state.user;if(!user)return ctx.unauthorized();
    const event=await strapi.documents("api::event.event").findOne({documentId:ctx.params.eventDocumentId});
    if(!event)return ctx.notFound("Event not found");
    const record=await strapi.db.query(UID).findOne({where:{user:{id:user.id},event:{id:event.id}}});
    if(!record)return ctx.notFound("RSVP not found");
    await strapi.db.query(UID).update({where:{id:record.id},data:{status:"cancelled"}});
    return ctx.send({data:{status:"cancelled"}});
  }
}));
