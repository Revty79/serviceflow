import Link from "next/link";
import { MissingBusinessConfig } from "@/components/public/missing-business-config";
import { getActiveBusinessContext } from "@/lib/business-context";
import { getPublicCopy } from "@/lib/public-copy";

export const dynamic = "force-dynamic";

export default async function PackagesPage() {
  const context = await getActiveBusinessContext();

  if (!context) {
    return <MissingBusinessConfig pageName="Packages page" />;
  }

  const { business, services } = context;
  const copy = getPublicCopy(business.mode);
  const featured = services.find((service) => service.isFeatured) ?? services[0] ?? null;
  const standardPackages = featured
    ? services.filter((service) => service.id !== featured.id)
    : services;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          {business.businessName}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Packages & Pricing
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
          {copy.packagesPageIntro}
        </p>
      </section>

      {featured ? (
        <section className="mt-6 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-white p-6 shadow-sm">
          <span className="rounded-full bg-teal-700 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            Featured Package
          </span>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">{featured.name}</h2>
          {featured.priceLabel ? (
            <p className="mt-2 text-xl font-semibold text-teal-800">
              {featured.priceLabel}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {featured.summary ?? "Package details available on request."}
          </p>
          {featured.description ? (
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {featured.description}
            </p>
          ) : null}
          <Link
            href="/request"
            className="mt-5 inline-block rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            {business.mode === "service_business"
              ? "Request Service"
              : "Request Featured Package"}
          </Link>
        </section>
      ) : null}

      {standardPackages.length ? (
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {standardPackages.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">{service.name}</h2>
              {service.priceLabel ? (
                <p className="mt-2 text-lg font-semibold text-teal-800">
                  {service.priceLabel}
                </p>
              ) : (
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Custom pricing after discovery
                </p>
              )}
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {service.summary ?? "Package details available on request."}
              </p>
              {service.description ? (
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {service.description}
                </p>
              ) : null}
              <Link
                href="/request"
                className="mt-5 inline-block rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
              >
                {business.mode === "service_business"
                  ? "Request Service"
                  : "Request This Package"}
              </Link>
            </article>
          ))}
        </section>
      ) : null}

      {!services.length ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Packages are being prepared
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {business.mode === "service_business"
              ? "We are finalizing service options. Submit a request and we will follow up with recommendations based on your service needs."
              : "We are finalizing package options. Submit a request and we will follow up with recommendations based on your business needs."}
          </p>
          <Link
            href="/request"
            className="mt-5 inline-block rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            {business.mode === "service_business"
              ? "Request Service"
              : "Request an Audit"}
          </Link>
        </section>
      ) : null}
    </main>
  );
}
