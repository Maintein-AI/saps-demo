"use client";

import { X, FileText, Save, Ban } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/components/ToastContext";

interface Invoice {
  id: string;
  invoiceNo: string;
  awb: string;
  do: string;
  consignee: string;
  amountPKR: string;
  dueDate: string;
  status: string;
  paymentMethod: string;
  receiptUrl: string;
}

interface InvoiceBreakdown {
  invoiceNo: string;
  awb: string;
  do: string;
  storageCharges: string;
  demurrage: string;
  surcharges: string;
  adjustments: string;
  gst: string;
  grandTotal: string;
  paidAmount: string;
  balance: string;
}

const breakdowns: Record<string, InvoiceBreakdown> = {
  "SAPS-2026-00841": {
    invoiceNo: "SAPS-2026-00841",
    awb: "214-45678901",
    do: "DO-90871",
    storageCharges: "85,000",
    demurrage: "15,000",
    surcharges: "8,500",
    adjustments: "0",
    gst: "16,500",
    grandTotal: "125,000",
    paidAmount: "0",
    balance: "125,000",
  },
  "SAPS-2026-00839": {
    invoiceNo: "SAPS-2026-00839",
    awb: "157-90811223",
    do: "DO-90872",
    storageCharges: "62,000",
    demurrage: "8,500",
    surcharges: "5,000",
    adjustments: "0",
    gst: "12,000",
    grandTotal: "87,500",
    paidAmount: "0",
    balance: "87,500",
  },
  "SAPS-2026-00835": {
    invoiceNo: "SAPS-2026-00835",
    awb: "074-88219033",
    do: "DO-90873",
    storageCharges: "145,000",
    demurrage: "30,000",
    surcharges: "12,000",
    adjustments: "0",
    gst: "23,000",
    grandTotal: "210,000",
    paidAmount: "105,000",
    balance: "105,000",
  },
  "SAPS-2026-00830": {
    invoiceNo: "SAPS-2026-00830",
    awb: "117-55443321",
    do: "DO-90874",
    storageCharges: "110,000",
    demurrage: "18,000",
    surcharges: "9,000",
    adjustments: "0",
    gst: "19,000",
    grandTotal: "156,000",
    paidAmount: "0",
    balance: "156,000",
  },
  "SAPS-2026-00828": {
    invoiceNo: "SAPS-2026-00828",
    awb: "117-98765432",
    do: "DO-90875",
    storageCharges: "240,000",
    demurrage: "45,000",
    surcharges: "20,000",
    adjustments: "0",
    gst: "35,000",
    grandTotal: "340,000",
    paidAmount: "0",
    balance: "340,000",
  },
  "SAPS-2026-00825": {
    invoiceNo: "SAPS-2026-00825",
    awb: "214-99887766",
    do: "DO-90877",
    storageCharges: "65,000",
    demurrage: "10,000",
    surcharges: "4,500",
    adjustments: "0",
    gst: "12,500",
    grandTotal: "92,000",
    paidAmount: "0",
    balance: "92,000",
  },
  "SAPS-2026-00822": {
    invoiceNo: "SAPS-2026-00822",
    awb: "117-44556677",
    do: "DO-90878",
    storageCharges: "95,000",
    demurrage: "12,000",
    surcharges: "7,000",
    adjustments: "0",
    gst: "23,000",
    grandTotal: "137,000",
    paidAmount: "137,000",
    balance: "0",
  },
  "SAPS-2026-00818": {
    invoiceNo: "SAPS-2026-00818",
    awb: "074-55667788",
    do: "DO-90879",
    storageCharges: "45,000",
    demurrage: "5,000",
    surcharges: "3,000",
    adjustments: "0",
    gst: "12,000",
    grandTotal: "65,000",
    paidAmount: "65,000",
    balance: "0",
  },
  "SAPS-2026-00815": {
    invoiceNo: "SAPS-2026-00815",
    awb: "214-44556677",
    do: "DO-90881",
    storageCharges: "120,000",
    demurrage: "25,000",
    surcharges: "10,000",
    adjustments: "0",
    gst: "20,000",
    grandTotal: "175,000",
    paidAmount: "0",
    balance: "175,000",
  },
  "SAPS-2026-00812": {
    invoiceNo: "SAPS-2026-00812",
    awb: "074-11223344",
    do: "DO-90876",
    storageCharges: "32,000",
    demurrage: "4,000",
    surcharges: "2,500",
    adjustments: "0",
    gst: "9,500",
    grandTotal: "48,000",
    paidAmount: "48,000",
    balance: "0",
  },
};

interface InvoiceBreakdownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice;
}

export default function InvoiceBreakdownDrawer({ isOpen, onClose, invoice }: InvoiceBreakdownDrawerProps) {
  const { addToast } = useToast();
  const bd = invoice ? breakdowns[invoice.invoiceNo] : null;

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

  const handleDownload = () => {
    addToast("Invoice breakdown downloaded.", "success");
  };

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
          maxWidth: 420,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Invoice Breakdown</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EBF0F7] flex items-center justify-center">
              <FileText size={18} className="text-[#1B4F8B]" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#0F172A]">{invoice?.invoiceNo || "Select invoice"}</p>
              <p className="text-[12px] text-[#64748B]">{invoice?.awb || ""} | {invoice?.do || ""}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            {bd ? (
              <>
                <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-semibold text-[#64748B]">Invoice #</span>
                    <span className="text-[13px] font-bold text-[#0F172A] font-mono">{bd.invoiceNo}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-semibold text-[#64748B]">AWB #</span>
                    <span className="text-[13px] font-semibold text-[#1B4F8B]">{bd.awb}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#64748B]">DO #</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{bd.do}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">Storage Charges</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs {bd.storageCharges}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">Demurrage</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs {bd.demurrage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">Surcharges</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs {bd.surcharges}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">Adjustments</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs {bd.adjustments}</span>
                  </div>
                  <div className="h-px bg-[#E2E8F0]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#0F172A]">Subtotal</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs {bd.grandTotal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">GST 18%</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">Rs {bd.gst}</span>
                  </div>
                  <div className="h-px bg-[#E2E8F0]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[#0F172A]">Grand Total</span>
                    <span className="text-[14px] font-bold text-[#1B4F8B]">Rs {bd.grandTotal}</span>
                  </div>
                  <div className="h-px bg-[#E2E8F0]" />
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#64748B]">Paid Amount</span>
                    <span className="text-[13px] font-semibold text-[#16A34A]">Rs {bd.paidAmount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#0F172A]">Balance</span>
                    <span className="text-[13px] font-bold text-[#DC2626]">Rs {bd.balance}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-[13px] text-[#94A3B8]">Select an invoice to view breakdown</div>
            )}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#0B2545" }}
          >
            <Save size={16} />
            <span className="whitespace-nowrap">Download</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <Ban size={16} />
            <span className="whitespace-nowrap">Close</span>
          </button>
        </div>
      </div>
    </>
  );
}