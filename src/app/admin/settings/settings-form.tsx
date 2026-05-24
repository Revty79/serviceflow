"use client";

import { useActionState } from "react";
import type { businessSettings } from "@/lib/db/schema";
import {
  type BusinessSettingsFormState,
  updateBusinessSettingsAction,
} from "./actions";

const initialState: BusinessSettingsFormState = {};

type SettingsFormProps = {
  business: typeof businessSettings.$inferSelect;
  notifyEmailsDefault: string;
};

function FieldError({
  state,
  field,
}: {
  state: BusinessSettingsFormState;
  field: string;
}) {
  const error = state.fieldErrors?.[field];

  if (!error) {
    return null;
  }

  return <p className="mt-1 text-sm text-rose-700">{error}</p>;
}

export function BusinessSettingsForm({
  business,
  notifyEmailsDefault,
}: SettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateBusinessSettingsAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-6 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
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
          Business Name *
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={business.businessName}
            name="businessName"
            required
          />
          <FieldError field="businessName" state={state} />
        </label>

        <label className="text-sm font-medium text-slate-800">
          Timezone *
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={business.timezone}
            name="timezone"
            required
          />
          <FieldError field="timezone" state={state} />
        </label>

        <label className="text-sm font-medium text-slate-800">
          Phone *
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={business.phone}
            name="phone"
            required
          />
          <FieldError field="phone" state={state} />
        </label>

        <label className="text-sm font-medium text-slate-800">
          Email *
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={business.email}
            name="email"
            required
            type="email"
          />
          <FieldError field="email" state={state} />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-800">
        Service Area *
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          defaultValue={business.serviceArea}
          name="serviceArea"
          required
        />
        <FieldError field="serviceArea" state={state} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-800">
          Primary CTA Text *
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={business.primaryCtaText}
            name="primaryCtaText"
            required
          />
          <FieldError field="primaryCtaText" state={state} />
        </label>

        <label className="text-sm font-medium text-slate-800">
          Secondary CTA Text
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue={business.secondaryCtaText ?? ""}
            name="secondaryCtaText"
          />
          <FieldError field="secondaryCtaText" state={state} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-medium text-slate-800">
          Brand Primary *
          <div className="mt-1 flex items-center gap-3">
            <input
              className="h-10 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              defaultValue={business.brandPrimary}
              name="brandPrimary"
              required
              type="color"
            />
            <span className="text-xs text-slate-600">Choose primary color</span>
          </div>
          <FieldError field="brandPrimary" state={state} />
        </label>

        <label className="text-sm font-medium text-slate-800">
          Brand Secondary *
          <div className="mt-1 flex items-center gap-3">
            <input
              className="h-10 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              defaultValue={business.brandSecondary}
              name="brandSecondary"
              required
              type="color"
            />
            <span className="text-xs text-slate-600">Choose secondary color</span>
          </div>
          <FieldError field="brandSecondary" state={state} />
        </label>

        <label className="text-sm font-medium text-slate-800">
          Brand Accent *
          <div className="mt-1 flex items-center gap-3">
            <input
              className="h-10 w-16 cursor-pointer rounded-lg border border-slate-300 bg-white p-1"
              defaultValue={business.brandAccent}
              name="brandAccent"
              required
              type="color"
            />
            <span className="text-xs text-slate-600">Choose accent color</span>
          </div>
          <FieldError field="brandAccent" state={state} />
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-800">
        Notify Emails (optional)
        <textarea
          className="mt-1 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          defaultValue={notifyEmailsDefault}
          name="notifyEmails"
          placeholder="Separate with commas or new lines"
        />
        <p className="mt-1 text-xs text-slate-600">
          Used for contact routing notification recipients.
        </p>
        <FieldError field="notifyEmails" state={state} />
      </label>

      <button
        className="rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
