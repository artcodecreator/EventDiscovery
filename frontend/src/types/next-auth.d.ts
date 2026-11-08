declare module "next-auth" {
  export interface DefaultSession {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    expires: string;
  }
  export interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    strapiToken?: string;
    role?: string;
  }
  export interface Session {
    strapiToken?: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
    expires: string;
  }
  export function NextAuth(config: any): {
    handlers: { GET: any; POST: any };
    auth: () => Promise<Session | null>;
    signIn: (provider?: string, options?: any) => Promise<any>;
    signOut: (options?: any) => Promise<any>;
  };
  export default NextAuth;
}

declare module "next-auth/react" {
  export function useSession(): {
    data: {
      user?: {
        id?: string;
        name?: string | null;
        email?: string | null;
        role?: string;
        image?: string | null;
      };
      strapiToken?: string;
      expires?: string;
    } | null;
    status: "authenticated" | "unauthenticated" | "loading";
    update: (data?: any) => Promise<any>;
  };
  export function signIn(provider?: string, options?: any): Promise<any>;
  export function signOut(options?: any): Promise<any>;
  export function SessionProvider(props: { children: any; session?: any }): any;
}

declare module "next-auth/providers/credentials" {
  export default function Credentials(options: any): any;
}

declare module "next-auth/jwt" {
  export interface JWT {
    sub?: string;
    strapiToken?: string;
    role?: string;
    [key: string]: any;
  }
}
