"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Ban,
  Eye,
  Download,
  CreditCard,
  FileText,
  X,
  RefreshCw,
  ArrowRight,
  FileUp,
  DollarSign,
  ShieldAlert,
  Printer,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  invoiceNo: string;
  awb: string;
  doNo: string;
  consignee: string;
  amountPKR: number;
  dueDate: string;
  status: "Unpaid" | "Partially Paid" | "Paid" | "Overdue" | "Disputed";
  paymentMethod: string;
  receipt: string;
  storageCharges: number;
  demurrage: number;
  surcharges: number;
  adjustments: number;
  gst: number;
  paidAmount: number;
  balance: number;
}

const invoiceItems: InvoiceItem[] = [
  {
    id: "INV-001",
    invoiceNo: "INV-2026-00412",
    awb: "214-77890123",
    doNo: "DO-90912",
    consignee: "Gerry's Dnata",
    amountPKR: 485000,
    dueDate: "02 Jun 2026",
    status: "Unpaid",
    paymentMethod: "—",
    receipt: "",
    storageCharges: 320000,
    demurrage: 45000,
    surcharges: 25000,
    adjustments: 0,
    gst: 95000,
    paidAmount: 0,
    balance: 485000,
  },
  {
    id: "INV-002",
    invoiceNo: "INV-2026-00413",
    awb: "157-66778899",
    doNo: "DO-90913",
    consignee: "DB Schenker Pakistan",
    amountPKR: 320000,
    dueDate: "03 Jun 2026",
    status: "Partially Paid",
    paymentMethod: "Bank Transfer",
    receipt: "RCP-2026-00892",
    storageCharges: 210000,
    demurrage: 30000,
    surcharges: 15000,
    adjustments: 0,
    gst: 65000,
    paidAmount: 150000,
    balance: 170000,
  },
  {
    id: "INV-003",
    invoiceNo: "INV-2026-00410",
    awb: "074-55443322",
    doNo: "DO-90914",
    consignee: "Kuehne+Nagel KHI",
    amountPKR: 180000,
    dueDate: "28 May 2026",
    status: "Paid",
    paymentMethod: "Credit Card",
    receipt: "RCP-2026-00891",
    storageCharges: 125000,
    demurrage: 15000,
    surcharges: 8000,
    adjustments: 0,
    gst: 32000,
    paidAmount: 180000,
    balance: 0,
  },
  {
    id: "INV-004",
    invoiceNo: "INV-2026-00408",
    awb: "117-99887766",
    doNo: "DO-90915",
    consignee: "Agility Pakistan",
    amountPKR: 650000,
    dueDate: "25 May 2026",
    status: "Overdue",
    paymentMethod: "—",
    receipt: "",
    storageCharges: 450000,
    demurrage: 85000,
    surcharges: 35000,
    adjustments: -5000,
    gst: 75000,
    paidAmount: 0,
    balance: 650000,
  },
  {
    id: "INV-005",
    invoiceNo: "INV-2026-00405",
    awb: "214-11223344",
    doNo: "DO-90916",
    consignee: "Pakistan Cargo Services",
    amountPKR: 275000,
    dueDate: "01 Jun 2026",
    status: "Disputed",
    paymentMethod: "—",
    receipt: "",
    storageCharges: 185000,
    demurrage: 22000,
    surcharges: 12000,
    adjustments: 0,
    gst: 56000,
    paidAmount: 0,
    balance: 275000,
  },
  {
    id: "INV-006",
    invoiceNo: "INV-2026-00401",
    awb: "074-44556677",
    doNo: "DO-90917",
    consignee: "Gerry's Dnata",
    amountPKR: 420000,
    dueDate: "20 May 2026",
    status: "Paid",
    paymentMethod: "Bank Transfer",
    receipt: "RCP-2026-00885",
    storageCharges: 285000,
    demurrage: 40000,
    surcharges: 18000,
    adjustments: 0,
    gst: 77000,
    paidAmount: 420000,
    balance: 0,
  },
  {
    id: "INV-007",
    invoiceNo: "INV-2026-00415",
    awb: "157-22334455",
    doNo: "DO-90918",
    consignee: "DB Schenker Pakistan",
    amountPKR: 390000,
    dueDate: "05 Jun 2026",
    status: "Unpaid",
    paymentMethod: "—",
    receipt: "",
    storageCharges: 260000,
    demurrage: 35000,
    surcharges: 18000,
    adjustments: 0,
    gst: 77000,
    paidAmount: 0,
    balance: 390000,
  },
  {
    id: "INV-008",
    invoiceNo: "INV-2026-00409",
    awb: "117-55667788",
    doNo: "DO-90919",
    consignee: "Kuehne+Nagel KHI",
    amountPKR: 145000,
    dueDate: "30 May 2026",
    status: "Paid",
    paymentMethod: "Cash",
    receipt: "RCP-2026-00890",
    storageCharges: 95000,
    demurrage: 12000,
    surcharges: 7000,
    adjustments: 0,
    gst: 31000,
    paidAmount: 145000,
    balance: 0,
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Unpaid: { bg: "#FEE2E2", text: "#DC2626", icon: <Clock size={12} /> },
  "Partially Paid": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Paid: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Overdue: { bg: "#FEE2E2", text: "#DC2626", icon: <AlertTriangle size={12} /> },
  Disputed: { bg: "#F1F5F9", text: "#64748B", icon: <Ban size={12} /> },
};

function formatPKR(amount: number) {
  return "Rs " + amount.toLocaleString("en-IN");
}

export default function InvoicesTable() {
  const { addToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<InvoiceItem[]>(invoiceItems);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{ transactionId: string; invoiceNo: string; amount: number } | null>(null);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setItems(invoiceItems);
      addToast("Payment completed.", "success");
    }, 1500);
  };

  const activeItem = items.find((t) => t.id === selectedItem);

  const handlePayNow = () => {
    if (!activeItem) return;
    const transactionId = "TXN-2026-" + Math.floor(100000 + Math.random() * 900000);
    setPaymentSuccessData({
      transactionId,
      invoiceNo: activeItem.invoiceNo,
      amount: activeItem.balance,
    });
    setShowPaymentSuccess(true);
    addToast("Payment completed.", "success");
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem
          ? {
              ...i,
              status: "Paid" as const,
              paidAmount: i.amountPKR,
              balance: 0,
              paymentMethod: "Credit Card",
              receipt: "RCP-2026-" + Math.floor(10000 + Math.random() * 90000),
            }
          : i
      )
    );
  };

  const handleDownloadInvoice = () => {
    addToast("Invoice PDF downloaded.", "success");
  };

  const handleDownloadReceipt = () => {
    addToast("Receipt PDF downloaded.", "success");
  };

  const handleViewStatement = () => {
    addToast("Statement opened.", "success");
  };

  const handleRaiseDispute = () => {
    if (!activeItem) return;
    setItems((prev) =>
      prev.map((i) => (i.id === selectedItem ? { ...i, status: "Disputed" as const } : i))
    );
    addToast("Dispute raised on invoice.", "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">CHA Invoices</h2>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{items.length} invoices</span>
      </div>

      <div className="p-5">
        {error && (
          <div className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626]" />
            <span className="text-[13px] font-semibold text-[#DC2626]">Failed to load invoice data. Please try again.</span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {showPaymentSuccess && paymentSuccessData && (
          <div className="mb-4 p-5 rounded-xl border border-[#DCFCE7] bg-[#F0FDF4]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <CheckCircle size={20} className="text-[#16A34A]" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-[#0F172A]">Payment Successful</h3>
                <p className="text-[12px] text-[#64748B]">{paymentSuccessData.transactionId}</p>
              </div>
              <button
                onClick={() => setShowPaymentSuccess(false)}
                className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#DCFCE7] text-[#64748B] cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1">Invoice #</label>
                <p className="text-[13px] font-semibold text-[#0F172A] font-mono">{paymentSuccessData.invoiceNo}</p>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1">Amount PKR</label>
                <p className="text-[13px] font-semibold text-[#0F172A]">{formatPKR(paymentSuccessData.amount)}</p>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1">Transaction ID</label>
                <p className="text-[13px] font-semibold text-[#0F172A] font-mono">{paymentSuccessData.transactionId}</p>
              </div>
            </div>
            <button
              onClick={() => { addToast("Receipt downloaded.", "success"); }}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: "#0B2545" }}
            >
              <Download size={14} />
              Download Receipt
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Invoice #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Consignee</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Amount PKR</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Due Date</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Payment Method</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Receipt</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9]">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="py-3 px-3">
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 0 ? "90px" : j === 1 ? "90px" : j === 2 ? "70px" : j === 3 ? "110px" : j === 4 ? "80px" : j === 5 ? "70px" : j === 6 ? "80px" : "60px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                        <FileText size={24} className="text-[#94A3B8]" />
                      </div>
                      <p className="text-[13px] font-semibold text-[#64748B]">No invoices found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const sc = statusConfig[item.status];
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    >
                      <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{item.invoiceNo}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{item.doNo}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.consignee}</td>
                      <td className="py-3 px-3 text-[12px] font-bold text-[#0F172A]">{formatPKR(item.amountPKR)}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.dueDate}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {sc.icon}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.paymentMethod}</td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.receipt || "—"}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedItem(item.id); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="View Detail"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToast(`Invoice ${item.invoiceNo} downloaded.`, "success"); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Download Invoice"
                          >
                            <Download size={14} />
                          </button>
                          {item.receipt && (
                            <button
                              onClick={(e) => { e.stopPropagation(); addToast(`Receipt ${item.receipt} downloaded.`, "success"); }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                              title="Download Receipt"
                            >
                              <FileText size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {activeItem && (
          <div className="mt-5 p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileUp size={16} className="text-[#1B4F8B]" />
                <h3 className="text-[13px] font-bold text-[#0F172A]">Invoice Breakdown</h3>
                <ScopeBadge type="exc" />
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Invoice #</label>
                <input type="text" value={activeItem.invoiceNo} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">AWB #</label>
                <input type="text" value={activeItem.awb} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">DO #</label>
                <input type="text" value={activeItem.doNo} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Storage Charges</label>
                <input type="text" value={formatPKR(activeItem.storageCharges)} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Demurrage</label>
                <input type="text" value={formatPKR(activeItem.demurrage)} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Surcharges</label>
                <input type="text" value={formatPKR(activeItem.surcharges)} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Adjustments</label>
                <input type="text" value={formatPKR(activeItem.adjustments)} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">GST 18%</label>
                <input type="text" value={formatPKR(activeItem.gst)} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Grand Total</label>
                <input type="text" value={formatPKR(activeItem.amountPKR)} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Paid Amount</label>
                <input type="text" value={formatPKR(activeItem.paidAmount)} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#16A34A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Balance</label>
                <input type="text" value={formatPKR(activeItem.balance)} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#DC2626] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Status</label>
                <span className="inline-flex items-center gap-1 h-9 px-3 rounded-lg text-[12px] font-semibold" style={{ backgroundColor: statusConfig[activeItem.status].bg, color: statusConfig[activeItem.status].text }}>
                  {statusConfig[activeItem.status].icon}
                  {activeItem.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
              {activeItem.status !== "Paid" && activeItem.status !== "Disputed" && (
                <button
                  onClick={handlePayNow}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                  style={{ backgroundColor: "#0B2545" }}
                >
                  <DollarSign size={14} />
                  Pay Now
                </button>
              )}
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <Download size={14} />
                Download Invoice
              </button>
              {activeItem.receipt && (
                <button
                  onClick={handleDownloadReceipt}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
                >
                  <FileText size={14} />
                  Download Receipt
                </button>
              )}
              <button
                onClick={handleViewStatement}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <ArrowRight size={14} />
                View Statement
              </button>
              {activeItem.status !== "Disputed" && activeItem.status !== "Paid" && (
                <button
                  onClick={handleRaiseDispute}
                  className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#DC2626] cursor-pointer transition-colors hover:bg-[#FEE2E2]"
                >
                  <ShieldAlert size={14} />
                  Raise Dispute
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}