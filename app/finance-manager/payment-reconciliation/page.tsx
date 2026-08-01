"use client";

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/finance-manager/payment-reconciliation/KPIStrip";
import FilterBar from "@/components/finance-manager/payment-reconciliation/FilterBar";
import BankSettlementTable from "@/components/finance-manager/payment-reconciliation/BankSettlementTable";
import ManualMatchDrawer from "@/components/finance-manager/payment-reconciliation/ManualMatchDrawer";
import ExceptionSummary from "@/components/finance-manager/payment-reconciliation/ExceptionSummary";
import { Payment } from "@/components/finance-manager/payment-reconciliation/types";

const samplePayments: Payment[] = [
  { id: "1", refNo: "PAY-HBL-2026-0012", bank: "HBL", receivedAt: "31 May 2026 10:40", payerName: "Al Noor Traders", amount: 148500, invoiceId: "INV-2026-0081", awb: "214-45678901", status: "Matched", matchedBy: "Auto" },
  { id: "2", refNo: "PAY-MEEZAN-2026-0021", bank: "Meezan", receivedAt: "31 May 2026 11:05", payerName: "Karachi Pharma Imports", amount: 42850, invoiceId: "INV-2026-0082", awb: "157-90811223", status: "Unmatched", matchedBy: "—" },
  { id: "3", refNo: "PAY-UBL-2026-0034", bank: "UBL", receivedAt: "31 May 2026 11:45", payerName: "Metro Engineering", amount: 75000, invoiceId: "INV-2026-0083", awb: "074-88219033", status: "Partial", matchedBy: "Manual" },
  { id: "4", refNo: "PAY-HBL-2026-0013", bank: "HBL", receivedAt: "31 May 2026 12:10", payerName: "Sindh Textile Mills", amount: 145000, invoiceId: "INV-2026-0084", awb: "999-11223344", status: "Matched", matchedBy: "Auto" },
  { id: "5", refNo: "PAY-ASKARI-2026-0008", bank: "Askari", receivedAt: "31 May 2026 12:35", payerName: "Habib Auto Parts", amount: 78000, invoiceId: "INV-2026-0085", awb: "111-55667788", status: "Excess", matchedBy: "Manual" },
  { id: "6", refNo: "PAY-MEEZAN-2026-0022", bank: "Meezan", receivedAt: "31 May 2026 13:00", payerName: "Lahore Chemicals", amount: 245000, invoiceId: "INV-2026-0086", awb: "222-33445566", status: "Failed", matchedBy: "—" },
  { id: "7", refNo: "PAY-UBL-2026-0035", bank: "UBL", receivedAt: "31 May 2026 13:25", payerName: "Faisal Edibles", amount: 52000, invoiceId: "INV-2026-0087", awb: "333-77889900", status: "Matched", matchedBy: "Auto" },
  { id: "8", refNo: "PAY-HBL-2026-0014", bank: "HBL", receivedAt: "31 May 2026 14:00", payerName: "Pakistan Oilfields", amount: 198000, invoiceId: "INV-2026-0088", awb: "555-66778899", status: "Under Review", matchedBy: "Farooq Ahmed" },
  { id: "9", refNo: "PAY-ASKARI-2026-0009", bank: "Askari", receivedAt: "30 May 2026 09:15", payerName: "K-Electric Spares", amount: 112000, invoiceId: "INV-2026-0089", awb: "444-22334455", status: "Matched", matchedBy: "Auto" },
  { id: "10", refNo: "PAY-MEEZAN-2026-0023", bank: "Meezan", receivedAt: "30 May 2026 10:30", payerName: "Global Freight PK", amount: 85000, invoiceId: "—", awb: "—", status: "Unmatched", matchedBy: "—" },
  { id: "11", refNo: "PAY-HBL-2026-0015", bank: "HBL", receivedAt: "30 May 2026 11:45", payerName: "Skyline Forwarders", amount: 62000, invoiceId: "INV-2026-0090", awb: "666-99001122", status: "Partial", matchedBy: "Manual" },
  { id: "12", refNo: "PAY-UBL-2026-0036", bank: "UBL", receivedAt: "30 May 2026 14:20", payerName: "MedEx Logistics", amount: 93000, invoiceId: "INV-2026-0091", awb: "777-00112233", status: "Matched", matchedBy: "Auto" },
];

