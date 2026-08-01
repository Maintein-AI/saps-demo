"use client";

import { useState } from "react";
import { Payment } from "@/components/finance-manager/payment-reconciliation/types";
import { X, CheckCircle, Search } from "lucide-react";

interface ManualMatchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  onConfirm: (paymentId: string) => void;
}

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

export default function ManualMatchDrawer({
  isOpen,
  onClose,
  payment,
  onConfirm,
}: ManualMatchDrawerProps) {
  const [invoiceQuery, setInvoiceQuery] = useState("");
  const [awbQuery, setAwbQuery] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen || !payment) return null;

  const invoiceOptions = ["INV-2026-0081", "INV-2026-0082", "INV-2026-0083", "INV-2026-0084", "INV-2026-0085"];
  const awbOptions = ["214-45678901", "157-90811223", "074-88219033", "999-11223344", "111-55667788"];
  const filteredInvoices = invoiceOptions.filter(i => i.includes(invoiceQuery) || invoiceQuery === "");
  const filteredAWBs = awbOptions.filter(a => a.includes(awbQuery) || awbQuery === "");

  const difference = payment.amount - 148500; // placeholder invoice amount

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Manual Match</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Payment Ref #</label>
            <div className="text-[13px] font-semibold text-[#0B2545]">{payment.refNo}</div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Amount Received</label>
            <div className="text-[13px] font-semibold text-[#0F172A]">{formatPKR(payment.amount)}</div>
          </div>
          <div className="relative">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Search Invoice</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <Search size={16} className="text-[#94A3B8]" />
              </div>
              <input
                type="text"
                value={invoiceQuery}
                onChange={(e) => setInvoiceQuery(e.target.value)}
                placeholder="Search invoice..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20"
              />
            </div>
            {invoiceQuery && filteredInvoices.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden">
                {filteredInvoices.map((inv) => (
                  <button key={inv} onClick={() => setInvoiceQuery(inv)} className="w-full text-left px-4 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                    {inv}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Search AWB</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                <Search size={16} className="text-[#94A3B8]" />
              </div>
              <input
                type="text"
                value={awbQuery}
                onChange={(e) => setAwbQuery(e.target.value)}
                placeholder="Search AWB..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20"
              />
            </div>
            {awbQuery && filteredAWBs.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white rounded-xl border border-[#E2E8F0] shadow-lg overflow-hidden">
                {filteredAWBs.map((awb) => (
                  <button key={awb} onClick={() => setAwbQuery(awb)} className="w-full text-left px-4 py-2.5 text-[13px] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                    {awb}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Invoice Amount</label>
            <div className="text-[13px] font-semibold text-[#0F172A]">Rs. 148,500</div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Difference</label>
            <div className={`text-[13px] font-semibold ${difference >= 0 ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
              {difference >= 0 ? "+" : ""}{formatPKR(difference)}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Adjustment Reason</label>
            <select
              value={adjustmentReason}
              onChange={(e) => setAdjustmentReason(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20 pr-8"
            >
              <option value="">Select reason...</option>
              <option value="overpayment">Overpayment</option>
              <option value="underpayment">Underpayment</option>
              <option value="duplicate">Duplicate payment</option>
              <option value="wrong-invoice">Wrong invoice linked</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              placeholder="Enter match notes..."
              className="w-full h-20 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B]/20 resize-none"
            />
            <div className="text-[11px] text-[#94A3B8] mt-1 text-right">{notes.length}/500</div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => onConfirm(payment.id)}
              className="h-10 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
              style={{ backgroundColor: "#16A34A" }}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <CheckCircle size={14} />
              </div>
              Confirm Match
            </button>
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}