export interface TariffLine {
  id: string;
  cargoClass: string;
  handlingCode: string;
  chargeType: string;
  freeDays: number;
  slabFromDay: number;
  slabToDay: number;
  rate: number;
  minimumCharge: number;
  surcharge: number;
  effectiveFrom: string;
  status: string;
  tariffVersion: string;
}

export interface TariffVersion {
  name: string;
  effectiveFrom: string;
  effectiveTo: string;
  status: string;
  createdBy: string;
  approvedBy: string;
  notes: string;
}

export interface AuditEntry {
  id: string;
  changedBy: string;
  changedAt: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
  reason: string;
}