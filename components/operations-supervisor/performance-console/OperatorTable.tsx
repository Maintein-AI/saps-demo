"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { ArrowRight, MoreHorizontal, FileSearch, BarChart3, ArrowUpRight } from "lucide-react";

const operators = [
  { operator: "Ahmed Khan", role: "Lifter Operator", shift: "Morning", assignedTasks: 18, completedTasks: 15, exceptionCount: 1, sla: 94, avgTime: "8m", productivityScore: 91, status: "Good" },
  { operator: "Sana Iqbal", role: "Warehouse Associate", shift: "Morning", assignedTasks: 22, completedTasks: 19, exceptionCount: 0, sla: 98, avgTime: "6m", productivityScore: 96, status: "Excellent" },
  { operator: "Bilal Raza", role: "Gate Guard", shift: "Evening", assignedTasks: 12, completedTasks: 9, exceptionCount: 2, sla: 82, avgTime: "11m", productivityScore: 78, status: "At Risk" },
  { operator: "Imran Ali", role: "Supervisor", shift: "Morning", assignedTasks: 8, completedTasks: 8, exceptionCount: 0, sla: 100, avgTime: "4m", productivityScore: 99, status: "Excellent" },
  { operator: "Nadeem Shah", role: "Supervisor", shift: "Evening", assignedTasks: 10, completedTasks: 9, exceptionCount: 1, sla: 92, avgTime: "7m", productivityScore: 88, status: "Good" },
  { operator: "Kamran Hussain", role: "Lifter Operator", shift: "Afternoon", assignedTasks: 20, completedTasks: 17, exceptionCount: 1, sla: 90, avgTime: "9m", productivityScore: 85, status: "Good" },
  { operator: "Faisal Qureshi", role: "Compliance Officer", shift: "Morning", assignedTasks: 14, completedTasks: 13, exceptionCount: 0, sla: 96, avgTime: "5m", productivityScore: 93, status: "Excellent" },
  { operator: "Asma Javed", role: "Warehouse Associate", shift: "Evening", assignedTasks: 24, completedTasks: 21, exceptionCount: 0, sla: 95, avgTime: "7m", productivityScore: 92, status: "Good" },
  { operator: "Tariq Mehmood", role: "Gate Guard", shift: "Morning", assignedTasks: 11, completedTasks: 10, exceptionCount: 0, sla: 97, avgTime: "6m", productivityScore: 94, status: "Excellent" },
  { operator: "Rabia Nawaz", role: "Lifter Operator", shift: "Night", assignedTasks: 16, completedTasks: 12, exceptionCount: 2, sla: 81, avgTime: "12m", productivityScore: 76, status: "At Risk" },
  { operator: "Owais Khan", role: "Warehouse Associate", shift: "Afternoon", assignedTasks: 19, completedTasks: 18, exceptionCount: 0, sla: 99, avgTime: "5m", productivityScore: 97, status: "Excellent" },
  { operator: "Hina Rafique", role: "Compliance Officer", shift: "Evening", assignedTasks: 13, completedTasks: 11, exceptionCount: 1, sla: 89, avgTime: "10m", productivityScore: 83, status: "Below Target" },
  { operator: "Shahid Afridi", role: "Lifter Operator", shift: "Morning", assignedTasks: 21, completedTasks: 19, exceptionCount: 0, sla: 97, avgTime: "7m", productivityScore: 95, status: "Excellent" },
  { operator: "Nadia Hussain", role: "Warehouse Associate", shift: "Night", assignedTasks: 17, completedTasks: 14, exceptionCount: 1, sla: 87, avgTime: "9m", productivityScore: 84, status: "Good" },
  { operator: "Zubair Ahmed", role: "Gate Guard", shift: "Afternoon", assignedTasks: 9, completedTasks: 8, exceptionCount: 0, sla: 94, avgTime: "8m", productivityScore: 89, status: "Good" },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  Excellent: { bg: "#DCFCE7", text: "#16A34A" },
  Good: { bg: "#DBEAFE", text: "#1B4F8B" },
  "At Risk": { bg: "#FEF3C7", text: "#D97706" },
  "Below Target": { bg: "#FEE2E2", text: "#DC2626" },
};

export default function OperatorTable({ onViewDetail }: { onViewDetail: (operator: string) => void }) {
  const [actionRow, setActionRow] = useState<number | null>(null);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Operator Performance</h3>
        <ScopeBadge type="inc" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Operator</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Role</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Shift</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Assigned</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Completed</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Exceptions</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">SLA %</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Avg Time</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider text-right">Score</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((op, i) => {
              const sc = statusConfig[op.status] || { bg: "#F1F5F9", text: "#64748B" };
              return (
                <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{op.operator}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{op.role}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{op.shift}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A] text-right">{op.assignedTasks}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A] text-right">{op.completedTasks}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A] text-right">{op.exceptionCount}</td>
                  <td className="py-3 px-3 text-[12px] font-medium text-[#0F172A] text-right">{op.sla}%</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A] text-right">{op.avgTime}</td>
                  <td className="py-3 px-3 text-[12px] font-bold text-[#0F172A] text-right">{op.productivityScore}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {op.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 relative">
                    <button onClick={() => setActionRow(actionRow === i ? null : i)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
                      <MoreHorizontal size={16} />
                    </button>
                    {actionRow === i && (
                      <div className="absolute right-3 top-10 z-10 w-[180px] bg-white rounded-xl shadow-lg border border-[#E2E8F0] overflow-hidden">
                        <button onClick={() => { setActionRow(null); onViewDetail(op.operator); }} className="w-full text-left px-3 py-2 text-[12px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer">
                          <FileSearch size={14} /> View Detail
                        </button>
                        <button onClick={() => setActionRow(null)} className="w-full text-left px-3 py-2 text-[12px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer">
                          <BarChart3 size={14} /> Open Movement Log
                        </button>
                        <button onClick={() => setActionRow(null)} className="w-full text-left px-3 py-2 text-[12px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer">
                          <ArrowUpRight size={14} /> Open Escalation
                        </button>
                      </div>
                    )}
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