import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getActiveBusiness } from "@/lib/business-context";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { getLeadStatusLabel, leadStatusOptions } from "@/lib/leads/status";
import { addLeadNoteAction, updateLeadStatusAction } from "./actions";

type LeadDetailPageProps = {
  params: Promise<{
    leadId: string;
  }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { leadId } = await params;
  const session = await requireAdminSession();
  const business = await getActiveBusiness();

  if (!business) {
    notFound();
  }

  if (session.businessId !== business.id) {
    notFound();
  }

  const lead = await db.query.leads.findFirst({
    where: and(eq(leads.id, leadId), eq(leads.businessId, business.id)),
    with: {
      requestedService: true,
      appointmentRequests: {
        orderBy: (fields) => [asc(fields.createdAt)],
      },
      notes: {
        orderBy: (fields) => [asc(fields.createdAt)],
      },
    },
  });

  if (!lead) {
    notFound();
  }

  const intakePayload = lead.intakePayload ?? {};

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-6 py-10">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Lead Detail
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {lead.firstName} {lead.lastName ?? ""}
        </h1>
        <p className="mt-1 text-sm text-slate-700">{lead.email}</p>
        {lead.phone ? <p className="text-sm text-slate-700">{lead.phone}</p> : null}
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Request Info
            </h2>
            <dl className="mt-3 grid gap-3 text-sm text-slate-800 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-600">Lead Type</dt>
                <dd>{lead.leadType.replaceAll("_", " ")}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">Current Status</dt>
                <dd>{getLeadStatusLabel(lead.status)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">Requested Package</dt>
                <dd>{lead.requestedService?.name ?? "Not selected"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-600">Preferred Contact</dt>
                <dd>{lead.preferredContactMethod}</dd>
              </div>
              {lead.timeline ? (
                <div>
                  <dt className="font-semibold text-slate-600">Timeline</dt>
                  <dd>{lead.timeline}</dd>
                </div>
              ) : null}
              {lead.budgetRange ? (
                <div>
                  <dt className="font-semibold text-slate-600">Budget</dt>
                  <dd>{lead.budgetRange}</dd>
                </div>
              ) : null}
              {lead.companyName ? (
                <div>
                  <dt className="font-semibold text-slate-600">Company</dt>
                  <dd>{lead.companyName}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Message
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-800">
              {lead.message ?? "No message provided."}
            </p>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Intake Payload
            </h2>
            {Object.keys(intakePayload).length ? (
              <dl className="mt-3 space-y-2 text-sm text-slate-800">
                {Object.entries(intakePayload).map(([key, value]) => (
                  <div key={key}>
                    <dt className="font-semibold text-slate-600">{key}</dt>
                    <dd className="break-words">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No intake payload captured.</p>
            )}
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Appointment Requests
            </h2>
            {lead.appointmentRequests.length ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-800">
                {lead.appointmentRequests.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    {appointment.requestedDate ?? "Date not set"} |{" "}
                    {appointment.windowStart ?? "--:--"} -{" "}
                    {appointment.windowEnd ?? "--:--"} ({appointment.status})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                No appointment windows requested.
              </p>
            )}
          </section>
        </article>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Update Status
            </h2>
            <form action={updateLeadStatusAction} className="mt-3 space-y-3">
              <input name="leadId" type="hidden" value={lead.id} />
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                defaultValue={lead.status}
                name="status"
              >
                {leadStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-800"
                type="submit"
              >
                Save Status
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Internal Notes
            </h2>
            <form action={addLeadNoteAction} className="mt-3 space-y-3">
              <input name="leadId" type="hidden" value={lead.id} />
              <textarea
                className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                name="note"
                placeholder="Add follow-up context, call notes, or next actions."
                required
              />
              <button
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
                type="submit"
              >
                Add Note
              </button>
            </form>

            <ul className="mt-4 space-y-2">
              {lead.notes.map((note) => (
                <li
                  key={note.id}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
                >
                  <p className="whitespace-pre-wrap leading-6">{note.note}</p>
                  <p className="mt-1 text-xs text-slate-600">
                    {note.createdAt.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </section>
  );
}
