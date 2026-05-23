import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const businessModeEnum = pgEnum("business_mode", [
  "localops",
  "service_business",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "scheduled",
  "proposal_sent",
  "won",
  "lost",
  "follow_up_later",
]);

export const leadSourceEnum = pgEnum("lead_source", [
  "website",
  "phone",
  "manual",
  "referral",
  "other",
]);

export const leadTypeEnum = pgEnum("lead_type", [
  "audit_request",
  "consultation_request",
  "service_request",
  "estimate_request",
  "appointment_request",
  "general_contact",
]);

export const contactMethodEnum = pgEnum("contact_method", [
  "email",
  "phone",
  "sms",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "requested",
  "contacted",
  "confirmed",
  "declined",
]);

export const adminRoleEnum = pgEnum("admin_role", ["owner", "manager", "staff"]);

export const intakeAudienceEnum = pgEnum("intake_audience", [
  "owner",
  "customer",
]);

export const intakeFieldTypeEnum = pgEnum("intake_field_type", [
  "text",
  "textarea",
  "email",
  "phone",
  "select",
  "multiselect",
  "number",
  "checkbox",
  "date",
  "time",
]);

export const businessSettings = pgTable("business_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  mode: businessModeEnum("mode").notNull().default("localops"),
  businessName: text("business_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  serviceArea: text("service_area").notNull(),
  primaryCtaText: text("primary_cta_text").notNull(),
  secondaryCtaText: text("secondary_cta_text"),
  logoUrl: text("logo_url"),
  brandPrimary: text("brand_primary").notNull().default("#0f766e"),
  brandSecondary: text("brand_secondary").notNull().default("#f59e0b"),
  brandAccent: text("brand_accent").notNull().default("#0f172a"),
  timezone: text("timezone").notNull().default("America/Denver"),
  branding: jsonb("branding").$type<Record<string, unknown>>(),
  contactRouting: jsonb("contact_routing").$type<Record<string, unknown>>(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const services = pgTable(
  "services",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businessSettings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    summary: text("summary"),
    description: text("description"),
    priceLabel: text("price_label"),
    sortOrder: integer("sort_order").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    businessSlugUnique: uniqueIndex("services_business_slug_unique").on(
      table.businessId,
      table.slug,
    ),
    businessSortIdx: index("services_business_sort_idx").on(
      table.businessId,
      table.sortOrder,
    ),
  }),
);

type IntakeOption = {
  label: string;
  value: string;
};

export const intakeQuestions = pgTable(
  "intake_questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businessSettings.id, { onDelete: "cascade" }),
    audience: intakeAudienceEnum("audience").notNull(),
    label: text("label").notNull(),
    fieldKey: varchar("field_key", { length: 120 }).notNull(),
    fieldType: intakeFieldTypeEnum("field_type").notNull().default("text"),
    helpText: text("help_text"),
    placeholder: text("placeholder"),
    options: jsonb("options").$type<IntakeOption[]>(),
    isRequired: boolean("is_required").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    businessFieldKeyUnique: uniqueIndex("intake_questions_business_field_unique").on(
      table.businessId,
      table.fieldKey,
    ),
    businessSortIdx: index("intake_questions_business_sort_idx").on(
      table.businessId,
      table.sortOrder,
    ),
  }),
);

export const admins = pgTable(
  "admins",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businessSettings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: adminRoleEnum("role").notNull().default("staff"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    businessEmailUnique: uniqueIndex("admins_business_email_unique").on(
      table.businessId,
      table.email,
    ),
  }),
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businessSettings.id, { onDelete: "cascade" }),
    status: leadStatusEnum("status").notNull().default("new"),
    source: leadSourceEnum("source").notNull().default("website"),
    leadType: leadTypeEnum("lead_type").notNull().default("general_contact"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name"),
    companyName: text("company_name"),
    email: text("email").notNull(),
    phone: text("phone"),
    serviceAddress: text("service_address"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    preferredContactMethod: contactMethodEnum("preferred_contact_method")
      .notNull()
      .default("email"),
    requestedServiceId: uuid("requested_service_id").references(() => services.id, {
      onDelete: "set null",
    }),
    message: text("message"),
    timeline: text("timeline"),
    budgetRange: text("budget_range"),
    intakePayload: jsonb("intake_payload").$type<Record<string, unknown>>(),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    assignedAdminId: uuid("assigned_admin_id").references(() => admins.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    businessStatusIdx: index("leads_business_status_idx").on(
      table.businessId,
      table.status,
    ),
    businessSubmittedIdx: index("leads_business_submitted_idx").on(
      table.businessId,
      table.submittedAt,
    ),
  }),
);

