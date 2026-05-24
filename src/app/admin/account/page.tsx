import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { db } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";
import { AdminAccountPasswordForm } from "./password-form";

export default async function AdminAccountPage() {
  const session = await requireAdminSession();

  const admin = await db.query.admins.findFirst({
    where: and(
      eq(admins.id, session.adminId),
      eq(admins.businessId, session.businessId),
      eq(admins.isActive, true),
    ),
    columns: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!admin) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        Admin
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        Account
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        Signed in as <span className="font-semibold">{admin.email}</span>.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
        <p className="mt-2 text-sm text-slate-700">
          Use a strong password that is unique to this admin account.
        </p>
        <AdminAccountPasswordForm />
      </section>
    </section>
  );
}
