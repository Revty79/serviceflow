"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getActiveBusinessContext } from "@/lib/business-context";
import { db } from "@/lib/db/client";
import { appointmentRequests, leadTypeEnum, leads, services } from "@/lib/db/schema";

export type RequestLeadActionState = {
  message?: string;
  fieldErrors?: Record<string, string>;
};

const leadFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().max(120).optional(),
  companyName: z.string().trim().max(200).optional(),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().max(50).optional(),
  preferredContactMethod: z.enum(["email", "phone", "sms"]),
  leadType: z.enum(leadTypeEnum.enumValues),
  requestedServiceId: z.string().uuid().optional(),
  timeline: z.string().trim().max(200).optional(),
  budgetRange: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please share a little more detail before submitting.")
    .max(4000),
  appointmentDate: z.string().trim().optional(),
  appointmentWindowStart: z.string().trim().optional(),
  appointmentWindowEnd: z.string().trim().optional(),
});

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function toOptionalString(value: string) {
  return value ? value : undefined;
}

function isValidDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidTime(value: string) {
  return /^\d{2}:\d{2}$/.test(value);
}

export async function submitLeadRequestAction(
  _state: RequestLeadActionState,
  formData: FormData,
): Promise<RequestLeadActionState> {
  const context = await getActiveBusinessContext();

  if (!context) {
    return {
      message:
        "Business configuration is missing. Seed and activate SERVICEFLOW_BUSINESS_SLUG before submitting leads.",
    };
  }

  const parsed = leadFormSchema.safeParse({
    firstName: getStringValue(formData, "firstName"),
    lastName: toOptionalString(getStringValue(formData, "lastName")),
    companyName: toOptionalString(getStringValue(formData, "companyName")),
    email: getStringValue(formData, "email"),
    phone: toOptionalString(getStringValue(formData, "phone")),
    preferredContactMethod: getStringValue(formData, "preferredContactMethod"),
    leadType: getStringValue(formData, "leadType"),
    requestedServiceId: toOptionalString(getStringValue(formData, "requestedServiceId")),
    timeline: toOptionalString(getStringValue(formData, "timeline")),
    budgetRange: toOptionalString(getStringValue(formData, "budgetRange")),
    message: getStringValue(formData, "message"),
    appointmentDate: toOptionalString(getStringValue(formData, "appointmentDate")),
    appointmentWindowStart: toOptionalString(
      getStringValue(formData, "appointmentWindowStart"),
    ),
    appointmentWindowEnd: toOptionalString(
      getStringValue(formData, "appointmentWindowEnd"),
    ),
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
      fieldErrors,
      message: "Please correct the highlighted fields.",
    };
  }

  const fieldErrors: Record<string, string> = {};
  const intakePayload: Record<string, unknown> = {};

  for (const question of context.intakeQuestions) {
    const fieldName = `intake_${question.fieldKey}`;
    let payloadValue: unknown = undefined;

    if (question.fieldType === "multiselect") {
      const values = formData
        .getAll(fieldName)
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean);

      if (values.length) {
        payloadValue = values;
      }
    } else if (question.fieldType === "checkbox") {
      const checkboxValue = formData.get(fieldName);
      if (checkboxValue !== null) {
        payloadValue = true;
      }
    } else {
      const value = getStringValue(formData, fieldName);
      if (value) {
        payloadValue = value;
      }
    }

    if (question.isRequired && payloadValue === undefined) {
      fieldErrors[fieldName] = `${question.label} is required.`;
      continue;
    }

    if (payloadValue !== undefined) {
      intakePayload[question.fieldKey] = payloadValue;
    }
  }

  const { appointmentDate, appointmentWindowStart, appointmentWindowEnd } = parsed.data;
  const hasAppointmentInput =
    !!appointmentDate || !!appointmentWindowStart || !!appointmentWindowEnd;

  if (appointmentDate && !isValidDate(appointmentDate)) {
    fieldErrors.appointmentDate = "Use a valid appointment date.";
  }

  if (appointmentWindowStart && !isValidTime(appointmentWindowStart)) {
    fieldErrors.appointmentWindowStart = "Use a valid start time.";
  }

  if (appointmentWindowEnd && !isValidTime(appointmentWindowEnd)) {
    fieldErrors.appointmentWindowEnd = "Use a valid end time.";
  }

  if ((appointmentWindowStart || appointmentWindowEnd) && !appointmentDate) {
    fieldErrors.appointmentDate = "Choose an appointment date with time window.";
  }

  if (
    appointmentWindowStart &&
    appointmentWindowEnd &&
    appointmentWindowStart >= appointmentWindowEnd
  ) {
    fieldErrors.appointmentWindowEnd = "End time must be later than start time.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please correct the highlighted fields.",
    };
  }

  let requestedServiceId = parsed.data.requestedServiceId;

  if (requestedServiceId) {
    const selectedService = await db.query.services.findFirst({
      where: and(
        eq(services.businessId, context.business.id),
        eq(services.id, requestedServiceId),
        eq(services.isActive, true),
      ),
    });

    if (!selectedService) {
      return {
        fieldErrors: {
          requestedServiceId: "Selected package is no longer available.",
        },
        message: "Please choose a valid package option.",
      };
    }
  } else {
    requestedServiceId = undefined;
  }

  try {
    const [createdLead] = await db
      .insert(leads)
      .values({
        businessId: context.business.id,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        companyName: parsed.data.companyName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        preferredContactMethod: parsed.data.preferredContactMethod,
        leadType: parsed.data.leadType,
        requestedServiceId,
        message: parsed.data.message,
        timeline: parsed.data.timeline,
        budgetRange: parsed.data.budgetRange,
        intakePayload: Object.keys(intakePayload).length ? intakePayload : undefined,
      })
      .returning({ id: leads.id });

    if (hasAppointmentInput) {
      await db.insert(appointmentRequests).values({
        leadId: createdLead.id,
        requestedDate: appointmentDate,
        windowStart: appointmentWindowStart,
        windowEnd: appointmentWindowEnd,
        timezone: context.business.timezone,
      });
    }
  } catch (error) {
    console.error("Failed to submit lead request:", error);
    return {
      message:
        "We could not save your request right now. Please try again in a minute.",
    };
  }

  redirect("/thank-you");
}
