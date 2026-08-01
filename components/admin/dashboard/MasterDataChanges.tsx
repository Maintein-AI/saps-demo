"use client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Edit3, Plus, Ban, History } from "lucide-react";

const changes = [
  { entity: "Airline", item: "EY — Etihad Airways", action: "Added", user: "Fatima Rizvi", time: "09:28 AM", icon: Plus, color: "#16A34A" },
  { entity: "Charge Type", item: "ULD Storage — Daily", action: "Modified", user: "Ahmed Shaikh", time: "09:15 AM", icon: Edit3, color: "#1B4F8B" },
  { entity: "City", item: "Gwadar", action: "Added", user: "Fatima Rizvi", time: "08:50 AM", icon: Plus, color: "#16A34A" },
  { entity: "Bank", item: "Meezan Bank — Corporate", action: "Disabled", user: "Ahmed Shaikh", time: "08:30 AM", icon: Ban, color: "#DC2626" },
  { entity: "Tariff Slab", item: "GCR 45–100 kg", action: "Modified", user: "Bilal Khan", time: "07:55 AM", icon: Edit3, color: "#1B4F8B" },
];

export default function MasterDataChanges({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Master Data Changes</h2>
        </div>
        <button className="flex items-center gap-1 text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">
          <History size={14} /> Audit Trail
        </button>
      </div>
      {isLoading ? (
        <LoadingSkeleton rows={5} columns={4} />
      ) : (
        <div className="space-y-2">
          {changes.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: item.color === "#16A34A" ? "#DCFCE7" : item.color === "#DC2626" ? "#FEE2E2" : "#DBEAFE" }}>
                  <Icon size={14} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: item.color }}>
                      {item.action}
                    </span>
                    <p className="text-[13px] font-semibold text-[#0F172A]">{item.item}</p>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">{item.entity} · {item.user} · {item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}