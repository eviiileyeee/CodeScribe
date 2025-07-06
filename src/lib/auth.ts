// lib/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

export async function auth() {
  return await getServerSession(authOptions);
}
