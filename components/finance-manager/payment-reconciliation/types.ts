export interface Payment {
  id: string;
  refNo: string;
  bank: string;
  receivedAt: string;
  payerName: string;
  amount: number;
  invoiceId: string;
  awb: string;
  status: string;
  matchedBy: string;
}

export interface ReconciliationException {
  type: string;
  count: number;
  totalAmount: number;
}