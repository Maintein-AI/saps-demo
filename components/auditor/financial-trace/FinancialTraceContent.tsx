"use client";

import { useState } from "react";
import LoadingSkeleton from "../../LoadingSkeleton";
import EmptyState from "../../EmptyState";
import ErrorState from "../../ErrorState";
import DataTable from "../../DataTable";
import { Search, Clock, ExternalLink, CheckCircle, XCircle, FileText } from "lucide-react";

interface FinancialTimelineEvent {
  state: string;
  user: string;
  timestamp: string;
  module: string;
  sourceSystem: string;
  evidenceLink: string;
  remarks: string;
  status: "completed" | "pending" | "rejected";
}

interface ApprovalRecord {
  requester: string;
  approver: string;
  supportingDocs: string;
  decision: string;
  timestamp: string;
  auditTrail: string;
}

const mockFinancialTimeline: FinancialTimelineEvent[] = [
  { state: "Invoice Generated", user: "omer.farooq", timestamp: "2026-06-08 11:30:00", module: "Finance", sourceSystem: "AirVault Billing", evidenceLink: "inv_2026_0042.pdf", remarks: "Auto-generated from tariff engine v3.2.1", status: "completed" },
  { state: "Tariff Version Applied", user: "system", timestamp: "2026-06-08 11:30:05", module: "Finance", sourceSystem: "Tariff Engine", evidenceLink: "tariff_v321_config.json", remarks: "CMTS Multi-Tariff v3.2.1 — General Cargo", status: "completed" },
  { state: "Line Items Locked", user: "system", timestamp: "2026-06-08 11:30:10", module: "Finance", sourceSystem: "AirVault Billing", evidenceLink: "lock_log_0042.txt", remarks: "7 line items frozen for audit", status: "completed" },
  { state: "Waiver Requested", user: "consignee_demo", timestamp: "2026-06-08 11:45:00", module: "Finance", sourceSystem: "Waiver Workflow", evidenceLink: "wvr_req_0031.pdf", remarks: "Requested waiver on demurrage: 2 days grace", status: "completed" },
  { state: "Waiver Reviewed", user: "omer.farooq", timestamp: "2026-06-08 12:00:00", module: "Finance", sourceSystem: "Waiver Workflow", evidenceLink: "wvr_review_0031.pdf", remarks: "Review notes: valid grace period applied", status: "completed" },
  { state: "Waiver Approved", user: "admin.ops", timestamp: "2026-06-08 12:10:00", module: "Finance", sourceSystem: "Waiver Workflow", evidenceLink: "wvr_approval_0031.pdf", remarks: "PKR 3,200 demurrage waived", status: "completed" },
  { state: "Credit Note Created", user: "system", timestamp: "2026-06-08 12:10:30", module: "Finance", sourceSystem: "AirVault Billing", evidenceLink: "cn_2026_0018.pdf", remarks: "CN-2026-0018 for PKR 3,200", status: "completed" },
  { state: "Payment Received", user: "system", timestamp: "2026-06-08 12:05:00", module: "Finance", sourceSystem: "Payment Gateway", evidenceLink: "pmt_rcpt_0042.pdf", remarks: "PKR 48,250 via HBL — ref: HBL-TXN-884291", status: "completed" },
  { state: "Reconciliation Completed", user: "admin.ops", timestamp: "2026-06-08 14:00:00", module: "Finance", sourceSystem: "Reconciliation Engine", evidenceLink: "recon_0042_match.pdf", remarks: "Auto-matched: invoice vs payment vs bank", status: "completed" },
  { state: "Receipt Issued", user: "system", timestamp: "2026-06-08 14:05:00", module: "Finance", sourceSystem: "AirVault Billing", evidenceLink: "receipt_0042.pdf", remarks: "Official receipt RCPT-2026-0042 issued", status: "completed" },
];

const mockInvoiceDetail = {
  invoiceNo: "INV-2026-0042",
  awb: "117-23456123",
  consignee: "Shaheen Airport Services",
  pieces: "12",
  chargeableWeight: "852 kg",
  tariffVersion: "CMTS v3.2.1",
  storage: "PKR 18,400",
  demurrage: "PKR 3,200",
  surcharge: "PKR 5,100",
  adjustment: "PKR -3,200",
  gst: "PKR 7,350",
  grandTotal: "PKR 48,250",
  paidAmount: "PKR 48,250",
  balance: "PKR 0",
};

const mockApprovalRecords: ApprovalRecord[] = [
  {
    requester: "consignee_demo",
    approver: "admin.ops",
    supportingDocs: "demurrage_grace_req.pdf, gate_log_V1356.pdf",
    decision: "Approved",
    timestamp: "2026-06-08 12:10:00",
    auditTrail: "wvr_audit_0031_full.pdf",
  },
  {
    requester: "consignee_demo",
    approver: "omer.farooq",
    supportingDocs: "demurrage_grace_req.pdf",
    decision: "Reviewed",
    timestamp: "2026-06-08 12:00:00",
    auditTrail: "wvr_review_0031.pdf",
  },
];

