"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { getActiveBusiness } from "@/lib/business-context";
import { db } from "@/lib/db/client";
import { services } from "@/lib/db/schema";

export type ServiceFormState = {
  status?: "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const serviceSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(160),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  summary: z.string().trim().max(600).optional(),
  description: z.string().trim().max(5000).optional(),
  priceLabel: z.string().trim().max(160).optional(),
  sortOrder: z.coerce
    .number()
    .int("Sort order must be a whole number.")
    .min(0, "Sort order must be 0 or higher.")
    .max(9999, "Sort order is too large."),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

const updateServiceSchema = serviceSchema.extend({
  serviceId: z.string().uuid(),
});

const toggleServiceSchema = z.object({
  serviceId: z.string().uuid(),
  nextActive: z.enum(["true", "false"]),
});

function parseBooleanCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function parseOptional(value: string) {
  return value ? value : undefined;
}

function parseServiceFormData(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? "").trim().toLowerCase(),
    summary: parseOptional(String(formData.get("summary") ?? "").trim()),
    description: parseOptional(String(formData.get("description") ?? "").trim()),
    priceLabel: parseOptional(String(formData.get("priceLabel") ?? "").trim()),
    sortOrder: formData.get("sortOrder"),
    isFeatured: parseBooleanCheckbox(formData, "isFeatured"),
    isActive: parseBooleanCheckbox(formData, "isActive"),
  };
}

function flattenZodErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  const flattened = error.flatten().fieldErrors as Record<
    string,
    string[] | undefined
  >;

  for (const [field, errors] of Object.entries(flattened)) {
    if (errors && errors.length > 0) {
      fieldErrors[field] = errors[0];
    }
  }

  return fieldErrors;
}

function revalidateServiceDependentPages() {
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/packages");
  revalidatePath("/request");
  revalidatePath("/admin/services");
}

async function resolveAuthorizedBusiness() {
  const session = await requireAdminSession();
  const business = await getActiveBusiness();

  if (!business || session.businessId !== business.id) {
    return null;
  }

  return business;
}

export async function createServiceAction(
  _state: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const business = await resolveAuthorizedBusiness();

  if (!business) {
    return {
      status: "error",
      message: "Could not resolve active business for this admin session.",
    };
  }

  const parsed = serviceSchema.safeParse(parseServiceFormData(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const existingSlug = await db.query.services.findFirst({
    where: and(
      eq(services.businessId, business.id),
      eq(services.slug, parsed.data.slug),
    ),
    columns: { id: true },
  });

  if (existingSlug) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        slug: "This slug is already in use for another service.",
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      if (parsed.data.isFeatured) {
        await tx
          .update(services)
          .set({
            isFeatured: false,
            updatedAt: new Date(),
          })
          .where(eq(services.businessId, business.id));
      }

      await tx.insert(services).values({
        businessId: business.id,
        name: parsed.data.name,
        slug: parsed.data.slug,
        summary: parsed.data.summary ?? null,
        description: parsed.data.description ?? null,
        priceLabel: parsed.data.priceLabel ?? null,
        sortOrder: parsed.data.sortOrder,
        isFeatured: parsed.data.isFeatured,
        isActive: parsed.data.isActive,
      });
    });
  } catch (error) {
    console.error("Failed to create service:", error);
    return {
      status: "error",
      message: "Could not create service right now. Please try again.",
    };
  }

  revalidateServiceDependentPages();

  return {
    status: "success",
    message: "Service created successfully.",
  };
}

export async function updateServiceAction(
  _state: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const business = await resolveAuthorizedBusiness();

  if (!business) {
    return {
      status: "error",
      message: "Could not resolve active business for this admin session.",
    };
  }

  const parsed = updateServiceSchema.safeParse({
    ...parseServiceFormData(formData),
    serviceId: String(formData.get("serviceId") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const { serviceId, ...values } = parsed.data;

  const existingService = await db.query.services.findFirst({
    where: and(eq(services.id, serviceId), eq(services.businessId, business.id)),
    columns: { id: true },
  });

  if (!existingService) {
    return {
      status: "error",
      message: "Service not found for this business.",
    };
  }

  const slugConflict = await db.query.services.findFirst({
    where: and(
      eq(services.businessId, business.id),
      eq(services.slug, values.slug),
      ne(services.id, serviceId),
    ),
    columns: { id: true },
  });

  if (slugConflict) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        slug: "This slug is already in use for another service.",
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      if (values.isFeatured) {
        await tx
          .update(services)
          .set({
            isFeatured: false,
            updatedAt: new Date(),
          })
          .where(and(eq(services.businessId, business.id), ne(services.id, serviceId)));
      }

      await tx
        .update(services)
        .set({
          name: values.name,
          slug: values.slug,
          summary: values.summary ?? null,
          description: values.description ?? null,
          priceLabel: values.priceLabel ?? null,
          sortOrder: values.sortOrder,
          isFeatured: values.isFeatured,
          isActive: values.isActive,
          updatedAt: new Date(),
        })
        .where(and(eq(services.id, serviceId), eq(services.businessId, business.id)));
    });
  } catch (error) {
    console.error("Failed to update service:", error);
    return {
      status: "error",
      message: "Could not update service right now. Please try again.",
    };
  }

  revalidateServiceDependentPages();

  return {
    status: "success",
    message: "Service updated successfully.",
  };
}

export async function toggleServiceActiveAction(formData: FormData) {
  const business = await resolveAuthorizedBusiness();

  if (!business) {
    return;
  }

  const parsed = toggleServiceSchema.safeParse({
    serviceId: String(formData.get("serviceId") ?? ""),
    nextActive: String(formData.get("nextActive") ?? ""),
  });

  if (!parsed.success) {
    return;
  }

  const isActive = parsed.data.nextActive === "true";

  await db
    .update(services)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(services.id, parsed.data.serviceId),
        eq(services.businessId, business.id),
      ),
    );

  revalidateServiceDependentPages();
}
