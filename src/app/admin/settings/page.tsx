import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { getActiveBusiness } from "@/lib/business-context";
import { BusinessSettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const session = await requireAdminSession();
  const business = await getActiveBusiness();

  if (!business || business.id !== session.businessId) {
    notFound();
  }

  const contactRouting =
    (business.contactRouting as { notifyEmails?: unknown } | null) ?? null;
  const notifyEmailsDefault = Array.isArray(contactRouting?.notifyEmails)
    ? contactRouting.notifyEmails
        .filter((value): value is string => typeof value === "string")
        .join(", ")
    : "";

  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        Admin
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        Business Settings
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        Update your active ServiceFlow business profile. Changes apply to public
        pages such as `/request`.
      </p>

      <BusinessSettingsForm
        business={business}
        notifyEmailsDefault={notifyEmailsDefault}
      />
    </section>
  );
}
