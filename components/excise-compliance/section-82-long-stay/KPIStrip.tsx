interface KPIStripProps {
  longStay: number;
  noticeDue: number;
  escalated: number;
  decisionPending: number;
  auctionDisposal: number;
  releasedAfter: number;
}

export default function KPIStrip({
  longStay,
  noticeDue,
  escalated,
  decisionPending,
  auctionDisposal,
  releasedAfter,
}: KPIStripProps) {
  const items = [
    { title: "Long-stay AWBs", value: longStay.toString(), color: "#0B2545" },
    { title: "Notice Due", value: noticeDue.toString(), color: "#D97706" },
    { title: "Escalated to Customs", value: escalated.toString(), color: "#1B4F8B" },
    { title: "Customs Decision Pending", value: decisionPending.toString(), color: "#DC2626" },
    { title: "Auction / Disposal Cases", value: auctionDisposal.toString(), color: "#7C3AED" },
    { title: "Released After Escalation", value: releasedAfter.toString(), color: "#16A34A" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-semibold text-[#64748B]">
              {item.title}
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-[26px] font-bold"
              style={{ color: item.color }}
            >
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}