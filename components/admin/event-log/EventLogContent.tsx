"use client";

import { useState, useEffect } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import DataTable from "@/components/DataTable";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/components/ToastContext";
import { Download } from "lucide-react";

const sessionData = [
  { user: "Ahmed Shaikh", loginTime: "09:42:18 AM", logoutTime: "—", ip: "192.168.1.45", device: "Windows / Chrome 126", sessionStatus: "Active" },
  { user: "Fatima Rizvi", loginTime: "09:38:05 AM", logoutTime: "—", ip: "10.5.12.200", device: "MacOS / Safari 18", sessionStatus: "Active" },
  { user: "Bilal Khan", loginTime: "09:35:22 AM", logoutTime: "09:35:28 AM", ip: "203.0.113.42", device: "Mobile / Chrome 126", sessionStatus: "Terminated" },
  { user: "Sana Tariq", loginTime: "09:28:40 AM", logoutTime: "—", ip: "192.168.1.78", device: "Windows / Edge 126", sessionStatus: "Active" },
  { user: "Raza Akbar", loginTime: "09:20:11 AM", logoutTime: "—", ip: "192.168.3.14", device: "Windows / Chrome 125", sessionStatus: "Active" },
  { user: "Owais Javed", loginTime: "07:50:33 AM", logoutTime: "—", ip: "192.168.5.88", device: "RFID Handheld / Android", sessionStatus: "Active" },
  { user: "Nadia Hassan", loginTime: "08:40:29 AM", logoutTime: "—", ip: "192.168.2.45", device: "Windows / Firefox 127", sessionStatus: "Active" },
  { user: "Azeem Qureshi", loginTime: "Yesterday 16:20", logoutTime: "Yesterday 22:15", ip: "192.168.7.10", device: "Windows / Chrome 125", sessionStatus: "Expired" },
  { user: "Hina Akram", loginTime: "2 days ago 10:05", logoutTime: "2 days ago 14:30", ip: "172.20.10.5", device: "Mobile / Safari 17", sessionStatus: "Expired" },
  { user: "Maryam Saeed", loginTime: "3 days ago 09:15", logoutTime: "3 days ago 17:00", ip: "10.0.5.22", device: "Windows / Chrome 126", sessionStatus: "Expired" },
];

const eventData = [
  { eventId: "EVT-1001", timestamp: "09:42:18 AM", module: "Auth", severity: "Info", message: "User login successful — ahmed.shaikh", user: "Ahmed Shaikh", status: "Processed" },
  { eventId: "EVT-1002", timestamp: "09:38:05 AM", module: "RBAC", severity: "Warning", message: "Role modified: fa_user → ops_supervisor for USR-007", user: "Fatima Rizvi", status: "Processed" },
  { eventId: "EVT-1003", timestamp: "09:35:22 AM", module: "Auth", severity: "Error", message: "Failed login attempt — bilal.khan (5th attempt)", user: "Bilal Khan", status: "Flagged" },
  { eventId: "EVT-1004", timestamp: "09:28:40 AM", module: "Master Data", severity: "Info", message: "New airline added: EY — Etihad Airways", user: "Sana Tariq", status: "Processed" },
  { eventId: "EVT-1005", timestamp: "09:20:11 AM", module: "Security", severity: "Critical", message: "Permission escalation blocked: raza.akbar → /admin/settings", user: "Raza Akbar", status: "Escalated" },
  { eventId: "EVT-1006", timestamp: "09:15:55 AM", module: "RBAC", severity: "Info", message: "Permissions updated for role: sys_admin", user: "Ahmed Shaikh", status: "Processed" },
  { eventId: "EVT-1007", timestamp: "09:08:33 AM", module: "Master Data", severity: "Info", message: "Charge type modified: ULD Storage → ULD Storage — Daily", user: "Fatima Rizvi", status: "Processed" },
  { eventId: "EVT-1008", timestamp: "08:55:12 AM", module: "Lifter", severity: "Info", message: "Task TASK-4412 completed by Owais Javed", user: "Owais Javed", status: "Processed" },
  { eventId: "EVT-1009", timestamp: "08:40:29 AM", module: "Planner", severity: "Warning", message: "Slot SLOT-331 reserved — capacity at 87%", user: "Nadia Hassan", status: "Processed" },
  { eventId: "EVT-1010", timestamp: "08:30:15 AM", module: "Master Data", severity: "Info", message: "Bank disabled: Meezan Bank — Corporate", user: "Ahmed Shaikh", status: "Processed" },
  { eventId: "EVT-1011", timestamp: "08:20:00 AM", module: "Integration", severity: "Critical", message: "WhatsApp Provider rate limit exceeded (120 req/min)", user: "SYSTEM", status: "Open" },
  { eventId: "EVT-1012", timestamp: "08:15:00 AM", module: "Backup", severity: "Info", message: "Daily backup completed — 2.4 GB to AWS S3", user: "SYSTEM", status: "Processed" },
];

