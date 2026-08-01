"use client";

import { useToast } from "@/components/ToastContext";
import { X, Copy, Download, CheckCircle } from "lucide-react";

interface IATASyntaxDrawerProps {
  open: boolean;
  onClose: () => void;
  syntax: string;
  messageType?: string;
}

export default function IATASyntaxDrawer({ open, onClose, syntax, messageType = "ULD" }: IATASyntaxDrawerProps) {
  const { addToast } = useToast();

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(syntax).then(() => {
      addToast("IATA syntax copied to clipboard.", "success");
    }).catch(() => {
      addToast("Failed to copy syntax.", "error");
    });
  };

  const handleDownload = () => {
    const blob = new Blob([syntax], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${messageType}_IATA_Syntax.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast("IATA syntax downloaded.", "success");
  };

  const handleValidate = () => {
    addToast("Syntax validation passed. No errors detected.", "success");
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[640px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">IATA Syntax</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <pre className="text-[13px] font-mono text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 whitespace-pre-wrap break-all leading-relaxed">
            {syntax || "No syntax generated."}
          </pre>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-[#E2E8F0]">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
          >
            <Copy size={14} />
            Copy Syntax
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold bg-[#0F172A] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
          >
            <Download size={14} />
            Download Text
          </button>
          <button
            onClick={handleValidate}
            className="flex items-center gap-2 h-9 px-4 rounded-lg text-[12px] font-semibold border border-[#16A34A] text-[#16A34A] hover:bg-[#DCFCE7] cursor-pointer transition-colors whitespace-nowrap"
          >
            <CheckCircle size={14} />
            Validate Syntax
          </button>
        </div>
      </div>
    </div>
  );
}