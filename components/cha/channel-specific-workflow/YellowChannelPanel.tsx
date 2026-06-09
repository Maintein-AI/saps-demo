"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import {
  FileText,
  MessageSquare,
  Upload,
  Send,
  CheckCircle,
  Plus,
  Eye,
  Paperclip,
  Clock,
  AlertTriangle,
  Save,
  X,
} from "lucide-react";

interface YellowQuery {
  id: string;
  queryRef: string;
  awb: string;
  gd: string;
  queryAge: string;
  responseStatus: "Awaiting Response" | "Response Submitted" | "Resolved" | "Customs Rejected";
  docsAttached: number;
  remarks: string;
  queryDesc: string;
  queryRaisedAt: string;
  responseNotes: string;
  sapsReviewStatus: string;
  customsRemarks: string;
}

const initialQueries: YellowQuery[] = [
  {
    id: "YQ-001",
    queryRef: "QRY-2026-KHI-00441",
    awb: "214-77890123",
    gd: "2026-KHI-00441",
    queryAge: "2d 4h",
    responseStatus: "Awaiting Response",
    docsAttached: 0,
    remarks: "Commercial invoice mismatch",
    queryDesc: "Commercial invoice value does not match the declared value in GD. Please provide revised invoice with correct PKR value.",
    queryRaisedAt: "30 May 2026, 14:30",
    responseNotes: "",
    sapsReviewStatus: "Pending",
    customsRemarks: "Awaiting CHA response",
  },
  {
    id: "YQ-002",
    queryRef: "QRY-2026-KHI-00432",
    awb: "117-55667788",
    gd: "2026-KHI-00432",
    queryAge: "1d 6h",
    responseStatus: "Response Submitted",
    docsAttached: 3,
    remarks: "Packing list incomplete",
    queryDesc: "Packing list is missing dimensions for individual cartons. Please provide detailed packing list.",
    queryRaisedAt: "31 May 2026, 08:15",
    responseNotes: "Revised packing list with all dimensions attached.",
    sapsReviewStatus: "Under Review",
    customsRemarks: "Documents forwarded to examiner",
  },
  {
    id: "YQ-003",
    queryRef: "QRY-2026-KHI-00436",
    awb: "117-99887766",
    gd: "2026-KHI-00436",
    queryAge: "3h",
    responseStatus: "Resolved",
    docsAttached: 2,
    remarks: "Certificate of origin required",
    queryDesc: "Certificate of origin not found. Please provide attested copy from origin country chamber.",
    queryRaisedAt: "31 May 2026, 17:00",
    responseNotes: "Attested certificate of origin from Dubai Chamber of Commerce attached.",
    sapsReviewStatus: "Approved",
    customsRemarks: "Query cleared. Moved to OOC.",
  },
  {
    id: "YQ-004",
    queryRef: "QRY-2026-KHI-00435",
    awb: "214-11223344",
    gd: "2026-KHI-00435",
    queryAge: "4h 20m",
    responseStatus: "Awaiting Response",
    docsAttached: 0,
    remarks: "HS code clarification needed",
    queryDesc: "HS code 8501.5290 does not match the product description. Please provide technical specification sheet.",
    queryRaisedAt: "01 Jun 2026, 05:40",
    responseNotes: "",
    sapsReviewStatus: "Pending",
    customsRemarks: "Awaiting CHA response",
  },
  {
    id: "YQ-005",
    queryRef: "QRY-2026-KHI-00433",
    awb: "157-22334455",
    gd: "2026-KHI-00433",
    queryAge: "1d",
    responseStatus: "Customs Rejected",
    docsAttached: 1,
    remarks: "Import permit expired",
    queryDesc: "Import permit for pharmaceutical products has expired. Current valid permit required.",
    queryRaisedAt: "31 May 2026, 10:00",
    responseNotes: "Renewed import permit from DRAP attached.",
    sapsReviewStatus: "Rejected",
    customsRemarks: "Permit date does not cover shipment arrival date. Re-submit.",
  },
];

const responseStatusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Awaiting Response": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  "Response Submitted": { bg: "#DBEAFE", text: "#1D4ED8", icon: <Send size={12} /> },
  "Resolved": { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  "Customs Rejected": { bg: "#FEE2E2", text: "#DC2626", icon: <AlertTriangle size={12} /> },
};

interface YellowChannelPanelProps {
  onViewDetail: (query: YellowQuery) => void;
}

