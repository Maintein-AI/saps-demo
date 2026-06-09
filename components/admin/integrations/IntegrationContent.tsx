"use client";

import { useState, useEffect } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorState from "@/components/ErrorState";
import { useToast } from "@/components/ToastContext";
import { CheckCircle, AlertTriangle, XCircle, ExternalLink, RefreshCw, Settings, FileText, Plug, Wifi, WifiOff } from "lucide-react";

interface IntegrationCardData {
  name: string;
  provider: string;
  environment: string;
  endpoint: string;
  status: "online" | "degraded" | "offline";
  lastSync: string;
  lastError: string;
  scope: "inc" | "exc";
  configFields?: { label: string; value: string }[];
}

const integrationCards: IntegrationCardData[] = [
  {
    name: "PSW / WeBOC Connector",
    provider: "Pakistan Single Window",
    environment: "Production",
    endpoint: "https://api.psw.gov.pk/v2",
    status: "online",
    lastSync: "09:40 AM",
    lastError: "—",
    scope: "inc",
  },
  {
    name: "Airline Messaging FFM/FWB/FHL/FSU",
    provider: "SITA Type-B Gateway",
    environment: "Production",
    endpoint: "smtp://msg.sita.aero:25",
    status: "online",
    lastSync: "09:38 AM",
    lastError: "—",
    scope: "inc",
  },
  {
    name: "SMS Provider",
    provider: "Twilio",
    environment: "Production",
    endpoint: "https://api.twilio.com",
    status: "online",
    lastSync: "09:35 AM",
    lastError: "—",
    scope: "inc",
  },
  {
    name: "Email Provider",
    provider: "SendGrid",
    environment: "Production",
    endpoint: "https://api.sendgrid.com/v3",
    status: "online",
    lastSync: "09:30 AM",
    lastError: "—",
    scope: "inc",
  },
  {
    name: "WhatsApp Provider",
    provider: "Meta Business API",
    environment: "Production",
    endpoint: "https://graph.facebook.com/v18.0",
    status: "degraded",
    lastSync: "09:15 AM",
    lastError: "Rate limit exceeded — 120 req/min threshold breached",
    scope: "inc",
  },
  {
    name: "Backup / Restore / Replication",
    provider: "AWS S3 + RDS Read Replica",
    environment: "Production",
    endpoint: "s3://airvault-backups-prod",
    status: "online",
    lastSync: "08:00 AM",
    lastError: "—",
    scope: "inc",
  },
  {
    name: "ERP Push SAP / Oracle",
    provider: "SAP S/4HANA Cloud",
    environment: "Staging",
    endpoint: "https://sap-s4hana.airvault.internal/odata",
    status: "online",
    lastSync: "09:25 AM",
    lastError: "—",
    scope: "exc",
  },
  {
    name: "Payment Gateway",
    provider: "1LINK / HBL",
    environment: "Production",
    endpoint: "https://pay.1link.pk/api/v3",
    status: "online",
    lastSync: "09:20 AM",
    lastError: "—",
    scope: "exc",
  },
];

const statusIcon = (status: string) => {
  if (status === "online") return <CheckCircle size={16} className="text-[#16A34A]" />;
  if (status === "degraded") return <AlertTriangle size={16} className="text-[#D97706]" />;
  return <XCircle size={16} className="text-[#DC2626]" />;
};

const statusLabel = (status: string) => {
  if (status === "online") return { bg: "#DCFCE7", text: "#16A34A", dot: "#16A34A", label: "Connected" };
  if (status === "degraded") return { bg: "#FEF3C7", text: "#D97706", dot: "#D97706", label: "Degraded" };
  return { bg: "#FEE2E2", text: "#DC2626", dot: "#DC2626", label: "Disconnected" };
};

