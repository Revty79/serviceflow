import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import { env } from "@/lib/config/env";
import { db } from "../client";
import { admins, businessSettings, intakeQuestions, services } from "../schema";
import { localOpsSeed } from "./localops";

async function upsertLocalOpsTemplate() {
  const existingBusiness = await db.query.businessSettings.findFirst({
    where: eq(businessSettings.slug, localOpsSeed.business.slug),
  });

  let businessId = existingBusiness?.id;

  if (businessId) {
    await db
      .update(businessSettings)
      .set({
        ...localOpsSeed.business,
        updatedAt: new Date(),
      })
      .where(eq(businessSettings.id, businessId));
  } else {
    const [inserted] = await db
      .insert(businessSettings)
      .values(localOpsSeed.business)
      .returning({ id: businessSettings.id });

    businessId = inserted.id;
  }

  if (!businessId) {
    throw new Error("Unable to resolve LocalOps business id during seed.");
  }

  await db.delete(services).where(eq(services.businessId, businessId));
  await db.delete(intakeQuestions).where(eq(intakeQuestions.businessId, businessId));

  await db.insert(services).values(
    localOpsSeed.services.map((service) => ({
      ...service,
      businessId,
    })),
  );

  await db.insert(intakeQuestions).values(
    localOpsSeed.intakeQuestions.map((question) => ({
      ...question,
      businessId,
    })),
  );

  const adminEmail = env.SEED_ADMIN_EMAIL;
  const existingAdmin = await db.query.admins.findFirst({
    where: and(
      eq(admins.businessId, businessId),
      eq(admins.email, adminEmail),
    ),
  });

  const adminValues = {
    ...localOpsSeed.admin,
    email: adminEmail,
    passwordHash: hashSync(env.SEED_ADMIN_PASSWORD, 12),
    updatedAt: new Date(),
  };

  if (existingAdmin) {
    await db.update(admins).set(adminValues).where(eq(admins.id, existingAdmin.id));
  } else {
    await db.insert(admins).values({
      ...adminValues,
      businessId,
    });
  }

  return businessId;
}

async function seed() {
  const businessId = await upsertLocalOpsTemplate();
  console.log(`Seed complete. Active business id: ${businessId}`);
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