export default function EventLogContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [activeTab, setActiveTab] = useState<"session" | "event">("session");
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const sessionColumns = [
    { key: "user", header: "User", sortable: true },
    { key: "loginTime", header: "Login Time", sortable: true },
    { key: "logoutTime", header: "Logout Time", sortable: true },
    { key: "ip", header: "IP", sortable: true },
    { key: "device", header: "Device", sortable: true },
    { key: "sessionStatus", header: "Session Status", sortable: true },
  ];

  const sessionStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Active: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
    Terminated: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
    Expired: { bg: "#F1F5F9", text: "#64748B", dot: "#94A3B8" },
  };

  const sessionRows = sessionData.map((s) => {
    const sc = sessionStatusConfig[s.sessionStatus] || sessionStatusConfig.Expired;
    return {
      user: <span className="text-[13px] font-semibold text-[#0F172A]">{s.user}</span>,
      loginTime: <span className="text-[12px] text-[#64748B]">{s.loginTime}</span>,
      logoutTime: <span className="text-[12px] text-[#64748B]">{s.logoutTime}</span>,
      ip: <span className="text-[12px] text-[#64748B] font-mono">{s.ip}</span>,
      device: <span className="text-[12px] text-[#64748B]">{s.device}</span>,
      sessionStatus: (
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: sc.bg, color: sc.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sc.dot }} />
          {s.sessionStatus}
        </span>
      ),
    };
  });

  const eventColumns = [
    { key: "eventId", header: "Event ID", sortable: true },
    { key: "timestamp", header: "Timestamp", sortable: true },
    { key: "module", header: "Module", sortable: true },
    { key: "severity", header: "Severity", sortable: true },
    { key: "message", header: "Message" },
    { key: "user", header: "User", sortable: true },
    { key: "status", header: "Status", sortable: true },
  ];

  const severityConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Info: { bg: "#DBEAFE", text: "#1B4F8B", dot: "#2E75B6" },
    Warning: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
    Error: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
    Critical: { bg: "#FCE7F3", text: "#BE185D", dot: "#BE185D" },
  };

  const eventStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
    Processed: { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A" },
    Flagged: { bg: "#FEF3C7", text: "#D97706", dot: "#D97706" },
    Escalated: { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626" },
    Open: { bg: "#EDE9FE", text: "#7C3AED", dot: "#7C3AED" },
  };

  const eventRows = eventData.map((e) => {
    const sev = severityConfig[e.severity] || severityConfig.Info;
    const est = eventStatusConfig[e.status] || eventStatusConfig.Processed;
    return {
      eventId: <span className="text-[12px] font-mono font-semibold text-[#1B4F8B]">{e.eventId}</span>,
      timestamp: <span className="text-[12px] text-[#64748B] whitespace-nowrap">{e.timestamp}</span>,
      module: <span className="text-[12px] text-[#64748B]">{e.module}</span>,
      severity: (
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: sev.bg, color: sev.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sev.dot }} />
          {e.severity}
        </span>
      ),
      message: <span className="text-[12px] text-[#0F172A] max-w-[300px] truncate block">{e.message}</span>,
      user: <span className="text-[13px] font-semibold text-[#0F172A]">{e.user}</span>,
      status: (
        <span className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ backgroundColor: est.bg, color: est.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: est.dot }} />
          {e.status}
        </span>
      ),
    };
  });

  if (showError) {
    return <ErrorState title="Unable to load logs" message="Session and event log data could not be fetched. Please retry." onRetry={() => { setShowError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1">
        <button
          onClick={() => setActiveTab("session")}
          className="h-10 px-5 rounded-xl text-[13px] font-semibold border cursor-pointer transition-colors whitespace-nowrap"
          style={{
            backgroundColor: activeTab === "session" ? "#0B2545" : "white",
            color: activeTab === "session" ? "white" : "#64748B",
            borderColor: activeTab === "session" ? "#0B2545" : "#E2E8F0",
          }}
        >
          Session Log
          <span className="ml-2 text-[11px] opacity-70">{sessionData.length}</span>
        </button>
        <button
          onClick={() => setActiveTab("event")}
          className="h-10 px-5 rounded-xl text-[13px] font-semibold border cursor-pointer transition-colors whitespace-nowrap"
          style={{
            backgroundColor: activeTab === "event" ? "#0B2545" : "white",
            color: activeTab === "event" ? "white" : "#64748B",
            borderColor: activeTab === "event" ? "#0B2545" : "#E2E8F0",
          }}
        >
          Event Log
          <span className="ml-2 text-[11px] opacity-70">{eventData.length}</span>
        </button>

        <div className="ml-auto">
          <button onClick={() => addToast(`${activeTab === "session" ? "Session" : "Event"} log exported`, "success")} className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton rows={10} columns={activeTab === "session" ? 6 : 7} />
      ) : activeTab === "session" ? (
        <DataTable columns={sessionColumns} rows={sessionRows} sortable headerStyle="navy" />
      ) : (
        <DataTable columns={eventColumns} rows={eventRows} sortable headerStyle="navy" />
      )}
    </div>
  );
}