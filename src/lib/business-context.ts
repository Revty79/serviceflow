import { and, asc, eq } from "drizzle-orm";
import { env } from "@/lib/config/env";
import { db } from "@/lib/db/client";
import { businessSettings, intakeQuestions, services } from "@/lib/db/schema";

export async function getActiveBusiness() {
  return db.query.businessSettings.findFirst({
    where: and(
      eq(businessSettings.slug, env.SERVICEFLOW_BUSINESS_SLUG),
      eq(businessSettings.isActive, true),
    ),
  });
}

export async function getActiveBusinessContext() {
  const business = await getActiveBusiness();

  if (!business) {
    return null;
  }

  const [activeServices, activeQuestions] = await Promise.all([
    db.query.services.findMany({
      where: and(
        eq(services.businessId, business.id),
        eq(services.isActive, true),
      ),
      orderBy: [asc(services.sortOrder)],
    }),
    db.query.intakeQuestions.findMany({
      where: and(
        eq(intakeQuestions.businessId, business.id),
        eq(intakeQuestions.isActive, true),
      ),
      orderBy: [asc(intakeQuestions.sortOrder)],
    }),
  ]);

  return {
    business,
    services: activeServices,
    intakeQuestions: activeQuestions,
  };
}
