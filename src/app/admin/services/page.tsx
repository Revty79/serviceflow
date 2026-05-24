import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { getActiveBusiness } from "@/lib/business-context";
import { db } from "@/lib/db/client";
import { services } from "@/lib/db/schema";
import { ServiceCreateForm } from "./service-create-form";
import { ServiceEditForm } from "./service-edit-form";

export default async function AdminServicesPage() {
  const session = await requireAdminSession();
  const business = await getActiveBusiness();

  if (!business || session.businessId !== business.id) {
    notFound();
  }

  const serviceRows = await db.query.services.findMany({
    where: eq(services.businessId, business.id),
    orderBy: [asc(services.sortOrder), asc(services.name)],
  });

  const activeServices = serviceRows.filter((service) => service.isActive);
  const inactiveServices = serviceRows.filter((service) => !service.isActive);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        Admin
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        Services & Packages
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        Manage the services shown on your public site pages for{" "}
        <span className="font-semibold">{business.businessName}</span>.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Create Service</h2>
        <ServiceCreateForm />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Active Services</h2>
        {activeServices.length ? (
          <div className="mt-4 space-y-4">
            {activeServices.map((service) => (
              <ServiceEditForm key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-700">
            No active services yet. Create your first service above.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Inactive Services</h2>
        {inactiveServices.length ? (
          <div className="mt-4 space-y-4">
            {inactiveServices.map((service) => (
              <ServiceEditForm key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-700">
            No inactive services.
          </p>
        )}
      </section>
    </section>
  );
}
