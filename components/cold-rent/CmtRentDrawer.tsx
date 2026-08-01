"use client";

import { useEffect, useState } from "react";
import { X, AlertTriangle, Info, RefreshCw, Clock, User, ArrowRight, FileText, DollarSign, CheckCircle, ChevronRight, Calendar, FileCheck, Printer, Eye, Save, Send } from "lucide-react";
import DataTable from "@/components/DataTable";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";

interface CmtRentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SURCHARGE_CHIPS = [
  { id: "dgr", label: "DGR", active: true },
  { id: "per", label: "PER", active: false },
  { id: "val", label: "VAL", active: false },
  { id: "aog", label: "AOG", active: true },
  { id: "hum", label: "HUM", active: false },
  { id: "cold", label: "Cold Storage", active: true },
  { id: "vault", label: "Vault", active: false },
  { id: "oversize", label: "Oversize", active: false },
  { id: "longstay", label: "Long-stay", active: false },
];

const TARIFF_SLABS = [
  { name: "Day 1–3", from: "1", to: "3", rate: "PKR 25", minimum: "PKR 500", surcharge: "0%", applied: "PKR 12,400" },
  { name: "Day 4–7", from: "4", to: "7", rate: "PKR 35", minimum: "PKR 700", surcharge: "15%", applied: "PKR 18,620" },
  { name: "Day 8–14", from: "8", to: "14", rate: "PKR 50", minimum: "PKR 1,000", surcharge: "25%", applied: "PKR 31,000" },
  { name: "Day 15+", from: "15", to: "∞", rate: "PKR 75", minimum: "PKR 1,500", surcharge: "35%", applied: "PKR 5,062" },
];

const AUDIT_ENTRIES = [
  { time: "31 May 2026 12:30", user: "Ahmed Khan", field: "Free Period Days", old: "3", new: "5", reason: "Airline delay confirmed" },
  { time: "31 May 2026 12:28", user: "Sana Khan", field: "Surcharge DGR", old: "Inactive", new: "Active", reason: "Shipper declared DG" },
  { time: "31 May 2026 12:15", user: "Imran Ali", field: "Day 4–7 Rate", old: "PKR 30", new: "PKR 35", reason: "Rate card update Q2" },
  { time: "31 May 2026 11:50", user: "System", field: "Charge Start Date", old: "29 May 2026", new: "30 May 2026", reason: "Customs hold exclusion" },
  { time: "31 May 2026 11:30", user: "Bilal Ahmed", field: "Working Days Toggle", old: "Off", new: "On", reason: "Standard billing practice" },
];

const CALCULATION_BREAKDOWN = [
  { label: "Base storage rent", amount: "PKR 67,082", note: "Days 1–4 at applicable slabs" },
  { label: "Surcharges", amount: "PKR 10,062", note: "DGR + AOG + Cold Storage" },
  { label: "Waivers", amount: "- PKR 5,000", note: "Airline credit note applied" },
  { label: "Adjustments", amount: "- PKR 2,500", note: "Customs hold exclusion" },
  { label: "Subtotal", amount: "PKR 69,644", note: "", isSubtotal: true },
  { label: "Tax (16% GST)", amount: "PKR 11,143", note: "FBR applicable rate" },
  { label: "Grand Total", amount: "PKR 80,787", note: "", isTotal: true },
];

