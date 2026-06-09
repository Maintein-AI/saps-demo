"use client";

import { useState, useEffect } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import DataTable from "@/components/DataTable";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import { Search, Filter, Download, Eye } from "lucide-react";

const auditTrailData = [
  { timestamp: "09:42:18 AM", user: "Ahmed Shaikh", module: "Auth", entity: "Session", action: "Login", oldValue: "—", newValue: "Session active", ipDevice: "192.168.1.45 / Windows", evidence: "JWT-AB12", scope: "inc" },
  { timestamp: "09:38:05 AM", user: "Fatima Rizvi", module: "Users", entity: "USR-007", action: "Role Updated", oldValue: "fa_user", newValue: "ops_supervisor", ipDevice: "10.5.12.200 / MacOS", evidence: "AUDIT-882", scope: "inc" },
  { timestamp: "09:35:22 AM", user: "Bilal Khan", module: "Auth", entity: "Session", action: "Failed Login", oldValue: "—", newValue: "Invalid password", ipDevice: "203.0.113.42 / Mobile", evidence: "AUTH-FAIL-044", scope: "inc" },
  { timestamp: "09:28:40 AM", user: "Sana Tariq", module: "Master Data", entity: "Airlines", action: "Added", oldValue: "—", newValue: "EY — Etihad Airways", ipDevice: "192.168.1.78 / Windows", evidence: "MD-INSERT-156", scope: "inc" },
  { timestamp: "09:20:11 AM", user: "Raza Akbar", module: "Admin", entity: "Settings", action: "Access Denied", oldValue: "—", newValue: "Permission escalation blocked", ipDevice: "192.168.3.14 / Windows", evidence: "SEC-BLOCK-023", scope: "inc" },
  { timestamp: "09:15:55 AM", user: "Ahmed Shaikh", module: "Roles", entity: "sys_admin", action: "Permission Change", oldValue: "View,Create", newValue: "View,Create,Update,Delete,Export", ipDevice: "192.168.1.45 / Windows", evidence: "RBAC-MOD-301", scope: "inc" },
  { timestamp: "09:08:33 AM", user: "Fatima Rizvi", module: "Master Data", entity: "Charge Types", action: "Modified", oldValue: "ULD Storage", newValue: "ULD Storage — Daily", ipDevice: "10.5.12.200 / MacOS", evidence: "MD-UPDATE-712", scope: "inc" },
  { timestamp: "08:55:12 AM", user: "Owais Javed", module: "Lifter Operator", entity: "Task-4412", action: "Completed", oldValue: "Assigned", newValue: "Completed", ipDevice: "192.168.5.88 / RFID Handheld", evidence: "TASK-COMP-992", scope: "inc" },
  { timestamp: "08:50:07 AM", user: "Fatima Rizvi", module: "Master Data", entity: "Cities", action: "Added", oldValue: "—", newValue: "Gwadar", ipDevice: "10.5.12.200 / MacOS", evidence: "MD-INSERT-157", scope: "inc" },
  { timestamp: "08:40:29 AM", user: "Nadia Hassan", module: "Planner", entity: "Slot-331", action: "Reserved", oldValue: "Available", newValue: "Reserved", ipDevice: "192.168.2.45 / Windows", evidence: "SLOT-RES-089", scope: "inc" },
  { timestamp: "08:30:15 AM", user: "Ahmed Shaikh", module: "Master Data", entity: "Banks", action: "Disabled", oldValue: "Active", newValue: "Disabled", ipDevice: "192.168.1.45 / Windows", evidence: "MD-TOGGLE-055", scope: "inc" },
  { timestamp: "08:15:00 AM", user: "SYSTEM", module: "Integration", entity: "WhatsApp Provider", action: "Rate Limit", oldValue: "OK", newValue: "Rate limit exceeded", ipDevice: "sys.internal / Automated", evidence: "INT-ERR-412", scope: "exc" },
];

