import type { BusinessMode, LeadType } from "@/lib/db/schema";

export type PublicBenefitCard = {
  title: string;
  description: string;
};

export type PublicLeadTypeOption = {
  value: LeadType;
  label: string;
};

type PublicCopy = {
  homepageHeadlineFallback: string;
  homepageSubheadlineFallback: string;
  benefitCards: PublicBenefitCard[];
  servicesPageIntro: string;
  packagesPageIntro: string;
  requestFormTitle: string;
  requestFormDescription: string;
  requestMessageLabel: string;
  requestLeadTypeDefault: LeadType;
  requestLeadTypeOptions: PublicLeadTypeOption[];
  thankYouFollowUp: string;
};

const MODE_PUBLIC_COPY: Record<BusinessMode, PublicCopy> = {
  localops: {
    homepageHeadlineFallback:
      "Business systems implementation for local service companies that want fewer missed opportunities.",
    homepageSubheadlineFallback:
      "We help small businesses streamline lead capture, response time, and follow-up so growth does not depend on chaos.",
    benefitCards: [
      {
        title: "Capture more leads",
        description:
          "Collect complete request details with clear calls to action and structured intake.",
      },
      {
        title: "Respond faster",
        description:
          "Route inquiries into one lead inbox so your team can answer quickly and consistently.",
      },
      {
        title: "Organize requests",
        description:
          "Track every incoming request by status from first contact through proposal and scheduling.",
      },
      {
        title: "Follow up consistently",
        description:
          "Keep notes, update next steps, and reduce drop-off from missed outreach.",
      },
    ],
    servicesPageIntro:
      "We help businesses build reliable lead handling, client intake, and follow-up systems that support consistent growth.",
    packagesPageIntro:
      "Choose a package based on your current stage, then request an audit or consultation to confirm fit and rollout timing.",
    requestFormTitle: "Request Business Systems Audit",
    requestFormDescription:
      "Tell us where operations are breaking down, and we will follow up with a practical plan.",
    requestMessageLabel: "What should we know before contacting you? *",
    requestLeadTypeDefault: "audit_request",
    requestLeadTypeOptions: [
      { value: "audit_request", label: "Free Audit Request" },
      { value: "consultation_request", label: "Consultation Request" },
      { value: "general_contact", label: "General Contact" },
    ],
    thankYouFollowUp:
      "A team member will review your details and follow up within one business day. We typically respond by your preferred contact method first.",
  },
  service_business: {
    homepageHeadlineFallback:
      "Trusted local service with clear communication from first request to completed work.",
    homepageSubheadlineFallback:
      "Request service, estimate, or appointment in a few minutes. We will confirm details and follow up quickly.",
    benefitCards: [
      {
        title: "Capture more leads",
        description:
          "Make it easy for customers to submit service requests with complete details.",
      },
      {
        title: "Respond faster",
        description:
          "Get organized service requests in one place so your team can reply quickly.",
      },
      {
        title: "Organize requests",
        description:
          "Track jobs by status from new request to scheduled appointment and completed follow-up.",
      },
      {
        title: "Follow up consistently",
        description:
          "Avoid missed callbacks with clear notes and consistent next steps for each customer.",
      },
    ],
    servicesPageIntro:
      "Explore our services and request the help you need. We serve local customers with clear timelines and dependable communication.",
    packagesPageIntro:
      "Review common service options and pricing guidance, then request the service or estimate that fits your needs.",
    requestFormTitle: "Request Service, Estimate, or Appointment",
    requestFormDescription:
      "Tell us what you need help with and the best way to reach you. We will follow up about your service request.",
    requestMessageLabel: "Tell us what you need help with *",
    requestLeadTypeDefault: "service_request",
    requestLeadTypeOptions: [
      { value: "service_request", label: "Service Request" },
      { value: "estimate_request", label: "Estimate Request" },
      { value: "appointment_request", label: "Appointment Request" },
      { value: "general_contact", label: "General Contact" },
    ],
    thankYouFollowUp:
      "We received your request and will follow up about your service request within one business day. We typically reply using your preferred contact method first.",
  },
};

export function getPublicCopy(mode: BusinessMode): PublicCopy {
  return MODE_PUBLIC_COPY[mode];
}
