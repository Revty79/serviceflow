"use client";

import { useActionState } from "react";
import { createServiceAction, type ServiceFormState } from "./actions";

const initialState: ServiceFormState = {};

function FieldError({
  state,
  field,
}: {
  state: ServiceFormState;
  field: string;
}) {
  const error = state.fieldErrors?.[field];

  if (!error) {
    return null;
  }

  return <p className="mt-1 text-sm text-rose-700">{error}</p>;
}

export function ServiceCreateForm() {
  const [state, formAction, isPending] = useActionState(
    createServiceAction,
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
          Name *
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            name="name"
            required
          />
          <FieldError field="name" state={state} />
        </label>

        <label className="text-sm font-medium text-slate-800">
          Slug *
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
            name="slug"
            placeholder="growth-ops-package"
            required
          />
          <FieldError field="slug" state={state} />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-800">
        Summary
        <textarea
          className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          name="summary"
        />
        <FieldError field="summary" state={state} />
      </label>

      <label className="block text-sm font-medium text-slate-800">
        Description
        <textarea
          className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          name="description"
        />
        <FieldError field="description" state={state} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-800">
          Price Label
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            name="priceLabel"
            placeholder="$3,500 project"
          />
          <FieldError field="priceLabel" state={state} />
        </label>

        <label className="text-sm font-medium text-slate-800">
          Sort Order *
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue="0"
            min={0}
            name="sortOrder"
            required
            type="number"
          />
          <FieldError field="sortOrder" state={state} />
        </label>
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="inline-flex items-center gap-2 text-sm text-slate-800">
          <input className="h-4 w-4" defaultChecked name="isActive" type="checkbox" />
          Active
        </label>

        <label className="inline-flex items-center gap-2 text-sm text-slate-800">
          <input className="h-4 w-4" name="isFeatured" type="checkbox" />
          Featured package
        </label>
      </div>

      <button
        className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Creating..." : "Create Service"}
      </button>
    </form>
  );
}
