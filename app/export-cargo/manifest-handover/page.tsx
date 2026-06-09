"use client";

import { useState } from "react";
import { Plane, Send, CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";

interface ManifestItem {
  flight: string;
  destination: string;
  pieces: number;
  weight: number;
  uld: number;
  status: "Build-up" | "Manifest sent" | "Handed over";
}

const ITEMS: ManifestItem[] = [
  { flight: "EK 612 / 31 May 18:40", destination: "DXB → LHR", pieces: 248, weight: 12480, uld: 6, status: "Build-up" },
  { flight: "QR 610 / 31 May 21:10", destination: "DOH → JFK", pieces: 192, weight: 9420, uld: 4, status: "Manifest sent" },
  { flight: "EY 632 / 01 Jun 02:30", destination: "AUH → FRA", pieces: 84, weight: 4210, uld: 2, status: "Handed over" },
];

const STATUS_STYLES: Record<ManifestItem["status"], { bg: string; text: string }> = {
  "Build-up": { bg: "#FFFBEB", text: "#D97706" },
  "Manifest sent": { bg: "#EBF0F7", text: "#1B4F8B" },
  "Handed over": { bg: "#ECFDF5", text: "#16A34A" },
};

export default function ManifestHandover() {
  const [selected, setSelected] = useState<string | null>("EK 612 / 31 May 18:40");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[
          { label: "Export Cargo", href: "/export-cargo" },
          { label: "Manifest & Handover" },
        ]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Manifest & Handover
          </h1>
          <ScopeBadge type="exc" />
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Build-up planning, outbound FFM / FWB / FHL messaging and airline handover. Handover marks the software-side
          end of the export lifecycle; ramp / aircraft-side handling remains out of scope (logged only).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-[2.5px] text-[#1B4F8B]">Outbound flights</h3>
          {ITEMS.map((m) => {
            const s = STATUS_STYLES[m.status];
            const sel = selected === m.flight;
            return (
              <button
                key={m.flight}
                onClick={() => setSelected(m.flight)}
                className={`w-full text-left rounded-[16px] border bg-white p-5 shadow-sm transition-all ${
                  sel ? "border-[#0B2545] ring-2 ring-[#0B2545]/10" : "border-[#E2E8F0] hover:border-[#1B4F8B]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                    <Plane size={20} color="#0B2545" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-bold text-[#0F172A] mb-0.5">{m.flight}</div>
                    <div className="text-[12px] text-[#64748B] mb-2">{m.destination}</div>
                    <div className="flex flex-wrap items-center gap-4 text-[12.5px] text-[#475569]">
                      <span><b>{m.pieces}</b> pieces</span>
                      <span><b>{m.weight.toLocaleString()}</b> kg</span>
                      <span><b>{m.uld}</b> ULDs</span>
                    </div>
                  </div>
                  <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: s.bg, color: s.text }}>
                    {m.status}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="space-y-5">
          {/* Messages */}
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#0F172A] mb-3">Outbound messages</h3>
            <div className="space-y-2">
              <MessageRow code="FFM" label="Flight Manifest" sent />
              <MessageRow code="FWB" label="Master AWB Data" sent />
              <MessageRow code="FHL" label="House Manifest" />
              <MessageRow code="NOTOC" label="Captain Notification (if DGR)" />
            </div>
            <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-md bg-[#0B2545] text-white text-[13px] font-semibold hover:bg-[#1B4F8B] transition-colors">
              <Send size={14} /> Send selected messages
            </button>
          </div>

          {/* Handover confirmation */}
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#0F172A] mb-3">Airline handover</h3>
            <div className="space-y-2">
              <Step label="Build-up complete" done />
              <Step label="Manifest sent (FFM)" done />
              <Step label="ULDs handed to ramp" />
              <Step label="Airline acceptance signed" />
            </div>
            <button className="mt-4 w-full py-2.5 rounded-md bg-[#16A34A] text-white text-[13px] font-bold hover:bg-[#15803D] transition-colors">
              Mark handover complete
            </button>
            <p className="text-[10.5px] text-[#94A3B8] mt-3 text-center">
              Ramp / aircraft-side handling is out of software scope. Logged only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageRow({ code, label, sent }: { code: string; label: string; sent?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-3 py-2">
      <div className="flex items-center gap-2">
        <input type="checkbox" defaultChecked={!sent} className="rounded border-[#E2E8F0]" />
        <code className="text-[11.5px] font-mono font-bold text-[#1B4F8B]">{code}</code>
        <span className="text-[12px] text-[#475569]">{label}</span>
      </div>
      {sent && (
        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#16A34A]">
          <CheckCircle2 size={11} /> sent
        </span>
      )}
    </div>
  );
}

function Step({ label, done }: { label: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      {done ? (
        <CheckCircle2 size={16} color="#16A34A" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-[#94A3B8]" />
      )}
      <span className={`text-[12.5px] ${done ? "text-[#0F172A] font-semibold" : "text-[#64748B]"}`}>{label}</span>
    </div>
  );
}
