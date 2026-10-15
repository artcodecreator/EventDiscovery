import type { DefaultSession } from "next-auth";
declare module "next-auth" {
 interface User { strapiToken?: string; role?: string }
 interface Session { strapiToken?: string; user: { id: string; role?: string } & DefaultSession["user"] }
}
declare module "next-auth/jwt" { interface JWT { strapiToken?: string; role?: string } }


