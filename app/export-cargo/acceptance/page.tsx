"use client";

import { useState } from "react";
import { PackageCheck, ScanLine, Camera, ShieldAlert } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

export default function ExportAcceptance() {
  const [bookingRef, setBookingRef] = useState("BKG-EK-784521");
  const [shipper, setShipper] = useState("Pak Textile Mills");
  const [pieces, setPieces] = useState("18");
  const [weight, setWeight] = useState("1240");
  const [cargoClass, setCargoClass] = useState("GCR");
  const [screening, setScreening] = useState("Pending");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[
          { label: "Export Cargo", href: "/export-cargo" },
          { label: "Acceptance" },
        ]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Export Acceptance
          </h1>
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Cargo presented at export counter — booking confirmation, document collection, security screening,
          weighing, classification and storage allocation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Booking & shipper */}
          <Card title="Booking & shipper" icon={<PackageCheck size={18} color="#1B4F8B" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Booking reference" value={bookingRef} onChange={setBookingRef} mono required />
              <Input label="Shipper" value={shipper} onChange={setShipper} required />
              <Input label="Consignee" value="Hyperstar UK Ltd" onChange={() => {}} />
              <Input label="Destination (IATA)" value="LHR" onChange={() => {}} mono required />
              <Input label="Carrier" value="Emirates SkyCargo" onChange={() => {}} />
              <Input label="Flight / Date" value="EK 612 · 31 May 2026" onChange={() => {}} />
            </div>
          </Card>

          {/* Cargo */}
          <Card title="Cargo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Pieces" value={pieces} onChange={setPieces} suffix="pcs" required />
              <Input label="Gross weight" value={weight} onChange={setWeight} suffix="kg" required />
              <Select label="Cargo class" value={cargoClass} onChange={setCargoClass} options={["GCR", "DGR", "PER", "VAL", "HUM", "AOG", "AVI"]} required />
              <Input label="Nature of goods" value="Textile garments" onChange={() => {}} />
            </div>
          </Card>

          {/* Documents */}
          <Card title="Documents collected">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {["Commercial Invoice", "Packing List", "Export GD (PSW)", "Certificate of Origin", "DGR Declaration (if applicable)", "NOTOC (if applicable)"].map((d) => (
                <label key={d} className="flex items-center gap-2 text-[13px] text-[#475569] cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-[#E2E8F0]" />
                  {d}
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          {/* Security screening */}
          <Card title="Security screening" icon={<ShieldAlert size={18} color="#D97706" />}>
            <Select label="Status" value={screening} onChange={setScreening} options={["Pending", "X-ray cleared", "ETD cleared", "Physical cleared", "Held"]} required />
            <div className="grid grid-cols-2 gap-2 mt-3">
              <button className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-[#0B2545] text-[#0B2545] text-[12px] font-semibold">
                <ScanLine size={14} /> X-ray scan
              </button>
              <button className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border border-[#0B2545] text-[#0B2545] text-[12px] font-semibold">
                <Camera size={14} /> Photo
              </button>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-3">RFID handheld for export operations carries the same scope tag.</p>
          </Card>

          {/* Storage allocation */}
          <Card title="Storage allocation">
            <Input label="Suggested zone" value="EXP-A1" onChange={() => {}} mono />
            <Input label="Override (with reason)" value="" onChange={() => {}} />
          </Card>

          <button className="w-full py-3 rounded-md bg-[#16A34A] text-white font-bold text-[14px] hover:bg-[#15803D] transition-colors">
            Accept & Bin
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-[14px] font-bold text-[#0F172A]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, suffix, required, mono }: { label: string; value: string; onChange: (v: string) => void; suffix?: string; required?: boolean; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] font-bold uppercase tracking-[1px] text-[#94A3B8] mb-1">
        {label}{required && <span className="text-[#DC2626]"> *</span>}
      </div>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`flex-1 px-3 py-2 rounded-md border border-[#E2E8F0] text-[13px] ${mono ? "font-mono" : ""} outline-none focus:ring-2 focus:ring-[#1B4F8B]/30 focus:border-[#1B4F8B]`}
        />
        {suffix && <span className="text-[11px] font-semibold text-[#64748B] w-8">{suffix}</span>}
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  return (
    <div>
      <div className="text-[10.5px] font-bold uppercase tracking-[1px] text-[#94A3B8] mb-1">
        {label}{required && <span className="text-[#DC2626]"> *</span>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-[#E2E8F0] text-[13px] outline-none focus:ring-2 focus:ring-[#1B4F8B]/30 focus:border-[#1B4F8B] bg-white"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
