import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Submission Received
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Thanks, we have your request.
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          This page will eventually pull business-specific follow-up messaging from
          `business_settings`, including response windows and preferred contact
          channel.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
