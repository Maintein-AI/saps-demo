"use client";

import { useState } from "react";
import {
  Wallet,
  Receipt,
  AlertTriangle,
  FileCheck,
  Download,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface PaymentSummaryProps {
  onPayInvoice: () => void;
}

export default function PaymentSummary({ onPayInvoice }: PaymentSummaryProps) {
  const { addToast } = useToast();

  const items = [
    {
      label: "Outstanding PKR",
      value: "Rs 2,147,000",
      icon: <Wallet size={16} />,
      iconBg: "#FEE2E2",
      iconColor: "#DC2626",
    },
    {
      label: "Paid this month",
      value: "Rs 1,892,000",
      icon: <Receipt size={16} />,
      iconBg: "#DCFCE7",
      iconColor: "#16A34A",
    },
    {
      label: "Overdue invoices",
      value: "Rs 560,000",
      icon: <AlertTriangle size={16} />,
      iconBg: "#FEF3C7",
      iconColor: "#D97706",
    },
    {
      label: "Receipts available",
      value: "12 receipts",
      icon: <FileCheck size={16} />,
      iconBg: "#DBEAFE",
      iconColor: "#1D4ED8",
    },
  ];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Payment Summary</h3>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-4 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.iconBg, color: item.iconColor }}>
                {item.icon}
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0F172A]">{item.value}</p>
                <p className="text-[12px] text-[#64748B]">{item.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#E2E8F0] flex items-center gap-2">
        <button
          onClick={onPayInvoice}
          className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors"
          style={{ backgroundColor: "#0B2545" }}
        >
          <Wallet size={16} />
          Pay Invoice
        </button>
        <button
          onClick={() => addToast("Statement downloaded.", "success")}
          className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
        >
          <Download size={16} />
          Download
        </button>
        <button
          onClick={() => addToast("Statement emailed.", "success")}
          className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors"
        >
          <Mail size={16} />
          Email
        </button>
      </div>
    </div>
  );
}