export const leadNotes = pgTable(
  "lead_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    authorAdminId: uuid("author_admin_id").references(() => admins.id, {
      onDelete: "set null",
    }),
    note: text("note").notNull(),
    isInternal: boolean("is_internal").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    leadCreatedIdx: index("lead_notes_lead_created_idx").on(
      table.leadId,
      table.createdAt,
    ),
  }),
);

export const appointmentRequests = pgTable(
  "appointment_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    requestedDate: date("requested_date"),
    windowStart: time("window_start"),
    windowEnd: time("window_end"),
    timezone: text("timezone").notNull().default("America/Denver"),
    status: appointmentStatusEnum("status").notNull().default("requested"),
    adminResponse: text("admin_response"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    leadRequestedIdx: index("appointment_requests_lead_requested_idx").on(
      table.leadId,
      table.requestedDate,
    ),
  }),
);

export const businessSettingsRelations = relations(
  businessSettings,
  ({ many }) => ({
    services: many(services),
    intakeQuestions: many(intakeQuestions),
    leads: many(leads),
    admins: many(admins),
  }),
);

export const servicesRelations = relations(services, ({ one, many }) => ({
  business: one(businessSettings, {
    fields: [services.businessId],
    references: [businessSettings.id],
  }),
  leads: many(leads),
}));

export const intakeQuestionsRelations = relations(
  intakeQuestions,
  ({ one }) => ({
    business: one(businessSettings, {
      fields: [intakeQuestions.businessId],
      references: [businessSettings.id],
    }),
  }),
);

export const adminsRelations = relations(admins, ({ one, many }) => ({
  business: one(businessSettings, {
    fields: [admins.businessId],
    references: [businessSettings.id],
  }),
  assignedLeads: many(leads),
  leadNotes: many(leadNotes),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  business: one(businessSettings, {
    fields: [leads.businessId],
    references: [businessSettings.id],
  }),
  requestedService: one(services, {
    fields: [leads.requestedServiceId],
    references: [services.id],
  }),
  assignedAdmin: one(admins, {
    fields: [leads.assignedAdminId],
    references: [admins.id],
  }),
  notes: many(leadNotes),
  appointmentRequests: many(appointmentRequests),
}));

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
  lead: one(leads, {
    fields: [leadNotes.leadId],
    references: [leads.id],
  }),
  author: one(admins, {
    fields: [leadNotes.authorAdminId],
    references: [admins.id],
  }),
}));

export const appointmentRequestsRelations = relations(
  appointmentRequests,
  ({ one }) => ({
    lead: one(leads, {
      fields: [appointmentRequests.leadId],
      references: [leads.id],
    }),
  }),
);

export type BusinessMode = (typeof businessModeEnum.enumValues)[number];
export type LeadStatus = (typeof leadStatusEnum.enumValues)[number];
export type LeadType = (typeof leadTypeEnum.enumValues)[number];
export type LeadSource = (typeof leadSourceEnum.enumValues)[number];
export type ContactMethod = (typeof contactMethodEnum.enumValues)[number];
export type AppointmentStatus = (typeof appointmentStatusEnum.enumValues)[number];
export type AdminRole = (typeof adminRoleEnum.enumValues)[number];

export type BusinessSettings = InferSelectModel<typeof businessSettings>;
export type NewBusinessSettings = InferInsertModel<typeof businessSettings>;
export type Service = InferSelectModel<typeof services>;
export type NewService = InferInsertModel<typeof services>;
export type IntakeQuestion = InferSelectModel<typeof intakeQuestions>;
export type NewIntakeQuestion = InferInsertModel<typeof intakeQuestions>;
export type Admin = InferSelectModel<typeof admins>;
export type NewAdmin = InferInsertModel<typeof admins>;
export type Lead = InferSelectModel<typeof leads>;
export type NewLead = InferInsertModel<typeof leads>;
export type LeadNote = InferSelectModel<typeof leadNotes>;
export type NewLeadNote = InferInsertModel<typeof leadNotes>;
export type AppointmentRequest = InferSelectModel<typeof appointmentRequests>;
export type NewAppointmentRequest = InferInsertModel<typeof appointmentRequests>;
