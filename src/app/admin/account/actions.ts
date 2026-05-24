"use server";

import { compare, hash } from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { db } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";

export type AdminAccountPasswordState = {
  status?: "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters."),
  confirmNewPassword: z.string().min(1, "Please confirm your new password."),
});

export async function updateAdminPasswordAction(
  _state: AdminAccountPasswordState,
  formData: FormData,
): Promise<AdminAccountPasswordState> {
  const session = await requireAdminSession();

  const parsed = updatePasswordSchema.safeParse({
    currentPassword: String(formData.get("currentPassword") ?? ""),
    newPassword: String(formData.get("newPassword") ?? ""),
    confirmNewPassword: String(formData.get("confirmNewPassword") ?? ""),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    const flattened = parsed.error.flatten().fieldErrors;

    for (const [field, errors] of Object.entries(flattened)) {
      if (errors?.[0]) {
        fieldErrors[field] = errors[0];
      }
    }

    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const { currentPassword, newPassword, confirmNewPassword } = parsed.data;

  if (newPassword !== confirmNewPassword) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        confirmNewPassword: "New password confirmation does not match.",
      },
    };
  }

  if (newPassword === currentPassword) {
    return {
      status: "error",
      message: "Please choose a different new password.",
      fieldErrors: {
        newPassword: "New password must be different from current password.",
      },
    };
  }

  const admin = await db.query.admins.findFirst({
    where: and(
      eq(admins.id, session.adminId),
      eq(admins.businessId, session.businessId),
      eq(admins.isActive, true),
    ),
  });

  if (!admin) {
    return {
      status: "error",
      message: "Admin account not found. Please sign in again.",
    };
  }

  const currentPasswordMatches = await compare(
    currentPassword,
    admin.passwordHash,
  );

  if (!currentPasswordMatches) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        currentPassword: "Current password is incorrect.",
      },
    };
  }

  const passwordHash = await hash(newPassword, 12);

  await db
    .update(admins)
    .set({
      passwordHash,
      updatedAt: new Date(),
    })
    .where(eq(admins.id, admin.id));

  revalidatePath("/admin/account");

  return {
    status: "success",
    message: "Password updated successfully.",
  };
}
