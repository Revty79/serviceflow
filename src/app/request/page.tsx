import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export default function RequestPage() {
  return (
    <RoutePlaceholder
      routeType="Public"
      title="Request Audit / Contact"
      description="The MVP form route that creates leads and appointment requests. Form fields will be assembled from intake_questions + base lead fields."
      nextMilestones={[
        "Build shared lead intake schema with server-side validation.",
        "Insert lead record, optional appointment request, and redirect to thank-you.",
        "Capture mode-specific intent (audit, consultation, service request, estimate).",
      ]}
    />
  );
}
