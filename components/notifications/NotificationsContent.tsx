"use client";

import { useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import EmptyState from "../EmptyState";
import ErrorState from "../ErrorState";
import { useToast } from "../ToastContext";
import {
  Search,
  Mail,
  MessageCircle,
  Smartphone,
  Send,
  Eye,
  RefreshCw,
  X,
  Check,
  AlertTriangle,
  Clock,
} from "lucide-react";

const iataMessageTypes = [
  "FFM", "FWB", "FHL", "NOTOC", "RCT", "AWD", "TFD",
  "RCF", "DEP", "TGC", "NFD", "DLV", "DIS", "ARR", "FIW",
];

const customerNotificationTypes = [
  "Notice of Arrival",
  "Free Period Expiry",
  "Payment Due",
  "DO Ready",
  "Delivered",
  "Customs Hold",
  "Missing Document",
];

const channels = ["Email", "SMS", "WhatsApp"];

const templateVariables = [
  "{{awb}}",
  "{{consignee}}",
  "{{pieces}}",
  "{{free_period_expiry}}",
];

const initialTemplates = [
  {
    id: "t1",
    name: "NOA Standard",
    type: "Notice of Arrival",
    channel: "Email",
    subject: "Notice of Arrival — AWB {{awb}}",
    body: "Dear {{consignee}}, your shipment {{awb}} with {{pieces}} pieces has arrived at KHI. Free period expires {{free_period_expiry}}.",
    status: "Active",
  },
  {
    id: "t2",
    name: "Payment Due Reminder",
    type: "Payment Due",
    channel: "SMS",
    subject: "",
    body: "AirVault: Payment due for AWB {{awb}}. Please settle to avoid storage charges.",
    status: "Active",
  },
  {
    id: "t3",
    name: "DO Ready Alert",
    type: "DO Ready",
    channel: "WhatsApp",
    subject: "",
    body: "Your Delivery Order for AWB {{awb}} ({{pieces}} pcs) is ready.",
    status: "Active",
  },
  {
    id: "t4",
    name: "Free Period Expiry",
    type: "Free Period Expiry",
    channel: "Email",
    subject: "Free Period Expiring — AWB {{awb}}",
    body: "Dear {{consignee}}, free period for AWB {{awb}} expires {{free_period_expiry}}. Storage charges apply after expiry.",
    status: "Draft",
  },
  {
    id: "t5",
    name: "Delivery Confirmation",
    type: "Delivered",
    channel: "SMS",
    subject: "",
    body: "AirVault: AWB {{awb}} has been delivered. Thank you.",
    status: "Active",
  },
];

const initialMessageLog = [
  { id: "msg1", type: "Notice of Arrival", channel: "Email", recipient: "importer@paktrade.pk", awb: "176-1234-5678", sentAt: "2026-06-08 09:15", status: "Delivered", error: "" },
  { id: "msg2", type: "Payment Due", channel: "SMS", recipient: "+92 300 1234567", awb: "176-2345-6789", sentAt: "2026-06-08 08:30", status: "Delivered", error: "" },
  { id: "msg3", type: "DO Ready", channel: "WhatsApp", recipient: "+92 321 9876543", awb: "176-3456-7890", sentAt: "2026-06-08 07:45", status: "Delivered", error: "" },
  { id: "msg4", type: "Free Period Expiry", channel: "Email", recipient: "consignee@textile.pk", awb: "176-4567-8901", sentAt: "2026-06-08 07:00", status: "Failed", error: "SMTP timeout" },
  { id: "msg5", type: "Delivered", channel: "SMS", recipient: "+92 333 1122334", awb: "176-5678-9012", sentAt: "2026-06-07 18:20", status: "Delivered", error: "" },
  { id: "msg6", type: "Customs Hold", channel: "Email", recipient: "broker@cha.pk", awb: "176-6789-0123", sentAt: "2026-06-07 16:45", status: "Delivered", error: "" },
  { id: "msg7", type: "Missing Document", channel: "WhatsApp", recipient: "+92 345 5566778", awb: "176-7890-1234", sentAt: "2026-06-07 14:10", status: "Delivered", error: "" },
  { id: "msg8", type: "FFM", channel: "IATA", recipient: "KHIAPCA", awb: "176-8901-2345", sentAt: "2026-06-07 11:30", status: "Delivered", error: "" },
  { id: "msg9", type: "FWB", channel: "IATA", recipient: "SITA", awb: "176-9012-3456", sentAt: "2026-06-07 10:15", status: "Delivered", error: "" },
  { id: "msg10", type: "RCF", channel: "IATA", recipient: "LHEAPCA", awb: "176-0123-4567", sentAt: "2026-06-07 09:00", status: "Delivered", error: "" },
];

export default function NotificationsContent() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"iata" | "customer">("customer");
  const [activeSection, setActiveSection] = useState<"templates" | "log">("templates");
  const [templates, setTemplates] = useState(initialTemplates);
  const [messageLog] = useState(initialMessageLog);
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<typeof initialTemplates[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editTemplate, setEditTemplate] = useState<typeof initialTemplates[0] | null>(null);

  const filteredLog = messageLog.filter((m) => {
    if (searchTerm && !m.awb.includes(searchTerm) && !m.recipient.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (channelFilter !== "All" && m.channel !== channelFilter) return false;
    if (statusFilter !== "All" && m.status !== statusFilter) return false;
    return true;
  });

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleToggleTemplateStatus = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === "Active" ? "Draft" : "Active" } : t))
    );
    addToast("Template status updated", "success");
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
        <LoadingSkeleton rows={8} columns={5} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E2E8F0] p-1">
        <button
          onClick={() => setActiveTab("customer")}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-all whitespace-nowrap ${
            activeTab === "customer" ? "bg-[#0B2545] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"
          }`}
        >
          Customer Notifications
        </button>
        <button
          onClick={() => setActiveTab("iata")}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-all whitespace-nowrap ${
            activeTab === "iata" ? "bg-[#0B2545] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"
          }`}
        >
          IATA Messaging
        </button>
      </div>

      {activeTab === "iata" ? (
        <IATAPanel />
      ) : (
        <>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E2E8F0] p-1">
            <button
              onClick={() => setActiveSection("templates")}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-all whitespace-nowrap ${
                activeSection === "templates" ? "bg-[#0B2545] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"
              }`}
            >
              Template Editor
            </button>
            <button
              onClick={() => setActiveSection("log")}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-all whitespace-nowrap ${
                activeSection === "log" ? "bg-[#0B2545] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"
              }`}
            >
              Message Log
            </button>
          </div>

          {activeSection === "templates" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {templates.map((tpl) => (
                <div key={tpl.id} className="bg-white rounded-xl border border-[#E2E8F0] p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[13px] font-bold text-[#0F172A]">{tpl.name}</h4>
                      </div>
                      <p className="text-[11px] text-[#64748B] mt-0.5">{tpl.type} — {tpl.channel}</p>
                    </div>
                    <span
                      className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-bold ${
                        tpl.status === "Active" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"
                      }`}
                    >
                      {tpl.status}
                    </span>
                  </div>
                  {tpl.subject && <p className="text-[12px] font-semibold text-[#0B2545] mb-1">{tpl.subject}</p>}
                  <p className="text-[12px] text-[#64748B] mb-3 line-clamp-2">{tpl.body}</p>
                  <div className="flex items-center gap-1 flex-wrap mb-3">
                    {templateVariables.map((v) => (
                      <span key={v} className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium bg-[#EBF0F7] text-[#1B4F8B]">
                        {v}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(tpl)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <Eye size={12} />
                      Preview
                    </button>
                    <button
                      onClick={() => setEditTemplate(tpl)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold text-[#0B2545] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleTemplateStatus(tpl.id)}
                      className={`flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                        tpl.status === "Active"
                          ? "text-[#DC2626] border border-[#DC2626]/20 hover:bg-[#DC2626]/5"
                          : "text-[#16A34A] border border-[#16A34A]/20 hover:bg-[#16A34A]/5"
                      }`}
                    >
                      {tpl.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newId = "t" + (templates.length + 1);
                  setTemplates([...templates, {
                    id: newId, name: "New Template", type: "Notice of Arrival",
                    channel: "Email", subject: "", body: "", status: "Draft",
                  }]);
                  addToast("New draft template created", "success");
                }}
                className="flex items-center justify-center h-[200px] rounded-xl border-2 border-dashed border-[#E2E8F0] hover:border-[#2E75B6] hover:bg-[#F8FAFC] cursor-pointer transition-all"
              >
                <span className="text-[13px] font-semibold text-[#94A3B8]">+ New Template</span>
              </button>
            </div>
          ) : (
            <MessageLogTable
              messages={filteredLog}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              channelFilter={channelFilter}
              onChannelFilterChange={setChannelFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          )}
        </>
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setPreviewTemplate(null)}>
          <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 h-[56px] border-b border-[#E2E8F0]">
              <h3 className="text-[16px] font-bold text-[#0F172A]">Preview: {previewTemplate.name}</h3>
              <button onClick={() => setPreviewTemplate(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Channel</p>
                <div className="flex items-center gap-1.5">
                  {previewTemplate.channel === "Email" ? <Mail size={15} className="text-[#64748B]" /> :
                   previewTemplate.channel === "SMS" ? <Smartphone size={15} className="text-[#64748B]" /> :
                   <MessageCircle size={15} className="text-[#64748B]" />}
                  <span className="text-[13px] font-semibold">{previewTemplate.channel}</span>
                </div>
              </div>
              {previewTemplate.subject && (
                <div>
                  <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Subject</p>
                  <p className="text-[13px] font-semibold text-[#0F172A]">{previewTemplate.subject}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Body</p>
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] whitespace-pre-wrap">
                  {previewTemplate.body}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Preview with Data</p>
                <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] text-[13px] text-[#0F172A] whitespace-pre-wrap">
                  {previewTemplate.body
                    .replace("{{awb}}", "176-1234-5678")
                    .replace("{{consignee}}", "Pak Textile Industries")
                    .replace("{{pieces}}", "12")
                    .replace("{{free_period_expiry}}", "2026-06-15")}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editTemplate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setEditTemplate(null)}>
          <div className="w-full max-w-[640px] bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 h-[56px] border-b border-[#E2E8F0]">
              <h3 className="text-[16px] font-bold text-[#0F172A]">Edit Template</h3>
              <button onClick={() => setEditTemplate(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Template Name</label>
                  <input type="text" defaultValue={editTemplate.name} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Notification Type</label>
                  <select defaultValue={editTemplate.type} className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
                    {customerNotificationTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Channel</label>
                  <select defaultValue={editTemplate.channel} className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
                    {channels.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Status</label>
                  <select defaultValue={editTemplate.status} className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              {editTemplate.channel === "Email" && (
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Subject</label>
                  <input type="text" defaultValue={editTemplate.subject} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
                </div>
              )}
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Message Body</label>
                <textarea defaultValue={editTemplate.body} rows={4} className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] resize-none" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Available Variables</label>
                <div className="flex flex-wrap gap-1">
                  {templateVariables.map((v) => (
                    <span key={v} className="inline-flex items-center h-6 px-2 rounded-full text-[11px] font-medium bg-[#EBF0F7] text-[#1B4F8B] cursor-pointer hover:bg-[#DBEAFE]">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <button onClick={() => setEditTemplate(null)} className="h-8 px-4 rounded-lg text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer whitespace-nowrap">
                Cancel
              </button>
              <button
                onClick={() => { setEditTemplate(null); addToast("Template saved", "success"); }}
                className="h-8 px-4 rounded-lg text-[12px] font-semibold text-white cursor-pointer hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: "#0B2545" }}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IATAPanel() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[13px] font-bold text-[#0F172A]">Supported IATA Message Types</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {iataMessageTypes.map((t) => (
            <span
              key={t}
              className="inline-flex items-center h-7 px-3 rounded-lg text-[12px] font-semibold bg-[#EBF0F7] text-[#1B4F8B]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[13px] font-bold text-[#0F172A]">IATA Message Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B2545" }}>
              <tr>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Message ID</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Type</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Recipient</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">AWB</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Sent At</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Status</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "IATA-001", type: "FFM", recipient: "KHIAPCA", awb: "176-1234-5678", sentAt: "2026-06-08 09:00", status: "Delivered" },
                { id: "IATA-002", type: "FWB", recipient: "SITA", awb: "176-2345-6789", sentAt: "2026-06-08 08:45", status: "Delivered" },
                { id: "IATA-003", type: "FHL", recipient: "LHEAPCA", awb: "176-3456-7890", sentAt: "2026-06-08 08:30", status: "Delivered" },
                { id: "IATA-004", type: "RCF", recipient: "ISBAPCA", awb: "176-4567-8901", sentAt: "2026-06-08 07:15", status: "Delivered" },
                { id: "IATA-005", type: "DEP", recipient: "SITA", awb: "176-5678-9012", sentAt: "2026-06-08 06:00", status: "Delivered" },
                { id: "IATA-006", type: "DLV", recipient: "PEWAPCA", awb: "176-6789-0123", sentAt: "2026-06-07 22:30", status: "Failed" },
              ].map((m, i) => (
                <tr key={m.id} className="border-b border-[#E2E8F0]" style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "white" }}>
                  <td className="px-4 py-3 text-[12px] font-mono text-[#0F172A]">{m.id}</td>
                  <td className="px-4 py-3 text-[12px] font-semibold text-[#1B4F8B]">{m.type}</td>
                  <td className="px-4 py-3 text-[12px] text-[#0F172A]">{m.recipient}</td>
                  <td className="px-4 py-3 text-[12px] text-[#0F172A]">{m.awb}</td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{m.sentAt}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-bold ${m.status === "Delivered" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="h-7 px-2.5 rounded-lg text-[11px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer whitespace-nowrap">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MessageLogTable({
  messages,
  searchTerm,
  onSearchChange,
  channelFilter,
  onChannelFilterChange,
  statusFilter,
  onStatusFilterChange,
}: {
  messages: typeof initialMessageLog;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  channelFilter: string;
  onChannelFilterChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search AWB or recipient..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] w-[240px]"
          />
        </div>
        <select value={channelFilter} onChange={(e) => onChannelFilterChange(e.target.value)} className="h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
          <option value="All">All Channels</option>
          <option value="Email">Email</option>
          <option value="SMS">SMS</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="IATA">IATA</option>
        </select>
        <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value)} className="h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
          <option value="All">All Status</option>
          <option value="Delivered">Delivered</option>
          <option value="Failed">Failed</option>
        </select>
      </div>
      {messages.length === 0 ? (
        <EmptyState title="No messages found" description="No messages match your search criteria." />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B2545" }}>
              <tr>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Message ID</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Type</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Channel</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Recipient</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">AWB</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Sent At</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Status</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Error</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m, i) => (
                <tr key={m.id} className="border-b border-[#E2E8F0] transition-colors hover:bg-[#F1F5F9]" style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "white" }}>
                  <td className="px-4 py-3 text-[12px] font-mono text-[#0F172A]">{m.id}</td>
                  <td className="px-4 py-3 text-[12px] text-[#0F172A]">{m.type}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[12px] text-[#64748B]">
                      {m.channel === "Email" ? <Mail size={13} /> : m.channel === "SMS" ? <Smartphone size={13} /> : m.channel === "WhatsApp" ? <MessageCircle size={13} /> : <Send size={13} />}
                      {m.channel}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#0F172A]">{m.recipient}</td>
                  <td className="px-4 py-3 text-[12px] text-[#0F172A]">{m.awb}</td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{m.sentAt}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-bold ${m.status === "Delivered" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>
                      {m.status === "Delivered" ? <Check size={10} /> : <AlertTriangle size={10} />}
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#DC2626]">{m.error || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="h-7 px-2 rounded-lg text-[11px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer whitespace-nowrap">View</button>
                      {m.status === "Failed" && (
                        <button className="h-7 w-7 flex items-center justify-center rounded-lg text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer">
                          <RefreshCw size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}