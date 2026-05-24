import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/auth/admin-session.server";
import { getActiveBusiness } from "@/lib/business-context";
import { db } from "@/lib/db/client";
import { intakeQuestions } from "@/lib/db/schema";
import { IntakeQuestionCreateForm } from "./question-create-form";
import { IntakeQuestionEditForm } from "./question-edit-form";

export default async function AdminIntakePage() {
  const session = await requireAdminSession();
  const business = await getActiveBusiness();

  if (!business || session.businessId !== business.id) {
    notFound();
  }

  const questionRows = await db.query.intakeQuestions.findMany({
    where: eq(intakeQuestions.businessId, business.id),
    orderBy: [asc(intakeQuestions.sortOrder), asc(intakeQuestions.label)],
  });

  const activeQuestions = questionRows.filter((question) => question.isActive);
  const inactiveQuestions = questionRows.filter((question) => !question.isActive);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        Admin
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        Intake Questions
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        Manage the request-form intake questions shown for{" "}
        <span className="font-semibold">{business.businessName}</span>.
      </p>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Create Intake Question
        </h2>
        <IntakeQuestionCreateForm />
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Active Questions</h2>
        {activeQuestions.length ? (
          <div className="mt-4 space-y-4">
            {activeQuestions.map((question) => (
              <IntakeQuestionEditForm key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-700">
            No active intake questions yet. Create your first question above.
          </p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Inactive Questions</h2>
        {inactiveQuestions.length ? (
          <div className="mt-4 space-y-4">
            {inactiveQuestions.map((question) => (
              <IntakeQuestionEditForm key={question.id} question={question} />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-700">No inactive intake questions.</p>
        )}
      </section>
    </section>
  );
}
