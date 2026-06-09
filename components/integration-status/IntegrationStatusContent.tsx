"use client";

import { useState } from "react";
import ScopeBadge from "../ScopeBadge";
import LoadingSkeleton from "../LoadingSkeleton";
import EmptyState from "../EmptyState";
import ErrorState from "../ErrorState";
import { useToast } from "../ToastContext";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  ExternalLink,
  Check,
  AlertTriangle,
  Clock,
} from "lucide-react";

const integrations = [
  {
    id: "psw",
    name: "PSW / WeBOC Connector",
    scope: "inc",
    environment: "Production",
    status: "Connected",
    lastSync: "2026-06-08 09:15",
    lastError: "",
    endpoint: "https://psw.fbr.gov.pk/api/v2",
  },
  {
    id: "airline-msg",
    name: "Airline Messaging FFM/FWB/FHL/FSU",
    scope: "inc",
    environment: "Production",
    status: "Connected",
    lastSync: "2026-06-08 09:10",
    lastError: "",
    endpoint: "SITA Type-B / MQ",
  },
  {
    id: "sms",
    name: "SMS Provider",
    scope: "inc",
    environment: "Production",
    status: "Connected",
    lastSync: "2026-06-08 09:14",
    lastError: "",
    endpoint: "Jazz Enterprise SMS Gateway",
  },
  {
    id: "email",
    name: "Email Provider",
    scope: "inc",
    environment: "Production",
    status: "Connected",
    lastSync: "2026-06-08 09:13",
    lastError: "",
    endpoint: "SendGrid API v3",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Provider",
    scope: "inc",
    environment: "Production",
    status: "Connected",
    lastSync: "2026-06-08 09:12",
    lastError: "",
    endpoint: "Twilio WhatsApp Business API",
  },
  {
    id: "backup",
    name: "Backup / Restore / Replication",
    scope: "inc",
    environment: "Production",
    status: "Connected",
    lastSync: "2026-06-08 06:00",
    lastError: "",
    endpoint: "Automated S3 + WAL Streaming",
  },
  {
    id: "payment",
    name: "Payment Gateway",
    scope: "exc",
    environment: "Staging",
    status: "Degraded",
    lastSync: "2026-06-08 08:30",
    lastError: "Timeout on settlement check (2026-06-08 08:30)",
    endpoint: "HBL / NIFT / 1LINK",
  },
  {
    id: "erp",
    name: "ERP Push SAP / Oracle",
    scope: "exc",
    environment: "Staging",
    status: "Disconnected",
    lastSync: "2026-06-07 18:00",
    lastError: "Connection refused — ERP endpoint unreachable",
    endpoint: "SAP PI/PO — awaiting VPN config",
  },
];

export default function IntegrationStatusContent() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleTestConnection = (name: string) => {
    addToast(`Testing connection for ${name}...`, "success");
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast("Integration statuses refreshed", "success");
    }, 1500);
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
        >
          <RefreshCw size={13} />
          Refresh All
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton rows={8} columns={6} />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B2545" }}>
              <tr>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Integration</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Scope</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Environment</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Status</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Last Sync</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Last Error</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Endpoint</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((int, i) => (
                <tr
                  key={int.id}
                  className="border-b border-[#E2E8F0] transition-colors hover:bg-[#F1F5F9]"
                  style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "white" }}
                >
                  <td className="px-4 py-3 text-[13px] font-semibold text-[#0F172A]">{int.name}</td>
                  <td className="px-4 py-3">
                    <ScopeBadge type={int.scope as "inc" | "exc"} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-bold ${
                      int.environment === "Production" ? "bg-[#DBEAFE] text-[#1B4F8B]" : "bg-[#FEF3C7] text-[#D97706]"
                    }`}>
                      {int.environment}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-bold ${
                      int.status === "Connected"
                        ? "bg-[#DCFCE7] text-[#16A34A]"
                        : int.status === "Degraded"
                        ? "bg-[#FEF3C7] text-[#D97706]"
                        : "bg-[#FEE2E2] text-[#DC2626]"
                    }`}>
                      {int.status === "Connected" ? <Wifi size={10} /> :
                       int.status === "Degraded" ? <AlertTriangle size={10} /> :
                       <WifiOff size={10} />}
                      {int.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{int.lastSync}</td>
                  <td className="px-4 py-3 text-[12px] text-[#DC2626] max-w-[250px] truncate">
                    {int.lastError || "—"}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-[#64748B] max-w-[200px] truncate">{int.endpoint}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTestConnection(int.name)}
                        className="h-7 px-2.5 rounded-lg text-[11px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                        style={{ backgroundColor: "#0B2545" }}
                      >
                        Test
                      </button>
                      <button className="h-7 w-7 flex items-center justify-center rounded-lg text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer">
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="text-[12px] font-semibold text-[#0F172A]">Connected</span>
          </div>
          <span className="text-[24px] font-bold text-[#0F172A]">
            {integrations.filter((i) => i.status === "Connected").length}
          </span>
          <p className="text-[11px] text-[#64748B] mt-0.5">healthy integrations</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#D97706]" />
            <span className="text-[12px] font-semibold text-[#0F172A]">Degraded</span>
          </div>
          <span className="text-[24px] font-bold text-[#0F172A]">
            {integrations.filter((i) => i.status === "Degraded").length}
          </span>
          <p className="text-[11px] text-[#64748B] mt-0.5">needs attention</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
            <span className="text-[12px] font-semibold text-[#0F172A]">Disconnected</span>
          </div>
          <span className="text-[24px] font-bold text-[#0F172A]">
            {integrations.filter((i) => i.status === "Disconnected").length}
          </span>
          <p className="text-[11px] text-[#64748B] mt-0.5">requires action</p>
        </div>
      </div>
    </div>
  );
}