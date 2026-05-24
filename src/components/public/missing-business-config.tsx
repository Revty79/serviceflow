import Link from "next/link";

type MissingBusinessConfigProps = {
  pageName: string;
};

export function MissingBusinessConfig({ pageName }: MissingBusinessConfigProps) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
          Configuration Needed
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {pageName} is not configured yet
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          ServiceFlow could not find an active business for
          {" "}
          <span className="font-semibold">SERVICEFLOW_BUSINESS_SLUG</span>.
          Seed a business and verify the environment value.
        </p>
        <div className="mt-5">
          <Link
            href="/request"
            className="rounded-full bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-800"
          >
            Go to Request Page
          </Link>
        </div>
      </section>
    </main>
  );
}
