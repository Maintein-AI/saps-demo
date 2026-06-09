export interface CargoData {
  awb: string;
  hawb: string;
  pieces: number;
  actualWeight: number;
  volumetricWeight: number;
  chargeableWeight: number;
  arrivalDate: string;
  freePeriodExpiry: string;
  billingStatus: string;
  consignee: string;
  cha: string;
  forwardingAgent: string;
  cargoClass: string;
  storageDays: number;
  do?: string;
}

export interface LineItem {
  lineType: string;
  awbHawb: string;
  pieces: number;
  weightBasis: string;
  rate: number;
  days: number;
  amount: number;
}

export interface Invoice {
  id: string;
  awb: string;
  consignee: string;
  amount: number;
  status: string;
  generatedAt: string;
  generatedBy: string;
}