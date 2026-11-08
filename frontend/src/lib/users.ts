import { DEMO_USERS } from "@/auth";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: string;
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
    city: "Lahore",
    phone: "+92 321 4455667",
    bio: "Software developer and open-source contributor in Lahore."
  },
  {
    id: "4",
    name: "Hamza Tariq",
    email: "hamza.tariq@gmail.com",
    role: "user",
    city: "Karachi",
    phone: "+92 333 7788990",
    bio: "Running enthusiast & marathon participant."
  },
  {
    id: "5",
    name: "Fatima Noor",
    email: "fatima.noor@lokvirsa.org",
    role: "user",
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
