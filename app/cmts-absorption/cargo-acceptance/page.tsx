"use client";

import { useState } from "react";
import { ClipboardCheck, Camera, ScanLine, CheckCircle2, AlertTriangle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

type CheckState = "ok" | "fail" | "pending";

interface CheckItem {
  id: string;
  label: string;
  detail: string;
  state: CheckState;
}

export default function CargoAcceptance() {
  const [pieces, setPieces] = useState("24");
  const [weight, setWeight] = useState("1840");
  const [condition, setCondition] = useState("Intact");
  const [seal, setSeal] = useState("Unbroken");

  const [checks, setChecks] = useState<CheckItem[]>([
    { id: "doc", label: "Documents verified", detail: "MAWB · HAWB · NOTOC · NOA", state: "ok" },
    { id: "pieces", label: "Piece count matches manifest", detail: "Manifest 24 · counted 24", state: "ok" },
    { id: "weight", label: "Weight within tolerance", detail: "Manifest 1840 kg · weighed 1840 kg · Δ 0%", state: "ok" },
    { id: "condition", label: "Package condition", detail: "Visible inspection — no damage", state: "ok" },
    { id: "seal", label: "Seal verification", detail: "Seal# SP-238911 · unbroken", state: "ok" },
    { id: "photo", label: "Evidence photos captured", detail: "3 photos · top / side / seal", state: "pending" },
  ]);

  const allOk = checks.every((c) => c.state === "ok");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[
          { label: "CMTS Absorption", href: "/cmts-absorption" },
          { label: "Cargo Acceptance Check-in" },
        ]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Cargo Acceptance Check-in
          </h1>
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Distinct acceptance step before storage allocation. Verifies pieces, weight, condition, seal and documentation
          against the manifest — produces an Acceptance Certificate signed off by the receiving agent.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left — Form */}
        <div className="lg:col-span-3 space-y-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardCheck size={18} color="#1B4F8B" />
              <h3 className="text-[14px] font-bold text-[#0F172A]">Acceptance form</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="AWB Number" value="618-12345678" mono />
              <Field label="HAWB Number" value="HWB-DBS-001" mono />
              <Field label="Flight" value="EK 612 · 12 May 2026" />
              <Field label="Origin" value="DXB" />
              <FieldInput label="Pieces counted" value={pieces} onChange={setPieces} suffix="pcs" required />
              <FieldInput label="Weight measured" value={weight} onChange={setWeight} suffix="kg" required />
              <FieldSelect
                label="Package condition"
                value={condition}
                onChange={setCondition}
                options={["Intact", "Minor damage", "Major damage", "Tampered"]}
                required
              />
              <FieldSelect
                label="Seal status"
                value={seal}
                onChange={setSeal}
                options={["Unbroken", "Broken — seal #", "Missing", "Re-sealed"]}
                required
              />
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white border border-[#0B2545] text-[#0B2545] text-[13px] font-semibold hover:bg-[#F8FAFC] transition-colors">
                <Camera size={14} /> Capture evidence photo
              </button>
              <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white border border-[#0B2545] text-[#0B2545] text-[13px] font-semibold hover:bg-[#F8FAFC] transition-colors">
                <ScanLine size={14} /> Scan seal barcode
              </button>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#0F172A] mb-3">Receiving agent</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Receiver" value="Ahmed Khan" />
              <Field label="Station" value="KHI · AFU" />
              <Field label="Timestamp" value="13 May 2026, 14:22" />
            </div>
          </div>
        </div>

        {/* Right — checklist */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <h3 className="text-[14px] font-bold text-[#0F172A] mb-3">Acceptance checklist</h3>
            <div className="space-y-2.5">
              {checks.map((c) => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 p-3 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer hover:bg-[#F1F5F9] transition-colors"
                  onClick={() =>
                    setChecks((cur) => cur.map((x) => (x.id === c.id ? { ...x, state: x.state === "ok" ? "pending" : "ok" } : x)))
                  }
                >
                  <div className="mt-0.5">
                    {c.state === "ok" ? (
                      <CheckCircle2 size={16} color="#16A34A" />
                    ) : c.state === "fail" ? (
                      <AlertTriangle size={16} color="#DC2626" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-[#94A3B8]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold text-[#0F172A]">{c.label}</div>
                    <div className="text-[11.5px] text-[#64748B] mt-0.5">{c.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={!allOk}
            className={`w-full py-3 rounded-md font-bold text-[14px] transition-colors ${
              allOk
                ? "bg-[#16A34A] text-white hover:bg-[#15803D] cursor-pointer"
                : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
            }`}
          >
            {allOk ? "Accept & Generate Certificate" : `Complete ${checks.filter((c) => c.state !== "ok").length} pending check${checks.filter((c) => c.state !== "ok").length === 1 ? "" : "s"}`}
          </button>

          <button className="w-full py-2.5 rounded-md border border-[#DC2626] text-[#DC2626] font-semibold text-[13px] hover:bg-[#FEF2F2] transition-colors">
            Reject — Open CDR
          </button>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">CMTS source tables</div>
        <code className="text-[12px] text-[#475569] font-mono">CARGOACCEPTANCE · ACCEPTENCEDETAIL · CARGOACCEPTANCEHWB</code>
      </div>
    </div>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] font-bold uppercase tracking-[1px] text-[#94A3B8] mb-1">{label}</div>
      <div className={`text-[13.5px] text-[#0F172A] ${mono ? "font-mono font-semibold" : "font-medium"}`}>{value}</div>
    </div>
  );
}

function FieldInput({ label, value, onChange, suffix, required }: { label: string; value: string; onChange: (v: string) => void; suffix?: string; required?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] font-bold uppercase tracking-[1px] text-[#94A3B8] mb-1">
        {label} {required && <span className="text-[#DC2626]">*</span>}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md border border-[#E2E8F0] text-[13px] font-mono outline-none focus:ring-2 focus:ring-[#1B4F8B]/30 focus:border-[#1B4F8B]"
        />
        {suffix && <span className="text-[11px] font-semibold text-[#64748B] w-8">{suffix}</span>}
      </div>
    </div>
  );
}

function FieldSelect({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] font-bold uppercase tracking-[1px] text-[#94A3B8] mb-1">
        {label} {required && <span className="text-[#DC2626]">*</span>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-[#E2E8F0] text-[13px] outline-none focus:ring-2 focus:ring-[#1B4F8B]/30 focus:border-[#1B4F8B] bg-white"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
