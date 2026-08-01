"use client";

import { useState } from "react";
import LoadingSkeleton from "../../LoadingSkeleton";
import EmptyState from "../../EmptyState";
import ErrorState from "../../ErrorState";
import DataTable from "../../DataTable";
import { Search, Calendar, Download, GitCompare, Eye } from "lucide-react";

interface RbacRow {
  user: string;
  username: string;
  role: string;
  group: string;
  portal: string;
  screen: string;
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  approve: boolean;
  export: boolean;
  lastChangedBy: string;
  lastChangedAt: string;
}

const mockRbacData: RbacRow[] = [
  { user: "Ahmed Shaikh", username: "ahmed.shaikh", role: "warehouse_manager", group: "Operations", portal: "Warehouse Manager", screen: "Dashboard", view: true, create: true, update: true, delete: false, approve: true, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-05-22" },
  { user: "Ahmed Shaikh", username: "ahmed.shaikh", role: "warehouse_manager", group: "Operations", portal: "Warehouse Manager", screen: "Putaway", view: true, create: true, update: true, delete: false, approve: false, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-05-22" },
  { user: "Ahmed Shaikh", username: "ahmed.shaikh", role: "warehouse_manager", group: "Operations", portal: "Warehouse Manager", screen: "Picking", view: true, create: true, update: true, delete: false, approve: false, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-05-22" },
  { user: "Zainab Khan", username: "zainab.khan", role: "cha_admin", group: "CHA", portal: "CHA", screen: "Dashboard", view: true, create: true, update: true, delete: false, approve: true, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-05-20" },
  { user: "Zainab Khan", username: "zainab.khan", role: "cha_admin", group: "CHA", portal: "CHA", screen: "GD Filing", view: true, create: true, update: true, delete: false, approve: true, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-05-20" },
  { user: "Omer Farooq", username: "omer.farooq", role: "finance_manager", group: "Finance", portal: "Finance Manager", screen: "Dashboard", view: true, create: true, update: true, delete: false, approve: true, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-06-01" },
  { user: "Omer Farooq", username: "omer.farooq", role: "finance_manager", group: "Finance", portal: "Finance Manager", screen: "Invoice Generation", view: true, create: true, update: true, delete: false, approve: true, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-06-01" },
  { user: "Omer Farooq", username: "omer.farooq", role: "finance_manager", group: "Finance", portal: "Finance Manager", screen: "Waiver Workflow", view: true, create: false, update: false, delete: false, approve: true, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-06-01" },
  { user: "Bilal Ahmed", username: "bilal.ahmed", role: "cha_user", group: "CHA", portal: "CHA", screen: "Dashboard", view: true, create: false, update: false, delete: false, approve: false, export: false, lastChangedBy: "cha_admin", lastChangedAt: "2026-05-28" },
  { user: "Fatima Malik", username: "fatima.malik", role: "auditor", group: "Audit", portal: "Auditor", screen: "Cargo Trace", view: true, create: false, update: false, delete: false, approve: false, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-06-05" },
  { user: "Fatima Malik", username: "fatima.malik", role: "auditor", group: "Audit", portal: "Auditor", screen: "Financial Trace", view: true, create: false, update: false, delete: false, approve: false, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-06-05" },
  { user: "Fatima Malik", username: "fatima.malik", role: "auditor", group: "Audit", portal: "Auditor", screen: "RBAC Snapshot", view: true, create: false, update: false, delete: false, approve: false, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-06-05" },
  { user: "Sana Tariq", username: "sana.tariq", role: "sys_admin", group: "Admin", portal: "Admin", screen: "Users", view: true, create: true, update: true, delete: true, approve: true, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-04-15" },
  { user: "Sana Tariq", username: "sana.tariq", role: "sys_admin", group: "Admin", portal: "Admin", screen: "Roles & Permissions", view: true, create: true, update: true, delete: true, approve: true, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-04-15" },
  { user: "Khalid Mehmood", username: "khalid.mehmood", role: "gate_entry", group: "Operations", portal: "Gate Entry", screen: "Vehicle Entry", view: true, create: true, update: true, delete: false, approve: false, export: true, lastChangedBy: "sys_admin", lastChangedAt: "2026-05-10" },
];

const portals = ["All", "Warehouse Manager", "Gate Entry", "CHA", "Finance Manager", "Auditor", "Admin", "ULD Message Builder"];
const roles = ["All", "warehouse_manager", "cha_admin", "cha_user", "finance_manager", "auditor", "sys_admin", "gate_entry"];

export default function RbacSnapshotContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snapshotDate, setSnapshotDate] = useState("2026-06-08");
  const [filterPortal, setFilterPortal] = useState("All");
  const [filterRole, setFilterRole] = useState("All");
  const [searchUser, setSearchUser] = useState("");
  const [detailOpen, setDetailOpen] = useState<string | null>(null);

  const filteredData = mockRbacData.filter((r) => {
    if (filterPortal !== "All" && r.portal !== filterPortal) return false;
    if (filterRole !== "All" && r.role !== filterRole) return false;
    if (searchUser && !r.user.toLowerCase().includes(searchUser.toLowerCase()) && !r.username.toLowerCase().includes(searchUser.toLowerCase())) return false;
    return true;
  });

  const permIcon = (val: boolean) => (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded text-[10px] font-bold"
      style={{
        backgroundColor: val ? "#DCFCE7" : "#F1F5F9",
        color: val ? "#16A34A" : "#CBD5E1",
      }}
    >
      {val ? "✓" : "—"}
    </span>
  );

  if (loading) return <LoadingSkeleton rows={8} columns={13} />;
  if (error) return <ErrorState message={error} onRetry={() => setError("")} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
            <GitCompare size={14} />
            Compare Snapshots
          </button>
          <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            <Download size={14} />
            Export Snapshot
          </button>
        </div>
      </div>

      <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#64748B]" />
            <span className="text-[12px] font-medium text-[#64748B]">Snapshot Date:</span>
            <input
              type="date"
              value={snapshotDate}
              onChange={(e) => setSnapshotDate(e.target.value)}
              className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#2E75B6]"
            />
          </div>
          <select
            value={filterPortal}
            onChange={(e) => setFilterPortal(e.target.value)}
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#2E75B6] bg-white pr-8"
          >
            {portals.map((p) => (
              <option key={p} value={p}>{p === "All" ? "All Portals" : p}</option>
            ))}
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#2E75B6] bg-white pr-8"
          >
            {roles.map((r) => (
              <option key={r} value={r}>{r === "All" ? "All Roles" : r}</option>
            ))}
          </select>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search user..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#2E75B6] w-[180px]"
            />
          </div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "user", header: "User", width: "130px" },
          { key: "username", header: "Username", width: "120px" },
          { key: "role", header: "Role", width: "140px" },
          { key: "group", header: "Group", width: "100px" },
          { key: "portal", header: "Portal", width: "140px" },
          { key: "screen", header: "Screen", width: "140px" },
          { key: "view", header: "View", width: "60px" },
          { key: "create", header: "Create", width: "60px" },
          { key: "update", header: "Update", width: "60px" },
          { key: "delete", header: "Delete", width: "60px" },
          { key: "approve", header: "Approve", width: "65px" },
          { key: "export", header: "Export", width: "60px" },
          { key: "lastChangedBy", header: "Last Changed By", width: "120px" },
          { key: "lastChangedAt", header: "Last Changed At", width: "110px" },
          { key: "action", header: "Action", width: "80px" },
        ]}
        rows={filteredData.map((r, idx) => ({
          user: <span className="text-[12px] font-medium text-[#0F172A]">{r.user}</span>,
          username: <span className="text-[12px] text-[#1B4F8B] font-medium">{r.username}</span>,
          role: <span className="text-[12px] text-[#334155]">{r.role}</span>,
          group: <span className="text-[11px] text-[#64748B]">{r.group}</span>,
          portal: <span className="text-[12px] text-[#0F172A]">{r.portal}</span>,
          screen: <span className="text-[12px] text-[#334155]">{r.screen}</span>,
          view: permIcon(r.view),
          create: permIcon(r.create),
          update: permIcon(r.update),
          delete: permIcon(r.delete),
          approve: permIcon(r.approve),
          export: permIcon(r.export),
          lastChangedBy: <span className="text-[11px] text-[#64748B]">{r.lastChangedBy}</span>,
          lastChangedAt: <span className="text-[11px] font-mono text-[#64748B]">{r.lastChangedAt}</span>,
          action: (
            <button
              onClick={() => setDetailOpen(detailOpen === r.username + r.screen ? null : r.username + r.screen)}
              className="flex items-center gap-1 h-7 px-2 rounded-lg border border-[#E2E8F0] text-[11px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
            >
              <Eye size={12} />
              Detail
            </button>
          ),
        }))}
        headerStyle="navy"
      />

      {filteredData.length === 0 && (
        <EmptyState
          title="No RBAC records"
          description="No matching RBAC entries for the selected filters."
        />
      )}

      {detailOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setDetailOpen(null)}>
          <div
            className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] w-[520px] max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#0F172A]">RBAC Detail</h3>
              </div>
              <button onClick={() => setDetailOpen(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer">
                ✕
              </button>
            </div>
            {(() => {
              const record = mockRbacData.find((r) => r.username + r.screen === detailOpen);
              if (!record) return null;
              return (
                <div className="space-y-3">
                  {Object.entries(record).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-[#F1F5F9]">
                      <span className="text-[12px] text-[#94A3B8] font-medium uppercase tracking-wide">{key}</span>
                      <span className="text-[13px] font-semibold text-[#0F172A]">{typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}