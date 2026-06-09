"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import { ConfigEntry } from "@/components/finance-manager/payment-gateway-reconciliation/types";

export default function ConfigCard() {
  const [config, setConfig] = useState<ConfigEntry>({
    provider: "HBL",
    apiKey: "hbl_live_***...",
    apiSecret: "hbl_live_sec_***...",
    webhookUrl: "https://api.airvault.pk/webhook/hbl",
    liveMode: true,
    settlementBank: "HBL Main Branch",
    convenienceFee: 2.5,
    passThrough: true,
  });

  const providers = ["HBL", "Meezan", "NIFT", "Easypaisa", "JazzCash", "1LINK"];
  const settlements = ["HBL Main Branch", "Meezan Bank Ltd", "NIFT Settlement", "JazzCash Settlement", "Easypaisa Settlement", "1LINK Settlement"];

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-[16px] font-semibold text-[#0F172A]">Gateway Configuration</h2>
        <ScopeBadge type="exc" />
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Provider</label>
          <select
            value={config.provider}
            onChange={(e) => setConfig({ ...config, provider: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {providers.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">API Key</label>
          <input
            type="text"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">API Secret</label>
          <input
            type="text"
            value={config.apiSecret}
            onChange={(e) => setConfig({ ...config, apiSecret: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Webhook URL</label>
          <input
            type="text"
            value={config.webhookUrl}
            onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="liveMode"
            checked={config.liveMode}
            onChange={(e) => setConfig({ ...config, liveMode: e.target.checked })}
            className="w-4 h-4 rounded border-[#E2E8F0] cursor-pointer accent-[#0B2545]"
          />
          <label htmlFor="liveMode" className="text-[12px] font-medium text-[#64748B] cursor-pointer">Live Mode</label>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Settlement Bank</label>
          <select
            value={config.settlementBank}
            onChange={(e) => setConfig({ ...config, settlementBank: e.target.value })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] pr-8 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50 appearance-none cursor-pointer"
            style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "12px" }}
          >
            {settlements.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium text-[#64748B] mb-1 block">Convenience Fee %</label>
          <input
            type="number"
            step="0.1"
            value={config.convenienceFee}
            onChange={(e) => setConfig({ ...config, convenienceFee: Number(e.target.value) })}
            className="w-full h-9 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[13px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 focus:border-[#14B8A6]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="passThrough"
            checked={config.passThrough}
            onChange={(e) => setConfig({ ...config, passThrough: e.target.checked })}
            className="w-4 h-4 rounded border-[#E2E8F0] cursor-pointer accent-[#0B2545]"
          />
          <label htmlFor="passThrough" className="text-[12px] font-medium text-[#64748B] cursor-pointer">Pass-through to payer</label>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <button className="h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
            Save Config
          </button>
          <button className="h-9 px-3 rounded-xl border border-[#E2E8F0] text-[13px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap">
            Test Webhook
          </button>
        </div>
      </div>
    </div>
  );
}