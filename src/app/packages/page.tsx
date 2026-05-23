import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export default function PackagesPage() {
  return (
    <RoutePlaceholder
      routeType="Public"
      title="Pricing / Packages"
      description="This page is the package pricing layer. It will stay reusable by drawing package names, summaries, and price labels from services."
      nextMilestones={[
        "Group featured and standard packages from the services table.",
        "Support business-mode-specific copy while reusing layout.",
        "Add CTA buttons that open /request with package context.",
      ]}
    />
  );
}
