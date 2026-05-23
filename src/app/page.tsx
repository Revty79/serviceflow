import Link from "next/link";
import { adminMvpRoutes, publicMvpRoutes } from "@/lib/routes/mvp-routes";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-14">
      <section className="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 via-white to-amber-50 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">
          ClientFlow Template
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900">
          Reusable lead capture and client workflow starter for local service
          businesses.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
          This first pass sets the project foundation, database shape, and MVP
          route map before feature implementation.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
            href="/request"
          >
            Open Request Route
          </Link>
          <Link
            className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
            href="/admin/leads"
          >
            Open Admin Leads Route
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Public MVP routes</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            {publicMvpRoutes.map((route) => (
              <li key={route.path}>
                <p className="font-semibold">
                  <Link className="text-teal-700 hover:text-teal-800" href={route.path}>
                    {route.path}
                  </Link>{" "}
                  - {route.title}
                </p>
                <p>{route.purpose}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Admin MVP routes</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-700">
            {adminMvpRoutes.map((route) => (
              <li key={route.path}>
                <p className="font-semibold">
                  <Link
                    className="text-teal-700 hover:text-teal-800"
                    href={route.path.replace("[leadId]", "sample")}
                  >
                    {route.path}
                  </Link>{" "}
                  - {route.title}
                </p>
                <p>{route.purpose}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">What is included now</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Drizzle schema draft for core lead, admin, and settings entities.</li>
          <li>Seed data for LocalOps Systems as the initial client configuration.</li>
          <li>Route structure for public and admin MVP pages.</li>
          <li>Environment-driven config and database tooling scripts.</li>
        </ul>
      </section>
    </main>
  );
}
