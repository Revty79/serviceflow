"use client";

import { useActionState } from "react";
import type { services } from "@/lib/db/schema";
import {
  type ServiceFormState,
  toggleServiceActiveAction,
  updateServiceAction,
} from "./actions";

const initialState: ServiceFormState = {};

type ServiceEditFormProps = {
  service: typeof services.$inferSelect;
};

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

export function ServiceEditForm({ service }: ServiceEditFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateServiceAction,
    initialState,
  );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
          <p className="text-xs text-slate-600">Slug: {service.slug}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {service.isFeatured ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
              Featured
            </span>
          ) : null}
          {service.isActive ? (
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

        <input name="serviceId" type="hidden" value={service.id} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            Name *
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue={service.name}
              name="name"
              required
            />
            <FieldError field="name" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Slug *
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
              defaultValue={service.slug}
              name="slug"
              required
            />
            <FieldError field="slug" state={state} />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-800">
          Summary
          <textarea
            className="mt-1 min-h-20 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={service.summary ?? ""}
            name="summary"
          />
          <FieldError field="summary" state={state} />
        </label>

        <label className="block text-sm font-medium text-slate-800">
          Description
          <textarea
            className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={service.description ?? ""}
            name="description"
          />
          <FieldError field="description" state={state} />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            Price Label
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue={service.priceLabel ?? ""}
              name="priceLabel"
            />
            <FieldError field="priceLabel" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Sort Order *
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue={String(service.sortOrder)}
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
            <input
              className="h-4 w-4"
              defaultChecked={service.isActive}
              name="isActive"
              type="checkbox"
            />
            Active
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-slate-800">
            <input
              className="h-4 w-4"
              defaultChecked={service.isFeatured}
              name="isFeatured"
              type="checkbox"
            />
            Featured package
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
            value={service.isActive ? "false" : "true"}
          />
          <button
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
            formAction={toggleServiceActiveAction}
            type="submit"
          >
            {service.isActive ? "Deactivate" : "Reactivate"}
          </button>
        </div>
      </form>
    </article>
  );
}
