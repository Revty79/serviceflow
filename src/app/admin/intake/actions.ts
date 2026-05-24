"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { getActiveBusiness } from "@/lib/business-context";
import { db } from "@/lib/db/client";
import {
  intakeAudienceEnum,
  intakeFieldTypeEnum,
  intakeQuestions,
} from "@/lib/db/schema";

type IntakeOption = {
  label: string;
  value: string;
};

export type IntakeQuestionFormState = {
  status?: "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

const selectLikeFieldTypes = new Set(["select", "multiselect"]);

const intakeQuestionSchema = z.object({
  audience: z.enum(intakeAudienceEnum.enumValues),
  label: z.string().trim().min(1, "Label is required.").max(300),
  fieldKey: z
    .string()
    .trim()
    .min(1, "Field key is required.")
    .max(120, "Field key is too long.")
    .regex(
      /^[a-z0-9_]+$/,
      "Use lowercase letters, numbers, and underscores only.",
    ),
  fieldType: z.enum(intakeFieldTypeEnum.enumValues),
  helpText: z.string().trim().max(1200).optional(),
  placeholder: z.string().trim().max(1000).optional(),
  optionsInput: z.string().trim().max(8000).optional(),
  isRequired: z.boolean(),
  sortOrder: z.coerce
    .number()
    .int("Sort order must be a whole number.")
    .min(0, "Sort order must be 0 or higher.")
    .max(9999, "Sort order is too large."),
  isActive: z.boolean(),
});

const updateIntakeQuestionSchema = intakeQuestionSchema.extend({
  questionId: z.string().uuid(),
});

const toggleQuestionSchema = z.object({
  questionId: z.string().uuid(),
  nextActive: z.enum(["true", "false"]),
});

function parseBooleanCheckbox(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function parseOptional(value: string) {
  return value ? value : undefined;
}

function parseQuestionFormData(formData: FormData) {
  return {
    audience: String(formData.get("audience") ?? ""),
    label: String(formData.get("label") ?? ""),
    fieldKey: String(formData.get("fieldKey") ?? "").trim().toLowerCase(),
    fieldType: String(formData.get("fieldType") ?? ""),
    helpText: parseOptional(String(formData.get("helpText") ?? "").trim()),
    placeholder: parseOptional(String(formData.get("placeholder") ?? "").trim()),
    optionsInput: parseOptional(String(formData.get("optionsInput") ?? "").trim()),
    isRequired: parseBooleanCheckbox(formData, "isRequired"),
    sortOrder: formData.get("sortOrder"),
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

function slugifyOptionValue(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function parseOptionsInput(
  optionsInput: string | undefined,
): { options: IntakeOption[]; error?: string } {
  if (!optionsInput) {
    return { options: [] };
  }

  const optionLines = optionsInput
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);

  const options: IntakeOption[] = [];
  const usedValues = new Set<string>();

  for (const [index, line] of optionLines.entries()) {
    const lineNumber = index + 1;
    let label = "";
    let value = "";

    if (line.includes("|")) {
      const [labelPart, ...valueParts] = line.split("|");
      label = labelPart?.trim() ?? "";
      value = valueParts.join("|").trim();
    } else {
      label = line;
      value = slugifyOptionValue(line);
    }

    if (!label) {
      return {
        options: [],
        error: `Option line ${lineNumber} is missing a label.`,
      };
    }

    if (!value) {
      return {
        options: [],
        error:
          `Option line ${lineNumber} is missing a value. Use Label|value or provide a label that can generate a value.`,
      };
    }

    if (usedValues.has(value)) {
      return {
        options: [],
        error: `Option value "${value}" is duplicated. Values must be unique.`,
      };
    }

    usedValues.add(value);
    options.push({ label, value });
  }

  return { options };
}

function revalidateIntakePages() {
  revalidatePath("/request");
  revalidatePath("/admin/intake");
}

async function resolveAuthorizedBusiness() {
  const session = await requireAdminSession();
  const business = await getActiveBusiness();

  if (!business || session.businessId !== business.id) {
    return null;
  }

  return business;
}

function normalizeOptionsForFieldType(
  fieldType: string,
  optionsInput: string | undefined,
): { options: IntakeOption[] | null; fieldError?: string } {
  if (!selectLikeFieldTypes.has(fieldType)) {
    return { options: null };
  }

  const parsedOptions = parseOptionsInput(optionsInput);
  if (parsedOptions.error) {
    return { options: null, fieldError: parsedOptions.error };
  }

  if (!parsedOptions.options.length) {
    return {
      options: null,
      fieldError:
        "At least one option is required for select and multiselect fields.",
    };
  }

  return { options: parsedOptions.options };
}

export async function createIntakeQuestionAction(
  _state: IntakeQuestionFormState,
  formData: FormData,
): Promise<IntakeQuestionFormState> {
  const business = await resolveAuthorizedBusiness();

  if (!business) {
    return {
      status: "error",
      message: "Could not resolve active business for this admin session.",
    };
  }

  const parsed = intakeQuestionSchema.safeParse(parseQuestionFormData(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const optionsResult = normalizeOptionsForFieldType(
    parsed.data.fieldType,
    parsed.data.optionsInput,
  );

  if (optionsResult.fieldError) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        optionsInput: optionsResult.fieldError,
      },
    };
  }

  const existingFieldKey = await db.query.intakeQuestions.findFirst({
    where: and(
      eq(intakeQuestions.businessId, business.id),
      eq(intakeQuestions.fieldKey, parsed.data.fieldKey),
    ),
    columns: { id: true },
  });

  if (existingFieldKey) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        fieldKey: "This field key is already in use for another question.",
      },
    };
  }

  try {
    await db.insert(intakeQuestions).values({
      businessId: business.id,
      audience: parsed.data.audience,
      label: parsed.data.label,
      fieldKey: parsed.data.fieldKey,
      fieldType: parsed.data.fieldType,
      helpText: parsed.data.helpText ?? null,
      placeholder: parsed.data.placeholder ?? null,
      options: optionsResult.options,
      isRequired: parsed.data.isRequired,
      sortOrder: parsed.data.sortOrder,
      isActive: parsed.data.isActive,
    });
  } catch (error) {
    console.error("Failed to create intake question:", error);
    return {
      status: "error",
      message: "Could not create intake question right now. Please try again.",
    };
  }

  revalidateIntakePages();

  return {
    status: "success",
    message: "Intake question created successfully.",
  };
}

