import { ArrowRight, AlertTriangle } from "lucide-react";

interface TaskRouteProps {
  task: {
    id: string;
    type: string;
    priority: string;
    fromLocation: string;
    toLocation: string;
  };
  taskStatus: string;
  slaRemaining: string;
}

const priorityConfig: Record<string, { bg: string; text: string; border: string }> = {
  Urgent: { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
  High: { bg: "#FFF7ED", text: "#D97706", border: "#FED7AA" },
  Normal: { bg: "#F1F5F9", text: "#64748B", border: "#E2E8F0" },
};

const typeConfig: Record<string, { bg: string; text: string }> = {
  Putaway: { bg: "#DBEAFE", text: "#1B4F8B" },
  Pick: { bg: "#F3E8FF", text: "#7C3AED" },
  Move: { bg: "#FEF3C7", text: "#D97706" },
  Charge: { bg: "#DCFCE7", text: "#16A34A" },
};

export default function TaskRoute({ task, taskStatus, slaRemaining }: TaskRouteProps) {
  const pc = priorityConfig[task.priority] || priorityConfig.Normal;
  const tc = typeConfig[task.type] || { bg: "#F1F5F9", text: "#64748B" };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Task Route</h3>
      </div>

      {/* Route display */}
      <div className="flex items-center gap-3 mb-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide mb-1">From</p>
          <p className="text-[18px] font-bold text-[#0F172A] truncate">{task.fromLocation}</p>
        </div>
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#EBF0F7] flex items-center justify-center">
          <ArrowRight size={24} className="text-[#0B2545]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide mb-1">To</p>
          <p className="text-[18px] font-bold text-[#0F172A] truncate">{task.toLocation}</p>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="inline-flex items-center h-9 px-3 rounded-lg text-[13px] font-bold"
          style={{ backgroundColor: tc.bg, color: tc.text }}
        >
          {task.type}
        </span>
        <span
          className="inline-flex items-center h-9 px-3 rounded-lg text-[13px] font-bold border"
          style={{ backgroundColor: pc.bg, color: pc.text, borderColor: pc.border }}
        >
          {task.priority === "Urgent" && (
            <AlertTriangle size={16} className="mr-1.5" />
          )}
          {task.priority}
        </span>
        <span className="inline-flex items-center h-9 px-3 rounded-lg text-[13px] font-bold bg-[#F1F5F9] text-[#64748B]">
          <span className="w-2 h-2 rounded-full bg-[#2E75B6] mr-2" />
          {taskStatus}
        </span>
        <span className={`inline-flex items-center h-9 px-3 rounded-lg text-[13px] font-bold ${task.priority === "Urgent" ? "bg-[#FEF2F2] text-[#DC2626]" : task.priority === "High" ? "bg-[#FFF7ED] text-[#D97706]" : "bg-[#DCFCE7] text-[#16A34A]"}`}>
          <ClockIcon size={14} className="mr-1.5" />
          SLA: {slaRemaining}
        </span>
        <span className="text-[12px] font-mono text-[#94A3B8] ml-auto">{task.id}</span>
      </div>
    </div>
  );
}

function ClockIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}