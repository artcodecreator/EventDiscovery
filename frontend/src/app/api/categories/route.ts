import { NextResponse } from "next/server";
import { auth } from "@/auth";
export async function GET(){
 const session=await auth();if(!session?.strapiToken)return NextResponse.json({error:"Sign in required."},{status:401});
 const base=process.env.STRAPI_URL;if(!base)return NextResponse.json({data:[]});
 const upstream=await fetch(`${base}/api/categories?${new URLSearchParams({"pagination[pageSize]":"100"})}`,{next:{revalidate:300}});
 if(!upstream.ok)return NextResponse.json({data:[]},{status:upstream.status});
 return NextResponse.json(await upstream.json());
}
