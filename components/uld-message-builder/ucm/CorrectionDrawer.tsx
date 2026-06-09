"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import { X } from "lucide-react";

interface CorrectionDrawerProps {
  open: boolean;
  onClose: () => void;
  messageRef: string;
}

export default function CorrectionDrawer({ open, onClose, messageRef }: CorrectionDrawerProps) {
  const { addToast } = useToast();
  const [correctionReason, setCorrectionReason] = useState("");
  const [correctedFields, setCorrectedFields] = useState("");
  const [siRemarks, setSiRemarks] = useState("");
  const [newStatus, setNewStatus] = useState("Correction");

  if (!open) return null;

  const handleSubmit = () => {
    if (!correctionReason.trim()) {
      addToast("Correction reason is required.", "error");
      return;
    }
    addToast("Correction submitted successfully.", "success");
    onClose();
    setCorrectionReason("");
    setCorrectedFields("");
    setSiRemarks("");
    setNewStatus("Correction");
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[560px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Create Correction</h2>
            <ScopeBadge type="exc" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Original Message Reference</label>
            <input
              type="text"
              value={messageRef}
              readOnly
              className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] font-mono text-[#0F172A] bg-[#F1F5F9]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Correction Reason <span className="text-[#DC2626]">*</span></label>
            <select
              value={correctionReason}
              onChange={(e) => setCorrectionReason(e.target.value)}
              className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white cursor-pointer focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
            >
              <option value="">Select reason...</option>
              <option value="ULD count mismatch">ULD count mismatch</option>
              <option value="ULD number error">ULD number error</option>
              <option value="Flight details incorrect">Flight details incorrect</option>
              <option value="Station code error">Station code error</option>
              <option value="Content classification change">Content classification change</option>
              <option value="Duplicate message correction">Duplicate message correction</option>
              <option value="Operational update">Operational update</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Corrected Fields</label>
            <textarea
              value={correctedFields}
              onChange={(e) => setCorrectedFields(e.target.value)}
              placeholder="Describe which fields have been corrected..."
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] resize-none focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors placeholder:text-[#94A3B8]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">SI Remarks</label>
            <textarea
              value={siRemarks}
              onChange={(e) => setSiRemarks(e.target.value)}
              placeholder="Additional remarks for this correction..."
              maxLength={500}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] resize-none focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors placeholder:text-[#94A3B8]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">New Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] font-semibold text-[#D97706] bg-[#FEF3C7] cursor-pointer focus:outline-none focus:border-[#1B4F8B] focus:ring-1 focus:ring-[#1B4F8B] transition-colors"
            >
              <option value="Correction">Correction</option>
              <option value="Sent">Sent</option>
              <option value="Draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 px-6 py-4 border-t border-[#E2E8F0]">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 h-9 px-5 rounded-lg text-[12px] font-semibold bg-[#1B4F8B] text-white hover:opacity-90 cursor-pointer transition-opacity whitespace-nowrap"
          >
            Submit Correction
          </button>
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-lg text-[12px] font-medium text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}