import { RoutePlaceholder } from "@/components/dev/route-placeholder";

const leadStatusLabels = [
  "New",
  "Contacted",
  "Scheduled",
  "Proposal Sent",
  "Won",
  "Lost",
  "Follow Up Later",
];

export default function AdminLeadInboxPage() {
  return (
    <RoutePlaceholder
      routeType="Admin"
      title="Lead Inbox"
      description={`Core admin list view for triaging incoming leads. Planned statuses: ${leadStatusLabels.join(", ")}.`}
      nextMilestones={[
        "Query leads by active business and order by submitted_at desc.",
        "Add status filters and quick actions for assignment.",
        "Link each row to /admin/leads/[leadId] detail page.",
      ]}
    />
  );
}
