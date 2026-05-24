"use client";

import { useActionState } from "react";
import {
  type AdminAccountPasswordState,
  updateAdminPasswordAction,
} from "./actions";

const initialState: AdminAccountPasswordState = {};

function FieldError({
  state,
  field,
}: {
  state: AdminAccountPasswordState;
  field: string;
}) {
  const error = state.fieldErrors?.[field];

  if (!error) {
    return null;
  }

  return <p className="mt-1 text-sm text-rose-700">{error}</p>;
}

export function AdminAccountPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    updateAdminPasswordAction,
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

      <label className="block text-sm font-medium text-slate-800">
        Current password
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          name="currentPassword"
          required
          type="password"
        />
        <FieldError field="currentPassword" state={state} />
      </label>

      <label className="block text-sm font-medium text-slate-800">
        New password
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          name="newPassword"
          required
          type="password"
        />
        <FieldError field="newPassword" state={state} />
      </label>

      <label className="block text-sm font-medium text-slate-800">
        Confirm new password
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          name="confirmNewPassword"
          required
          type="password"
        />
        <FieldError field="confirmNewPassword" state={state} />
      </label>

      <button
        className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Updating..." : "Change Password"}
      </button>
    </form>
  );
}
