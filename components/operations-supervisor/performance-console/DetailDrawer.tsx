"use client";

import { X, FileSearch, BarChart3, ArrowUpRight, StickyNote, Clock, CheckCircle, User, MapPin, Calendar, List, AlertTriangle, TrendingUp } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";

const detailData: Record<string, {
  operator: string; role: string; shift: string; assignedZone: string;
  completedTasks: number; pendingTasks: number; exceptionCount: number;
  sla: number; avgTime: string; bestArea: string; improvementArea: string;
}> = {
  "Ahmed Khan": { operator: "Ahmed Khan", role: "Lifter Operator", shift: "Morning", assignedZone: "AFU Zone A", completedTasks: 15, pendingTasks: 3, exceptionCount: 1, sla: 94, avgTime: "8m", bestArea: "Putaway", improvementArea: "Gate dwell coordination" },
  "Sana Iqbal": { operator: "Sana Iqbal", role: "Warehouse Associate", shift: "Morning", assignedZone: "GCR Zone", completedTasks: 19, pendingTasks: 3, exceptionCount: 0, sla: 98, avgTime: "6m", bestArea: "Picking", improvementArea: "N/A" },
  "Bilal Raza": { operator: "Bilal Raza", role: "Gate Guard", shift: "Evening", assignedZone: "Gate Entry", completedTasks: 9, pendingTasks: 3, exceptionCount: 2, sla: 82, avgTime: "11m", bestArea: "Vehicle inspection", improvementArea: "Dwell time management" },
};

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  operator: string;
}

export default function DetailDrawer({ isOpen, onClose, operator }: DetailDrawerProps) {
  const data = detailData[operator] || detailData["Ahmed Khan"];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300" onClick={onClose} />
      )}
      <div className="fixed top-0 right-0 h-full bg-white shadow-xl z-[70] transition-transform duration-300 ease-out flex flex-col" style={{ width: "100%", maxWidth: 420, transform: isOpen ? "translateX(0)" : "translateX(100%)" }}>
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-[#E2E8F0] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Operator Performance Detail</h2>
            <ScopeBadge type="inc" />
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
              <User size={24} />
            </div>
            <div>
              <div className="text-[16px] font-bold text-[#0F172A]">{data.operator}</div>
              <div className="text-[12px] text-[#64748B]">{data.role} • {data.shift}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#E2E8F0] p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle size={12} className="text-[#16A34A]" />
                <span className="text-[11px] text-[#64748B]">Completed</span>
              </div>
              <div className="text-[20px] font-bold text-[#0F172A]">{data.completedTasks}</div>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <List size={12} className="text-[#D97706]" />
                <span className="text-[11px] text-[#64748B]">Pending</span>
              </div>
              <div className="text-[20px] font-bold text-[#0F172A]">{data.pendingTasks}</div>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle size={12} className="text-[#DC2626]" />
                <span className="text-[11px] text-[#64748B]">Exceptions</span>
              </div>
              <div className="text-[20px] font-bold text-[#0F172A]">{data.exceptionCount}</div>
            </div>
            <div className="rounded-xl border border-[#E2E8F0] p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp size={12} className="text-[#1B4F8B]" />
                <span className="text-[11px] text-[#64748B]">SLA %</span>
              </div>
              <div className="text-[20px] font-bold text-[#0F172A]">{data.sla}%</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#64748B]" />
              <span className="text-[12px] text-[#64748B]">Assigned Zone:</span>
              <span className="text-[12px] font-medium text-[#0F172A]">{data.assignedZone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#64748B]" />
              <span className="text-[12px] text-[#64748B]">Average Task Time:</span>
              <span className="text-[12px] font-medium text-[#0F172A]">{data.avgTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#64748B]" />
              <span className="text-[12px] text-[#64748B]">Shift:</span>
              <span className="text-[12px] font-medium text-[#0F172A]">{data.shift}</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] p-4">
            <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">Performance Areas</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
                <span className="text-[12px] text-[#64748B]">Best:</span>
                <span className="text-[12px] font-medium text-[#0F172A]">{data.bestArea}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#D97706]" />
                <span className="text-[12px] text-[#64748B]">Improvement:</span>
                <span className="text-[12px] font-medium text-[#0F172A]">{data.improvementArea}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-[#E2E8F0] p-4">
            <div className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-3">Recent Task Timeline</div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={12} className="text-[#16A34A]" />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#0F172A]">Putaway completed</div>
                  <div className="text-[11px] text-[#64748B]">AWB-117-98765432 • 08:42</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={12} className="text-[#1B4F8B]" />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#0F172A]">Picking completed</div>
                  <div className="text-[11px] text-[#64748B]">AWB-117-55443321 • 08:15</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#FEF3C7] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle size={12} className="text-[#D97706]" />
                </div>
                <div>
                  <div className="text-[12px] font-medium text-[#0F172A]">Exception reported</div>
                  <div className="text-[11px] text-[#64748B]">Piece-4421 • 07:55</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center gap-2">
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold text-white cursor-pointer hover:opacity-90 transition-colors" style={{ backgroundColor: "#0B2545" }}>
            <FileSearch size={14} /> View Detail
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <BarChart3 size={14} /> Movement Log
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <ArrowUpRight size={14} /> Escalation
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-xl text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <StickyNote size={14} /> Note
          </button>
        </div>
      </div>
    </>
  );
}