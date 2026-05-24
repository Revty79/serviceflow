"use client";

import { useActionState } from "react";
import type { intakeQuestions } from "@/lib/db/schema";
import {
  type IntakeQuestionFormState,
  toggleIntakeQuestionActiveAction,
  updateIntakeQuestionAction,
} from "./actions";

const initialState: IntakeQuestionFormState = {};

const fieldTypeOptions = [
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
] as const;

type IntakeQuestionEditFormProps = {
  question: typeof intakeQuestions.$inferSelect;
};

function formatOptionsForTextarea(
  options: { label: string; value: string }[] | null,
) {
  if (!options?.length) {
    return "";
  }

  return options.map((option) => `${option.label}|${option.value}`).join("\n");
}

function FieldError({
  state,
  field,
}: {
  state: IntakeQuestionFormState;
  field: string;
}) {
  const error = state.fieldErrors?.[field];

  if (!error) {
    return null;
  }

  return <p className="mt-1 text-sm text-rose-700">{error}</p>;
}

export function IntakeQuestionEditForm({ question }: IntakeQuestionEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateIntakeQuestionAction,
    initialState,
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{question.label}</h3>
          <p className="text-xs text-slate-600">
            Key: {question.fieldKey} | Type: {question.fieldType}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {question.isRequired ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
              Required
            </span>
          ) : null}
          {question.isActive ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Active
            </span>
          ) : (
            <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
              Inactive
            </span>
          )}
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        {state.message ? (
          <p
            className={
              state.status === "success"
                ? "rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                : "rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            }
          >
            {state.message}
          </p>
        ) : null}

        <input name="questionId" type="hidden" value={question.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            Audience *
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue={question.audience}
              name="audience"
              required
            >
              <option value="owner">Owner</option>
              <option value="customer">Customer</option>
            </select>
            <FieldError field="audience" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Field Type *
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue={question.fieldType}
              name="fieldType"
              required
            >
              {fieldTypeOptions.map((fieldType) => (
                <option key={fieldType} value={fieldType}>
                  {fieldType}
                </option>
              ))}
            </select>
            <FieldError field="fieldType" state={state} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            Label *
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue={question.label}
              name="label"
              required
            />
            <FieldError field="label" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Field Key *
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
              defaultValue={question.fieldKey}
              name="fieldKey"
              required
            />
            <FieldError field="fieldKey" state={state} />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-800">
          Help Text
          <textarea
            className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={question.helpText ?? ""}
            name="helpText"
          />
          <FieldError field="helpText" state={state} />
        </label>

        <label className="block text-sm font-medium text-slate-800">
          Placeholder
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={question.placeholder ?? ""}
            name="placeholder"
          />
          <FieldError field="placeholder" state={state} />
        </label>

        <label className="block text-sm font-medium text-slate-800">
          Options (for select/multiselect)
          <textarea
            className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
            defaultValue={formatOptionsForTextarea(question.options ?? null)}
            name="optionsInput"
            placeholder={"Option A|option_a\nOption B|option_b\nOr just: Option C"}
          />
          <p className="mt-1 text-xs text-slate-600">
            One option per line. Use `Label|value` or just `Label` to auto-generate
            value.
          </p>
          <FieldError field="optionsInput" state={state} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            Sort Order *
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue={String(question.sortOrder)}
              min={0}
              name="sortOrder"
              required
              step={1}
              type="number"
            />
            <FieldError field="sortOrder" state={state} />
          </label>
        </div>

        <div className="flex flex-wrap gap-5">
          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              className="h-4 w-4"
              defaultChecked={question.isRequired}
              name="isRequired"
              type="checkbox"
            />
            Required
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              className="h-4 w-4"
              defaultChecked={question.isActive}
              name="isActive"
              type="checkbox"
            />
            Active
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
            type="submit"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>

          <input
            name="nextActive"
            type="hidden"
            value={question.isActive ? "false" : "true"}
          />
          <button
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
            formAction={toggleIntakeQuestionActiveAction}
            type="submit"
          >
            {question.isActive ? "Deactivate" : "Reactivate"}
          </button>
        </div>
      </form>
    </article>
  );
}