export default function CmtRentDrawer({ isOpen, onClose }: CmtRentDrawerProps) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [activeChips, setActiveChips] = useState(SURCHARGE_CHIPS);
  const [workingDays, setWorkingDays] = useState(true);
  const [customsHold, setCustomsHold] = useState(true);
  const [airlineDelay, setAirlineDelay] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleChip = (id: string) => {
    setActiveChips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const handleRecalculate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast("Godown rent recalculated", "success");
    }, 1200);
  };

  const handleSaveDraft = () => {
    addToast("Draft calculation saved", "success");
  };

  const handleApplyInvoice = () => {
    addToast("Applied to invoice — awaiting approval", "success");
  };

  const handleExportPDF = () => {
    addToast("Calculation PDF exported", "success");
  };

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const slabColumns = [
    { key: "name", header: "Slab", width: "80px", sortable: true },
    { key: "from", header: "From", width: "50px", sortable: true },
    { key: "to", header: "To", width: "50px", sortable: true },
    { key: "rate", header: "Rate", width: "100px", sortable: true },
    { key: "minimum", header: "Minimum", width: "100px", sortable: true },
    { key: "surcharge", header: "Surcharge", width: "90px", sortable: true },
    { key: "applied", header: "Applied", width: "100px", sortable: true },
  ];

  const slabRows = TARIFF_SLABS.map((s) => ({
    name: <span className="text-[13px] font-semibold text-[#0F172A]">{s.name}</span>,
    from: <span className="text-[13px] text-[#64748B]">{s.from}</span>,
    to: <span className="text-[13px] text-[#64748B]">{s.to}</span>,
    rate: <span className="text-[13px] text-[#0F172A]">{s.rate}</span>,
    minimum: <span className="text-[13px] text-[#0F172A]">{s.minimum}</span>,
    surcharge: <span className="text-[13px] font-medium text-[#D97706]">{s.surcharge}</span>,
    applied: <span className="text-[13px] font-semibold text-[#0B2545]">{s.applied}</span>,
  }));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full bg-white shadow-xl z-[70] transition-transform duration-300 ease-out flex flex-col"
        style={{
          width: "100%",
          maxWidth: 560,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">
              CMTS-grade Godown Rent Engine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Subtitle */}
          <div className="flex items-start gap-3 p-3 rounded-lg border border-[#DC2626]/20 bg-[#DC2626]/5 mb-5">
            <AlertTriangle size={16} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#DC2626] font-medium leading-relaxed">
              Outside awarded contract scope — advanced CMTS-grade rent calculation beyond Annexure-G operational billing.
            </p>
          </div>

          {error && (
            <div className="mb-4">
              <ErrorState
                message="Failed to load rent calculation data. Gateway timeout from CMTS tariff service."
                onRetry={handleRetry}
              />
            </div>
          )}

          {empty && !error && (
            <div className="mb-4">
              <EmptyState
                title="No rent calculation generated yet"
                description="No advanced godown rent calculation exists for this AWB. Run recalculate to generate."
                icon={<FileText size={28} className="text-[#94A3B8]" />}
                actionLabel="Recalculate"
                onAction={handleRecalculate}
              />
            </div>
          )}

          {!empty && (
            <>
              {/* Top Summary */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[14px] font-bold text-[#0F172A]">AWB Summary</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">AWB #</span>
                    <span className="text-[13px] font-semibold text-[#0B2545] font-mono">214-45678901</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">HAWB #</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">HAWB-214-001</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Consignee</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">Pak Pharma Ltd</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Cargo Class</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">Pharma</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Pieces</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Chargeable Weight</span>
                    <span className="text-[13px] font-medium text-[#0F172A]">1,240 kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Arrival Date</span>
                    <span className="text-[13px] text-[#0F172A]">29 May 2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Storage Start</span>
                    <span className="text-[13px] text-[#0F172A]">29 May 2026</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Current Day Count</span>
                    <span className="text-[13px] font-medium text-[#0B2545]">3 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#64748B]">Free Period Applied</span>
                    <span className="text-[13px] font-medium text-[#16A34A]">5 days</span>
                  </div>
                  <div className="flex items-center justify-between col-span-2">
                    <span className="text-[12px] text-[#64748B]">Billing Status</span>
                    <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold bg-[#FEF3C7] text-[#D97706]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                      Draft Calculation
                    </span>
                  </div>
                </div>
              </div>

              {/* Free Period Section */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[14px] font-bold text-[#0F172A]">Free Period Configuration</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Free Period Days</label>
                    <input
                      type="text"
                      defaultValue="5"
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Free Period Start</label>
                    <input
                      type="text"
                      defaultValue="29 May 2026"
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Free Period End</label>
                    <input
                      type="text"
                      defaultValue="3 Jun 2026"
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Charge Start Date</label>
                    <input
                      type="text"
                      defaultValue="4 Jun 2026"
                      className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => setWorkingDays((w) => !w)}
                    className="flex items-center gap-2 h-8 px-3 rounded-lg border text-[12px] font-medium cursor-pointer transition-colors"
                    style={{
                      backgroundColor: workingDays ? "#EBF0F7" : "white",
                      borderColor: workingDays ? "#1B4F8B" : "#E2E8F0",
                      color: workingDays ? "#0B2545" : "#64748B",
                    }}
                  >
                    <Calendar size={14} />
                    Working Days
                  </button>
                  <button
                    onClick={() => setCustomsHold((c) => !c)}
                    className="flex items-center gap-2 h-8 px-3 rounded-lg border text-[12px] font-medium cursor-pointer transition-colors"
                    style={{
                      backgroundColor: customsHold ? "#EBF0F7" : "white",
                      borderColor: customsHold ? "#1B4F8B" : "#E2E8F0",
                      color: customsHold ? "#0B2545" : "#64748B",
                    }}
                  >
                    <FileCheck size={14} />
                    Exclude Customs Hold
                  </button>
                  <button
                    onClick={() => setAirlineDelay((a) => !a)}
                    className="flex items-center gap-2 h-8 px-3 rounded-lg border text-[12px] font-medium cursor-pointer transition-colors"
                    style={{
                      backgroundColor: airlineDelay ? "#EBF0F7" : "white",
                      borderColor: airlineDelay ? "#1B4F8B" : "#E2E8F0",
                      color: airlineDelay ? "#0B2545" : "#64748B",
                    }}
                  >
                    <Clock size={14} />
                    Exclude Airline Delay
                  </button>
                </div>
              </div>

              {/* Surcharge Chips */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[14px] font-bold text-[#0F172A]">Surcharge Configuration</h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {activeChips.map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => toggleChip(chip.id)}
                      className="inline-flex items-center h-7 px-3 rounded-full text-[12px] font-medium cursor-pointer transition-all border"
                      style={{
                        backgroundColor: chip.active ? "#FEE2E2" : "white",
                        borderColor: chip.active ? "#DC2626" : "#E2E8F0",
                        color: chip.active ? "#DC2626" : "#64748B",
                      }}
                    >
                      {chip.active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mr-1.5" />
                      )}
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tariff Slabs */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden mb-5">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E2E8F0]">
                  <h3 className="text-[14px] font-bold text-[#0F172A]">Tariff Slabs</h3>
                </div>
                <div className="p-3">
                  {loading ? (
                    <LoadingSkeleton rows={4} columns={7} />
                  ) : (
                    <DataTable columns={slabColumns} rows={slabRows} zebra sortable />
                  )}
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[14px] font-bold text-[#0F172A]">Calculation Breakdown</h3>
                </div>
                <div className="space-y-2">
                  {CALCULATION_BREAKDOWN.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                      style={{
                        borderTop: i > 0 ? "1px solid #E2E8F0" : "none",
                        borderBottom: item.isSubtotal || item.isTotal ? "1px solid #E2E8F0" : "none",
                        backgroundColor: item.isTotal ? "#F8FAFC" : "transparent",
                        padding: item.isTotal ? "12px 8px" : item.isSubtotal ? "8px" : "8px 0",
                        margin: item.isTotal || item.isSubtotal ? "0 -8px" : "0",
                        borderRadius: item.isTotal || item.isSubtotal ? "8px" : "0",
                      }}
                    >
                      <div className="flex flex-col">
                        <span
                          className="text-[13px]"
                          style={{
                            fontWeight: item.isTotal ? 700 : item.isSubtotal ? 600 : 400,
                            color: item.isTotal ? "#0B2545" : "#0F172A",
                          }}
                        >
                          {item.label}
                        </span>
                        {item.note && (
                          <span className="text-[11px] text-[#94A3B8]">{item.note}</span>
                        )}
                      </div>
                      <span
                        className="text-[14px] font-semibold"
                        style={{
                          color: item.isTotal ? "#0B2545" : item.amount.startsWith("-") ? "#DC2626" : "#0F172A",
                          fontWeight: item.isTotal ? 700 : 600,
                        }}
                      >
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-[14px] font-bold text-[#0F172A]">Actions</h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleRecalculate}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                    style={{ backgroundColor: "#0B2545" }}
                  >
                    <RefreshCw size={14} />
                    Recalculate
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <Save size={14} />
                    Save Draft
                  </button>
                  <button
                    onClick={handleApplyInvoice}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <Send size={14} />
                    Apply to Invoice
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <Printer size={14} />
                    Export PDF
                  </button>
                  <button
                    onClick={() => setShowAudit((s) => !s)}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <Eye size={14} />
                    View Audit
                    <ChevronRight
                      size={14}
                      className="transition-transform"
                      style={{ transform: showAudit ? "rotate(90deg)" : "rotate(0deg)" }}
                    />
                  </button>
                </div>
              </div>

              {/* Audit Section */}
              {showAudit && (
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-[14px] font-bold text-[#0F172A]">Calculation Audit</h3>
                  </div>
                  <div className="space-y-3">
                    {AUDIT_ENTRIES.map((entry, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border border-[#E2E8F0]"
                        style={{ backgroundColor: index % 2 === 1 ? "#F8FAFC" : "white" }}
                      >
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#EBF0F7] flex items-center justify-center mt-0.5">
                          <Clock size={14} className="text-[#1B4F8B]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <User size={12} className="text-[#94A3B8]" />
                            <span className="text-[12px] font-semibold text-[#0F172A]">{entry.user}</span>
                            <span className="text-[11px] text-[#94A3B8]">{entry.time}</span>
                          </div>
                          <p className="text-[13px] text-[#0F172A] mb-1">
                            Changed <span className="font-semibold">{entry.field}</span>
                          </p>
                          <div className="flex items-center gap-2 text-[12px] mb-1">
                            <span className="text-[#94A3B8] line-through">{entry.old}</span>
                            <ArrowRight size={12} className="text-[#64748B]" />
                            <span className="text-[#16A34A] font-medium">{entry.new}</span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8]">Reason: {entry.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Simulate toggles */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setLoading((l) => !l)}
              className="h-7 px-2 rounded-md border border-[#E2E8F0] text-[11px] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
            >
              {loading ? "Stop Loading" : "Sim Loading"}
            </button>
            <button
              onClick={() => setError((e) => !e)}
              className="h-7 px-2 rounded-md border border-[#E2E8F0] text-[11px] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
            >
              {error ? "Clear Error" : "Sim Error"}
            </button>
            <button
              onClick={() => setEmpty((e) => !e)}
              className="h-7 px-2 rounded-md border border-[#E2E8F0] text-[11px] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer"
            >
              {empty ? "Show Data" : "Sim Empty"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}