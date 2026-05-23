import Link from "next/link";
import { getAdminSession } from "@/lib/auth/admin-session.server";
import { logoutAdminAction } from "./actions";

const adminNav = [
  { href: "/admin/login", label: "Login" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link className="text-sm font-semibold text-slate-900" href="/">
            ServiceFlow
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-700">
            {adminNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-slate-950">
                {item.label}
              </Link>
            ))}
            {session ? (
              <form action={logoutAdminAction}>
                <button className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400">
                  Logout
                </button>
              </form>
            ) : null}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
