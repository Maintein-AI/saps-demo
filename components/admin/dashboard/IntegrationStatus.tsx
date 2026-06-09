"use client";

import ScopeBadge from "@/components/ScopeBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { CheckCircle, AlertTriangle, XCircle, ExternalLink, RefreshCw } from "lucide-react";

interface IntegrationItem {
  name: string;
  provider: string;
  status: "online" | "degraded" | "offline";
  lastSync: string;
  lastError: string;
  scope: "inc" | "exc";
}

const integrations: IntegrationItem[] = [
  { name: "PSW / WeBOC", provider: "Pakistan Customs", status: "online", lastSync: "09:40 AM", lastError: "—", scope: "inc" },
  { name: "Airline Messaging", provider: "FFM/FWB/FHL/FSU", status: "online", lastSync: "09:38 AM", lastError: "—", scope: "inc" },
  { name: "SMS Provider", provider: "Twilio", status: "online", lastSync: "09:35 AM", lastError: "—", scope: "inc" },
  { name: "Email Provider", provider: "SendGrid", status: "online", lastSync: "09:30 AM", lastError: "—", scope: "inc" },
  { name: "WhatsApp Provider", provider: "Meta Business", status: "degraded", lastSync: "09:15 AM", lastError: "Rate limit exceeded", scope: "inc" },
  { name: "Backup / Restore", provider: "AWS S3", status: "online", lastSync: "08:00 AM", lastError: "—", scope: "inc" },
  { name: "ERP Push SAP / Oracle", provider: "SAP S/4HANA", status: "online", lastSync: "09:25 AM", lastError: "—", scope: "exc" },
  { name: "Payment Gateway", provider: "1LINK / HBL", status: "online", lastSync: "09:20 AM", lastError: "—", scope: "exc" },
];

const statusIcon = (status: string) => {
  if (status === "online") return <CheckCircle size={14} className="text-[#16A34A]" />;
  if (status === "degraded") return <AlertTriangle size={14} className="text-[#D97706]" />;
  return <XCircle size={14} className="text-[#DC2626]" />;
};

const statusBg = (status: string) => {
  if (status === "online") return { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" };
  if (status === "degraded") return { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" };
  return { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" };
};

export default function IntegrationStatus({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Integration Status</h2>
          <ScopeBadge type="inc" />
        </div>
      </div>
      {isLoading ? (
        <LoadingSkeleton rows={8} columns={4} />
      ) : (
        <div className="space-y-2">
          {integrations.map((item) => {
            const s = statusBg(item.status);
            return (
              <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
                  {statusIcon(item.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#0F172A]">{item.name}</p>
                    <span className="text-[11px] text-[#94A3B8]">{item.provider}</span>
                    <ScopeBadge type={item.scope} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[11px] text-[#64748B]">Last Sync: {item.lastSync}</span>
                    {item.lastError !== "—" && (
                      <span className="text-[11px] text-[#DC2626]">{item.lastError}</span>
                    )}
                  </div>
                </div>
                <span
                  className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
                  style={{ backgroundColor: s.bg, color: s.text }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}