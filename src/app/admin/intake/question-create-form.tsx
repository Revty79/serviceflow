"use client";

import { useActionState } from "react";
import {
  createIntakeQuestionAction,
  type IntakeQuestionFormState,
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

export function IntakeQuestionCreateForm() {
  const [state, formAction, isPending] = useActionState(
    createIntakeQuestionAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-4 space-y-4">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-800">
          Audience *
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue="owner"
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
            defaultValue="text"
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
            name="label"
            required
          />
          <FieldError field="label" state={state} />
        </label>

        <label className="text-sm font-medium text-slate-800">
          Field Key *
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
            name="fieldKey"
            placeholder="primary_operations_pain"
            required
          />
          <FieldError field="fieldKey" state={state} />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-800">
        Help Text
        <textarea
          className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          name="helpText"
        />
        <FieldError field="helpText" state={state} />
      </label>

      <label className="block text-sm font-medium text-slate-800">
        Placeholder
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          name="placeholder"
        />
        <FieldError field="placeholder" state={state} />
      </label>

      <label className="block text-sm font-medium text-slate-800">
        Options (for select/multiselect)
        <textarea
          className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
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
            defaultValue="0"
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
          <input className="h-4 w-4" name="isRequired" type="checkbox" />
          Required
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-800">
          <input className="h-4 w-4" defaultChecked name="isActive" type="checkbox" />
          Active
        </label>
      </div>

      <button
        className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Creating..." : "Create Intake Question"}
      </button>
    </form>
  );
}