export default function AuditTrailContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRow, setSelectedRow] = useState<(typeof auditTrailData)[0] | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const filtered = auditTrailData.filter((row) => {
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      if (!row.user.toLowerCase().includes(s) && !row.module.toLowerCase().includes(s) && !row.entity.toLowerCase().includes(s) && !row.action.toLowerCase().includes(s)) return false;
    }
    if (filterUser && row.user !== filterUser) return false;
    if (filterModule && row.module !== filterModule) return false;
    if (filterAction && row.action !== filterAction) return false;
    return true;
  });

  const columns = [
    { key: "timestamp", header: "Timestamp", sortable: true },
    { key: "user", header: "User", sortable: true },
    { key: "module", header: "Module", sortable: true },
    { key: "entity", header: "Entity", sortable: true },
    { key: "action", header: "Action", sortable: true },
    { key: "oldValue", header: "Old Value" },
    { key: "newValue", header: "New Value" },
    { key: "ipDevice", header: "IP / Device" },
    { key: "scope", header: "Scope" },
    { key: "view", header: "Evidence", width: "80px" },
  ];

  const actionColors: Record<string, string> = {
    Login: "#16A34A",
    "Role Updated": "#1B4F8B",
    "Failed Login": "#DC2626",
    Added: "#16A34A",
    "Access Denied": "#DC2626",
    "Permission Change": "#7C3AED",
    Modified: "#D97706",
    Completed: "#16A34A",
    Reserved: "#1B4F8B",
    Disabled: "#64748B",
    "Rate Limit": "#DC2626",
  };

  const rows = filtered.map((row) => ({
    timestamp: <span className="text-[12px] text-[#64748B] whitespace-nowrap">{row.timestamp}</span>,
    user: <span className="text-[13px] font-semibold text-[#0F172A]">{row.user}</span>,
    module: <span className="text-[12px] text-[#64748B]">{row.module}</span>,
    entity: <span className="text-[12px] text-[#64748B]">{row.entity}</span>,
    action: (
      <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: (actionColors[row.action] || "#F1F5F9") + "1A", color: actionColors[row.action] || "#64748B", border: `1px solid ${actionColors[row.action] || "#E2E8F0"}40` }}>
        {row.action}
      </span>
    ),
    oldValue: <span className="text-[12px] text-[#94A3B8] max-w-[120px] truncate block">{row.oldValue}</span>,
    newValue: <span className="text-[12px] text-[#0F172A] max-w-[120px] truncate block">{row.newValue}</span>,
    ipDevice: <span className="text-[11px] text-[#94A3B8]">{row.ipDevice}</span>,
    scope: <ScopeBadge type={row.scope as "inc" | "exc"} />,
    view: (
      <button
        onClick={() => setSelectedRow(row)}
        className="flex items-center gap-1 text-[11px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors whitespace-nowrap"
      >
        <Eye size={12} /> {row.evidence}
      </button>
    ),
  }));

  const uniqueUsers = [...new Set(auditTrailData.map((r) => r.user))];
  const uniqueModules = [...new Set(auditTrailData.map((r) => r.module))];
  const uniqueActions = [...new Set(auditTrailData.map((r) => r.action))];

  if (showError) {
    return <ErrorState title="Unable to load audit trail" message="Audit data could not be fetched. Please retry." onRetry={() => { setShowError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-[280px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search audit trail..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors"
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap">
            <Filter size={14} /> Filters {(filterUser || filterModule || filterAction) && <span className="w-5 h-5 rounded-full bg-[#0B2545] text-white text-[10px] flex items-center justify-center">!</span>}
          </button>
          {(filterUser || filterModule || filterAction) && (
            <button onClick={() => { setFilterUser(""); setFilterModule(""); setFilterAction(""); }} className="text-[12px] font-semibold text-[#DC2626] hover:underline cursor-pointer whitespace-nowrap">
              Clear all
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#64748B]">{filtered.length} records</span>
          <button onClick={() => addToast("Audit trail exported", "success")} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-[#E2E8F0] bg-white">
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-1">User</label>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setFilterUser("")} className={`h-7 px-2.5 rounded-lg text-[11px] font-medium border transition-colors whitespace-nowrap ${!filterUser ? "bg-[#0B2545] text-white border-[#0B2545]" : "bg-white text-[#64748B] border-[#E2E8F0]"}`}>All</button>
              {uniqueUsers.map((u) => (
                <button key={u} onClick={() => setFilterUser(u === filterUser ? "" : u)} className={`h-7 px-2.5 rounded-lg text-[11px] font-medium border transition-colors whitespace-nowrap ${filterUser === u ? "bg-[#0B2545] text-white border-[#0B2545]" : "bg-white text-[#64748B] border-[#E2E8F0]"}`}>{u}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Module</label>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setFilterModule("")} className={`h-7 px-2.5 rounded-lg text-[11px] font-medium border transition-colors whitespace-nowrap ${!filterModule ? "bg-[#0B2545] text-white border-[#0B2545]" : "bg-white text-[#64748B] border-[#E2E8F0]"}`}>All</button>
              {uniqueModules.map((m) => (
                <button key={m} onClick={() => setFilterModule(m === filterModule ? "" : m)} className={`h-7 px-2.5 rounded-lg text-[11px] font-medium border transition-colors whitespace-nowrap ${filterModule === m ? "bg-[#0B2545] text-white border-[#0B2545]" : "bg-white text-[#64748B] border-[#E2E8F0]"}`}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Action</label>
            <div className="flex flex-wrap gap-1">
              <button onClick={() => setFilterAction("")} className={`h-7 px-2.5 rounded-lg text-[11px] font-medium border transition-colors whitespace-nowrap ${!filterAction ? "bg-[#0B2545] text-white border-[#0B2545]" : "bg-white text-[#64748B] border-[#E2E8F0]"}`}>All</button>
              {uniqueActions.map((a) => (
                <button key={a} onClick={() => setFilterAction(a === filterAction ? "" : a)} className={`h-7 px-2.5 rounded-lg text-[11px] font-medium border transition-colors whitespace-nowrap ${filterAction === a ? "bg-[#0B2545] text-white border-[#0B2545]" : "bg-white text-[#64748B] border-[#E2E8F0]"}`}>{a}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton rows={10} columns={10} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No audit records found" description="Try adjusting your filters or search terms." />
      ) : (
        <DataTable columns={columns} rows={rows} sortable headerStyle="navy" />
      )}

      {selectedRow && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50" onClick={() => setSelectedRow(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[480px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-bold text-[#0F172A] mb-4">Audit Evidence: {selectedRow.evidence}</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-[12px] text-[#64748B]">Timestamp</span><span className="text-[13px] font-medium text-[#0F172A]">{selectedRow.timestamp}</span></div>
              <div className="flex justify-between"><span className="text-[12px] text-[#64748B]">User</span><span className="text-[13px] font-medium text-[#0F172A]">{selectedRow.user}</span></div>
              <div className="flex justify-between"><span className="text-[12px] text-[#64748B]">Module</span><span className="text-[13px] font-medium text-[#0F172A]">{selectedRow.module}</span></div>
              <div className="flex justify-between"><span className="text-[12px] text-[#64748B]">Entity</span><span className="text-[13px] font-medium text-[#0F172A]">{selectedRow.entity}</span></div>
              <div className="flex justify-between"><span className="text-[12px] text-[#64748B]">Action</span><span className="text-[13px] font-medium text-[#0F172A]">{selectedRow.action}</span></div>
              <div className="flex justify-between"><span className="text-[12px] text-[#64748B]">Old Value</span><span className="text-[13px] font-medium text-[#64748B]">{selectedRow.oldValue}</span></div>
              <div className="flex justify-between"><span className="text-[12px] text-[#64748B]">New Value</span><span className="text-[13px] font-medium text-[#0F172A]">{selectedRow.newValue}</span></div>
              <div className="flex justify-between"><span className="text-[12px] text-[#64748B]">IP / Device</span><span className="text-[13px] font-medium text-[#0F172A]">{selectedRow.ipDevice}</span></div>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setSelectedRow(null)} className="h-9 px-4 rounded-xl text-[13px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}