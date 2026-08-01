"use client";

import { useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import EmptyState from "../EmptyState";
import ErrorState from "../ErrorState";
import { useToast } from "../ToastContext";
import {
  Check,
  X,
  AlertTriangle,
  Search,
  Download,
  ChevronDown,
  Calendar,
  Filter,
  Eye,
  Upload,
  Clock,
} from "lucide-react";

interface ChecklistItem {
  id: number;
  requirement: string;
  portal: string;
  screen: string;
  scopeTag: "inc" | "exc";
  reviewStatus: "Pass" | "Fail" | "Needs Fix" | "Pending";
  comment: string;
  reviewer: string;
  date: string;
  owner: string;
  dueDate: string;
  screenshot?: string;
}

const portals = ["All", "Warehouse Manager", "Gate Entry", "Lifter Operator", "Excise/Compliance", "Finance Manager", "Planner", "Operations Supervisor", "Forwarding Agent", "CHA", "Consignee", "ULD Message Builder", "Admin", "Auditor", "Reports", "Notifications", "RFID"];

const reviewStatuses = ["All", "Pass", "Fail", "Needs Fix", "Pending"];

const initialChecklist: ChecklistItem[] = [
  { id: 1, requirement: "Header present with AirVault wordmark and portal name", portal: "All", screen: "Global", scopeTag: "inc", reviewStatus: "Pass", comment: "Header renders correctly across all portals", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 2, requirement: "Sidebar has correct portal navigation", portal: "All", screen: "Global", scopeTag: "inc", reviewStatus: "Pass", comment: "All nav items verified", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 3, requirement: "Page title has correct inc. or exc badge", portal: "All", screen: "All Screens", scopeTag: "inc", reviewStatus: "Pass", comment: "Badge consistency verified", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 4, requirement: "Every module heading has scope badge", portal: "All", screen: "All Screens", scopeTag: "inc", reviewStatus: "Needs Fix", comment: "Missing on Dolley/GSE placeholder screen", reviewer: "QA Analyst", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-09" },
  { id: 5, requirement: "Badge colors exact: inc. #16A34A, exc #DC2626", portal: "All", screen: "Global", scopeTag: "inc", reviewStatus: "Pass", comment: "Colors verified with design token", reviewer: "QA Lead", date: "2026-06-08", owner: "Design Team", dueDate: "2026-06-10" },
  { id: 6, requirement: "All specified fields are present", portal: "Warehouse Manager", screen: "Dashboard", scopeTag: "inc", reviewStatus: "Pass", comment: "All KPI cards and tables present", reviewer: "QA Analyst", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 7, requirement: "No fields invented", portal: "ULD Message Builder", screen: "LUC", scopeTag: "inc", reviewStatus: "Pass", comment: "LUC screen has no invented form fields", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 8, requirement: "No fields renamed", portal: "Finance Manager", screen: "Invoice Generation", scopeTag: "inc", reviewStatus: "Pass", comment: "All fields match specification", reviewer: "QA Analyst", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 9, requirement: "Required fields show asterisk", portal: "Admin", screen: "Users", scopeTag: "inc", reviewStatus: "Fail", comment: "Add User drawer missing asterisk on Email field", reviewer: "QA Analyst", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-09" },
  { id: 10, requirement: "Validation messages are inline", portal: "Forwarding Agent", screen: "AWB Entry", scopeTag: "inc", reviewStatus: "Needs Fix", comment: "Some validations use alert() instead of inline messages", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-09" },
  { id: 11, requirement: "Primary actions are clear", portal: "All", screen: "All Screens", scopeTag: "inc", reviewStatus: "Pass", comment: "CTA buttons have sufficient contrast and size", reviewer: "QA Lead", date: "2026-06-08", owner: "Design Team", dueDate: "2026-06-10" },
  { id: 12, requirement: "Destructive actions are red", portal: "Admin", screen: "Users", scopeTag: "inc", reviewStatus: "Pass", comment: "Delete/Disable actions use red styling", reviewer: "QA Analyst", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 13, requirement: "Empty state implemented", portal: "All", screen: "All Screens", scopeTag: "inc", reviewStatus: "Pass", comment: "EmptyState component used consistently", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 14, requirement: "Loading state implemented", portal: "All", screen: "All Screens", scopeTag: "inc", reviewStatus: "Pass", comment: "LoadingSkeleton present on data screens", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 15, requirement: "Error state implemented", portal: "All", screen: "All Screens", scopeTag: "inc", reviewStatus: "Pass", comment: "ErrorState with Retry button present", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 16, requirement: "Success toast implemented", portal: "All", screen: "All Screens", scopeTag: "inc", reviewStatus: "Pass", comment: "ToastContext used for success messages", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 17, requirement: "Lucide icons used", portal: "All", screen: "Global", scopeTag: "inc", reviewStatus: "Pass", comment: "All icons from lucide-react", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 18, requirement: "Inter font used", portal: "All", screen: "Global", scopeTag: "inc", reviewStatus: "Pass", comment: "Font-family confirmed", reviewer: "QA Lead", date: "2026-06-08", owner: "Design Team", dueDate: "2026-06-10" },
  { id: 19, requirement: "WCAG AA contrast", portal: "All", screen: "Global", scopeTag: "inc", reviewStatus: "Needs Fix", comment: "Light gray text on some cards below 4.5:1 ratio", reviewer: "QA Analyst", date: "2026-06-08", owner: "Design Team", dueDate: "2026-06-09" },
  { id: 20, requirement: "Responsive at 1440, 768, 390", portal: "All", screen: "Global", scopeTag: "inc", reviewStatus: "Pass", comment: "Responsive breakpoints working correctly", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 22, requirement: "Pakistani cargo sample data used", portal: "All", screen: "All Screens", scopeTag: "inc", reviewStatus: "Pass", comment: "KHI/LHE/ISB references, PKR currency, Pakistani entities", reviewer: "QA Lead", date: "2026-06-08", owner: "Content Team", dueDate: "2026-06-10" },
  { id: 23, requirement: "PKR and IATA formats used correctly", portal: "Finance Manager", screen: "All Screens", scopeTag: "inc", reviewStatus: "Pass", comment: "PKR formatting correct, IATA AWB format validated", reviewer: "QA Analyst", date: "2026-06-08", owner: "Content Team", dueDate: "2026-06-10" },
  { id: 24, requirement: "Badge tooltip text is exact", portal: "All", screen: "Global", scopeTag: "inc", reviewStatus: "Pass", comment: "Tooltips match specification exactly", reviewer: "QA Lead", date: "2026-06-08", owner: "Frontend Team", dueDate: "2026-06-10" },
  { id: 25, requirement: "Screen matches source specification", portal: "Auditor", screen: "All Screens", scopeTag: "inc", reviewStatus: "Pending", comment: "Awaiting final review", reviewer: "QA Lead", date: "", owner: "QA Team", dueDate: "2026-06-12" },
];

export default function QAChecklistContent() {
  const { addToast } = useToast();
  const [checklist] = useState<ChecklistItem[]>(initialChecklist);
  const [portalFilter, setPortalFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [reviewerFilter, setReviewerFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);

  const reviewers = ["All", ...Array.from(new Set(checklist.map((c) => c.reviewer)))];

  const filtered = checklist.filter((c) => {
    if (portalFilter !== "All" && c.portal !== portalFilter) return false;
    if (statusFilter !== "All" && c.reviewStatus !== statusFilter) return false;
    if (reviewerFilter !== "All" && c.reviewer !== reviewerFilter) return false;
    if (searchTerm && !c.requirement.toLowerCase().includes(searchTerm.toLowerCase()) && !c.screen.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: checklist.length,
    pass: checklist.filter((c) => c.reviewStatus === "Pass").length,
    fail: checklist.filter((c) => c.reviewStatus === "Fail").length,
    needsFix: checklist.filter((c) => c.reviewStatus === "Needs Fix").length,
    pending: checklist.filter((c) => c.reviewStatus === "Pending").length,
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleSaveReview = () => {
    addToast("Review saved successfully", "success");
  };

  const handleExportPDF = () => {
    addToast("Review PDF exported", "success");
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <LoadingSkeleton rows={10} columns={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3">
          <p className="text-[11px] font-bold text-[#64748B] mb-1">Total Items</p>
          <span className="text-[22px] font-bold text-[#0F172A]">{stats.total}</span>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3">
          <p className="text-[11px] font-bold text-[#64748B] mb-1">Pass</p>
          <span className="text-[22px] font-bold text-[#16A34A]">{stats.pass}</span>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3">
          <p className="text-[11px] font-bold text-[#64748B] mb-1">Fail</p>
          <span className="text-[22px] font-bold text-[#DC2626]">{stats.fail}</span>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3">
          <p className="text-[11px] font-bold text-[#64748B] mb-1">Needs Fix</p>
          <span className="text-[22px] font-bold text-[#D97706]">{stats.needsFix}</span>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-3">
          <p className="text-[11px] font-bold text-[#64748B] mb-1">Pending</p>
          <span className="text-[22px] font-bold text-[#94A3B8]">{stats.pending}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search requirements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] w-[220px]"
          />
        </div>

        <div className="relative">
          <select value={portalFilter} onChange={(e) => setPortalFilter(e.target.value)} className="h-9 pl-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
            {portals.map((p) => <option key={p} value={p}>{p === "All" ? "Portal" : p}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>

        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 pl-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
            {reviewStatuses.map((s) => <option key={s} value={s}>{s === "All" ? "Review Status" : s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>

        <div className="relative">
          <select value={reviewerFilter} onChange={(e) => setReviewerFilter(e.target.value)} className="h-9 pl-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
            {reviewers.map((r) => <option key={r} value={r}>{r === "All" ? "Reviewer" : r}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleSaveReview}
            className="h-8 px-4 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            Save Review
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Download size={13} />
            Export PDF
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No checklist items" description="No items match the selected filters." />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B2545" }}>
              <tr>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white w-[50px]">#</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Requirement</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Portal</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Screen</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Status</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Reviewer</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Owner</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Due Date</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr
                  key={item.id}
                  className="border-b border-[#E2E8F0] transition-colors hover:bg-[#F1F5F9]"
                  style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "white" }}
                >
                  <td className="px-4 py-3 text-[12px] font-mono text-[#94A3B8]">{item.id}</td>
                  <td className="px-4 py-3 text-[13px] text-[#0F172A]">{item.requirement}</td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{item.portal}</td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{item.screen}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-bold ${
                      item.reviewStatus === "Pass" ? "bg-[#DCFCE7] text-[#16A34A]" :
                      item.reviewStatus === "Fail" ? "bg-[#FEE2E2] text-[#DC2626]" :
                      item.reviewStatus === "Needs Fix" ? "bg-[#FEF3C7] text-[#D97706]" :
                      "bg-[#F1F5F9] text-[#94A3B8]"
                    }`}>
                      {item.reviewStatus === "Pass" ? <Check size={10} /> :
                       item.reviewStatus === "Fail" ? <X size={10} /> :
                       item.reviewStatus === "Needs Fix" ? <AlertTriangle size={10} /> :
                       <Clock size={10} />}
                      {item.reviewStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{item.reviewer}</td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{item.owner}</td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{item.dueDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="h-7 px-2.5 rounded-lg text-[11px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer whitespace-nowrap"
                      >
                        Review
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setSelectedItem(null)}>
          <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 h-[56px] border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#0F172A]">Review Item #{selectedItem.id}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Requirement</p>
                <p className="text-[14px] font-semibold text-[#0F172A]">{selectedItem.requirement}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Portal</p>
                  <p className="text-[13px] text-[#0F172A]">{selectedItem.portal}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Screen</p>
                  <p className="text-[13px] text-[#0F172A]">{selectedItem.screen}</p>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Review Status</label>
                <div className="flex items-center gap-2">
                  {(["Pass", "Fail", "Needs Fix"] as const).map((s) => (
                    <button
                      key={s}
                      className={`h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer border transition-colors whitespace-nowrap ${
                        selectedItem.reviewStatus === s
                          ? s === "Pass" ? "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]" :
                            s === "Fail" ? "bg-[#FEE2E2] text-[#DC2626] border-[#DC2626]" :
                            "bg-[#FEF3C7] text-[#D97706] border-[#D97706]"
                          : "text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Comment</label>
                <textarea defaultValue={selectedItem.comment} rows={3} className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] resize-none" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Screenshot Upload</label>
                <button className="flex items-center gap-2 h-9 px-3 rounded-lg border border-dashed border-[#E2E8F0] text-[13px] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                  <Upload size={14} />
                  Upload Screenshot
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Owner</label>
                  <input type="text" defaultValue={selectedItem.owner} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Due Date</label>
                  <input type="date" defaultValue={selectedItem.dueDate} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between">
              <button className="h-8 px-3 rounded-lg text-[12px] font-semibold text-[#DC2626] border border-[#DC2626]/20 hover:bg-[#DC2626]/5 cursor-pointer whitespace-nowrap">
                Assign Fix
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedItem(null)} className="h-8 px-4 rounded-lg text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer whitespace-nowrap">
                  Cancel
                </button>
                <button
                  onClick={() => { setSelectedItem(null); addToast("Review saved", "success"); }}
                  className="h-8 px-4 rounded-lg text-[12px] font-semibold text-white cursor-pointer hover:opacity-90 whitespace-nowrap"
                  style={{ backgroundColor: "#0B2545" }}
                >
                  Save Review
                </button>
                <button
                  onClick={() => { setSelectedItem(null); addToast("Marked as approved", "success"); }}
                  className="h-8 px-4 rounded-lg text-[12px] font-semibold text-[#16A34A] border border-[#16A34A] hover:bg-[#16A34A]/5 cursor-pointer whitespace-nowrap"
                >
                  Mark Approved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}