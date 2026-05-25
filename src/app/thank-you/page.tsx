import Link from "next/link";
import { MissingBusinessConfig } from "@/components/public/missing-business-config";
import { getActiveBusiness } from "@/lib/business-context";
import { getPublicCopy } from "@/lib/public-copy";
import { getPublicThemeStyle } from "@/lib/public-theme";

export const dynamic = "force-dynamic";

export default async function ThankYouPage() {
  const business = await getActiveBusiness();

  if (!business) {
    return <MissingBusinessConfig pageName="Thank-you page" />;
  }

  const copy = getPublicCopy(business.mode);
  const themeStyle = getPublicThemeStyle({
    brandPrimary: business.brandPrimary,
    brandSecondary: business.brandSecondary,
    brandAccent: business.brandAccent,
  });

  return (
    <main
      className="sf-public-theme mx-auto w-full max-w-3xl px-6 py-16"
      style={themeStyle}
    >
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="sf-kicker text-sm font-semibold uppercase tracking-wide">
          Submission Received
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Thanks, {business.businessName} received your request.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          {copy.thankYouFollowUp}
        </p>
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{business.businessName}</p>
          <p>{business.phone}</p>
          <p>{business.email}</p>
          <p className="mt-1">Service area: {business.serviceArea}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="sf-btn-primary rounded-full px-5 py-2.5 text-sm font-semibold transition"
          >
            Back to Home
          </Link>
          <Link
            href="/services"
            className="sf-btn-secondary rounded-full border bg-white px-5 py-2.5 text-sm font-semibold transition"
          >
            View Services
          </Link>
        </div>
      </section>
    </main>
  );
}
