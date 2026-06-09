export interface GatewayTransaction {
  id: string;
  gatewayTxnId: string;
  provider: string;
  invoiceNo: string;
  awbNo: string;
  payer: string;
  amount: number;
  convenienceFee: number;
  passThrough: boolean;
  payerMobile: string;
  payerEmail: string;
  status: string;
  webhookTime: string;
  webhookUrl: string;
  webhookPayload: string;
  settledAt: string;
  refundStatus: string;
  errorMessage: string;
  auditTrail: string;
  settlementBank: string;
  liveMode: boolean;
}

export interface ConfigEntry {
  provider: string;
  apiKey: string;
  apiSecret: string;
  webhookUrl: string;
  liveMode: boolean;
  settlementBank: string;
  convenienceFee: number;
  passThrough: boolean;
}