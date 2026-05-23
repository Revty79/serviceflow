"use server";

import { compare } from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getActiveBusiness } from "@/lib/business-context";
import { setAdminSessionCookie } from "@/lib/auth/admin-session.server";
import { createAdminSessionToken } from "@/lib/auth/admin-session";
import { db } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";

export type AdminLoginState = {
  message?: string;
};

export async function loginAdminAction(
  _state: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const business = await getActiveBusiness();

  if (!business) {
    return {
      message:
        "Business configuration is missing. Seed SERVICEFLOW_BUSINESS_SLUG before admin sign-in.",
    };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      message: "Email and password are required.",
    };
  }

  const admin = await db.query.admins.findFirst({
    where: and(
      eq(admins.businessId, business.id),
      eq(admins.email, email),
      eq(admins.isActive, true),
    ),
  });

  if (!admin) {
    return {
      message: "Invalid email or password.",
    };
  }

  const isValidPassword = await compare(password, admin.passwordHash);

  if (!isValidPassword) {
    return {
      message: "Invalid email or password.",
    };
  }

  await db
    .update(admins)
    .set({
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(admins.id, admin.id));

  const token = await createAdminSessionToken({
    adminId: admin.id,
    businessId: business.id,
    email: admin.email,
  });

  await setAdminSessionCookie(token);
  redirect("/admin/leads");
}
