"use client";
import { AuditEntry } from "./types";
import { X, User, Calendar, ArrowRight } from "lucide-react";

interface AuditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entries: AuditEntry[];
}

export default function AuditDrawer({ isOpen, onClose, entries }: AuditDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[520px] bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-bold text-[#0F172A]">Tariff Audit Trail</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {entries.map((entry, idx) => (
              <div key={entry.id} className="rounded-xl border border-[#E2E8F0] p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#EBF0F7] flex items-center justify-center">
                      <User size={14} className="text-[#1B4F8B]" />
                    </div>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{entry.changedBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-[#94A3B8]" />
                    <span className="text-[11px] text-[#94A3B8]">{entry.changedAt}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Field Changed</span>
                    <span className="text-[13px] font-semibold text-[#0B2545]">{entry.fieldChanged}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#F8FAFC] rounded-lg p-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Old Value</span>
                      <span className="text-[13px] font-medium text-[#DC2626]">{entry.oldValue}</span>
                    </div>
                    <ArrowRight size={14} className="text-[#94A3B8]" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">New Value</span>
                      <span className="text-[13px] font-medium text-[#16A34A]">{entry.newValue}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Reason</span>
                    <span className="text-[13px] text-[#475569] ml-2">{entry.reason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}