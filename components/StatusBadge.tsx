interface StatusBadgeProps {
  status: string;
}

const config: Record<string, { bg: string; text: string; dot: string }> = {
  "Awaiting Putaway": { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
  Stored: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
  "Customs Filed": { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
  Picked: { bg: "#F3E8FF", text: "#7C3AED", dot: "#7C3AED" },
  Dispatched: { bg: "#E0E7FF", text: "#4338CA", dot: "#4338CA" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
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