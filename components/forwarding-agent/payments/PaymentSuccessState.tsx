"use client";

import { CheckCircle, Download, X, CreditCard } from "lucide-react";
import { useEffect } from "react";

interface PaymentSuccessStateProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNo?: string;
  amount?: string;
  transactionId?: string;
}

export default function PaymentSuccessState({
  isOpen,
  onClose,
  invoiceNo,
  amount,
  transactionId,
}: PaymentSuccessStateProps) {
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

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[80] flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white rounded-[20px] shadow-xl p-6 w-full max-w-[400px] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-bold text-[#0F172A]">Payment Successful</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                <CheckCircle size={32} className="text-[#16A34A]" />
              </div>
              <div className="text-center">
                <p className="text-[14px] font-bold text-[#0F172A]">Payment Confirmed</p>
                <p className="text-[13px] text-[#64748B] mt-1">Your payment has been recorded successfully.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#64748B]">Transaction ID</span>
                <span className="text-[13px] font-mono text-[#0F172A]">{transactionId || "TXN-7829146"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#64748B]">Invoice #</span>
                <span className="text-[13px] font-mono text-[#0F172A]">{invoiceNo || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#64748B]">Amount</span>
                <span className="text-[13px] font-bold text-[#1B4F8B]">Rs {amount || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#64748B]">Payment Method</span>
                <span className="text-[13px] text-[#0F172A]">Credit Card</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#64748B]">Date</span>
                <span className="text-[13px] text-[#0F172A]">01 Jun 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {}}
                className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0B2545" }}
              >
                <Download size={16} />
                <span className="whitespace-nowrap">Download Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
              >
                <span className="whitespace-nowrap">Done</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}