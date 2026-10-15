import { NextResponse } from "next/server";
import { DEMO_USERS } from "@/auth";

export const initialUsers = [
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

export async function GET() {
  return NextResponse.json({ data: initialUsers });
}
