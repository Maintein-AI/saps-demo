"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import {
  Search,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Banknote,
  X,
  CheckCheck,
  Eye,
} from "lucide-react";

interface Shipment {
  awb: string;
  hawb: string;
  invoiceNo: string;
  consignee: string;
  carrier: string;
  flight: string;
  arrival: string;
  pieces: number;
  weight: string;
  cargoClass: string;
  freePeriodExpiry: string;
  customsStatus: string;
  oocStatus: string;
  chargesStatus: "Paid" | "Unpaid" | "Partially Paid";
  doStatus: "Pending" | "Issued" | "Collected";
  doNumber: string;
  invoiceDate: string;
  dueDate: string;
  storage: number;
  demurrage: number;
  surcharge: number;
  adjustment: number;
  gst: number;
  grandTotal: number;
  paidAmount: number;
  creditEligible: boolean;
  paymentMethod?: string;
}

const shipments: Shipment[] = [
  {
    awb: "157-90811223", hawb: "HAWB-001234", invoiceNo: "SAPS-2026-00839",
    consignee: "Karachi Pharma Imports", carrier: "Qatar Airways Cargo", flight: "QR-604",
    arrival: "31 May 2026, 11:25", pieces: 8, weight: "420 kg", cargoClass: "PER",
    freePeriodExpiry: "05 Jun 2026", customsStatus: "Cleared", oocStatus: "Clear",
    chargesStatus: "Unpaid", doStatus: "Pending", doNumber: "DO-90872",
    invoiceDate: "31 May 2026", dueDate: "10 Jun 2026",
    storage: 28000, demurrage: 5000, surcharge: 3500, adjustment: 0, gst: 6570,
    grandTotal: 42850, paidAmount: 0, creditEligible: true
  },
  {
    awb: "214-45678901", hawb: "HAWB-005678", invoiceNo: "SAPS-2026-00841",
    consignee: "Al Noor Traders", carrier: "Emirates SkyCargo", flight: "EK-604",
    arrival: "31 May 2026, 09:15", pieces: 24, weight: "1,240 kg", cargoClass: "AFU",
    freePeriodExpiry: "04 Jun 2026", customsStatus: "Under Review", oocStatus: "Clear",
    chargesStatus: "Unpaid", doStatus: "Pending", doNumber: "DO-90871",
    invoiceDate: "31 May 2026", dueDate: "08 Jun 2026",
    storage: 62000, demurrage: 8500, surcharge: 5000, adjustment: 0, gst: 13590,
    grandTotal: 89090, paidAmount: 0, creditEligible: false
  },
  {
    awb: "074-88219033", hawb: "HAWB-009012", invoiceNo: "SAPS-2026-00835",
    consignee: "Metro Engineering", carrier: "Turkish Cargo", flight: "TK-708",
    arrival: "31 May 2026, 13:40", pieces: 16, weight: "680 kg", cargoClass: "GCR",
    freePeriodExpiry: "07 Jun 2026", customsStatus: "Cleared", oocStatus: "Clear",
    chargesStatus: "Partially Paid", doStatus: "Issued", doNumber: "DO-90873",
    invoiceDate: "31 May 2026", dueDate: "11 Jun 2026",
    storage: 45000, demurrage: 3000, surcharge: 2500, adjustment: -2000, gst: 8730,
    grandTotal: 57230, paidAmount: 28615, creditEligible: true
  },
  {
    awb: "117-55667788", hawb: "HAWB-003456", invoiceNo: "SAPS-2026-00830",
    consignee: "Karachi Pharma Imports", carrier: "Etihad Cargo", flight: "EY-241",
    arrival: "30 May 2026, 16:20", pieces: 42, weight: "2,110 kg", cargoClass: "GCR",
    freePeriodExpiry: "03 Jun 2026", customsStatus: "Pending", oocStatus: "Pending",
    chargesStatus: "Unpaid", doStatus: "Pending", doNumber: "DO-90874",
    invoiceDate: "30 May 2026", dueDate: "09 Jun 2026",
    storage: 95000, demurrage: 12000, surcharge: 8000, adjustment: 0, gst: 20700,
    grandTotal: 135700, paidAmount: 0, creditEligible: false
  },
  {
    awb: "214-99887766", hawb: "HAWB-007890", invoiceNo: "SAPS-2026-00825",
    consignee: "Al Noor Traders", carrier: "Saudia Cargo", flight: "SV-732",
    arrival: "29 May 2026, 08:50", pieces: 12, weight: "540 kg", cargoClass: "PER",
    freePeriodExpiry: "02 Jun 2026", customsStatus: "Cleared", oocStatus: "Clear",
    chargesStatus: "Paid", doStatus: "Collected", doNumber: "DO-90877",
    invoiceDate: "29 May 2026", dueDate: "06 Jun 2026",
    storage: 22000, demurrage: 0, surcharge: 1500, adjustment: 0, gst: 4230,
    grandTotal: 27730, paidAmount: 27730, creditEligible: true
  },
  {
    awb: "157-33445566", hawb: "HAWB-002345", invoiceNo: "SAPS-2026-00822",
    consignee: "Metro Engineering", carrier: "Emirates SkyCargo", flight: "EK-606",
    arrival: "28 May 2026, 10:15", pieces: 20, weight: "980 kg", cargoClass: "VAL",
    freePeriodExpiry: "01 Jun 2026", customsStatus: "Cleared", oocStatus: "Clear",
    chargesStatus: "Paid", doStatus: "Issued", doNumber: "DO-90878",
    invoiceDate: "28 May 2026", dueDate: "04 Jun 2026",
    storage: 52000, demurrage: 6000, surcharge: 4000, adjustment: -1500, gst: 10890,
    grandTotal: 71390, paidAmount: 71390, creditEligible: true
  },
];

