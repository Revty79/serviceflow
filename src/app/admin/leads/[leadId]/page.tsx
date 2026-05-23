import { RoutePlaceholder } from "@/components/dev/route-placeholder";

type LeadDetailPageProps = {
  params: Promise<{
    leadId: string;
  }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { leadId } = await params;

  return (
    <RoutePlaceholder
      routeType="Admin"
      title={`Lead Detail (${leadId})`}
      description="This view will hold full lead data, appointment requests, timeline activity, and internal notes."
      nextMilestones={[
        "Load one lead with notes and appointment requests via Drizzle relations.",
        "Add inline lead status update control.",
        "Add note composer for internal admin collaboration.",
      ]}
    />
  );
}
