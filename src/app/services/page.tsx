import Link from "next/link";
import { MissingBusinessConfig } from "@/components/public/missing-business-config";
import { getActiveBusinessContext } from "@/lib/business-context";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const context = await getActiveBusinessContext();

  if (!context) {
    return <MissingBusinessConfig pageName="Services page" />;
  }

  const { business, services } = context;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {business.businessName}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Services
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
          We help businesses in {business.serviceArea} build reliable lead handling,
          client intake, and follow-up systems that support consistent growth.
        </p>
      </section>

      {services.length ? (
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">{service.name}</h2>
                {service.isFeatured ? (
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                    Featured
                  </span>
                ) : null}
              </div>

              {service.priceLabel ? (
                <p className="mt-3 text-sm font-semibold text-teal-800">
                  {service.priceLabel}
                </p>
              ) : null}

              <p className="mt-3 text-sm leading-6 text-slate-700">
                {service.summary ?? "Service details available on request."}
              </p>
              {service.description ? (
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {service.description}
                </p>
              ) : null}

              <div className="mt-5">
                <Link
                  href="/request"
                  className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                >
                  Request This Service
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Services are being updated
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            We are preparing current service offerings. You can still submit a
            request and we will recommend the right package.
          </p>
          <Link
            href="/request"
            className="mt-5 inline-block rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Submit Request
          </Link>
        </section>
      )}
    </main>
  );
}
