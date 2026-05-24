import "dotenv/config";
import { and, eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import { env } from "@/lib/config/env";
import { db } from "../client";
import { admins, businessSettings, intakeQuestions, services } from "../schema";
import { localOpsSeed } from "./localops";

async function upsertLocalOpsTemplate() {
  const resetBusiness = env.RESET_SEEDED_BUSINESS;
  const resetServices = env.RESET_SEEDED_SERVICES;
  const resetIntakeQuestions = env.RESET_SEEDED_INTAKE_QUESTIONS;
  const resetSeedAdminPassword = env.RESET_SEED_ADMIN_PASSWORD;

  const existingBusiness = await db.query.businessSettings.findFirst({
    where: eq(businessSettings.slug, localOpsSeed.business.slug),
  });

  let businessId = existingBusiness?.id;

  if (businessId) {
    if (resetBusiness) {
      await db
        .update(businessSettings)
        .set({
          ...localOpsSeed.business,
          updatedAt: new Date(),
        })
        .where(eq(businessSettings.id, businessId));
      console.log("Reset seeded business_settings from seed defaults.");
    } else {
      console.log("Preserved existing business_settings (reset flag is false).");
    }
  } else {
    const [inserted] = await db
      .insert(businessSettings)
      .values(localOpsSeed.business)
      .returning({ id: businessSettings.id });

    businessId = inserted.id;
    console.log("Created missing business_settings record from seed defaults.");
  }

  if (!businessId) {
    throw new Error("Unable to resolve LocalOps business id during seed.");
  }

  if (resetServices) {
    await db.delete(services).where(eq(services.businessId, businessId));
    await db.insert(services).values(
      localOpsSeed.services.map((service) => ({
        ...service,
        businessId,
      })),
    );
    console.log("Reset seeded services from seed defaults.");
  } else {
    const existingServices = await db.query.services.findMany({
      where: eq(services.businessId, businessId),
      columns: {
        slug: true,
      },
    });

    const existingServiceSlugs = new Set(existingServices.map((service) => service.slug));
    const missingServices = localOpsSeed.services.filter(
      (service) => !existingServiceSlugs.has(service.slug),
    );

    if (missingServices.length) {
      await db.insert(services).values(
        missingServices.map((service) => ({
          ...service,
          businessId,
        })),
      );
      console.log(`Created ${missingServices.length} missing seeded service records.`);
    } else {
      console.log("Preserved existing services (no missing seeded records).");
    }
  }

  if (resetIntakeQuestions) {
    await db.delete(intakeQuestions).where(eq(intakeQuestions.businessId, businessId));
    await db.insert(intakeQuestions).values(
      localOpsSeed.intakeQuestions.map((question) => ({
        ...question,
        businessId,
      })),
    );
    console.log("Reset seeded intake_questions from seed defaults.");
  } else {
    const existingQuestions = await db.query.intakeQuestions.findMany({
      where: eq(intakeQuestions.businessId, businessId),
      columns: {
        fieldKey: true,
      },
    });

    const existingFieldKeys = new Set(
      existingQuestions.map((question) => question.fieldKey),
    );
    const missingQuestions = localOpsSeed.intakeQuestions.filter(
      (question) => !existingFieldKeys.has(question.fieldKey),
    );

    if (missingQuestions.length) {
      await db.insert(intakeQuestions).values(
        missingQuestions.map((question) => ({
          ...question,
          businessId,
        })),
      );
      console.log(
        `Created ${missingQuestions.length} missing seeded intake question records.`,
      );
    } else {
      console.log("Preserved existing intake_questions (no missing seeded records).");
    }
  }

  const adminEmail = env.SEED_ADMIN_EMAIL.toLowerCase();
  const existingAdmin = await db.query.admins.findFirst({
    where: and(
      eq(admins.businessId, businessId),
      eq(admins.email, adminEmail),
    ),
  });

  if (existingAdmin) {
    if (resetSeedAdminPassword) {
      await db
        .update(admins)
        .set({
          passwordHash: hashSync(env.SEED_ADMIN_PASSWORD, 12),
          updatedAt: new Date(),
        })
        .where(eq(admins.id, existingAdmin.id));
      console.log("Reset seeded admin password because reset flag is true.");
    } else {
      console.log("Preserved existing seeded admin password (reset flag is false).");
    }
  } else {
    await db.insert(admins).values({
      name: localOpsSeed.admin.name,
      email: adminEmail,
      passwordHash: hashSync(env.SEED_ADMIN_PASSWORD, 12),
      role: localOpsSeed.admin.role,
      isActive: localOpsSeed.admin.isActive,
      businessId,
    });
    console.log("Created missing seed admin account.");
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
