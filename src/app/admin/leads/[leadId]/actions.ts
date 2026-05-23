"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActiveBusiness } from "@/lib/business-context";
import { db } from "@/lib/db/client";
import { leadNotes, leads, leadStatusEnum } from "@/lib/db/schema";

const updateStatusSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(leadStatusEnum.enumValues),
});

const addNoteSchema = z.object({
  leadId: z.string().uuid(),
  note: z.string().trim().min(1).max(5000),
});

export async function updateLeadStatusAction(formData: FormData) {
  const business = await getActiveBusiness();

  if (!business) {
    return;
  }

  const parsed = updateStatusSchema.safeParse({
    leadId: formData.get("leadId"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return;
  }

  const { leadId, status } = parsed.data;

  await db
    .update(leads)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(and(eq(leads.id, leadId), eq(leads.businessId, business.id)));

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function addLeadNoteAction(formData: FormData) {
  const business = await getActiveBusiness();

  if (!business) {
    return;
  }

  const parsed = addNoteSchema.safeParse({
    leadId: formData.get("leadId"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    return;
  }

  const { leadId, note } = parsed.data;

  const matchingLead = await db.query.leads.findFirst({
    where: and(eq(leads.id, leadId), eq(leads.businessId, business.id)),
    columns: {
      id: true,
    },
  });

  if (!matchingLead) {
    return;
  }

  await db.insert(leadNotes).values({
    leadId,
    note,
    isInternal: true,
  });

  revalidatePath(`/admin/leads/${leadId}`);
}