export default function PaymentReconciliationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(samplePayments);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(samplePayments);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filters, setFilters] = useState({
    dateRange: "",
    bank: "",
    paymentMode: "",
    invoiceId: "",
    awb: "",
    payerName: "",
    status: "",
  });
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...payments];
    if (filters.bank) filtered = filtered.filter(p => p.bank === filters.bank);
    if (filters.status) filtered = filtered.filter(p => p.status === filters.status);
    if (filters.invoiceId) filtered = filtered.filter(p => p.invoiceId.toLowerCase().includes(filters.invoiceId.toLowerCase()));
    if (filters.awb) filtered = filtered.filter(p => p.awb.toLowerCase().includes(filters.awb.toLowerCase()));
    if (filters.payerName) filtered = filtered.filter(p => p.payerName.toLowerCase().includes(filters.payerName.toLowerCase()));
    setFilteredPayments(filtered);
  }, [filters, payments]);

  const handleAutoMatch = () => {
    const unmatched = payments.filter(p => p.status === "Unmatched");
    if (unmatched.length === 0) {
      addToast("No unmatched payments to auto-match", "error");
      return;
    }
    const updated = payments.map(p =>
      p.status === "Unmatched" && p.id === "2"
        ? { ...p, status: "Matched" as const, matchedBy: "Auto" }
        : p
    );
    setPayments(updated);
    addToast("Auto-match completed: 1 payment matched", "success");
  };

  const handleManualMatch = (payment: Payment) => {
    setSelectedPayment(payment);
    setDrawerOpen(true);
  };

  const handleConfirmMatch = (paymentId: string) => {
    const updated = payments.map(p =>
      p.id === paymentId ? { ...p, status: "Matched" as const, matchedBy: "Manual" } : p
    );
    setPayments(updated);
    setDrawerOpen(false);
    setSelectedPayment(null);
    addToast("Payment matched successfully", "success");
  };

  const handleMarkException = (paymentId: string) => {
    const updated = payments.map(p =>
      p.id === paymentId ? { ...p, status: "Under Review" as const, matchedBy: "—" } : p
    );
    setPayments(updated);
    addToast("Payment marked as exception", "error");
  };

  const handleRetry = () => {
    setShowError(false);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const totalCollected = payments.filter(p => p.status === "Matched").reduce((s, p) => s + p.amount, 0);
  const matched = payments.filter(p => p.status === "Matched").length;
  const unmatched = payments.filter(p => p.status === "Unmatched").length;
  const partial = payments.filter(p => p.status === "Partial").length;
  const exceptions = payments.filter(p => p.status === "Under Review" || p.status === "Failed").length;
  const pendingSettlements = payments.filter(p => p.status === "Unmatched" || p.status === "Under Review").length;

  const kpiData = {
    totalCollected,
    matched,
    unmatched,
    partial,
    exceptions,
    pendingSettlements,
  };

  const exceptionData = [
    { type: "Amount mismatch", count: 2, totalAmount: 117850 },
    { type: "Invoice not found", count: 1, totalAmount: 85000 },
    { type: "Duplicate payment", count: 0, totalAmount: 0 },
    { type: "Partial payment", count: 2, totalAmount: 137000 },
    { type: "Excess payment", count: 1, totalAmount: 78000 },
    { type: "Failed settlement", count: 1, totalAmount: 245000 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb + Title */}
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Finance Manager", href: "#" },
            { label: "Payment Reconciliation" },
          ]}
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
              Payment Reconciliation
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
          title="Reconciliation engine unavailable"
          message="Bank settlement feed could not be reached. Last successful sync: 09:30 AM."
          onRetry={handleRetry}
        />
      )}

      {/* Main Content */}
      {showEmpty ? (
        <EmptyState
          title="No payments pending reconciliation"
          description="All bank settlements have been matched. New payments will appear here when received."
          actionLabel="Refresh"
          onAction={() => {
            setShowEmpty(false);
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      ) : (
        <>
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

          {/* Bank Settlement Table */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <LoadingSkeleton rows={5} columns={10} />
            </div>
          ) : (
            <BankSettlementTable
              payments={filteredPayments}
              onAutoMatch={handleAutoMatch}
              onManualMatch={handleManualMatch}
              onMarkException={handleMarkException}
            />
          )}

          {/* Exception Summary */}
          {isLoading ? (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
              <div className="h-5 w-32 bg-[#F1F5F9] rounded animate-pulse mb-4" />
              <div className="h-20 w-full bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ) : (
            <ExceptionSummary exceptions={exceptionData} />
          )}
        </>
      )}

      {/* Manual Match Drawer */}
      <ManualMatchDrawer
        isOpen={drawerOpen}
        onClose={() => { setDrawerOpen(false); setSelectedPayment(null); }}
        payment={selectedPayment}
        onConfirm={handleConfirmMatch}
      />
    </div>
  );
}