"use server";

import { redirect } from "next/navigation";
import { clearAdminSessionCookie } from "@/lib/auth/admin-session.server";

export async function logoutAdminAction() {
  await clearAdminSessionCookie();
  redirect("/admin/login");
}
