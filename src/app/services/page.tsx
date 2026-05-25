import Link from "next/link";
import { MissingBusinessConfig } from "@/components/public/missing-business-config";
import { getActiveBusinessContext } from "@/lib/business-context";
import { getPublicCopy } from "@/lib/public-copy";
import { getPublicThemeStyle } from "@/lib/public-theme";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const context = await getActiveBusinessContext();

  if (!context) {
    return <MissingBusinessConfig pageName="Services page" />;
  }

  const { business, services } = context;
  const copy = getPublicCopy(business.mode);
  const themeStyle = getPublicThemeStyle({
    brandPrimary: business.brandPrimary,
    brandSecondary: business.brandSecondary,
    brandAccent: business.brandAccent,
  });

  return (
    <main
      className="sf-public-theme mx-auto w-full max-w-6xl px-6 py-12"
      style={themeStyle}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="sf-kicker text-xs font-semibold uppercase tracking-wide">
          {business.businessName}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Services
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
          {copy.servicesPageIntro} Service area: {business.serviceArea}.
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
                  <span className="sf-featured-badge rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide">
                    Featured
                  </span>
                ) : null}
              </div>

              {service.priceLabel ? (
                <p className="sf-price mt-3 text-sm font-semibold">
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
                  className="sf-btn-primary rounded-full px-5 py-2.5 text-sm font-semibold transition"
                >
                  {business.mode === "service_business"
                    ? "Request Service"
                    : "Request This Service"}
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
            {business.mode === "service_business"
              ? "We are preparing current service offerings. You can still submit a request and we will recommend the right service."
              : "We are preparing current service offerings. You can still submit a request and we will recommend the right package."}
          </p>
          <Link
            href="/request"
            className="sf-btn-primary mt-5 inline-block rounded-full px-5 py-2.5 text-sm font-semibold transition"
          >
            {business.mode === "service_business"
              ? "Request Service"
              : "Submit Request"}
          </Link>
        </section>
      )}
    </main>
  );
}
