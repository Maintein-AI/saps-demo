"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import KPIStrip from "@/components/forwarding-agent/payments/KPIStrip";
import FilterBar from "@/components/forwarding-agent/payments/FilterBar";
import OutstandingInvoicesTable from "@/components/forwarding-agent/payments/OutstandingInvoicesTable";
import StatementCard from "@/components/forwarding-agent/payments/StatementCard";
import InvoiceBreakdownDrawer from "@/components/forwarding-agent/payments/InvoiceBreakdownDrawer";
import PaymentSuccessState from "@/components/forwarding-agent/payments/PaymentSuccessState";
import { FileText } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNo: string;
  awb: string;
  do: string;
  consignee: string;
  amountPKR: string;
  dueDate: string;
  status: "Unpaid" | "Partially Paid" | "Paid" | "Overdue" | "Disputed";
  paymentMethod: string;
  receiptUrl: string;
}

export default function PaymentsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [breakdownDrawerOpen, setBreakdownDrawerOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();
  const [successOpen, setSuccessOpen] = useState(false);
  const [successInvoice, setSuccessInvoice] = useState<Invoice | undefined>();

  const handleFilter = () => {
    // filter logic
  };

  const handleBreakdown = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setBreakdownDrawerOpen(true);
  };

  const handlePay = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setSuccessInvoice(invoice);
    setSuccessOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb
          items={[
            { label: "Forwarding Agent", href: "/forwarding-agent" },
            { label: "Payments" },
          ]}
        />
        <div className="flex items-center gap-3">
          <h1 className="text-[22px] font-bold text-[#0F172A]">Payments</h1>
          <ScopeBadge type="exc" />
        </div>
      </div>

      <KPIStrip />

      <FilterBar onFilter={handleFilter} />

      {error && (
        <ErrorState
          message="Failed to load payment data. Please check your connection and try again."
          onRetry={() => setError(false)}
        />
      )}

      {loading ? (
        <LoadingSkeleton rows={6} columns={9} />
      ) : empty ? (
        <EmptyState
          title="No outstanding invoices"
          description="Your forwarding agency has no outstanding invoices at this time. All payments are up to date."
          icon={<FileText size={28} className="text-[#94A3B8]" />}
        />
      ) : (
        <>
          <StatementCard />
          <OutstandingInvoicesTable
            onBreakdown={handleBreakdown}
            onPay={handlePay}
          />
        </>
      )}

      <InvoiceBreakdownDrawer
        isOpen={breakdownDrawerOpen}
        onClose={() => setBreakdownDrawerOpen(false)}
        invoice={selectedInvoice}
      />

      <PaymentSuccessState
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
        invoiceNo={successInvoice?.invoiceNo}
        amount={successInvoice?.amountPKR}
      />
    </div>
  );
}