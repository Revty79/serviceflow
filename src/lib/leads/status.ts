import type { LeadStatus } from "@/lib/db/schema";

export const leadStatusOptions: Array<{ value: LeadStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "follow_up_later", label: "Follow Up Later" },
];

const leadStatusLabelMap = new Map(
  leadStatusOptions.map((option) => [option.value, option.label]),
);

export function getLeadStatusLabel(status: LeadStatus) {
  return leadStatusLabelMap.get(status) ?? status;
}
