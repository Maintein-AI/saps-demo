"use client";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { ShieldAlert, ShieldCheck, ShieldOff, ShieldQuestion } from "lucide-react";

const alerts = [
  { title: "Multiple failed logins detected", detail: "User: Bilal Khan · 5 attempts from 203.0.113.42", severity: "high", time: "09:35 AM" },
  { title: "Permission escalation attempt blocked", detail: "User: raza.akbar tried to access /admin/settings", severity: "critical", time: "09:20 AM" },
  { title: "Unusual export activity", detail: "User: Sana Tariq exported 450+ audit records", severity: "medium", time: "08:55 AM" },
  { title: "Session from unknown device", detail: "User: Ahmed Shaikh · Windows Desktop → Mobile Safari", severity: "low", time: "08:40 AM" },
  { title: "API rate limit exceeded", detail: "WhatsApp Provider · 120 req/min threshold", severity: "medium", time: "08:15 AM" },
];

const severityConfig: Record<string, { bg: string; border: string; icon: React.ReactNode; textColor: string }> = {
  critical: {
    bg: "#FEE2E2",
    border: "#FECACA",
    icon: <ShieldOff size={16} className="text-[#DC2626]" />,
    textColor: "#DC2626",
  },
  high: {
    bg: "#FEF3C7",
    border: "#FDE68A",
    icon: <ShieldAlert size={16} className="text-[#D97706]" />,
    textColor: "#D97706",
  },
  medium: {
    bg: "#DBEAFE",
    border: "#BFDBFE",
    icon: <ShieldQuestion size={16} className="text-[#1B4F8B]" />,
    textColor: "#1B4F8B",
  },
  low: {
    bg: "#F1F5F9",
    border: "#E2E8F0",
    icon: <ShieldCheck size={16} className="text-[#64748B]" />,
    textColor: "#64748B",
  },
};

export default function SecurityAlerts({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Security Alerts</h2>
        </div>
      </div>
      {isLoading ? (
        <LoadingSkeleton rows={5} columns={3} />
      ) : (
        <div className="space-y-2">
          {alerts.map((alert, i) => {
            const cfg = severityConfig[alert.severity];
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer hover:shadow-sm"
                style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/60">
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-[#0F172A]">{alert.title}</p>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ color: cfg.textColor, backgroundColor: "white" }}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-0.5">{alert.detail}</p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">{alert.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}