import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getActiveBusiness } from "@/lib/business-context";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { db } from "@/lib/db/client";
import { leads } from "@/lib/db/schema";
import { getLeadStatusLabel } from "@/lib/leads/status";

function formatDate(iso: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(iso);
}

export default async function AdminLeadInboxPage() {
  const session = await requireAdminSession();
  const business = await getActiveBusiness();

  if (!business) {
    return (
      <section className="mx-auto w-full max-w-4xl px-6 py-14">
        <h1 className="text-2xl font-semibold text-slate-900">Lead Inbox</h1>
        <p className="mt-2 text-sm text-slate-700">
          Active business configuration not found. Seed data and verify
          `SERVICEFLOW_BUSINESS_SLUG`.
        </p>
      </section>
    );
  }

  if (session.businessId !== business.id) {
    redirect("/admin/login");
  }

  const leadRows = await db.query.leads.findMany({
    where: eq(leads.businessId, business.id),
    orderBy: [desc(leads.submittedAt)],
    limit: 200,
    with: {
      requestedService: true,
      assignedAdmin: true,
    },
  });

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            Admin
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Lead Inbox
          </h1>
          <p className="mt-1 text-sm text-slate-700">
            {leadRows.length} lead{leadRows.length === 1 ? "" : "s"} for{" "}
            {business.businessName}.
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {leadRows.length === 0 ? (
          <p className="px-6 py-10 text-sm text-slate-600">
            No leads yet. New request form submissions will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Requested Package</th>
                  <th className="px-4 py-3">Assigned</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leadRows.map((lead) => (
                  <tr key={lead.id} className="align-top">
                    <td className="px-4 py-3 text-slate-700">
                      {formatDate(lead.submittedAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      <p className="font-semibold">
                        {lead.firstName} {lead.lastName ?? ""}
                      </p>
                      <p className="text-xs text-slate-600">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {lead.leadType.replaceAll("_", " ")}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {getLeadStatusLabel(lead.status)}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {lead.requestedService?.name ?? "Not selected"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {lead.assignedAdmin?.name ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        className="font-semibold text-teal-700 hover:text-teal-800"
                        href={`/admin/leads/${lead.id}`}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
