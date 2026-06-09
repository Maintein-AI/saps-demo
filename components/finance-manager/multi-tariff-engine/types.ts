export interface MultiTariffSet {
  id: string;
  tariffSetName: string;
  agentContract: string;
  consigneeTier: string;
  route: string;
  cargoClass: string;
  specialHandling: string;
  rateOverride: number;
  approvalRequired: boolean;
  effectiveDate: string;
  expiryDate: string;
  status: string;
  notes: string;
  requestedBy?: string;
  approver?: string;
  approvalStatus?: string;
  approvalNotes?: string;
  approvedAt?: string;
}

export interface ApprovalEntry {
  id: string;
  tariffSet: string;
  requestedBy: string;
  approvalRequired: boolean;
  approver: string;
  approvalStatus: string;
  approvalNotes: string;
  approvedAt: string;
}