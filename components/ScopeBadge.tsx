interface ScopeBadgeProps {
  type: "inc" | "exc";
}

export default function ScopeBadge({ type }: ScopeBadgeProps) {
  return (
    <span
      className="inline-flex items-center justify-center h-[22px] px-2.5 rounded-full text-[11px] font-bold tracking-[0.3px] lowercase select-none"
      style={{
        backgroundColor: type === "inc" ? "#16A34A" : "#DC2626",
        color: "white",
        fontWeight: 700,
        letterSpacing: "0.3px",
      }}
      title={
        type === "inc"
          ? "Included in awarded contract scope (Annexure-G, 14 Apr 2026)"
          : "Outside awarded contract scope — part of the New One-Window Vision delta"
      }
    >
      {type === "inc" ? "inc." : "exc"}
    </span>
  );
}