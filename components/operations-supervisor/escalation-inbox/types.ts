export interface EscalationRow {
  id: string;
  sourceModule: string;
  awb: string;
  issueType: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  createdAt: string;
  age: string;
  assignedTo: string;
  status: "Open" | "Awaiting Decision" | "Reassigned" | "Approved" | "Rejected" | "Closed";
  description: string;
  createdBy: string;
  slaDeadline: string;
  relatedEntity: string;
  evidenceCount: number;
  decisionNotes: string;
}

export interface TimelineEvent {
  timestamp: string;
  user: string;
  action: string;
  remarks: string;
}