export async function updateIntakeQuestionAction(
  _state: IntakeQuestionFormState,
  formData: FormData,
): Promise<IntakeQuestionFormState> {
  const business = await resolveAuthorizedBusiness();

  if (!business) {
    return {
      status: "error",
      message: "Could not resolve active business for this admin session.",
    };
  }

  const parsed = updateIntakeQuestionSchema.safeParse({
    ...parseQuestionFormData(formData),
    questionId: String(formData.get("questionId") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const { questionId, ...values } = parsed.data;

  const existingQuestion = await db.query.intakeQuestions.findFirst({
    where: and(
      eq(intakeQuestions.id, questionId),
      eq(intakeQuestions.businessId, business.id),
    ),
    columns: { id: true },
  });

  if (!existingQuestion) {
    return {
      status: "error",
      message: "Intake question not found for this business.",
    };
  }

  const fieldKeyConflict = await db.query.intakeQuestions.findFirst({
    where: and(
      eq(intakeQuestions.businessId, business.id),
      eq(intakeQuestions.fieldKey, values.fieldKey),
      ne(intakeQuestions.id, questionId),
    ),
    columns: { id: true },
  });

  if (fieldKeyConflict) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        fieldKey: "This field key is already in use for another question.",
      },
    };
  }

  const optionsResult = normalizeOptionsForFieldType(
    values.fieldType,
    values.optionsInput,
  );

  if (optionsResult.fieldError) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        optionsInput: optionsResult.fieldError,
      },
    };
  }

  try {
    await db
      .update(intakeQuestions)
      .set({
        audience: values.audience,
        label: values.label,
        fieldKey: values.fieldKey,
        fieldType: values.fieldType,
        helpText: values.helpText ?? null,
        placeholder: values.placeholder ?? null,
        options: optionsResult.options,
        isRequired: values.isRequired,
        sortOrder: values.sortOrder,
        isActive: values.isActive,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(intakeQuestions.id, questionId),
          eq(intakeQuestions.businessId, business.id),
        ),
      );
  } catch (error) {
    console.error("Failed to update intake question:", error);
    return {
      status: "error",
      message: "Could not update intake question right now. Please try again.",
    };
  }

  revalidateIntakePages();

  return {
    status: "success",
    message: "Intake question updated successfully.",
  };
}

export async function toggleIntakeQuestionActiveAction(formData: FormData) {
  const business = await resolveAuthorizedBusiness();

  if (!business) {
    return;
  }

  const parsed = toggleQuestionSchema.safeParse({
    questionId: String(formData.get("questionId") ?? ""),
    nextActive: String(formData.get("nextActive") ?? ""),
  });

  if (!parsed.success) {
    return;
  }

  const isActive = parsed.data.nextActive === "true";

  await db
    .update(intakeQuestions)
    .set({
      isActive,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(intakeQuestions.id, parsed.data.questionId),
        eq(intakeQuestions.businessId, business.id),
      ),
    );

  revalidateIntakePages();
}
