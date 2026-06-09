"use client";

import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import { AlertTriangle, Clock, Ban, FileWarning, Settings } from "lucide-react";

const alerts = [
  {
    id: "ALERT-001",
    type: "Tariff version expiring",
    message: "Tariff version 2026-Q1 expires on 30 Jun 2026. 3 weeks remaining.",
    severity: "warning",
    icon: Clock,
  },
  {
    id: "ALERT-002",
    type: "High waiver rate",
    message: "Waiver rate is 12.3% this month. Threshold is 8%. Review required.",
    severity: "error",
    icon: AlertTriangle,
  },
  {
    id: "ALERT-003",
    type: "Unmatched settlement",
    message: "6 unmatched bank deposits totalling Rs. 890,000 require reconciliation.",
    severity: "warning",
    icon: Ban,
  },
  {
    id: "ALERT-004",
    type: "Long outstanding invoice",
    message: "Invoice INV-2026-00345 for Rs. 450,000 is 58 days overdue. Escalation recommended.",
    severity: "error",
    icon: FileWarning,
  },
  {
    id: "ALERT-005",
    type: "Manual adjustment required",
    message: "2 invoices require manual rate adjustment after tariff review.",
    severity: "warning",
    icon: Settings,
  },
];

const severityConfig = {
  error: { border: "#DC2626", bg: "#FEE2E2", icon: "#DC2626" },
  warning: { border: "#D97706", bg: "#FEF3C7", icon: "#D97706" },
};

export default function BillingAlerts() {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Tariff / Billing Alerts</h2>
          <ScopeBadge type="inc" />
          <span className="text-[12px] text-[#64748B] ml-1">{alerts.length} active</span>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {alerts.map((alert) => {
            const cfg = severityConfig[alert.severity as keyof typeof severityConfig];
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className="p-4 rounded-xl border transition-colors"
                style={{ borderColor: cfg.border, backgroundColor: "white" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: cfg.bg }}
                  >
                    <Icon size={16} style={{ color: cfg.icon }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#0F172A] mb-1">{alert.type}</p>
                    <p className="text-[12px] text-[#64748B] leading-relaxed">{alert.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}