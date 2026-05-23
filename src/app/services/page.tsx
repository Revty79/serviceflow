import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export default function ServicesPage() {
  return (
    <RoutePlaceholder
      routeType="Public"
      title="Services / What We Build"
      description="This route will render business-specific services from the database and explain implementation outcomes for each package."
      nextMilestones={[
        "Read active business slug from environment + business settings table.",
        "Load and display active services ordered by sort_order.",
        "Link each service card to the request form with preselected intent.",
      ]}
    />
  );
}
