"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/finance-manager/payment-gateway-reconciliation/KPIStrip";
import FilterBar from "@/components/finance-manager/payment-gateway-reconciliation/FilterBar";
import TransactionTable from "@/components/finance-manager/payment-gateway-reconciliation/TransactionTable";
import DetailDrawer from "@/components/finance-manager/payment-gateway-reconciliation/DetailDrawer";
import ConfigCard from "@/components/finance-manager/payment-gateway-reconciliation/ConfigCard";
import { GatewayTransaction } from "@/components/finance-manager/payment-gateway-reconciliation/types";

const sampleTxns: GatewayTransaction[] = [
  { id: "1", gatewayTxnId: "HBL-2026-001847", provider: "HBL", invoiceNo: "INV-2026-0847", awbNo: "420-9876543", payer: "Schenker Pakistan", amount: 48750, convenienceFee: 2.5, passThrough: true, payerMobile: "+92 300 1122334", payerEmail: "billing@schenker.pk", status: "Success", webhookTime: "02 Jun 2026 14:23", webhookUrl: "https://api.airvault.pk/webhook/hbl", webhookPayload: "{ \"txnId\": \"HBL-2026-001847\", \"amount\": 48750, \"status\": \"SUCCESS\", \"invoiceRef\": \"INV-2026-0847\" }", settledAt: "03 Jun 2026 09:00", refundStatus: "None", errorMessage: "", auditTrail: "02 Jun 2026 14:23: Webhook received\n02 Jun 2026 14:24: Invoice INV-2026-0847 matched\n03 Jun 2026 09:00: Settlement confirmed", settlementBank: "HBL Main Branch", liveMode: true },
  { id: "2", gatewayTxnId: "MZN-2026-004231", provider: "Meezan", invoiceNo: "INV-2026-0848", awbNo: "420-8765432", payer: "Kuehne+Nagel Logistics", amount: 125000, convenienceFee: 2.0, passThrough: true, payerMobile: "+92 301 4455667", payerEmail: "accounts@kuehne.pk", status: "Success", webhookTime: "02 Jun 2026 15:45", webhookUrl: "https://api.airvault.pk/webhook/meezan", webhookPayload: "{ \"txnId\": \"MZN-2026-004231\", \"amount\": 125000, \"status\": \"SUCCESS\" }", settledAt: "04 Jun 2026 10:00", refundStatus: "None", errorMessage: "", auditTrail: "02 Jun 2026 15:45: Webhook received\n02 Jun 2026 15:46: Auto-matched to invoice\n04 Jun 2026 10:00: Settlement confirmed", settlementBank: "Meezan Bank Ltd", liveMode: true },
  { id: "3", gatewayTxnId: "NIFT-2026-007893", provider: "NIFT", invoiceNo: "INV-2026-0849", awbNo: "420-7654321", payer: "Gerry's International", amount: 18200, convenienceFee: 1.5, passThrough: false, payerMobile: "+92 302 7788991", payerEmail: "finance@gerrys.pk", status: "Pending", webhookTime: "03 Jun 2026 08:12", webhookUrl: "https://api.airvault.pk/webhook/nift", webhookPayload: "{ \"txnId\": \"NIFT-2026-007893\", \"amount\": 18200, \"status\": \"PENDING\", \"expiry\": \"2026-06-03T16:00:00Z\" }", settledAt: "", refundStatus: "None", errorMessage: "", auditTrail: "03 Jun 2026 08:12: Webhook received — status PENDING", settlementBank: "NIFT Settlement", liveMode: true },
  { id: "4", gatewayTxnId: "EP-2026-002156", provider: "Easypaisa", invoiceNo: "INV-2026-0850", awbNo: "420-6543210", payer: "Pakistan Oilfields Ltd", amount: 87500, convenienceFee: 3.0, passThrough: true, payerMobile: "+92 303 2233445", payerEmail: "payables@pol.pk", status: "Failed", webhookTime: "03 Jun 2026 11:30", webhookUrl: "https://api.airvault.pk/webhook/easypaisa", webhookPayload: "{ \"txnId\": \"EP-2026-002156\", \"status\": \"FAILED\", \"reason\": \"INSUFFICIENT_BALANCE\" }", settledAt: "", refundStatus: "None", errorMessage: "Payer account insufficient balance. Txn declined by Easypaisa.", auditTrail: "03 Jun 2026 11:30: Webhook received — FAILED\n03 Jun 2026 11:31: Insufficient balance error logged\n03 Jun 2026 12:00: Payment retry scheduled", settlementBank: "Easypaisa Settlement", liveMode: true },
  { id: "5", gatewayTxnId: "JC-2026-009102", provider: "JazzCash", invoiceNo: "INV-2026-0851", awbNo: "420-5432109", payer: "Ministry of Health", amount: 0, convenienceFee: 0, passThrough: false, payerMobile: "+92 304 5566778", payerEmail: "payments@health.gov.pk", status: "Success", webhookTime: "01 Jun 2026 09:15", webhookUrl: "https://api.airvault.pk/webhook/jazzcash", webhookPayload: "{ \"txnId\": \"JC-2026-009102\", \"amount\": 0, \"status\": \"SUCCESS\", \"waiver\": \"GOVT_EXEMPT\" }", settledAt: "01 Jun 2026 09:15", refundStatus: "None", errorMessage: "", auditTrail: "01 Jun 2026 09:15: Webhook received — GOVT_EXEMPT\n01 Jun 2026 09:15: Auto-settled (zero amount)", settlementBank: "JazzCash Settlement", liveMode: true },
  { id: "6", gatewayTxnId: "1LNK-2026-003045", provider: "1LINK", invoiceNo: "INV-2026-0852", awbNo: "420-4321098", payer: "Atlas Logistics", amount: 45200, convenienceFee: 1.8, passThrough: false, payerMobile: "+92 305 8899001", payerEmail: "billing@atlas.pk", status: "Success", webhookTime: "02 Jun 2026 16:50", webhookUrl: "https://api.airvault.pk/webhook/1link", webhookPayload: "{ \"txnId\": \"1LNK-2026-003045\", \"amount\": 45200, \"status\": \"SUCCESS\", \"invoiceRef\": \"INV-2026-0852\" }", settledAt: "", refundStatus: "None", errorMessage: "", auditTrail: "02 Jun 2026 16:50: Webhook received\n02 Jun 2026 16:51: Invoice matched\n02 Jun 2026 16:52: Awaiting settlement", settlementBank: "1LINK Settlement", liveMode: true },
  { id: "7", gatewayTxnId: "HBL-2026-001920", provider: "HBL", invoiceNo: "INV-2026-0853", awbNo: "420-3210987", payer: "International Pharma", amount: 67500, convenienceFee: 2.5, passThrough: true, payerMobile: "+92 306 1122334", payerEmail: "accounts@ipharma.pk", status: "Refunded", webhookTime: "28 May 2026 10:00", webhookUrl: "https://api.airvault.pk/webhook/hbl", webhookPayload: "{ \"txnId\": \"HBL-2026-001920\", \"amount\": 67500, \"status\": \"REFUNDED\" }", settledAt: "28 May 2026 10:00", refundStatus: "Completed", errorMessage: "", auditTrail: "28 May 2026 10:00: Payment received\n01 Jun 2026 09:00: Refund request submitted\n01 Jun 2026 14:00: Refund completed", settlementBank: "HBL Main Branch", liveMode: true },
  { id: "8", gatewayTxnId: "MZN-2026-004350", provider: "Meezan", invoiceNo: "INV-2026-0854", awbNo: "420-2109876", payer: "M/s Ahmed Brothers", amount: 23400, convenienceFee: 2.0, passThrough: false, payerMobile: "+92 307 3344556", payerEmail: "ahmed@brothers.pk", status: "Failed", webhookTime: "03 Jun 2026 13:10", webhookUrl: "https://api.airvault.pk/webhook/meezan", webhookPayload: "{ \"txnId\": \"MZN-2026-004350\", \"status\": \"FAILED\", \"reason\": \"CARD_EXPIRED\" }", settledAt: "", refundStatus: "None", errorMessage: "Payer card expired. Meezan declined transaction.", auditTrail: "03 Jun 2026 13:10: Webhook received — FAILED\n03 Jun 2026 13:11: Card expired error logged", settlementBank: "Meezan Bank Ltd", liveMode: true },
  { id: "9", gatewayTxnId: "NIFT-2026-008012", provider: "NIFT", invoiceNo: "INV-2026-0855", awbNo: "420-1098765", payer: "NLC CFS", amount: 189000, convenienceFee: 1.5, passThrough: true, payerMobile: "+92 308 6677889", payerEmail: "finance@nlc.pk", status: "Pending", webhookTime: "03 Jun 2026 14:30", webhookUrl: "https://api.airvault.pk/webhook/nift", webhookPayload: "{ \"txnId\": \"NIFT-2026-008012\", \"amount\": 189000, \"status\": \"PENDING\", \"invoiceRef\": \"INV-2026-0855\" }", settledAt: "", refundStatus: "None", errorMessage: "", auditTrail: "03 Jun 2026 14:30: Webhook received — PENDING", settlementBank: "NIFT Settlement", liveMode: true },
  { id: "10", gatewayTxnId: "EP-2026-002300", provider: "Easypaisa", invoiceNo: "INV-2026-0856", awbNo: "420-0987654", payer: "Sana Textile", amount: 52000, convenienceFee: 3.0, passThrough: true, payerMobile: "+92 309 9988776", payerEmail: "billing@sanatextile.pk", status: "Success", webhookTime: "02 Jun 2026 09:45", webhookUrl: "https://api.airvault.pk/webhook/easypaisa", webhookPayload: "{ \"txnId\": \"EP-2026-002300\", \"amount\": 52000, \"status\": \"SUCCESS\", \"invoiceRef\": \"INV-2026-0856\" }", settledAt: "03 Jun 2026 11:00", refundStatus: "None", errorMessage: "", auditTrail: "02 Jun 2026 09:45: Webhook received\n02 Jun 2026 09:46: Invoice matched\n03 Jun 2026 11:00: Settlement confirmed", settlementBank: "Easypaisa Settlement", liveMode: true },
  { id: "11", gatewayTxnId: "JC-2026-009215", provider: "JazzCash", invoiceNo: "INV-2026-0857", awbNo: "420-9876543", payer: "Sana Khan (Individual)", amount: 8900, convenienceFee: 2.0, passThrough: false, payerMobile: "+92 310 2233445", payerEmail: "sana.khan@email.com", status: "Success", webhookTime: "01 Jun 2026 11:20", webhookUrl: "https://api.airvault.pk/webhook/jazzcash", webhookPayload: "{ \"txnId\": \"JC-2026-009215\", \"amount\": 8900, \"status\": \"SUCCESS\" }", settledAt: "02 Jun 2026 08:00", refundStatus: "None", errorMessage: "", auditTrail: "01 Jun 2026 11:20: Webhook received\n02 Jun 2026 08:00: Settlement confirmed", settlementBank: "JazzCash Settlement", liveMode: true },
  { id: "12", gatewayTxnId: "1LNK-2026-003188", provider: "1LINK", invoiceNo: "INV-2026-0858", awbNo: "420-8765432", payer: "Imran Ali Traders", amount: 31000, convenienceFee: 1.8, passThrough: false, payerMobile: "+92 311 5566778", payerEmail: "imran@ali.traders.pk", status: "Pending", webhookTime: "03 Jun 2026 16:00", webhookUrl: "https://api.airvault.pk/webhook/1link", webhookPayload: "{ \"txnId\": \"1LNK-2026-003188\", \"amount\": 31000, \"status\": \"PENDING\" }", settledAt: "", refundStatus: "None", errorMessage: "", auditTrail: "03 Jun 2026 16:00: Webhook received — PENDING", settlementBank: "1LINK Settlement", liveMode: true },
];

export default function PaymentGatewayReconciliationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [transactions, setTransactions] = useState<GatewayTransaction[]>(sampleTxns);
  const [filteredTxns, setFilteredTxns] = useState<GatewayTransaction[]>(sampleTxns);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<GatewayTransaction | null>(null);
  const [filters, setFilters] = useState({
    provider: "",
    txnId: "",
    invoiceNo: "",
    payer: "",
    status: "",
    settlementDate: "",
    refundStatus: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...transactions];
    if (filters.provider) filtered = filtered.filter(t => t.provider === filters.provider);
    if (filters.txnId) filtered = filtered.filter(t => t.gatewayTxnId.toLowerCase().includes(filters.txnId.toLowerCase()));
    if (filters.invoiceNo) filtered = filtered.filter(t => t.invoiceNo.toLowerCase().includes(filters.invoiceNo.toLowerCase()));
    if (filters.payer) filtered = filtered.filter(t => t.payer.toLowerCase().includes(filters.payer.toLowerCase()));
    if (filters.status) filtered = filtered.filter(t => t.status === filters.status);
    if (filters.refundStatus) filtered = filtered.filter(t => t.refundStatus === filters.refundStatus);
    setFilteredTxns(filtered);
  }, [filters, transactions]);

  const handleViewDetail = (t: GatewayTransaction) => {
    setSelectedTxn(t);
    setDrawerOpen(true);
  };

  const handleRecheck = (t: GatewayTransaction) => {
    addToast(`Recheck triggered for ${t.gatewayTxnId}`, "success");
  };

  const handleMatchInvoice = (t: GatewayTransaction) => {
    addToast(`Invoice ${t.invoiceNo} matched`, "success");
  };

  const handleSettlement = (t: GatewayTransaction) => {
    const updated = transactions.map(txn =>
      txn.id === t.id ? { ...txn, settledAt: "04 Jun 2026 09:00", status: "Success" as const } : txn
    );
    setTransactions(updated);
    addToast(`Settlement marked for ${t.gatewayTxnId}`, "success");
  };

  const handleRefund = (t: GatewayTransaction) => {
    const updated = transactions.map(txn =>
      txn.id === t.id ? { ...txn, refundStatus: "Pending" as const, status: "Refunded" as const } : txn
    );
    setTransactions(updated);
    addToast(`Refund initiated for ${t.gatewayTxnId}`, "success");
  };

  const handleReceipt = (t: GatewayTransaction) => {
    addToast(`Receipt downloaded for ${t.gatewayTxnId}`, "success");
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const kpiData = {
    gatewayTransactions: transactions.length,
    successfulPayments: transactions.filter(t => t.status === "Success").length,
    failedPayments: transactions.filter(t => t.status === "Failed").length,
    refunds: transactions.filter(t => t.refundStatus !== "None").length,
    settlementPending: transactions.filter(t => t.status === "Success" && !t.settledAt).length,
    webhookErrors: transactions.filter(t => t.errorMessage).length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Finance Manager", href: "#" },
            { label: "Payment Gateway Reconciliation" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Payment Gateway Reconciliation
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowError(!showError);
                if (!showError) addToast("Error state simulated", "error");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showError ? "Hide Error" : "Simulate Error"}
            </button>
            <button
              onClick={() => {
                setShowEmpty(!showEmpty);
                if (!showEmpty) addToast("Empty state shown", "success");
              }}
              className="text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
            >
              {showEmpty ? "Show Data" : "Simulate Empty"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {showError && (
        <ErrorState
          title="Gateway reconciliation unavailable"
          message="Payment gateway API could not be reached. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No gateway transactions found"
          description="Gateway transactions will appear here once payments are processed through integrated providers."
          actionLabel="Refresh"
          onAction={() => {
            setShowEmpty(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <>
          {/* Info Banner */}
          {!isLoading && (
            <div className="rounded-[16px] border border-[#FEF3C7] bg-[#FEF3C7]/30 p-4 shadow-sm flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
              </div>
              <div>
                <span className="text-[13px] font-semibold text-[#D97706] block mb-0.5">
                  Extended Scope Notice
                </span>
                <span className="text-[13px] text-[#D97706]/80">
                  Payment gateway reconciliation is outside awarded contract scope and belongs to the One-Window Vision delta.
                </span>
              </div>
            </div>
          )}

          {/* Top Actions */}
          {!isLoading && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => addToast("Gateway file exported", "success")}
                className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
                style={{ backgroundColor: "#0B2545" }}
              >
                Export Gateway File
              </button>
              <button
                onClick={() => addToast("Settlement report downloaded", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Download Settlement Report
              </button>
              <button
                onClick={() => addToast("Webhook log downloaded", "success")}
                className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
              >
                Download Webhook Log
              </button>
            </div>
          )}

          {/* KPI Strip */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
                  <div className="h-3 w-20 bg-[#F1F5F9] rounded animate-pulse mb-2" />
                  <div className="h-7 w-16 bg-[#F1F5F9] rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <KPIStrip data={kpiData} />
          )}

          {/* Filter Bar */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <div className="h-10 w-full bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ) : (
            <FilterBar filters={filters} onFilterChange={setFilters} />
          )}

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Config Card */}
            <div className="lg:col-span-1">
              <ConfigCard />
            </div>

            {/* Right: Transaction Table */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
                  <div className="h-5 w-40 bg-[#F1F5F9] rounded animate-pulse mb-4" />
                  <LoadingSkeleton rows={5} columns={11} />
                </div>
              ) : (
                <TransactionTable
                  transactions={filteredTxns}
                  onViewDetail={handleViewDetail}
                  onRecheck={handleRecheck}
                  onMatchInvoice={handleMatchInvoice}
                  onSettlement={handleSettlement}
                  onRefund={handleRefund}
                  onReceipt={handleReceipt}
                />
              )}
            </div>
          </div>
        </>
      )}

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedTxn(null); }}
        transaction={selectedTxn}
        onRecheck={handleRecheck}
        onSettlement={handleSettlement}
        onRefund={handleRefund}
        onReceipt={handleReceipt}
      />
    </div>
  );
}