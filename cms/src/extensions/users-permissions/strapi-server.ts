export default (plugin:any) => {
  const attributes=plugin.contentTypes.user.schema.attributes;
  attributes.phone={type:"string"};
  attributes.city={type:"string"};
  attributes.bio={type:"text"};
  attributes.siteRole={type:"enumeration",enum:["user","admin"],default:"user"};

  plugin.controllers.user.updateProfile=async(ctx:any)=>{
    const current=ctx.state.user;
    if(!current)return ctx.unauthorized();
    const body=ctx.request.body??{};
    const profile=Object.fromEntries(["username","phone","city","bio"].filter((key)=>body[key]!==undefined).map((key)=>[key,String(body[key]).slice(0,key==="bio"?1000:160)]));
    if(!Object.keys(profile).length)return ctx.badRequest("Provide at least one profile field.");
    const updated=await plugin.services.user.edit(current.id,profile);
    return ctx.send({user:{id:updated.id,username:updated.username,email:updated.email,phone:updated.phone,city:updated.city,bio:updated.bio,siteRole:updated.siteRole}});
  };
  plugin.routes["content-api"].routes.push({method:"PATCH",path:"/users/me/profile",handler:"user.updateProfile",config:{prefix:"",policies:[]}});
  return plugin;
};


