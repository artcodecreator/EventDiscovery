import { NextResponse } from "next/server";
import { z } from "zod";
const registration=z.object({
 username:z.string().trim().min(2).max(80),
 email:z.string().trim().email().max(160),
 password:z.string().min(8).max(128),
 phone:z.string().trim().max(30).optional(),
 city:z.enum(["Lahore","Karachi","Islamabad","Rawalpindi","Peshawar","Faisalabad","Multan","Quetta"]).optional()
});
export async function POST(request:Request){
 const base=process.env.STRAPI_URL;if(!base)return NextResponse.json({error:"Account service is not configured."},{status:503});
 let input;
 try{input=registration.safeParse(await request.json());}catch{return NextResponse.json({error:"Invalid request body."},{status:400});}
 if(!input.success)return NextResponse.json({error:"Please provide a valid name, email, password and city."},{status:400});
 const response=await fetch(`${base}/api/auth/local/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input.data),cache:"no-store"});
 const data=await response.json();return NextResponse.json(data,{status:response.status});
}
