import { RoutePlaceholder } from "@/components/dev/route-placeholder";

export default function AdminLoginPage() {
  return (
    <RoutePlaceholder
      routeType="Admin"
      title="Admin Login"
      description="MVP auth entrypoint. This will start with a small, secure email/password flow and can later swap to Better Auth without touching lead modules."
      nextMilestones={[
        "Implement session-based auth using admins table credentials.",
        "Protect /admin routes with middleware and role checks.",
        "Add audit logging for failed and successful login attempts.",
      ]}
    />
  );
}
