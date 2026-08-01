"use client";

import { useState } from "react";
import { Download, Mail, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/components/ToastContext";

export default function StatementCard() {
  const { addToast } = useToast();
  const [emailSent, setEmailSent] = useState(false);

  const handleDownload = () => {
    addToast("Statement downloaded.", "success");
  };

  const handleEmail = () => {
    setEmailSent(true);
    addToast("Statement emailed to agency.", "success");
  };

  const handleExport = () => {
    addToast("CSV exported.", "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Agent Statement</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <Download size={14} />
            <span className="whitespace-nowrap">Download</span>
          </button>
          <button
            onClick={handleEmail}
            className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <Mail size={14} />
            <span className="whitespace-nowrap">{emailSent ? "Sent" : "Email"}</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
          >
            <FileSpreadsheet size={14} />
            <span className="whitespace-nowrap">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-[#64748B]" />
            <span className="text-[12px] font-semibold text-[#64748B]">Opening Balance</span>
          </div>
          <p className="text-[18px] font-bold text-[#0F172A]">Rs 845,000</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">As of 1 May 2026</p>
        </div>

        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-[#1B4F8B]" />
            <span className="text-[12px] font-semibold text-[#64748B]">New Invoices</span>
          </div>
          <p className="text-[18px] font-bold text-[#0F172A]">Rs 1,539,000</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">10 invoices issued</p>
        </div>

        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-[#16A34A]" />
            <span className="text-[12px] font-semibold text-[#64748B]">Payments Received</span>
          </div>
          <p className="text-[18px] font-bold text-[#0F172A]">Rs 892,000</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">5 invoices cleared</p>
        </div>

        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-[#D97706]" />
            <span className="text-[12px] font-semibold text-[#64748B]">Adjustments</span>
          </div>
          <p className="text-[18px] font-bold text-[#0F172A]">Rs 12,500</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Waivers & corrections</p>
        </div>

        <div className="p-4 rounded-xl border border-[#E2E8F0] bg-[#EBF0F7]">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-[#1B4F8B]" />
            <span className="text-[12px] font-semibold text-[#64748B]">Closing Balance</span>
          </div>
          <p className="text-[18px] font-bold text-[#1B4F8B]">Rs 1,247,500</p>
          <p className="text-[11px] text-[#94A3B8] mt-1">Due by 30 Jun 2026</p>
        </div>
      </div>
    </div>
  );
}