import type {
  NewAdmin,
  NewBusinessSettings,
  NewIntakeQuestion,
  NewService,
} from "../schema";

type SeedBusiness = Omit<NewBusinessSettings, "id" | "createdAt" | "updatedAt">;
type SeedService = Omit<
  NewService,
  "id" | "businessId" | "createdAt" | "updatedAt"
>;
type SeedIntakeQuestion = Omit<
  NewIntakeQuestion,
  "id" | "businessId" | "createdAt" | "updatedAt"
>;
type SeedAdmin = Omit<
  NewAdmin,
  "id" | "businessId" | "createdAt" | "updatedAt" | "lastLoginAt"
>;

export const localOpsSeed: {
  business: SeedBusiness;
  services: SeedService[];
  intakeQuestions: SeedIntakeQuestion[];
  admin: SeedAdmin;
} = {
  business: {
    slug: "localops-systems",
    mode: "localops",
    businessName: "LocalOps Systems",
    phone: "(720) 555-0191",
    email: "hello@localopssystems.com",
    serviceArea: "Denver Metro and remote engagements",
    primaryCtaText: "Request a Free Business Systems Audit",
    secondaryCtaText: "Book a Consultation",
    brandPrimary: "#0f766e",
    brandSecondary: "#f59e0b",
    brandAccent: "#0f172a",
    timezone: "America/Denver",
    branding: {
      logoType: "wordmark",
      tone: "helpful, practical, execution-focused",
    },
    contactRouting: {
      notifyEmails: ["hello@localopssystems.com"],
    },
    isActive: true,
  },
  services: [
    {
      name: "Starter Systems Cleanup",
      slug: "starter-systems-cleanup",
      summary: "Fix lead handling, quoting, and follow-up basics in 2 weeks.",
      description:
        "For small local businesses that need a fast operational reset and a clean pipeline.",
      priceLabel: "$1,500 project",
      sortOrder: 1,
      isFeatured: false,
      isActive: true,
    },
    {
      name: "Growth Ops Package",
      slug: "growth-ops-package",
      summary:
        "Build repeatable lead capture, scheduling, and client communication flows.",
      description:
        "Our core implementation package with custom intake forms, CRM handoff, and reporting.",
      priceLabel: "$3,500 project",
      sortOrder: 2,
      isFeatured: true,
      isActive: true,
    },
    {
      name: "Ongoing Systems Partner",
      slug: "ongoing-systems-partner",
      summary:
        "Monthly optimization, automation tuning, and dashboard support for owner-operators.",
      description:
        "Best for teams that want to keep improving systems as the business grows.",
      priceLabel: "From $900/mo",
      sortOrder: 3,
      isFeatured: false,
      isActive: true,
    },
  ],
  intakeQuestions: [
    {
      audience: "owner",
      label: "What kind of business do you run?",
      fieldKey: "business_type",
      fieldType: "text",
      placeholder: "Example: residential cleaning company",
      isRequired: true,
      sortOrder: 1,
      isActive: true,
    },
    {
      audience: "owner",
      label: "How many inbound leads do you get per month?",
      fieldKey: "monthly_lead_volume",
      fieldType: "select",
      options: [
        { label: "0-10", value: "0_10" },
        { label: "11-30", value: "11_30" },
        { label: "31-75", value: "31_75" },
        { label: "75+", value: "75_plus" },
      ],
      isRequired: true,
      sortOrder: 2,
      isActive: true,
    },
    {
      audience: "owner",
      label: "Which process is causing the most pain right now?",
      fieldKey: "primary_operations_pain",
      fieldType: "textarea",
      helpText: "Examples: no-show appointments, slow quote turnaround, missed follow-up.",
      isRequired: true,
      sortOrder: 3,
      isActive: true,
    },
    {
      audience: "owner",
      label: "Preferred consultation timeframe",
      fieldKey: "consultation_timeframe",
      fieldType: "select",
      options: [
        { label: "This week", value: "this_week" },
        { label: "Next week", value: "next_week" },
        { label: "Later this month", value: "later_this_month" },
      ],
      isRequired: false,
      sortOrder: 4,
      isActive: true,
    },
  ],
  admin: {
    name: "LocalOps Owner",
    email: "owner@localopssystems.com",
    passwordHash: "seed-script-overrides-this",
    role: "owner",
    isActive: true,
  },
};
