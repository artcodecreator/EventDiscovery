import { NextResponse } from "next/server";
import { auth } from "@/auth";
export async function PATCH(request:Request){
 const session=await auth();if(!session?.strapiToken)return NextResponse.json({error:"Sign in required."},{status:401});
 const base=process.env.STRAPI_URL;if(!base)return NextResponse.json({error:"Profile service is unavailable."},{status:503});
 const upstream=await fetch(`${base}/api/users/me/profile`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.strapiToken}`},body:JSON.stringify(await request.json()),cache:"no-store"});
 return NextResponse.json(await upstream.json(),{status:upstream.status});
}
