"use client";

import { useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Download,
  Eye,
  CreditCard,
  Flag,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

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

const invoices: Invoice[] = [
  {
    id: "INV001",
    invoiceNo: "SAPS-2026-00841",
    awb: "214-45678901",
    do: "DO-90871",
    consignee: "Gerry's Dnata",
    amountPKR: "125,000",
    dueDate: "10 Jun 2026",
    status: "Unpaid",
    paymentMethod: "Bank Transfer",
    receiptUrl: "",
  },
  {
    id: "INV002",
    invoiceNo: "SAPS-2026-00839",
    awb: "157-90811223",
    do: "DO-90872",
    consignee: "DB Schenker",
    amountPKR: "87,500",
    dueDate: "08 Jun 2026",
    status: "Unpaid",
    paymentMethod: "Credit Card",
    receiptUrl: "",
  },
  {
    id: "INV003",
    invoiceNo: "SAPS-2026-00835",
    awb: "074-88219033",
    do: "DO-90873",
    consignee: "Kuehne+Nagel",
    amountPKR: "210,000",
    dueDate: "05 Jun 2026",
    status: "Partially Paid",
    paymentMethod: "Bank Transfer",
    receiptUrl: "",
  },
  {
    id: "INV004",
    invoiceNo: "SAPS-2026-00830",
    awb: "117-55443321",
    do: "DO-90874",
    consignee: "Agility Pakistan",
    amountPKR: "156,000",
    dueDate: "01 Jun 2026",
    status: "Overdue",
    paymentMethod: "Bank Transfer",
    receiptUrl: "",
  },
  {
    id: "INV005",
    invoiceNo: "SAPS-2026-00828",
    awb: "117-98765432",
    do: "DO-90875",
    consignee: "Gerry's Dnata",
    amountPKR: "340,000",
    dueDate: "28 May 2026",
    status: "Overdue",
    paymentMethod: "Credit Card",
    receiptUrl: "",
  },
  {
    id: "INV006",
    invoiceNo: "SAPS-2026-00825",
    awb: "214-99887766",
    do: "DO-90877",
    consignee: "DB Schenker",
    amountPKR: "92,000",
    dueDate: "25 May 2026",
    status: "Disputed",
    paymentMethod: "Bank Transfer",
    receiptUrl: "",
  },
  {
    id: "INV007",
    invoiceNo: "SAPS-2026-00822",
    awb: "117-44556677",
    do: "DO-90878",
    consignee: "Kuehne+Nagel",
    amountPKR: "137,000",
    dueDate: "22 May 2026",
    status: "Paid",
    paymentMethod: "Bank Transfer",
    receiptUrl: "SAPS-2026-00822-R.pdf",
  },
  {
    id: "INV008",
    invoiceNo: "SAPS-2026-00818",
    awb: "074-55667788",
    do: "DO-90879",
    consignee: "Agility Pakistan",
    amountPKR: "65,000",
    dueDate: "18 May 2026",
    status: "Paid",
    paymentMethod: "Credit Card",
    receiptUrl: "SAPS-2026-00818-R.pdf",
  },
  {
    id: "INV009",
    invoiceNo: "SAPS-2026-00815",
    awb: "214-44556677",
    do: "DO-90881",
    consignee: "Gerry's Dnata",
    amountPKR: "175,000",
    dueDate: "15 May 2026",
    status: "Unpaid",
    paymentMethod: "Bank Transfer",
    receiptUrl: "",
  },
  {
    id: "INV010",
    invoiceNo: "SAPS-2026-00812",
    awb: "074-11223344",
    do: "DO-90876",
    consignee: "DB Schenker",
    amountPKR: "48,000",
    dueDate: "12 May 2026",
    status: "Paid",
    paymentMethod: "Credit Card",
    receiptUrl: "SAPS-2026-00812-R.pdf",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Unpaid: { bg: "#F1F5F9", text: "#64748B", icon: <Clock size={12} /> },
  "Partially Paid": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Paid: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Overdue: { bg: "#FEE2E2", text: "#DC2626", icon: <AlertTriangle size={12} /> },
  Disputed: { bg: "#FEE2E2", text: "#DC2626", icon: <XCircle size={12} /> },
};

interface OutstandingInvoicesTableProps {
  onBreakdown: (invoice: Invoice) => void;
  onPay: (invoice: Invoice) => void;
}

export default function OutstandingInvoicesTable({
  onBreakdown,
  onPay,
}: OutstandingInvoicesTableProps) {
  const { addToast } = useToast();
  const [raisedDisputes, setRaisedDisputes] = useState<Set<string>>(new Set());

  const handleDownload = (invoice: Invoice) => {
    addToast(`Invoice ${invoice.invoiceNo} downloaded.`, "success");
  };

  const handleRaiseDispute = (invoice: Invoice) => {
    setRaisedDisputes((prev) => new Set(prev).add(invoice.id));
    addToast(`Dispute raised for ${invoice.invoiceNo}.`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Outstanding Invoices</h3>
        </div>
        <span className="text-[12px] text-[#64748B]">{invoices.length} invoices</span>
      </div>

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
            {invoices.map((invoice) => {
              const sc = statusConfig[invoice.status];
              const isDisputed = raisedDisputes.has(invoice.id);
              return (
                <tr key={invoice.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#EBF0F7] flex items-center justify-center">
                        <FileText size={14} className="text-[#1B4F8B]" />
                      </div>
                      <span className="text-[12px] font-semibold text-[#0F172A] font-mono">{invoice.invoiceNo}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#1B4F8B]">{invoice.awb}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{invoice.do}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{invoice.consignee}</td>
                  <td className="py-3 px-3 text-[12px] font-bold text-[#0F172A]">Rs {invoice.amountPKR}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{invoice.dueDate}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {invoice.status}
                    </span>
                    {isDisputed && (
                      <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold ml-1" style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}>
                        <Flag size={12} />
                        Disputed
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{invoice.paymentMethod}</td>
                  <td className="py-3 px-3">
                    {invoice.receiptUrl ? (
                      <button
                        onClick={() => handleDownload(invoice)}
                        className="inline-flex items-center gap-1 h-5 px-2 rounded-full bg-[#EBF0F7] text-[#1B4F8B] text-[11px] font-semibold cursor-pointer hover:bg-[#1B4F8B]/10 transition-colors"
                      >
                        <Download size={12} />
                        Download
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#94A3B8]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onPay(invoice)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#DCFCE7] text-[#16A34A] cursor-pointer transition-colors"
                        title="Pay via Gateway"
                      >
                        <CreditCard size={14} />
                      </button>
                      <button
                        onClick={() => handleDownload(invoice)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Download Invoice"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => onBreakdown(invoice)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="View Breakdown"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleRaiseDispute(invoice)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#DC2626] cursor-pointer transition-colors"
                        title="Raise Dispute"
                      >
                        <Flag size={14} />
                      </button>
                      <button
                        onClick={() => {}}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Details"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}