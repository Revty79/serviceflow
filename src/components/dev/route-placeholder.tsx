type RoutePlaceholderProps = {
  title: string;
  description: string;
  routeType: "Public" | "Admin";
  nextMilestones: string[];
};

export function RoutePlaceholder({
  title,
  description,
  routeType,
  nextMilestones,
}: RoutePlaceholderProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-14">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        {routeType} MVP Route
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
        {description}
      </p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Next build steps</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          {nextMilestones.map((milestone) => (
            <li key={milestone}>{milestone}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
