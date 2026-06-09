"use client";

import { useState } from "react";
import LoadingSkeleton from "../../LoadingSkeleton";
import EmptyState from "../../EmptyState";
import ErrorState from "../../ErrorState";
import DataTable from "../../DataTable";
import ScopeBadge from "../../ScopeBadge";
import { useToast } from "../../ToastContext";
import { Search, Download, FileText, Calendar, Clock, CheckCircle, FileSpreadsheet, Package } from "lucide-react";

interface GeneratedPack {
  packId: string;
  scope: string;
  dateRange: string;
  generatedBy: string;
  generatedAt: string;
  files: string;
  status: string;
  download: string;
}

const mockPacks: GeneratedPack[] = [
  { packId: "AUD-PACK-2026-0042", scope: "Full — Cargo + Financial", dateRange: "2026-05-01 to 2026-05-31", generatedBy: "fatima.malik", generatedAt: "2026-06-01 09:15", files: "3 files", status: "Ready", download: "aud_pack_0042.zip" },
  { packId: "AUD-PACK-2026-0038", scope: "Cargo Only", dateRange: "2026-04-01 to 2026-04-30", generatedBy: "fatima.malik", generatedAt: "2026-05-02 14:30", files: "2 files", status: "Ready", download: "aud_pack_0038.zip" },
  { packId: "AUD-PACK-2026-0035", scope: "Financial Only", dateRange: "2026-04-01 to 2026-04-30", generatedBy: "auditor.external", generatedAt: "2026-05-03 11:00", files: "2 files", status: "Ready", download: "aud_pack_0035.zip" },
  { packId: "AUD-PACK-2026-0031", scope: "RBAC Snapshot", dateRange: "2026-04-15", generatedBy: "fatima.malik", generatedAt: "2026-04-15 16:45", files: "1 file", status: "Ready", download: "aud_pack_0031.pdf" },
  { packId: "AUD-PACK-2026-0028", scope: "Full — Cargo + Financial", dateRange: "2026-03-01 to 2026-03-31", generatedBy: "auditor.external", generatedAt: "2026-04-01 08:00", files: "4 files", status: "Ready", download: "aud_pack_0028.zip" },
];

const auditPackContents = [
  { label: "Summary PDF", icon: FileText },
  { label: "Cargo Timeline", icon: Package },
  { label: "Financial Timeline", icon: FileText },
  { label: "User Access Snapshot", icon: FileText },
  { label: "Supporting Evidence", icon: FileText },
  { label: "Uploaded Documents", icon: FileText },
  { label: "System Event Logs", icon: FileText },
];

const portals = ["All", "Warehouse Manager", "Gate Entry", "CHA", "Finance Manager", "Auditor", "Admin"];
const modules = ["All", "Warehouse", "Finance", "Gate Entry", "CHA", "Compliance", "ULD Builder"];
const scopeTags = ["All", "inc.", "exc"];

export default function ExportCentreContent() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-05-01");
  const [dateTo, setDateTo] = useState("2026-05-31");
  const [filterPortal, setFilterPortal] = useState("All");
  const [filterModule, setFilterModule] = useState("All");
  const [filterScope, setFilterScope] = useState("All");
  const [awbSearch, setAwbSearch] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleGeneratePack = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      addToast("Audit pack generated successfully.", "success");
    }, 1500);
  };

  if (loading) return <LoadingSkeleton rows={6} columns={6} />;
  if (error) return <ErrorState message={error} onRetry={() => setError("")} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-[14px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-[#0B2545]" />
            <h2 className="text-[15px] font-bold text-[#0F172A]">Generate Audit Pack</h2>
            <ScopeBadge type="inc" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide block mb-1">Date Range</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#2E75B6]"
                  />
                </div>
                <span className="text-[12px] text-[#94A3B8]">to</span>
                <div className="relative flex-1">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#2E75B6]"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide block mb-1">Portal</label>
              <select
                value={filterPortal}
                onChange={(e) => setFilterPortal(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#2E75B6] bg-white pr-8"
              >
                {portals.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide block mb-1">Module</label>
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#2E75B6] bg-white pr-8"
              >
                {modules.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide block mb-1">Scope Tag</label>
              <select
                value={filterScope}
                onChange={(e) => setFilterScope(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] outline-none focus:border-[#2E75B6] bg-white pr-8"
              >
                {scopeTags.map((s) => <option key={s} value={s}>{s === "All" ? "All Scope Tags" : s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wide block mb-1">AWB / Invoice #</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  type="text"
                  value={awbSearch}
                  onChange={(e) => setAwbSearch(e.target.value)}
                  placeholder="e.g. 117-23456123"
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[12px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#2E75B6]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGeneratePack}
              disabled={generating}
              className="flex items-center gap-2 h-10 px-5 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
              style={{ backgroundColor: "#0B2545" }}
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={15} />
                  Generate Audit Pack PDF
                </>
              )}
            </button>
            <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
              <Download size={14} />
              Export CSV
            </button>
            <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
              <FileSpreadsheet size={14} />
              Export XLSX
            </button>
            <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
              <Download size={14} />
              Download Evidence
            </button>
            <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
              <Clock size={14} />
              Schedule Export
            </button>
          </div>
        </div>

        <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-[#0B2545]" />
            <h2 className="text-[15px] font-bold text-[#0F172A]">Audit Pack Contents</h2>
            <ScopeBadge type="inc" />
          </div>
          <div className="space-y-2">
            {auditPackContents.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-[#F8FAFC] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#64748B]" />
                  </div>
                  <span className="text-[13px] font-medium text-[#0F172A]">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] font-bold text-[#0F172A]">Generated Packs</h2>
            <ScopeBadge type="inc" />
          </div>
          <span className="text-[12px] text-[#64748B] font-medium">{mockPacks.length} packs</span>
        </div>

        <DataTable
          columns={[
            { key: "packId", header: "Pack ID", width: "170px" },
            { key: "scope", header: "Scope", width: "180px" },
            { key: "dateRange", header: "Date Range", width: "220px" },
            { key: "generatedBy", header: "Generated By", width: "130px" },
            { key: "generatedAt", header: "Generated At", width: "150px" },
            { key: "files", header: "Files", width: "80px" },
            { key: "status", header: "Status", width: "90px" },
            { key: "download", header: "Download", width: "130px" },
          ]}
          rows={mockPacks.map((pack) => ({
            packId: <span className="text-[12px] font-mono font-medium text-[#1B4F8B]">{pack.packId}</span>,
            scope: <span className="text-[12px] text-[#334155]">{pack.scope}</span>,
            dateRange: <span className="text-[12px] text-[#334155]">{pack.dateRange}</span>,
            generatedBy: <span className="text-[12px] text-[#0F172A]">{pack.generatedBy}</span>,
            generatedAt: <span className="text-[12px] font-mono text-[#64748B]">{pack.generatedAt}</span>,
            files: <span className="text-[12px] text-[#64748B]">{pack.files}</span>,
            status: (
              <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#16A34A]">
                <CheckCircle size={11} />
                {pack.status}
              </span>
            ),
            download: (
              <button className="flex items-center gap-1 text-[12px] font-medium text-[#2E75B6] hover:underline cursor-pointer">
                <Download size={12} />
                {pack.download}
              </button>
            ),
          }))}
          headerStyle="navy"
        />
      </div>

      {mockPacks.length === 0 && (
        <EmptyState
          title="No generated packs"
          description="No audit packs have been generated yet."
        />
      )}
    </div>
  );
}