export default function IntegrationContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [configDrawerOpen, setConfigDrawerOpen] = useState(false);
  const [configCard, setConfigCard] = useState<IntegrationCardData | null>(null);
  const [pgConfig, setPgConfig] = useState({
    provider: "HBL",
    apiKey: "••••••••••••••••••••••••••",
    apiSecret: "••••••••••••••••••••••••••",
    webhookUrl: "https://airvault.com/api/webhooks/payment",
    liveMode: true,
    settlementBank: "HBL — Shaheen Complex Branch",
    convenienceFee: "2.5",
    passThrough: true,
  });
  const { addToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTestConnection = (card: IntegrationCardData) => {
    addToast(`Testing ${card.name}...`, "success");
    setTimeout(() => {
      if (card.status === "online") addToast(`${card.name} — Connection successful`, "success");
      else addToast(`${card.name} — Connection failed`, "error");
    }, 1500);
  };

  const handleViewLogs = (card: IntegrationCardData) => {
    addToast(`Opening logs for ${card.name}`, "success");
  };

  const handleConfigure = (card: IntegrationCardData) => {
    setConfigCard(card);
    setConfigDrawerOpen(true);
  };

  const pgProviders = ["HBL", "Meezan", "NIFT", "Easypaisa", "JazzCash", "1LINK"];

  if (showError) {
    return (
      <ErrorState title="Unable to load integration data" message="Integration console could not be loaded. Please retry." onRetry={() => { setShowError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }} />
    );
  }

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <div className="h-4 w-40 bg-[#F1F5F9] rounded animate-pulse mb-3" />
              <div className="h-3 w-60 bg-[#F1F5F9] rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-[#F1F5F9] rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {integrationCards.map((card) => {
            const sl = statusLabel(card.status);
            return (
              <div key={card.name} className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: sl.bg }}>
                      {statusIcon(card.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-bold text-[#0F172A]">{card.name}</h3>
                        <ScopeBadge type={card.scope} />
                      </div>
                      <p className="text-[11px] text-[#94A3B8]">{card.provider} · {card.environment}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[10px] font-bold whitespace-nowrap" style={{ backgroundColor: sl.bg, color: sl.text }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sl.dot }} />
                    {sl.label}
                  </span>
                </div>

                <div className="space-y-1.5 mb-4 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Endpoint</span>
                    <span className="font-medium text-[#64748B] truncate max-w-[200px]">{card.endpoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Last Sync</span>
                    <span className="font-medium text-[#64748B]">{card.lastSync}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Last Error</span>
                    <span className="font-medium" style={{ color: card.lastError === "—" ? "#64748B" : "#DC2626" }}>{card.lastError}</span>
                  </div>
                </div>

                {card.name === "Payment Gateway" && (
                  <div className="mb-4 p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Configuration</span>
                      <ScopeBadge type="exc" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      <div><span className="text-[#94A3B8]">Provider:</span> <span className="font-medium text-[#0F172A]">{pgConfig.provider}</span></div>
                      <div><span className="text-[#94A3B8]">Live Mode:</span> <span className="font-medium text-[#16A34A]">Yes</span></div>
                      <div><span className="text-[#94A3B8]">Settlement Bank:</span> <span className="font-medium text-[#0F172A]">{pgConfig.settlementBank}</span></div>
                      <div><span className="text-[#94A3B8]">Conv. Fee:</span> <span className="font-medium text-[#0F172A]">{pgConfig.convenienceFee}%</span></div>
                      <div className="col-span-2"><span className="text-[#94A3B8]">Pass-through:</span> <span className="font-medium text-[#16A34A]">Enabled</span></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button onClick={() => handleTestConnection(card)} className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-semibold text-[#16A34A] border border-[#16A34A]/30 bg-white hover:bg-[#DCFCE7] cursor-pointer transition-colors whitespace-nowrap">
                    <Plug size={12} /> Test Connection
                  </button>
                  <button onClick={() => handleViewLogs(card)} className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] cursor-pointer transition-colors whitespace-nowrap">
                    <FileText size={12} /> View Logs
                  </button>
                  <button onClick={() => handleConfigure(card)} className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11px] font-semibold text-[#1B4F8B] border border-[#1B4F8B]/30 bg-white hover:bg-[#DBEAFE] cursor-pointer transition-colors whitespace-nowrap">
                    <Settings size={12} /> Configure
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {configDrawerOpen && configCard && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50" onClick={() => setConfigDrawerOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[560px] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 h-[56px] border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-[#0F172A]">Configure: {configCard.name}</h3>
                <ScopeBadge type={configCard.scope} />
              </div>
              <button onClick={() => setConfigDrawerOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer">×</button>
            </div>
            <div className="p-6 space-y-4">
              {configCard.name === "Payment Gateway" ? (
                <>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Provider</label>
                    <div className="flex flex-wrap gap-1.5">
                      {pgProviders.map((p) => (
                        <button
                          key={p}
                          onClick={() => setPgConfig((prev) => ({ ...prev, provider: p }))}
                          className="h-8 px-3 rounded-lg text-[12px] font-semibold border cursor-pointer transition-colors whitespace-nowrap"
                          style={{
                            backgroundColor: pgConfig.provider === p ? "#0B2545" : "white",
                            color: pgConfig.provider === p ? "white" : "#64748B",
                            borderColor: pgConfig.provider === p ? "#0B2545" : "#E2E8F0",
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">API Key</label>
                    <input type="text" value={pgConfig.apiKey} onChange={(e) => setPgConfig((prev) => ({ ...prev, apiKey: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">API Secret</label>
                    <input type="password" value={pgConfig.apiSecret} onChange={(e) => setPgConfig((prev) => ({ ...prev, apiSecret: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Webhook URL</label>
                    <input type="text" value={pgConfig.webhookUrl} onChange={(e) => setPgConfig((prev) => ({ ...prev, webhookUrl: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={pgConfig.liveMode} onChange={(e) => setPgConfig((prev) => ({ ...prev, liveMode: e.target.checked }))} className="w-4 h-4 rounded accent-[#0B2545]" />
                      <span className="text-[13px] text-[#0F172A]">Live Mode</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={pgConfig.passThrough} onChange={(e) => setPgConfig((prev) => ({ ...prev, passThrough: e.target.checked }))} className="w-4 h-4 rounded accent-[#0B2545]" />
                      <span className="text-[13px] text-[#0F172A]">Pass-through to Payer</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Settlement Bank</label>
                    <input type="text" value={pgConfig.settlementBank} onChange={(e) => setPgConfig((prev) => ({ ...prev, settlementBank: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Convenience Fee (%)</label>
                    <input type="text" value={pgConfig.convenienceFee} onChange={(e) => setPgConfig((prev) => ({ ...prev, convenienceFee: e.target.value }))} className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors" />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Endpoint URL</label>
                    <input type="text" defaultValue={configCard.endpoint} className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">API Key</label>
                    <input type="password" defaultValue="••••••••••••••••••••" className="w-full h-10 px-3 rounded-xl border border-[#E2E8F0] bg-white text-[13px] outline-none focus:border-[#1B4F8B] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Environment</label>
                    <div className="flex gap-2">
                      {["Production", "Staging", "Development"].map((env) => (
                        <button key={env} className="h-9 px-4 rounded-xl text-[13px] font-medium border cursor-pointer transition-colors whitespace-nowrap" style={{ backgroundColor: configCard.environment === env ? "#0B2545" : "white", color: configCard.environment === env ? "white" : "#64748B", borderColor: configCard.environment === env ? "#0B2545" : "#E2E8F0" }}>
                          {env}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 justify-end px-6 py-4 border-t border-[#E2E8F0]">
              <button onClick={() => setConfigDrawerOpen(false)} className="h-9 px-4 rounded-xl text-[13px] font-semibold text-[#64748B] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">Cancel</button>
              <button onClick={() => { addToast("Configuration saved", "success"); setConfigDrawerOpen(false); }} className="h-9 px-5 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>Save Configuration</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}