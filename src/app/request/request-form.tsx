"use client";

import { useActionState } from "react";
import type { intakeQuestions, services } from "@/lib/db/schema";
import type { RequestLeadActionState } from "./actions";

const initialState: RequestLeadActionState = {};

type RequestFormProps = {
  businessName: string;
  ctaText: string;
  serviceArea: string;
  email: string;
  phone: string;
  servicesList: (typeof services.$inferSelect)[];
  intakeQuestionsList: (typeof intakeQuestions.$inferSelect)[];
  action: (
    state: RequestLeadActionState,
    formData: FormData,
  ) => Promise<RequestLeadActionState>;
};

function FieldError({
  state,
  field,
}: {
  state: RequestLeadActionState;
  field: string;
}) {
  const error = state.fieldErrors?.[field];

  if (!error) {
    return null;
  }

  return <p className="mt-1 text-sm text-rose-700">{error}</p>;
}

function normalizeInputFieldType(fieldType: string) {
  if (fieldType === "email") {
    return "email";
  }

  if (fieldType === "phone") {
    return "tel";
  }

  if (fieldType === "number") {
    return "number";
  }

  if (fieldType === "date") {
    return "date";
  }

  if (fieldType === "time") {
    return "time";
  }

  return "text";
}

export function RequestForm({
  businessName,
  ctaText,
  serviceArea,
  email,
  phone,
  servicesList,
  intakeQuestionsList,
  action,
}: RequestFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        {businessName}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        Request Business Systems Audit
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
        Tell us where operations are breaking down, and we will follow up with a
        practical plan. Service area: {serviceArea}.
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Prefer direct contact? Email {email} or call {phone}.
      </p>

      <form action={formAction} className="mt-8 space-y-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {state.message ? (
          <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {state.message}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            First Name *
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              name="firstName"
              required
            />
            <FieldError field="firstName" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Last Name
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              name="lastName"
            />
            <FieldError field="lastName" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Company Name
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              name="companyName"
            />
            <FieldError field="companyName" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Email *
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              name="email"
              type="email"
              required
            />
            <FieldError field="email" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Phone
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              name="phone"
              type="tel"
            />
            <FieldError field="phone" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Preferred Contact Method
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue="email"
              name="preferredContactMethod"
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="sms">SMS</option>
            </select>
            <FieldError field="preferredContactMethod" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Request Type *
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue="audit_request"
              name="leadType"
              required
            >
              <option value="audit_request">Free Audit Request</option>
              <option value="consultation_request">Consultation Request</option>
              <option value="general_contact">General Contact</option>
            </select>
            <FieldError field="leadType" state={state} />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-800">
          Requested Package
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            defaultValue=""
            name="requestedServiceId"
          >
            <option value="">No package selected</option>
            {servicesList.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          <FieldError field="requestedServiceId" state={state} />
        </label>

        {intakeQuestionsList.length ? (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              Intake questions
            </h2>

            {intakeQuestionsList.map((question) => {
              const fieldName = `intake_${question.fieldKey}`;
              const isSelect =
                question.fieldType === "select" ||
                question.fieldType === "multiselect";
              const isTextarea = question.fieldType === "textarea";

              if (isSelect && question.options?.length) {
                return (
                  <label
                    className="block text-sm font-medium text-slate-800"
                    key={question.id}
                  >
                    {question.label}
                    {question.isRequired ? " *" : ""}
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      defaultValue=""
                      multiple={question.fieldType === "multiselect"}
                      name={fieldName}
                      required={question.isRequired}
                    >
                      <option value="">Select one</option>
                      {question.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {question.helpText ? (
                      <p className="mt-1 text-xs text-slate-600">{question.helpText}</p>
                    ) : null}
                    <FieldError field={fieldName} state={state} />
                  </label>
                );
              }

              if (isTextarea) {
                return (
                  <label
                    className="block text-sm font-medium text-slate-800"
                    key={question.id}
                  >
                    {question.label}
                    {question.isRequired ? " *" : ""}
                    <textarea
                      className="mt-1 min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      name={fieldName}
                      placeholder={question.placeholder ?? ""}
                      required={question.isRequired}
                    />
                    {question.helpText ? (
                      <p className="mt-1 text-xs text-slate-600">{question.helpText}</p>
                    ) : null}
                    <FieldError field={fieldName} state={state} />
                  </label>
                );
              }

              return (
                <label
                  className="block text-sm font-medium text-slate-800"
                  key={question.id}
                >
                  {question.label}
                  {question.isRequired ? " *" : ""}
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    name={fieldName}
                    placeholder={question.placeholder ?? ""}
                    required={question.isRequired}
                    type={normalizeInputFieldType(question.fieldType)}
                  />
                  {question.helpText ? (
                    <p className="mt-1 text-xs text-slate-600">{question.helpText}</p>
                  ) : null}
                  <FieldError field={fieldName} state={state} />
                </label>
              );
            })}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-800">
            Preferred Start Timeline
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              name="timeline"
              placeholder="Example: within 30 days"
            />
            <FieldError field="timeline" state={state} />
          </label>

          <label className="text-sm font-medium text-slate-800">
            Approximate Budget
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              name="budgetRange"
              placeholder="Example: $2,000-$5,000"
            />
            <FieldError field="budgetRange" state={state} />
          </label>
        </div>

        <label className="block text-sm font-medium text-slate-800">
          What should we know before contacting you? *
          <textarea
            className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            name="message"
            required
          />
          <FieldError field="message" state={state} />
        </label>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Optional appointment window
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium text-slate-800">
              Date
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                name="appointmentDate"
                type="date"
              />
            </label>
            <label className="text-sm font-medium text-slate-800">
              Window start
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                name="appointmentWindowStart"
                type="time"
              />
            </label>
            <label className="text-sm font-medium text-slate-800">
              Window end
              <input
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                name="appointmentWindowEnd"
                type="time"
              />
            </label>
          </div>
          <FieldError field="appointmentDate" state={state} />
        </div>

        <button
          className="rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Submitting..." : ctaText}
        </button>
      </form>
    </section>
  );
}
