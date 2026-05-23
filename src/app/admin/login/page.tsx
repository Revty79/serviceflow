import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/admin-session.server";
import { AdminLoginForm } from "./login-form";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin/leads");
  }

  return (
    <section className="mx-auto w-full max-w-md px-6 py-14">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
          Admin Access
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Sign in to ServiceFlow
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Use your admin credentials to access lead management.
        </p>
        <AdminLoginForm />
      </div>
    </section>
  );
}
