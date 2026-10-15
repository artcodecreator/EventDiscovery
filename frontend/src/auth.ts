import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const DEMO_USERS = [
  {
    id: "1",
    name: "Ahmed Khan",
    email: "ahmed.khan@eventdiscovery.pk",
    password: "pakistan2026",
    role: "user",
    city: "Lahore",
    phone: "+92 300 8472911",
    bio: "Active Pakistani tech community enthusiast and cultural event attendee."
  },
  {
    id: "2",
    name: "Super Administrator",
    email: "admin@eventdiscovery.pk",
    password: "pakistan2026",
    role: "admin",
    city: "Islamabad",
    phone: "+92 51 9200000",
    bio: "EventDiscovery Pakistan Platform Super Administrator."
  }
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "EventDiscovery",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Try Strapi backend first if available
        const base = process.env.STRAPI_URL;
        if (base) {
          try {
            const response = await fetch(`${base}/api/auth/local`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ identifier: email, password }),
              cache: "no-store"
            });
            if (response.ok) {
              const data = await response.json();
              const user = data.user;
              return {
                id: String(user.id),
                name: user.username || user.name || "User",
                email: user.email,
                strapiToken: data.jwt,
                role: user.siteRole ?? (user.email === "admin@eventdiscovery.pk" ? "admin" : "user")
              };
            }
          } catch {
            // fallback to demo users
          }
        }

        // Demo user check fallback
        const demo = DEMO_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (demo) {
          return {
            id: demo.id,
            name: demo.name,
            email: demo.email,
            strapiToken: "demo-jwt-token",
            role: demo.role
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.strapiToken = (user as any).strapiToken;
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      session.strapiToken = typeof token.strapiToken === "string" ? token.strapiToken : undefined;
      session.user.id = token.sub ?? "";
      session.user.role = typeof token.role === "string" ? token.role : undefined;
      return session;
    }
  },
  pages: { signIn: "/login" }
});