export default function YellowChannelPanel({ onViewDetail }: YellowChannelPanelProps) {
  const { addToast } = useToast();
  const [queries, setQueries] = useState<YellowQuery[]>(initialQueries);
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [responseNotes, setResponseNotes] = useState("");
  const [reviewRemarks, setReviewRemarks] = useState("");
  const [docsAttached, setDocsAttached] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newQueryRef, setNewQueryRef] = useState("");
  const [newQueryDesc, setNewQueryDesc] = useState("");

  const handleAttachDocs = () => {
    setDocsAttached((prev) => prev + 1);
    addToast("Supporting documents attached.", "success");
  };

  const handleSubmitResponse = (queryId: string) => {
    setQueries((prev) =>
      prev.map((q) =>
        q.id === queryId
          ? { ...q, responseStatus: "Response Submitted", responseNotes, docsAttached: docsAttached || q.docsAttached }
          : q
      )
    );
    addToast("Response submitted to customs.", "success");
    setSelectedQuery(null);
    setResponseNotes("");
    setDocsAttached(0);
  };

  const handleMarkResolved = (queryId: string) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === queryId ? { ...q, responseStatus: "Resolved" } : q))
    );
    addToast("Query marked as resolved.", "success");
  };

  const handleAddRemark = () => {
    addToast("Remark added to query record.", "success");
    setReviewRemarks("");
  };

  const handleAddNewQuery = () => {
    if (!newQueryRef || !newQueryDesc) {
      addToast("Please fill all required fields.", "error");
      return;
    }
    const newQuery: YellowQuery = {
      id: `YQ-${String(queries.length + 1).padStart(3, "0")}`,
      queryRef: newQueryRef,
      awb: "214-77890123",
      gd: "2026-KHI-00441",
      queryAge: "0m",
      responseStatus: "Awaiting Response",
      docsAttached: 0,
      remarks: "",
      queryDesc: newQueryDesc,
      queryRaisedAt: "01 Jun 2026, 09:15",
      responseNotes: "",
      sapsReviewStatus: "Pending",
      customsRemarks: "Awaiting CHA response",
    };
    setQueries((prev) => [newQuery, ...prev]);
    setShowForm(false);
    setNewQueryRef("");
    setNewQueryDesc("");
    addToast("New query added to queue.", "success");
  };

  const activeQuery = queries.find((q) => q.id === selectedQuery);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Yellow Channel Query Queue</h2>
          <ScopeBadge type="exc" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[#64748B]">{queries.length} queries</span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#D97706" }}
          >
            <Plus size={14} />
            Add Query
          </button>
        </div>
      </div>

      {showForm && (
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Query Reference #</label>
              <input
                type="text"
                value={newQueryRef}
                onChange={(e) => setNewQueryRef(e.target.value)}
                placeholder="e.g., QRY-2026-KHI-00xxx"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#D97706] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">AWB #</label>
              <input
                type="text"
                defaultValue="214-77890123"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none bg-[#F1F5F9]"
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Query Description</label>
              <textarea
                value={newQueryDesc}
                onChange={(e) => setNewQueryDesc(e.target.value)}
                placeholder="Describe the query raised by customs"
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#D97706] transition-colors resize-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddNewQuery}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: "#D97706" }}
            >
              <Save size={14} />
              Save Query
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Query Ref #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">GD #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Query Age</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Response Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Docs Attached</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Remarks</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => {
                const sc = responseStatusConfig[query.responseStatus];
                return (
                  <tr
                    key={query.id}
                    className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    onClick={() => setSelectedQuery(selectedQuery === query.id ? null : query.id)}
                  >
                    <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{query.queryRef}</td>
                    <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{query.awb}</td>
                    <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{query.gd}</td>
                    <td className="py-3 px-3 text-[12px] text-[#64748B]">{query.queryAge}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {sc.icon}
                        {query.responseStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[12px] text-[#64748B]">{query.docsAttached} files</td>
                    <td className="py-3 px-3 text-[12px] text-[#64748B] max-w-[160px] truncate">{query.remarks}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(query);
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttachDocs();
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="Attach Response Docs"
                        >
                          <Paperclip size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {activeQuery && (
          <div className="mt-5 p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={16} className="text-[#D97706]" />
              <h3 className="text-[13px] font-bold text-[#0F172A]">Query Detail: {activeQuery.queryRef}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Query Raised At</label>
                <input
                  type="text"
                  value={activeQuery.queryRaisedAt}
                  readOnly
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">SAPS Review Status</label>
                <input
                  type="text"
                  value={activeQuery.sapsReviewStatus}
                  readOnly
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Query Description</label>
                <textarea
                  value={activeQuery.queryDesc}
                  readOnly
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9] resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Response Notes</label>
                <textarea
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Enter CHA response notes"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#D97706] transition-colors resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Customs Remarks</label>
                <textarea
                  value={activeQuery.customsRemarks}
                  readOnly
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9] resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Add Remark</label>
                <textarea
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  placeholder="Enter additional remarks"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#D97706] transition-colors resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Supporting Response Docs</label>
                <button
                  onClick={handleAttachDocs}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-[#CBD5E1] text-[13px] text-[#64748B] cursor-pointer hover:border-[#D97706] hover:text-[#D97706] transition-colors"
                >
                  <Upload size={16} />
                  Upload response documents
                  {docsAttached > 0 && (
                    <span className="text-[12px] font-semibold text-[#D97706]">({docsAttached} attached)</span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={() => handleSubmitResponse(activeQuery.id)}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: "#D97706" }}
              >
                <Send size={14} />
                Submit Response
              </button>
              <button
                onClick={() => handleMarkResolved(activeQuery.id)}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border cursor-pointer transition-colors hover:bg-[#F8FAFC]"
                style={{ borderColor: "#D97706", color: "#D97706" }}
              >
                <CheckCircle size={14} />
                Mark Resolved
              </button>
              <button
                onClick={handleAddRemark}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <FileText size={14} />
                Add Remark
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}