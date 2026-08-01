"use client";

import { useState } from "react";
import LoadingSkeleton from "../../LoadingSkeleton";
import EmptyState from "../../EmptyState";
import ErrorState from "../../ErrorState";
import DataTable from "../../DataTable";
import { Search } from "lucide-react";

interface AuditEvent {
  timestamp: string;
  user: string;
  module: string;
  entity: string;
  action: string;
  evidence: string;
  scope: string;
}

const mockEvents: AuditEvent[] = [
  { timestamp: "2026-06-08 14:32:11", user: "ahmed.shaikh", module: "Finance", entity: "INV-2026-0042", action: "Viewed", evidence: "inv_42_detail.pdf", scope: "inc." },
  { timestamp: "2026-06-08 14:18:05", user: "zainab.khan", module: "ULD Builder", entity: "SCM-M-2309", action: "Viewed", evidence: "scm_2309_log.txt", scope: "exc" },
  { timestamp: "2026-06-08 13:55:42", user: "bilal.ahmed", module: "CHA", entity: "DO-LHE-0812", action: "Exported", evidence: "do_batch_jun.csv", scope: "inc." },
  { timestamp: "2026-06-08 13:41:19", user: "fatima.malik", module: "Compliance", entity: "HOLD-2026-0156", action: "Viewed", evidence: "hold_156_audit.pdf", scope: "inc." },
  { timestamp: "2026-06-08 13:22:07", user: "omer.farooq", module: "Gate Entry", entity: "V-1356-LHE", action: "Viewed", evidence: "exit_gatepass_1356.png", scope: "inc." },
  { timestamp: "2026-06-08 12:58:33", user: "sana.tariq", module: "Admin", entity: "USER-sysadmin", action: "Exported", evidence: "rbac_snapshot_08jun.pdf", scope: "inc." },
  { timestamp: "2026-06-08 12:41:10", user: "ahmed.shaikh", module: "Warehouse", entity: "AWB-117-23456123", action: "Viewed", evidence: "awb_56123_trace.pdf", scope: "inc." },
  { timestamp: "2026-06-08 12:18:55", user: "bilal.ahmed", module: "Finance", entity: "WVR-2026-0031", action: "Viewed", evidence: "waiver_31_docs.zip", scope: "inc." },
  { timestamp: "2026-06-08 11:52:04", user: "zainab.khan", module: "ULD Builder", entity: "UCM-M-4512", action: "Viewed", evidence: "ucm_4512_detail.pdf", scope: "exc" },
  { timestamp: "2026-06-08 11:35:28", user: "fatima.malik", module: "Compliance", entity: "OOC-2026-0089", action: "Viewed", evidence: "ooc_89_scan.pdf", scope: "inc." },
];

export default function AuditorHomeContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("today");
  const [events] = useState<AuditEvent[]>(mockEvents);

  const kpis = [
    { title: "Transactions", value: "2,847", subtitle: "Last 30 days", trend: "up" as const, trendValue: "+8.2%" },
    { title: "Waivers", value: "31", subtitle: "Last 30 days", trend: "down" as const, trendValue: "-12% vs prev" },
    { title: "Holds", value: "156", subtitle: "Last 30 days", trend: "up" as const, trendValue: "+5.4%" },
    { title: "OOC Issuances", value: "89", subtitle: "Last 30 days", trend: "neutral" as const, trendValue: "±0%" },
    { title: "Invoices", value: "412", subtitle: "Last 30 days", trend: "up" as const, trendValue: "+11.8%" },
    { title: "User Access Changes", value: "24", subtitle: "Last 30 days", trend: "down" as const, trendValue: "-3 vs prev" },
  ];

  const summaryCards = [
    {
      title: "Cargo Activity",
      items: ["2,341 AWBs moved", "847 RFID scans", "156 exceptions", "23 cold-chain alerts"],
      color: "#2E75B6",
    },
    {
      title: "Financial Activity",
      items: ["412 invoices generated", "31 waiver requests", "28 credit notes", "PKR 48.2M collected"],
      color: "#16A34A",
    },
    {
      title: "Compliance Activity",
      items: ["89 OOC issued", "156 holds placed", "14 re-exports", "3 Section 82 long-stay"],
      color: "#D97706",
    },
    {
      title: "Security / Access Activity",
      items: ["24 role changes", "8 new users", "3 SSO links", "0 failed logins flagged"],
      color: "#7C3AED",
    },
  ];

  if (loading) return <LoadingSkeleton rows={6} columns={7} />;
  if (error) return <ErrorState message={error} onRetry={() => setError("")} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#64748B] font-medium">Period:</span>
          <div className="flex rounded-lg border border-[#E2E8F0] overflow-hidden">
            {["today", "7d", "30d", "custom"].map((opt) => (
              <button
                key={opt}
                onClick={() => setDateRange(opt)}
                className="h-8 px-3 text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: dateRange === opt ? "#0B2545" : "white",
                  color: dateRange === opt ? "white" : "#64748B",
                }}
              >
                {opt === "today" ? "Today" : opt === "7d" ? "7 Days" : opt === "30d" ? "30 Days" : "Custom"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.title} className="rounded-[14px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-semibold text-[#64748B]">{kpi.title}</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[26px] font-bold text-[#0F172A]">{kpi.value}</span>
              {kpi.trend && kpi.trendValue && (
                <span
                  className="text-[12px] font-medium"
                  style={{
                    color: kpi.trend === "up" ? "#16A34A" : kpi.trend === "down" ? "#DC2626" : "#64748B",
                  }}
                >
                  {kpi.trendValue}
                </span>
              )}
            </div>
            {kpi.subtitle && <p className="text-[11px] text-[#94A3B8] mt-1">{kpi.subtitle}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded-[14px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-[#0F172A] mb-4">{card.title}</h3>
            <div className="space-y-2.5">
              {card.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: card.color }} />
                  <span className="text-[12px] text-[#334155]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#0F172A]">Recent Audit Events</h2>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search events..."
              className="h-8 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#2E75B6] bg-white w-[200px]"
            />
          </div>
        </div>

        <DataTable
          columns={[
            { key: "timestamp", header: "Timestamp", width: "160px" },
            { key: "user", header: "User", width: "140px" },
            { key: "module", header: "Module", width: "120px" },
            { key: "entity", header: "Entity", width: "150px" },
            { key: "action", header: "Action", width: "100px" },
            { key: "evidence", header: "Evidence", width: "160px" },
          ]}
          rows={events.map((e) => ({
            timestamp: <span className="text-[12px] text-[#0F172A] font-mono">{e.timestamp}</span>,
            user: <span className="text-[12px] font-medium text-[#0F172A]">{e.user}</span>,
            module: <span className="text-[12px] text-[#334155]">{e.module}</span>,
            entity: <span className="text-[12px] font-medium text-[#1B4F8B]">{e.entity}</span>,
            action: (
              <span className="inline-flex items-center h-6 px-2 rounded-full text-[11px] font-semibold bg-[#DBEAFE] text-[#1B4F8B]">
                {e.action}
              </span>
            ),
            evidence: (
              <button className="text-[12px] text-[#2E75B6] hover:underline cursor-pointer font-medium">
                {e.evidence}
              </button>
            ),
          }))}
          headerStyle="navy"
        />
      </div>

      {events.length === 0 && (
        <EmptyState
          title="No audit events"
          description="No audit records for the selected period."
        />
      )}
    </div>
  );
}