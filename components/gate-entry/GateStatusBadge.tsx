interface GateStatusBadgeProps {
  status: string;
}

const config: Record<string, { bg: string; text: string; dot: string }> = {
  Verification: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  Waiting: { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
  Hold: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
  Cleared: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  "In Progress": { bg: "#F3E8FF", text: "#7C3AED", dot: "#7C3AED" },
  Rejected: { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
  Active: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  Docking: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  Exit: { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
};

export default function GateStatusBadge({ status }: GateStatusBadgeProps) {
  const c = config[status] || { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" };
  return (
    <span
      className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.dot }} />
      {status}
    </span>
  );
}