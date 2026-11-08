import { NextResponse } from "next/server";
import { auth } from "@/auth";
export async function POST(request:Request){
 const session=await auth();if(!session?.strapiToken)return NextResponse.json({error:"Sign in required."},{status:401});
 const base=process.env.STRAPI_URL;if(!base)return NextResponse.json({error:"Account service is unavailable."},{status:503});
 let body;try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request body."},{status:400});}
 try{
  const upstream=await fetch(`${base}/api/auth/change-password`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.strapiToken}`},body:JSON.stringify(body),cache:"no-store"});
  return NextResponse.json(await upstream.json(),{status:upstream.status});
 }catch{
  return NextResponse.json({error:"Account service is temporarily unavailable."},{status:503});
 }
}
