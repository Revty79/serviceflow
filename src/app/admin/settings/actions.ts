"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { getActiveBusiness } from "@/lib/business-context";
import { db } from "@/lib/db/client";
import { businessSettings } from "@/lib/db/schema";

export type BusinessSettingsFormState = {
  status?: "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const updateBusinessSettingsSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is required.").max(200),
  phone: z.string().trim().min(7, "Phone is required.").max(50),
  email: z.string().trim().email("Enter a valid business email."),
  serviceArea: z.string().trim().min(2, "Service area is required.").max(300),
  primaryCtaText: z
    .string()
    .trim()
    .min(3, "Primary CTA text is required.")
    .max(200),
  secondaryCtaText: z.string().trim().max(200).optional(),
  brandPrimary: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex color."),
  brandSecondary: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex color."),
  brandAccent: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Use a valid hex color."),
  timezone: z.string().trim().min(2, "Timezone is required.").max(100),
  notifyEmails: z.string().trim().max(2000).optional(),
});

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function toOptional(value: string) {
  return value ? value : undefined;
}

export async function updateBusinessSettingsAction(
  _state: BusinessSettingsFormState,
  formData: FormData,
): Promise<BusinessSettingsFormState> {
  const session = await requireAdminSession();
  const activeBusiness = await getActiveBusiness();

  if (!activeBusiness || session.businessId !== activeBusiness.id) {
    return {
      status: "error",
      message: "Active business configuration was not found for this admin.",
    };
  }

  const parsed = updateBusinessSettingsSchema.safeParse({
    businessName: getStringValue(formData, "businessName"),
    phone: getStringValue(formData, "phone"),
    email: getStringValue(formData, "email"),
    serviceArea: getStringValue(formData, "serviceArea"),
    primaryCtaText: getStringValue(formData, "primaryCtaText"),
    secondaryCtaText: toOptional(getStringValue(formData, "secondaryCtaText")),
    brandPrimary: getStringValue(formData, "brandPrimary"),
    brandSecondary: getStringValue(formData, "brandSecondary"),
    brandAccent: getStringValue(formData, "brandAccent"),
    timezone: getStringValue(formData, "timezone"),
    notifyEmails: toOptional(getStringValue(formData, "notifyEmails")),
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

  const notifyEmailList = (parsed.data.notifyEmails ?? "")
    .split(/[\n,;]/)
    .map((value) => value.trim())
    .filter(Boolean);

  if (notifyEmailList.length) {
    const emailSchema = z.string().email();
    const invalidEmail = notifyEmailList.find(
      (value) => !emailSchema.safeParse(value).success,
    );

    if (invalidEmail) {
      return {
        status: "error",
        message: "Please correct the highlighted fields.",
        fieldErrors: {
          notifyEmails: `Invalid notify email: ${invalidEmail}`,
        },
      };
    }
  }

  const contactRoutingBase =
    (activeBusiness.contactRouting as Record<string, unknown> | null) ?? {};
  const nextContactRouting: Record<string, unknown> = { ...contactRoutingBase };

  if (notifyEmailList.length) {
    nextContactRouting.notifyEmails = notifyEmailList;
  } else {
    delete nextContactRouting.notifyEmails;
  }

  const hasContactRouting = Object.keys(nextContactRouting).length > 0;

  try {
    await db
      .update(businessSettings)
      .set({
        businessName: parsed.data.businessName,
        phone: parsed.data.phone,
        email: parsed.data.email.toLowerCase(),
        serviceArea: parsed.data.serviceArea,
        primaryCtaText: parsed.data.primaryCtaText,
        secondaryCtaText: parsed.data.secondaryCtaText ?? null,
        brandPrimary: parsed.data.brandPrimary,
        brandSecondary: parsed.data.brandSecondary,
        brandAccent: parsed.data.brandAccent,
        timezone: parsed.data.timezone,
        contactRouting: hasContactRouting ? nextContactRouting : null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(businessSettings.id, activeBusiness.id),
          eq(businessSettings.slug, activeBusiness.slug),
        ),
      );
  } catch (error) {
    console.error("Failed to update business settings:", error);
    return {
      status: "error",
      message: "Could not save settings right now. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/request");
  revalidatePath("/services");
  revalidatePath("/packages");
  revalidatePath("/thank-you");
  revalidatePath("/admin/settings");

  return {
    status: "success",
    message: "Business settings updated successfully.",
  };
}
