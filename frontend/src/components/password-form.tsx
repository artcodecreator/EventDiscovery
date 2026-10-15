"use client";
import { useState } from "react";
export function PasswordForm(){
 const [message,setMessage]=useState("");
 async function change(form:FormData){
  const password=String(form.get("password")??""),confirmation=String(form.get("confirmation")??"");
  if(password!==confirmation){setMessage("The new passwords do not match.");return;}
  const response=await fetch("/api/profile/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:form.get("currentPassword"),password,passwordConfirmation:confirmation})});
  const data=await response.json();setMessage(response.ok?"Your password has been changed.":(data.error?.message??"Could not change the password."));
  if(response.ok)(document.querySelector("#password-form") as HTMLFormElement)?.reset();
 }
 return <form id="password-form" action={change} className="card border-0 shadow-sm rounded-4 p-4 mt-4"><h2 className="h4 font-heading mb-3">Change password</h2><label className="form-label">Current password</label><input className="form-control mb-3" name="currentPassword" type="password" autoComplete="current-password" required/><label className="form-label">New password</label><input className="form-control mb-3" name="password" type="password" minLength={8} autoComplete="new-password" required/><label className="form-label">Confirm new password</label><input className="form-control mb-3" name="confirmation" type="password" minLength={8} autoComplete="new-password" required/><button className="btn btn-outline-primary rounded-pill align-self-start px-4">Update password</button>{message&&<small className="text-secondary mt-2" role="status">{message}</small>}</form>
}
