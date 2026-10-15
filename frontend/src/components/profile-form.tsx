"use client";
import { useState } from "react";
import { PasswordForm } from "@/components/password-form";
export function ProfileForm({user}:{user:{username?:string;email?:string;phone?:string;city?:string;bio?:string}}){
 const [message,setMessage]=useState("");
 async function save(form:FormData){
  const response=await fetch("/api/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:form.get("username"),phone:form.get("phone"),city:form.get("city"),bio:form.get("bio")})});
  const data=await response.json();setMessage(response.ok?"Your profile has been updated.":(data.error?.message??"Unable to update profile."));
 }
 return <div><form action={save} className="card border-0 shadow-sm rounded-4 p-4"><h2 className="h4 font-heading mb-3">Account settings</h2><label className="form-label">Name</label><input className="form-control mb-3" name="username" defaultValue={user.username}/><label className="form-label">Email</label><input className="form-control mb-3" value={user.email??""} readOnly/><label className="form-label">Phone</label><input className="form-control mb-3" name="phone" defaultValue={user.phone}/><label className="form-label">City</label><select className="form-select mb-3" name="city" defaultValue={user.city??"Lahore"}>{["Lahore","Karachi","Islamabad","Rawalpindi","Peshawar","Faisalabad","Multan","Quetta"].map(c=><option key={c}>{c}</option>)}</select><label className="form-label">About you</label><textarea className="form-control mb-3" name="bio" rows={3} defaultValue={user.bio}/><button className="btn btn-primary rounded-pill align-self-start px-4">Save changes</button>{message&&<small className="text-secondary mt-2">{message}</small>}</form><PasswordForm/></div>;
}
