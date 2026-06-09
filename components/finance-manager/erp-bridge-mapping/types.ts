export interface ERPMapping {
  id: string;
  mappingId: string;
  chargeType: string;
  glAccount: string;
  taxAccount: string;
  costCenter: string;
  postingRule: string;
  debitCredit: string;
  taxCode: string;
  currency: string;
  active: boolean;
  notes: string;
  syncStatus: string;
  lastUpdated: string;
}

export interface ERPSyncLog {
  id: string;
  syncId: string;
  invoiceNo: string;
  journalRef: string;
  erpTarget: string;
  amount: number;
  tax: number;
  status: string;
  sentAt: string;
  response: string;
  awbNo: string;
  chargeType: string;
  glAccount: string;
  costCenter: string;
  payload: string;
  auditTrail: string;
}

export interface ERPTargetConfig {
  erpTarget: string;
  connectionName: string;
  environment: string;
  apiEndpoint: string;
  authType: string;
  lastSync: string;
  syncStatus: string;
  errorMessage: string;
}

export interface GLMappingRule {
  glAccount: string;
  chargeType: string;
  taxAccount: string;
  costCenter: string;
  postingRule: string;
  debitCredit: string;
  taxCode: string;
  currency: string;
  active: boolean;
  notes: string;
}