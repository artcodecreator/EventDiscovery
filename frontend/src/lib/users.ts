import { DEMO_USERS } from "@/auth";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: "active" | "suspended";
  city: string;
  phone: string;
  bio: string;
};

const allUsers = [
  ...DEMO_USERS,
  {
    id: "3",
    name: "Zainab Malik",
    email: "zainab.malik@devs.pk",
    role: "user",
    status: "active" as const,
    city: "Lahore",
    phone: "+92 321 4455667",
    bio: "Software developer and open-source contributor in Lahore."
  },
  {
    id: "4",
    name: "Hamza Tariq",
    email: "hamza.tariq@gmail.com",
    role: "user",
    status: "active" as const,
    city: "Karachi",
    phone: "+92 333 7788990",
    bio: "Running enthusiast & marathon participant."
  },
  {
    id: "5",
    name: "Fatima Noor",
    email: "fatima.noor@lokvirsa.org",
    role: "user",
    status: "active" as const,
    city: "Islamabad",
    phone: "+92 301 9988776",
    bio: "Heritage art and culture volunteer."
  }
];

declare global {
  var __USERS_STORE__: PublicUser[] | undefined;
}

export function getUsersStore(): PublicUser[] {
  if (!globalThis.__USERS_STORE__) {
    globalThis.__USERS_STORE__ = allUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: ((u as any).status || "active") as "active" | "suspended",
      city: u.city,
      phone: u.phone,
      bio: u.bio
    }));
  }
  return globalThis.__USERS_STORE__;
}

// Never expose credentials: passwords are stripped before any user data leaves the server.
export const initialUsers: PublicUser[] = getUsersStore();

export function updateUserProfile(identifier: string, data: Partial<PublicUser>): PublicUser | null {
  const users = getUsersStore();
  const user = users.find(u => u.id === identifier || u.email.toLowerCase() === identifier.toLowerCase());
  if (!user) return null;
  if (data.name) user.name = data.name;
  if (data.city) user.city = data.city;
  if (data.phone) user.phone = data.phone;
  if (data.bio !== undefined) user.bio = data.bio;
  return user;
}

export function updateUserRoleStatus(id: string, updates: { role?: "user" | "admin"; status?: "active" | "suspended" }): PublicUser | null {
  const users = getUsersStore();
  const user = users.find(u => u.id === id);
  if (!user) return null;
  // Prevent demoting the super administrator account
  if (user.email === "admin@eventdiscovery.pk" && updates.role === "user") {
    throw new Error("Super Administrator role cannot be demoted.");
  }
  if (updates.role) user.role = updates.role;
  if (updates.status) user.status = updates.status;
  return user;
}

export function deleteUser(id: string): boolean {
  const users = getUsersStore();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return false;
  if (users[idx].email === "admin@eventdiscovery.pk") {
    throw new Error("Super Administrator account cannot be deleted.");
  }
  users.splice(idx, 1);
  return true;
}