export default function FinancialTraceContent() {
  const [searchType, setSearchType] = useState("invoice");
  const [searchValue, setSearchValue] = useState("INV-2026-0042");
  const [searched, setSearched] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchOptions = [
    { value: "invoice", label: "Invoice #" },
    { value: "awb", label: "AWB #" },
    { value: "waiver", label: "Waiver Request #" },
    { value: "creditnote", label: "Credit Note #" },
    { value: "payment", label: "Payment Reference" },
  ];

  const handleSearch = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 600);
  };

  if (loading) return <LoadingSkeleton rows={8} columns={6} />;
  if (error) return <ErrorState message={error} onRetry={() => setError("")} />;

  return (
    <div className="space-y-6">
      <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-lg border border-[#E2E8F0] overflow-hidden">
            {searchOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSearchType(opt.value)}
                className="h-9 px-3 text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: searchType === opt.value ? "#0B2545" : "white",
                  color: searchType === opt.value ? "white" : "#64748B",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={`Enter ${searchOptions.find((o) => o.value === searchType)?.label}...`}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#2E75B6]"
            />
          </div>
          <button
            onClick={handleSearch}
            className="h-9 px-5 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            Trace
          </button>
        </div>
      </div>

      {searched && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-[16px] font-bold text-[#0F172A]">Financial Timeline — INV-2026-0042</h2>
                </div>
                <span className="text-[12px] text-[#64748B] font-medium">10 events</span>
              </div>

              <div className="relative pl-8">
                <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-[#E2E8F0]" />
                {mockFinancialTimeline.map((event, idx) => (
                  <div key={idx} className="relative pb-4 last:pb-0">
                    <div
                      className="absolute left-[-1.65rem] top-1 w-[14px] h-[14px] rounded-full border-2 border-white ring-2 z-10"
                      style={{
                        backgroundColor: event.status === "completed" ? "#16A34A" : event.status === "rejected" ? "#DC2626" : "#D97706",
                        "--tw-ring-color": event.status === "completed" ? "#16A34A" : event.status === "rejected" ? "#DC2626" : "#D97706",
                      } as React.CSSProperties}
                    />
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 ml-2">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-[#0F172A]">{event.state}</span>
                          {event.status === "completed" && <CheckCircle size={14} className="text-[#16A34A]" />}
                          {event.status === "rejected" && <XCircle size={14} className="text-[#DC2626]" />}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                          <Clock size={12} />
                          {event.timestamp}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-[12px]">
                        <div>
                          <span className="text-[#94A3B8]">User: </span>
                          <span className="text-[#334155] font-medium">{event.user}</span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8]">Module: </span>
                          <span className="text-[#334155] font-medium">{event.module}</span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8]">Source: </span>
                          <span className="text-[#334155] font-medium">{event.sourceSystem}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ExternalLink size={12} className="text-[#2E75B6]" />
                          <button className="text-[12px] text-[#2E75B6] hover:underline cursor-pointer font-medium">
                            {event.evidenceLink}
                          </button>
                        </div>
                      </div>
                      {event.remarks && (
                        <p className="text-[11px] text-[#94A3B8] mt-2 italic">{event.remarks}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-5 shadow-sm sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={16} className="text-[#0B2545]" />
                  <h2 className="text-[15px] font-bold text-[#0F172A]">Invoice Detail</h2>
                </div>
                <div className="space-y-2.5">
                  {Object.entries(mockInvoiceDetail).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-1 border-b border-[#F1F5F9] last:border-0">
                      <span className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wide">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span
                        className="text-[12px] font-semibold"
                        style={{
                          color: key === "balance" && value === "PKR 0" ? "#16A34A" : key === "grandTotal" ? "#0B2545" : "#0F172A",
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[16px] font-bold text-[#0F172A]">Approval Evidence — Waiver WVR-2026-0031</h2>
            </div>
            <DataTable
              columns={[
                { key: "requester", header: "Requester", width: "140px" },
                { key: "approver", header: "Approver", width: "140px" },
                { key: "supportingDocs", header: "Supporting Documents", width: "200px" },
                { key: "decision", header: "Decision", width: "100px" },
                { key: "timestamp", header: "Timestamp", width: "160px" },
                { key: "auditTrail", header: "Audit Trail", width: "160px" },
              ]}
              rows={mockApprovalRecords.map((r) => ({
                requester: <span className="text-[12px] font-medium text-[#0F172A]">{r.requester}</span>,
                approver: <span className="text-[12px] text-[#0F172A]">{r.approver}</span>,
                supportingDocs: (
                  <button className="text-[12px] text-[#2E75B6] hover:underline cursor-pointer font-medium">
                    {r.supportingDocs}
                  </button>
                ),
                decision: (
                  <span
                    className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold"
                    style={{
                      backgroundColor: r.decision === "Approved" ? "#DCFCE7" : "#FEF3C7",
                      color: r.decision === "Approved" ? "#16A34A" : "#D97706",
                    }}
                  >
                    {r.decision}
                  </span>
                ),
                timestamp: <span className="text-[12px] font-mono text-[#64748B]">{r.timestamp}</span>,
                auditTrail: (
                  <button className="flex items-center gap-1 text-[12px] text-[#2E75B6] hover:underline cursor-pointer font-medium">
                    <ExternalLink size={12} />
                    {r.auditTrail}
                  </button>
                ),
              }))}
              headerStyle="navy"
            />
          </div>
        </>
      )}

      {!searched && (
        <EmptyState
          title="No financial trace"
          description="Enter an invoice, AWB, waiver, credit note, or payment reference to trace."
        />
      )}
    </div>
  );
}