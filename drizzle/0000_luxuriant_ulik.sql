CREATE TYPE "public"."admin_role" AS ENUM('owner', 'manager', 'staff');--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('requested', 'contacted', 'confirmed', 'declined');--> statement-breakpoint
CREATE TYPE "public"."business_mode" AS ENUM('localops', 'service_business');--> statement-breakpoint
CREATE TYPE "public"."contact_method" AS ENUM('email', 'phone', 'sms');--> statement-breakpoint
CREATE TYPE "public"."intake_audience" AS ENUM('owner', 'customer');--> statement-breakpoint
CREATE TYPE "public"."intake_field_type" AS ENUM('text', 'textarea', 'email', 'phone', 'select', 'multiselect', 'number', 'checkbox', 'date', 'time');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('website', 'phone', 'manual', 'referral', 'other');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'scheduled', 'proposal_sent', 'won', 'lost', 'follow_up_later');--> statement-breakpoint
CREATE TYPE "public"."lead_type" AS ENUM('audit_request', 'consultation_request', 'service_request', 'estimate_request', 'appointment_request', 'general_contact');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "admin_role" DEFAULT 'staff' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "appointment_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"requested_date" date,
	"window_start" time,
	"window_end" time,
	"timezone" text DEFAULT 'America/Denver' NOT NULL,
	"status" "appointment_status" DEFAULT 'requested' NOT NULL,
	"admin_response" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"mode" "business_mode" DEFAULT 'localops' NOT NULL,
	"business_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"service_area" text NOT NULL,
	"primary_cta_text" text NOT NULL,
	"secondary_cta_text" text,
	"logo_url" text,
	"brand_primary" text DEFAULT '#0f766e' NOT NULL,
	"brand_secondary" text DEFAULT '#f59e0b' NOT NULL,
	"brand_accent" text DEFAULT '#0f172a' NOT NULL,
	"timezone" text DEFAULT 'America/Denver' NOT NULL,
	"branding" jsonb,
	"contact_routing" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "business_settings_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "intake_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"audience" "intake_audience" NOT NULL,
	"label" text NOT NULL,
	"field_key" varchar(120) NOT NULL,
	"field_type" "intake_field_type" DEFAULT 'text' NOT NULL,
	"help_text" text,
	"placeholder" text,
	"options" jsonb,
	"is_required" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"author_admin_id" uuid,
	"note" text NOT NULL,
	"is_internal" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"source" "lead_source" DEFAULT 'website' NOT NULL,
	"lead_type" "lead_type" DEFAULT 'general_contact' NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"company_name" text,
	"email" text NOT NULL,
	"phone" text,
	"service_address" text,
	"city" text,
	"state" text,
	"postal_code" text,
	"preferred_contact_method" "contact_method" DEFAULT 'email' NOT NULL,
	"requested_service_id" uuid,
	"message" text,
	"timeline" text,
	"budget_range" text,
	"intake_payload" jsonb,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"assigned_admin_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(120) NOT NULL,
	"summary" text,
	"description" text,
	"price_label" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admins" ADD CONSTRAINT "admins_business_id_business_settings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_requests" ADD CONSTRAINT "appointment_requests_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intake_questions" ADD CONSTRAINT "intake_questions_business_id_business_settings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_author_admin_id_admins_id_fk" FOREIGN KEY ("author_admin_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_business_id_business_settings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_requested_service_id_services_id_fk" FOREIGN KEY ("requested_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_admin_id_admins_id_fk" FOREIGN KEY ("assigned_admin_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_business_id_business_settings_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."business_settings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "admins_business_email_unique" ON "admins" USING btree ("business_id","email");--> statement-breakpoint
CREATE INDEX "appointment_requests_lead_requested_idx" ON "appointment_requests" USING btree ("lead_id","requested_date");--> statement-breakpoint
CREATE UNIQUE INDEX "intake_questions_business_field_unique" ON "intake_questions" USING btree ("business_id","field_key");--> statement-breakpoint
CREATE INDEX "intake_questions_business_sort_idx" ON "intake_questions" USING btree ("business_id","sort_order");--> statement-breakpoint
CREATE INDEX "lead_notes_lead_created_idx" ON "lead_notes" USING btree ("lead_id","created_at");--> statement-breakpoint
CREATE INDEX "leads_business_status_idx" ON "leads" USING btree ("business_id","status");--> statement-breakpoint
CREATE INDEX "leads_business_submitted_idx" ON "leads" USING btree ("business_id","submitted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "services_business_slug_unique" ON "services" USING btree ("business_id","slug");--> statement-breakpoint
CREATE INDEX "services_business_sort_idx" ON "services" USING btree ("business_id","sort_order");