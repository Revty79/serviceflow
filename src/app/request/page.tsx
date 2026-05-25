import { getActiveBusinessContext } from "@/lib/business-context";
import { getPublicCopy } from "@/lib/public-copy";
import { RequestForm } from "./request-form";
import { submitLeadRequestAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function RequestPage() {
  const context = await getActiveBusinessContext();

  if (!context) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Business profile not configured
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Seed and activate a business in `business_settings` for slug:
            {" "}
            <span className="font-semibold">SERVICEFLOW_BUSINESS_SLUG</span>.
          </p>
        </section>
      </main>
    );
  }

  const { business, services, intakeQuestions } = context;
  const copy = getPublicCopy(business.mode);

  return (
    <RequestForm
      action={submitLeadRequestAction}
      businessName={business.businessName}
      ctaText={business.primaryCtaText}
      email={business.email}
      intakeQuestionsList={intakeQuestions}
      leadTypeDefault={copy.requestLeadTypeDefault}
      leadTypeOptions={copy.requestLeadTypeOptions}
      brandAccent={business.brandAccent}
      brandPrimary={business.brandPrimary}
      brandSecondary={business.brandSecondary}
      phone={business.phone}
      requestDescription={copy.requestFormDescription}
      requestMessageLabel={copy.requestMessageLabel}
      requestTitle={copy.requestFormTitle}
      serviceArea={business.serviceArea}
      servicesList={services}
    />
  );
}
