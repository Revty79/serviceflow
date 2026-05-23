export type MvpRoute = {
  path: string;
  title: string;
  purpose: string;
};

export const publicMvpRoutes: MvpRoute[] = [
  {
    path: "/",
    title: "Home",
    purpose: "Position the business and drive primary CTA actions.",
  },
  {
    path: "/services",
    title: "Services / What We Build",
    purpose: "Explain offerings and link each to a conversion path.",
  },
  {
    path: "/packages",
    title: "Pricing / Packages",
    purpose: "Provide transparent package options to pre-qualify leads.",
  },
  {
    path: "/request",
    title: "Request Audit / Contact",
    purpose: "Capture lead details and requested service outcome.",
  },
  {
    path: "/thank-you",
    title: "Thank You",
    purpose: "Confirm submission and set expectations for next contact.",
  },
];

export const adminMvpRoutes: MvpRoute[] = [
  {
    path: "/admin/login",
    title: "Admin Login",
    purpose: "Authenticate admins before accessing lead data.",
  },
  {
    path: "/admin/leads",
    title: "Lead Inbox",
    purpose: "Review and filter inbound leads by status and date.",
  },
  {
    path: "/admin/leads/[leadId]",
    title: "Lead Detail",
    purpose: "Inspect full lead profile, appointment requests, and notes.",
  },
  {
    path: "/admin/settings",
    title: "Business Settings",
    purpose: "Manage business branding, contact details, and CTA text.",
  },
];