type PaymentStage = "idle" | "initiated" | "redirecting" | "pending" | "success" | "failed" | "refunded";

const paymentMethodConfig: Record<string, { label: string; icon: React.ReactNode; desc: string }> = {
  gateway: { label: "Online Gateway", icon: <CreditCard size={14} />, desc: "Pay via bank card or digital wallet" },
  credit: { label: "Credit Account", icon: <Building size={14} />, desc: "Charge to your registered credit account" },
  counter: { label: "Pay at Counter", icon: <Banknote size={14} />, desc: "Pay cash on collection at the terminal" },
};

export default function PayDOContent() {
  const { addToast } = useToast();
  const [searchAWB, setSearchAWB] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [paymentStage, setPaymentStage] = useState<PaymentStage>("idle");
  const [selectedMethod, setSelectedMethod] = useState<string>("gateway");
  const [transactionId, setTransactionId] = useState("");
  const [failureReason, setFailureReason] = useState("");
  const [doDownloaded, setDoDownloaded] = useState(false);

  const filteredShipments = searchAWB.trim()
    ? shipments.filter((s) => s.awb.toLowerCase().includes(searchAWB.toLowerCase()))
    : shipments;

  const handleSelectAWB = (awb: string) => {
    const found = shipments.find((s) => s.awb === awb);
    setSelected(found || null);
    setSearchAWB(awb);
    setShowDropdown(false);
    setPaymentStage("idle");
    setTransactionId("");
    setFailureReason("");
    setDoDownloaded(false);
  };

  const handlePayNow = () => {
    if (!selected) return;
    setPaymentStage("initiated");
    addToast("Payment initiated. Redirecting to gateway...", "success");
    setTimeout(() => {
      setPaymentStage("redirecting");
      setTimeout(() => {
        setPaymentStage("pending");
        setTimeout(() => {
          const success = Math.random() > 0.25;
          if (success) {
            const txnId = "TXN-" + Date.now().toString(36).toUpperCase();
            setTransactionId(txnId);
            setPaymentStage("success");
            addToast("Payment completed and DO is ready.", "success");
          } else {
            setFailureReason("Transaction declined by issuing bank. Please verify card details or try another method.");
            setPaymentStage("failed");
          }
        }, 2000);
      }, 1500);
    }, 800);
  };

  const handleRetry = () => {
    setPaymentStage("idle");
    setTransactionId("");
    setFailureReason("");
  };

  const handleDownloadDO = () => {
    if (!selected) return;
    setDoDownloaded(true);
    addToast(`DO ${selected.doNumber} downloaded.`, "success");
  };

  const handleDownloadReceipt = () => {
    addToast("Payment receipt downloaded.", "success");
  };

  const handleDownloadInvoice = () => {
    if (!selected) return;
    addToast(`Invoice ${selected.invoiceNo} downloaded.`, "success");
  };

  const handleRaiseDispute = () => {
    if (!selected) return;
    addToast(`Dispute raised for invoice ${selected.invoiceNo}. Support will contact you.`, "success");
  };

  const stageLabels: Record<PaymentStage, string> = {
    idle: "",
    initiated: "Payment Initiated",
    redirecting: "Redirecting to Gateway",
    pending: "Payment Pending",
    success: "Payment Successful",
    failed: "Payment Failed",
    refunded: "Refunded",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Select Shipment</h2>
            <ScopeBadge type="exc" />
          </div>
        </div>

        <div className="relative mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-[420px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                value={searchAWB}
                onChange={(e) => { setSearchAWB(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search AWB #"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
              />
            </div>
            {showDropdown && (
              <div className="absolute top-10 left-0 z-20 w-[420px] bg-white border border-[#E2E8F0] rounded-xl shadow-lg max-h-[240px] overflow-y-auto">
                {filteredShipments.length === 0 ? (
                  <div className="px-4 py-3 text-[13px] text-[#94A3B8]">No shipments found.</div>
                ) : (
                  filteredShipments.map((s) => (
                    <button
                      key={s.awb}
                      onClick={() => handleSelectAWB(s.awb)}
                      className="w-full text-left px-4 py-3 hover:bg-[#F8FAFC] cursor-pointer transition-colors border-b border-[#F1F5F9] last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[13px] font-bold font-mono text-[#0F172A]">{s.awb}</span>
                          <span className="text-[12px] text-[#64748B] ml-2">{s.consignee}</span>
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: s.chargesStatus === "Paid" ? "#16A34A" : s.chargesStatus === "Partially Paid" ? "#D97706" : "#DC2626" }}>
                          {s.chargesStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] mt-0.5">{s.carrier} | {s.flight} | {s.arrival}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {selected && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-[#E2E8F0]">
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">HAWB #</label>
              <p className="text-[13px] font-mono text-[#334155]">{selected.hawb}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Invoice #</label>
              <p className="text-[13px] font-mono font-semibold text-[#0F172A]">{selected.invoiceNo}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Consignee</label>
              <p className="text-[13px] text-[#334155]">{selected.consignee}</p>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Charges Status</label>
              <span className={`inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold ${selected.chargesStatus === "Paid" ? "bg-[#DCFCE7] text-[#16A34A]" : selected.chargesStatus === "Partially Paid" ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>
                {selected.chargesStatus}
              </span>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">DO Status</label>
              <span className={`inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold ${selected.doStatus === "Issued" ? "bg-[#DBEAFE] text-[#1D4ED8]" : selected.doStatus === "Collected" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                {selected.doStatus}
              </span>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">DO #</label>
              <p className="text-[13px] font-mono font-semibold text-[#1B4F8B]">{selected.doNumber}</p>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <>
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-[#0F172A]">Shipment Summary</h2>
                <ScopeBadge type="exc" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">AWB #</label>
                <p className="text-[13px] font-bold font-mono text-[#0F172A]">{selected.awb}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Carrier</label>
                <p className="text-[13px] text-[#334155]">{selected.carrier}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Flight</label>
                <p className="text-[13px] font-mono text-[#1B4F8B]">{selected.flight}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Arrival</label>
                <p className="text-[13px] text-[#334155]">{selected.arrival}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Pieces / Weight</label>
                <p className="text-[13px] font-semibold text-[#0F172A]">{selected.pieces} / {selected.weight}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Cargo Class</label>
                <p className="text-[13px] font-mono font-semibold text-[#64748B]">{selected.cargoClass}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Free Period Expiry</label>
                <p className="text-[13px] font-semibold text-[#D97706]">{selected.freePeriodExpiry}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Customs Status</label>
                <p className="text-[13px] text-[#334155]">{selected.customsStatus}</p>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">OOC Status</label>
                <p className="text-[13px] text-[#334155]">{selected.oocStatus}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-[#0F172A]">Charges Breakdown</h2>
                <ScopeBadge type="exc" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Invoice #</label>
                      <p className="text-[13px] font-bold font-mono text-[#0F172A]">{selected.invoiceNo}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Invoice Date</label>
                      <p className="text-[13px] text-[#334155]">{selected.invoiceDate}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Due Date</label>
                      <p className="text-[13px] font-semibold text-[#D97706]">{selected.dueDate}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Paid Amount</label>
                      <p className="text-[13px] font-bold text-[#16A34A]">PKR {selected.paidAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">Storage</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">PKR {selected.storage.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">Demurrage</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">PKR {selected.demurrage.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">Surcharge</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">PKR {selected.surcharge.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">Adjustment</span>
                    <span className="text-[13px] font-semibold" style={{ color: selected.adjustment < 0 ? "#16A34A" : "#0F172A" }}>
                      {selected.adjustment < 0 ? "-" : ""}PKR {Math.abs(selected.adjustment).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-[#E2E8F0]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#0F172A]">Subtotal</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">
                      PKR {(selected.storage + selected.demurrage + selected.surcharge + selected.adjustment).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">GST 18%</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">PKR {selected.gst.toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-[#E2E8F0]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-[#0F172A]">Grand Total</span>
                    <span className="text-[15px] font-bold text-[#1B4F8B]">PKR {selected.grandTotal.toLocaleString()}</span>
                  </div>
                  {selected.paidAmount > 0 && (
                    <>
                      <div className="h-px bg-[#E2E8F0]" />
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-[#64748B]">Outstanding Balance</span>
                        <span className="text-[13px] font-bold text-[#DC2626]">PKR {(selected.grandTotal - selected.paidAmount).toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="text-[13px] font-semibold text-[#0F172A] mb-3">Payment Method</h3>
                  <div className="space-y-2">
                    {Object.entries(paymentMethodConfig).map(([key, method]) => {
                      const isDisabled = key === "credit" && !selected.creditEligible;
                      const isSelected = selectedMethod === key;
                      return (
                        <button
                          key={key}
                          onClick={() => !isDisabled && setSelectedMethod(key)}
                          disabled={isDisabled}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                            isSelected ? "border-[#1B4F8B] bg-[#F0F4FA]" : "border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]"
                          } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? "bg-[#0B2545] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-[13px] font-semibold text-[#0F172A]">{method.label}</p>
                            <p className="text-[11px] text-[#94A3B8]">{isDisabled ? "Not eligible for credit account" : method.desc}</p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-[#1B4F8B] flex items-center justify-center">
                              <CheckCheck size={12} className="text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
                  {selected.chargesStatus === "Paid" ? (
                    <button
                      onClick={handleDownloadDO}
                      className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                      style={{ backgroundColor: "#16A34A" }}
                    >
                      <Download size={16} /> Download DO PDF
                    </button>
                  ) : (
                    <button
                      onClick={handlePayNow}
                      disabled={paymentStage === "initiated" || paymentStage === "redirecting" || paymentStage === "pending"}
                      className="flex items-center gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#0B2545" }}
                    >
                      <CreditCard size={16} /> Pay Now
                    </button>
                  )}
                  <button
                    onClick={handleDownloadInvoice}
                    className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <FileText size={16} /> Download Invoice
                  </button>
                  <button
                    onClick={handleRaiseDispute}
                    className="flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <AlertTriangle size={16} /> Raise Dispute
                  </button>
                </div>
              </div>
            </div>
          </div>

          {paymentStage !== "idle" && (
            <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-[#1B4F8B]" />
                <h2 className="text-[15px] font-bold text-[#0F172A]">Payment Process</h2>
                <ScopeBadge type="exc" />
              </div>

              <div className="flex items-center gap-2 mb-6">
                {(["initiated", "redirecting", "pending", "success", "failed"] as PaymentStage[]).map((stage) => {
                  const isActive = paymentStage === stage;
                  const isPast = (["initiated", "redirecting", "pending", "success", "failed"].indexOf(paymentStage) >
                    ["initiated", "redirecting", "pending", "success", "failed"].indexOf(stage));
                  const isFailed = paymentStage === "failed" && stage === "failed";
                  const isSuccess = paymentStage === "success" && stage === "success";

                  let bg = "#F1F5F9";
                  let text = "#94A3B8";
                  let icon: React.ReactNode = <span className="text-[10px] font-bold">{["initiated", "redirecting", "pending", "success", "failed"].indexOf(stage) + 1}</span>;

                  if (isFailed) { bg = "#FEE2E2"; text = "#DC2626"; icon = <XCircle size={14} />; }
                  else if (isSuccess) { bg = "#DCFCE7"; text = "#16A34A"; icon = <CheckCircle size={14} />; }
                  else if (isActive) { bg = "#EBF0F7"; text = "#1B4F8B"; }
                  else if (isPast) { bg = "#DCFCE7"; text = "#16A34A"; icon = <CheckCircle size={14} />; }

                  return (
                    <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: bg, color: text }}>
                        {icon}
                      </div>
                      <span className="text-[10px] font-semibold text-center leading-tight" style={{ color: text }}>
                        {stageLabels[stage]}
                      </span>
                    </div>
                  );
                })}
              </div>

              {paymentStage === "initiated" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#EBF0F7]">
                  <RefreshCw size={16} className="text-[#1B4F8B] animate-spin" />
                  <span className="text-[13px] font-semibold text-[#1B4F8B]">Initiating payment of PKR {selected.grandTotal.toLocaleString()}...</span>
                </div>
              )}

              {paymentStage === "redirecting" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#EBF0F7]">
                  <RefreshCw size={16} className="text-[#1B4F8B] animate-spin" />
                  <span className="text-[13px] font-semibold text-[#1B4F8B]">Redirecting to payment gateway...</span>
                </div>
              )}

              {paymentStage === "pending" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FEF3C7]">
                  <Clock size={16} className="text-[#D97706]" />
                  <span className="text-[13px] font-semibold text-[#D97706]">Awaiting payment confirmation from gateway...</span>
                </div>
              )}

              {paymentStage === "success" && (
                <div className="p-5 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center">
                      <CheckCircle size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#0F172A]">Payment Successful</p>
                      <p className="text-[12px] text-[#64748B]">Your DO is now ready for download.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    <div>
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase">Transaction ID</label>
                      <p className="text-[13px] font-mono font-bold text-[#0F172A]">{transactionId}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase">Invoice #</label>
                      <p className="text-[13px] font-mono font-semibold text-[#0F172A]">{selected.invoiceNo}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase">AWB #</label>
                      <p className="text-[13px] font-mono font-semibold text-[#1B4F8B]">{selected.awb}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase">Amount Paid</label>
                      <p className="text-[13px] font-bold text-[#16A34A]">PKR {selected.grandTotal.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase">Paid At</label>
                      <p className="text-[13px] text-[#334155]" suppressHydrationWarning={true}>01 Jun 2026, 14:32</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase">DO Status</label>
                      <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold bg-[#DBEAFE] text-[#1D4ED8]">
                        Ready
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownloadReceipt}
                      className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#16A34A]/30 text-[#16A34A] hover:bg-[#16A34A]/10 cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <FileText size={14} /> Download Receipt
                    </button>
                    <button
                      onClick={handleDownloadDO}
                      className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold bg-[#16A34A] text-white hover:opacity-90 cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <Download size={14} /> Download DO PDF
                    </button>
                  </div>

                  {doDownloaded && (
                    <div className="mt-4 p-4 rounded-xl bg-white border border-[#E2E8F0]">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText size={14} className="text-[#1B4F8B]" />
                        <h3 className="text-[13px] font-bold text-[#0F172A]">Delivery Order</h3>
                        <ScopeBadge type="exc" />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">DO #</label>
                          <p className="text-[13px] font-mono font-bold text-[#0F172A]">{selected.doNumber}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">AWB #</label>
                          <p className="text-[13px] font-mono font-semibold text-[#1B4F8B]">{selected.awb}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Issued At</label>
                          <p className="text-[13px] text-[#334155]">01 Jun 2026, 14:33</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Valid Until</label>
                          <p className="text-[13px] font-semibold text-[#0F172A]">03 Jun 2026</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-[#94A3B8] uppercase">Pickup Status</label>
                          <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#64748B]">Not Scheduled</span>
                        </div>
                      </div>
                      <button
                        onClick={handleDownloadDO}
                        className="flex items-center gap-2 mt-3 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                      >
                        <Download size={14} /> Download DO PDF
                      </button>
                    </div>
                  )}
                </div>
              )}

              {paymentStage === "failed" && (
                <div className="p-5 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#DC2626] flex items-center justify-center">
                      <XCircle size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#0F172A]">Payment Failed</p>
                      <p className="text-[12px] text-[#64748B]">Your payment could not be processed.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase">Failure Reason</label>
                      <p className="text-[13px] text-[#DC2626] font-semibold">{failureReason}</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-[#64748B] uppercase">Transaction Reference</label>
                      <p className="text-[13px] font-mono text-[#334155]">REF-{Date.now().toString(36).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleRetry}
                      className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <RefreshCw size={14} /> Retry Payment
                    </button>
                    <button
                      onClick={() => addToast("Support request sent. We will contact you shortly.", "success")}
                      className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {!selected && (
        <div className="py-16 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center">
              <Search size={28} className="text-[#94A3B8]" />
            </div>
            <p className="text-[14px] font-semibold text-[#64748B]">Select an AWB to view charges.</p>
            <p className="text-[12px] text-[#94A3B8]">Search for your AWB number above to see invoice details and make payment.</p>
          </div>
        </div>
      )}
    </div>
  );
}