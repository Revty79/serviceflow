import Link from "next/link";
import { MissingBusinessConfig } from "@/components/public/missing-business-config";
import { getActiveBusinessContext } from "@/lib/business-context";
import { getPublicCopy } from "@/lib/public-copy";
import { getPublicThemeStyle } from "@/lib/public-theme";

export const dynamic = "force-dynamic";

export default async function Home() {
  const context = await getActiveBusinessContext();

  if (!context) {
    return <MissingBusinessConfig pageName="Homepage" />;
  }

  const { business, services } = context;
  const copy = getPublicCopy(business.mode);
  const themeStyle = getPublicThemeStyle({
    brandPrimary: business.brandPrimary,
    brandSecondary: business.brandSecondary,
    brandAccent: business.brandAccent,
  });
  const featuredServices = services.slice(0, 3);

  const branding = business.branding as {
    headline?: unknown;
    subheadline?: unknown;
    tone?: unknown;
  } | null;
  const customHeadline =
    branding && typeof branding.headline === "string"
      ? branding.headline
      : null;
  const customSubheadline =
    branding && typeof branding.subheadline === "string"
      ? branding.subheadline
      : null;
  const tone =
    branding && typeof branding.tone === "string" ? branding.tone : null;

  return (
    <main
      className="sf-public-theme mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-14"
      style={themeStyle}
    >
      <section className="sf-hero-surface rounded-3xl border p-8 shadow-sm">
        <p className="sf-kicker text-xs font-semibold uppercase tracking-widest">
          {business.businessName}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900">
          {customHeadline ?? copy.homepageHeadlineFallback}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
          {customSubheadline ?? copy.homepageSubheadlineFallback}
        </p>
        <p className="mt-2 max-w-2xl text-base leading-7 text-slate-700">
          Service area: {business.serviceArea}. {tone ? `Approach: ${tone}.` : ""}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="sf-btn-primary rounded-full px-5 py-2.5 text-sm font-semibold transition"
            href="/request"
          >
            {business.primaryCtaText}
          </Link>
          <Link
            className="sf-btn-secondary rounded-full border bg-white px-5 py-2.5 text-sm font-semibold transition"
            href="/packages"
          >
            {business.secondaryCtaText ?? "View Service Packages"}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Why {business.mode === "service_business" ? "customers" : "businesses"}{" "}
          choose {business.businessName}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {copy.benefitCards.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <h3 className="text-base font-semibold text-slate-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Popular services</h2>
          <Link
            className="sf-link-primary text-sm font-semibold"
            href="/services"
          >
            View all services
          </Link>
        </div>
        {featuredServices.length ? (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {featuredServices.map((service) => (
              <article
                key={service.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <h3 className="text-base font-semibold text-slate-900">
                  {service.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {service.summary ?? service.description ?? "Service package details."}
                </p>
                {service.priceLabel ? (
                  <p className="sf-price mt-3 text-sm font-semibold">
                    {service.priceLabel}
                  </p>
                ) : null}
                <Link
                  href="/request"
                  className="sf-link-primary mt-4 inline-block text-sm font-semibold"
                >
                  {business.mode === "service_business"
                    ? "Request service"
                    : "Request this service"}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-700">
            {business.mode === "service_business"
              ? "Services will appear here once configured."
              : "Service packages will appear here once configured."}
          </p>
        )}
      </section>
    </main>
  );
}
