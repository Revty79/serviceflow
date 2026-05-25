import type {
  NewAdmin,
  NewBusinessSettings,
  NewIntakeQuestion,
  NewService,
} from "../schema";

export type SeedBusiness = Omit<
  NewBusinessSettings,
  "id" | "createdAt" | "updatedAt"
>;

export type SeedService = Omit<
  NewService,
  "id" | "businessId" | "createdAt" | "updatedAt"
>;

export type SeedIntakeQuestion = Omit<
  NewIntakeQuestion,
  "id" | "businessId" | "createdAt" | "updatedAt"
>;

export type SeedAdmin = Omit<
  NewAdmin,
  "id" | "businessId" | "createdAt" | "updatedAt" | "lastLoginAt"
>;

export type SeedProfile = {
  business: SeedBusiness;
  services: SeedService[];
  intakeQuestions: SeedIntakeQuestion[];
  admin: SeedAdmin;
};

export type SeedProfileName = "localops" | "service_business" | "electrician";
