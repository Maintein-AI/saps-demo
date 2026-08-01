"use client";

import { useState } from "react";
import { ERPTargetConfig } from "@/components/finance-manager/erp-bridge-mapping/types";

export default function ERPTargetCard() {
  const [config, setConfig] = useState<ERPTargetConfig>({
    erpTarget: "SAP",
    connectionName: "SAP-Production-01",
    environment: "Production",
    apiEndpoint: "https://api.sap.erp.internal/journal",
    authType: "OAuth",
    lastSync: "04 Jun 2026 09:30",
    syncStatus: "Active",
    errorMessage: "",
  });

  const erpTargets = ["SAP", "Oracle", "None"];
  const envs = ["Production", "Staging", "Sandbox", "Development"];
  const authTypes = ["API Key", "OAuth", "Basic Auth", "Certificate"];

  const statusMap: Record<string, { color: string; bg: string }> = {
    "Active": { color: "#10B981", bg: "#D1FAE5" },
    "Inactive": { color: "#64748B", bg: "#F8FAFC" },
    "Error": { color: "#EF4444", bg: "#FEE2E2" },
  };
  const statusStyle = statusMap[config.syncStatus] || statusMap["Inactive"];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">ERP Target Configuration</h2>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">ERP Target</label>
          <select
            value={config.erpTarget}
            onChange={(e) => setConfig({ ...config, erpTarget: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {erpTargets.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Connection Name</label>
          <input
            type="text"
            value={config.connectionName}
            onChange={(e) => setConfig({ ...config, connectionName: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Environment</label>
          <select
            value={config.environment}
            onChange={(e) => setConfig({ ...config, environment: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {envs.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">API Endpoint</label>
          <input
            type="text"
            value={config.apiEndpoint}
            onChange={(e) => setConfig({ ...config, apiEndpoint: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Authentication Type</label>
          <select
            value={config.authType}
            onChange={(e) => setConfig({ ...config, authType: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {authTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Last Sync</label>
          <input
            type="text"
            value={config.lastSync}
            readOnly
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#64748B]"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Sync Status</label>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ color: statusStyle.color, backgroundColor: statusStyle.bg }}>
              {config.syncStatus}
            </span>
          </div>
        </div>
        {config.errorMessage && (
          <div>
            <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Error Message</label>
            <div className="rounded-[12px] border border-[#EF4444]/20 bg-[#FEE2E2]/50 p-3 text-[12px] text-[#EF4444]">
              {config.errorMessage}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 pt-2">
          <button className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            Save Config
          </button>
          <button className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
            Test Connection
          </button>
        </div>
      </div>
    </div>
  );
}