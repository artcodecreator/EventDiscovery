"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
export function ReviewForm({eventDocumentId}:{eventDocumentId?:string}){
 const {data:session}=useSession();const [message,setMessage]=useState("");
 async function submit(form:FormData){
  if(!eventDocumentId){setMessage("Reviews are available after the CMS is connected.");return;}
  const response=await fetch("/api/reviews",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({eventDocumentId,rating:Number(form.get("rating")),comment:form.get("comment")})});
  const data=await response.json();setMessage(response.ok?"Thanks for sharing your review.":(data.error?.message??data.message??"Could not submit your review."));
 }
 if(!session?.user)return <p className="small text-secondary">Please <Link href="/login">sign in</Link> to leave a review.</p>;
 return <form action={submit} className="card border-0 bg-light p-3 rounded-4"><strong className="mb-2">Share your experience</strong><div className="row g-2"><div className="col-sm-3"><select className="form-select" name="rating" aria-label="Rating">{[5,4,3,2,1].map(n=><option key={n} value={n}>{n} stars</option>)}</select></div><div className="col-sm-7"><input className="form-control" name="comment" minLength={3} maxLength={3000} placeholder="Write a short review" required/></div><div className="col-sm-2"><button className="btn btn-primary w-100">Post</button></div></div>{message&&<small className="text-secondary mt-2">{message}</small>}</form>;
}
