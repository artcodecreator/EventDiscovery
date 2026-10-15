import type { Core } from "@strapi/strapi";
const categories = [
  ["Technology & Hackathons","technology","#06b6d4","fa-laptop-code"],["Music & Qawwali Nights","music","#8b5cf6","fa-music"],["Sports & Marathon Runs","sports","#10b981","fa-running"],["Art, Culture & Heritage","art-culture","#ec4899","fa-palette"],["Food Street & Chai Fests","food-drink","#f59e0b","fa-utensils"],["Community & Green Drives","community","#3b82f6","fa-hands-helping"],["Health, Yoga & Wellness","health-wellness","#14b8a6","fa-spa"]
];
const events = [
 {title:"Pakistan Tech Summit & AI Conclave 2026",slug:"pakistan-tech-summit-ai-conclave-2026",shortDescription:"Meet Pakistan’s builders, researchers and founders for a full day exploring AI and technology.",imageUrl:"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80",venueName:"Expo Centre Lahore",address:"1-A Abdul Haque Road, Johar Town",city:"Lahore",province:"Punjab",latitude:31.4676,longitude:74.2662,eventDate:"2026-11-18",startTime:"09:00:00",endTime:"18:00:00",price:3500,isFree:false,organizerName:"Pakistan Software Houses Association",featured:true,categorySlug:"technology"},
 {title:"Lahore Sufi & Indie Music Fusion Night",slug:"lahore-sufi-indie-music-fusion-night",shortDescription:"An open-air evening of Sufi poetry, indie beats and traditional sitar harmonies.",imageUrl:"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",venueName:"Alhamra Open Air Cultural Complex",address:"Mall Road",city:"Lahore",province:"Punjab",latitude:31.558,longitude:74.327,eventDate:"2026-11-24",startTime:"19:00:00",endTime:"23:00:00",price:2000,isFree:false,organizerName:"Lahore Heritage & Cultural Arts Society",featured:true,categorySlug:"music"},
 {title:"Karachi Coastal Half Marathon & 10K Peace Run",slug:"karachi-coastal-half-marathon",shortDescription:"Run beside the Arabian Sea with local runners, timing chips, finisher medals and breakfast.",imageUrl:"https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&auto=format&fit=crop&q=80",venueName:"Sea View Promenade",address:"Beach Avenue, DHA Phase 8",city:"Karachi",province:"Sindh",latitude:24.7892,longitude:67.0611,eventDate:"2026-12-02",startTime:"06:00:00",endTime:"11:00:00",price:1200,isFree:false,organizerName:"Karachi Coastal Athletics Guild",featured:true,categorySlug:"sports"},
 {title:"Karachi Eat Food & Chai Carnival",slug:"karachi-eat-food-chai-carnival",shortDescription:"Discover local food makers, Karachi favorites, matka chai and live acoustic music by the sea.",imageUrl:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80",venueName:"Beach View Park, Clifton",address:"Marine Promenade, Clifton",city:"Karachi",province:"Sindh",latitude:24.8143,longitude:67.0275,eventDate:"2026-12-08",startTime:"12:00:00",endTime:"23:00:00",price:600,isFree:false,organizerName:"CKO Events & Street Food Guild",featured:false,categorySlug:"food-drink"},
 {title:"Pakistan Heritage, Truck Art & Calligraphy Expo",slug:"pakistan-heritage-truck-art-expo",shortDescription:"A colorful celebration of truck art, classical calligraphy and craft traditions.",imageUrl:"https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80",venueName:"Lok Virsa National Cultural Museum",address:"Garden Avenue, Shakarparian",city:"Islamabad",province:"ICT",latitude:33.6938,longitude:73.0673,eventDate:"2026-12-15",startTime:"10:00:00",endTime:"20:00:00",price:300,isFree:false,organizerName:"National Heritage & Culture Division",featured:true,categorySlug:"art-culture"},
 {title:"Clean & Green Margalla Hills Eco Drive",slug:"clean-green-margalla-eco-drive",shortDescription:"Join local volunteers to plant indigenous trees and care for Margalla Hills trails.",imageUrl:"https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&auto=format&fit=crop&q=80",venueName:"Fatima Jinnah Park & Trail 3",address:"Margalla Road",city:"Islamabad",province:"ICT",latitude:33.7077,longitude:73.0188,eventDate:"2026-12-22",startTime:"07:30:00",endTime:"12:30:00",price:0,isFree:true,organizerName:"Green Pakistan Youth Climate Alliance",featured:false,categorySlug:"community"},
 {title:"Mindful Pakistan: Yoga & Wellness Summit",slug:"mindful-pakistan-wellness-summit",shortDescription:"A restorative morning of yoga, breathwork and practical mental wellness conversations.",imageUrl:"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80",venueName:"Jinnah Convention Centre Gardens",address:"Club Road",city:"Islamabad",province:"ICT",latitude:33.7144,longitude:73.1118,eventDate:"2027-01-03",startTime:"08:30:00",endTime:"13:00:00",price:1500,isFree:false,organizerName:"Serenity Wellness Pakistan",featured:false,categorySlug:"health-wellness"},
 {title:"National AI & Web3 Hackathon Pakistan",slug:"national-ai-web3-hackathon-pakistan",shortDescription:"Build practical AI and FinTech projects alongside teams, mentors and Pakistan’s developer community.",imageUrl:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80",venueName:"NUST Centre for Innovation",address:"NUST Main Campus, Sector H-12",city:"Islamabad",province:"ICT",latitude:33.6428,longitude:72.9904,eventDate:"2027-01-06",startTime:"16:00:00",endTime:"21:00:00",price:0,isFree:true,organizerName:"DevNation Pakistan",featured:true,categorySlug:"technology"}
];
async function grant(strapi:Core.Strapi, role:any, actions:string[]) {
 if(!role)return;
 for(const action of actions){
  const found=await strapi.db.query("plugin::users-permissions.permission").findOne({where:{action,role:{id:role.id}}});
  if(!found)await strapi.db.query("plugin::users-permissions.permission").create({data:{action,role:role.id}});
 }
}
export default {
 register({strapi}:{strapi:Core.Strapi}) {},
 async bootstrap({strapi}:{strapi:Core.Strapi}) {
  const categoryDocs=new Map<string,any>();
  for(const [name,slug,color,icon] of categories){
   let item=await strapi.db.query("api::category.category").findOne({where:{slug}});
   if(!item)item=await strapi.documents("api::category.category").create({data:{name,slug,color,icon}});
   categoryDocs.set(slug,item);
  }
  for(const event of events){
   const exists=await strapi.db.query("api::event.event").findOne({where:{slug:event.slug}});
   if(exists)continue;
   const {categorySlug,...data}=event,category=categoryDocs.get(categorySlug);
   await strapi.documents("api::event.event").create({data:{...data,category:{documentId:category.documentId},moderationStatus:"approved"} as any,status:"published"});
  }
  const roles=await strapi.db.query("plugin::users-permissions.role").findMany();
  const publicRole=roles.find((r:any)=>r.type==="public");
  const authenticatedRole=roles.find((r:any)=>r.type==="authenticated");
  await grant(strapi,publicRole,["api::event.event.find","api::event.event.findOne","api::category.category.find","api::category.category.findOne","api::review.review.find"]);
  await grant(strapi,authenticatedRole,["api::rsvp.rsvp.create","api::rsvp.rsvp.mine","api::rsvp.rsvp.cancel","api::favorite.favorite.toggle","api::favorite.favorite.mine","api::event.event.submit","api::review.review.create","plugin::users-permissions.user.me","plugin::users-permissions.user.updateProfile","plugin::users-permissions.auth.changePassword"]);
 }
};




