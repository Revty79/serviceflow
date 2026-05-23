import { RoutePlaceholder } from "@/components/dev/route-placeholder";
import { requireAdminSession } from "@/lib/auth/admin-session.server";

export default async function AdminSettingsPage() {
  await requireAdminSession();

  return (
    <RoutePlaceholder
      routeType="Admin"
      title="Business Settings"
      description="Single source of truth for reusable business identity: name, contacts, service area, CTA text, and brand tokens."
      nextMilestones={[
        "Read + update business_settings for the active business slug.",
        "Allow editing of branding and CTA copy fields.",
        "Add preview links to confirm public pages reflect changes.",
      ]}
    />
  );
}
