import Link from "next/link";
import { MissingBusinessConfig } from "@/components/public/missing-business-config";
import { getActiveBusiness } from "@/lib/business-context";
import { getPublicCopy } from "@/lib/public-copy";

export const dynamic = "force-dynamic";

export default async function ThankYouPage() {
  const business = await getActiveBusiness();

  if (!business) {
    return <MissingBusinessConfig pageName="Thank-you page" />;
  }

  const copy = getPublicCopy(business.mode);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
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
            className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Back to Home
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
          >
            View Services
          </Link>
        </div>
      </section>
    </main>
  );
}
