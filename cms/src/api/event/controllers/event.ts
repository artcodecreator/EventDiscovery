import { factories } from "@strapi/strapi";
const UID = "api::event.event";
export default factories.createCoreController(UID, ({ strapi }) => ({
 async submit(ctx) {
  const user=ctx.state.user;if(!user)return ctx.unauthorized();
  const input=ctx.request.body?.data??{};
  const allowed=["title","slug","shortDescription","description","venueName","address","city","province","latitude","longitude","eventDate","startTime","endTime","price","isFree","organizerName","organizerEmail","organizerPhone"];
  const data:any=Object.fromEntries(allowed.filter((key)=>input[key]!==undefined).map((key)=>[key,input[key]]));
  const categorySlug=String(input.categorySlug??"");
  const category=await strapi.db.query("api::category.category").findOne({where:{slug:categorySlug}});
  if(!data.title||!data.shortDescription||!data.venueName||!data.eventDate||!data.startTime||!data.city||!category)return ctx.badRequest("Please provide the required event details and a valid category.");
  data.moderationStatus="pending";data.submittedBy=user.id;data.category={documentId:category.documentId};
  const event=await strapi.documents(UID).create({data,status:"draft"});
  return ctx.created({data:{documentId:event.documentId,slug:event.slug,moderationStatus:event.moderationStatus}});
 }
}));

