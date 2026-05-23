export const businessModes = {
  localops: {
    label: "LocalOps Systems",
    primaryLeads: ["audit_request", "consultation_request"],
    primaryCta: "Request Free Business Systems Audit",
  },
  service_business: {
    label: "Service Business",
    primaryLeads: ["service_request", "estimate_request", "appointment_request"],
    primaryCta: "Request Service Estimate",
  },
} as const;

export type BusinessMode = keyof typeof businessModes;
