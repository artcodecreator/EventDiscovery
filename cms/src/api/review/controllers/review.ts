import { factories } from "@strapi/strapi";
const UID="api::review.review";
export default factories.createCoreController(UID,({strapi})=>({
 async create(ctx){
  const user=ctx.state.user;if(!user)return ctx.unauthorized();
  const {eventDocumentId,rating,comment}=ctx.request.body??{};
  const event=eventDocumentId&&await strapi.documents("api::event.event").findOne({documentId:eventDocumentId});
  const score=Number(rating),text=String(comment??"").trim().slice(0,3000);
  if(!event||!Number.isInteger(score)||score<1||score>5||text.length<3)return ctx.badRequest("A valid event, rating from 1 to 5, and review are required.");
  const existing=await strapi.db.query(UID).findOne({where:{user:{id:user.id},event:{id:event.id}}});
  const data={user:user.id,event:event.id,rating:score,comment:text};
  const review=existing?await strapi.db.query(UID).update({where:{id:existing.id},data}):await strapi.db.query(UID).create({data});
  return ctx.send({data:{id:review.id,rating:review.rating,comment:review.comment}},existing?200:201);
 }
}));
