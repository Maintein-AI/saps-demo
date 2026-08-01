"use client";

import { useState } from "react";
import { Search, History, Receipt } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

interface RentPeriod {
  period: string;
  from: string;
  to: string;
  days: number;
  rate: string;
  surcharge: string;
  computed: number;
  waived: number;
  net: number;
  voucher?: string;
  user?: string;
  remarks?: string;
}

const HISTORY: RentPeriod[] = [
  { period: "Day 1–3 free", from: "12 May 2026", to: "14 May 2026", days: 3, rate: "PKR 0", surcharge: "—", computed: 0, waived: 0, net: 0, remarks: "Free period" },
  { period: "Day 4–7 standard", from: "15 May 2026", to: "18 May 2026", days: 4, rate: "PKR 35/kg/day", surcharge: "0%", computed: 18620, waived: 0, net: 18620, voucher: "GR-2026-04421", user: "S. Khan" },
  { period: "Day 8–14 standard", from: "19 May 2026", to: "23 May 2026", days: 5, rate: "PKR 50/kg/day", surcharge: "0%", computed: 26500, waived: 5300, net: 21200, voucher: "GR-2026-04498", user: "S. Khan", remarks: "Customs hold waiver (20%)" },
  { period: "Day 8–14 + DGR", from: "24 May 2026", to: "25 May 2026", days: 2, rate: "PKR 50/kg/day", surcharge: "15% DGR", computed: 12190, waived: 0, net: 12190, voucher: "GR-2026-04555", user: "I. Ali" },
  { period: "Day 15+ premium", from: "26 May 2026", to: "31 May 2026", days: 6, rate: "PKR 75/kg/day", surcharge: "35%", computed: 50625, waived: 0, net: 50625, voucher: "GR-2026-04612", user: "I. Ali" },
];

export default function GodownRentHistory() {
  const [awb, setAwb] = useState("618-12345678");

  const totals = HISTORY.reduce(
    (acc, p) => ({
      computed: acc.computed + p.computed,
      waived: acc.waived + p.waived,
      net: acc.net + p.net,
      days: acc.days + p.days,
    }),
    { computed: 0, waived: 0, net: 0, days: 0 }
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[
          { label: "CMTS Absorption", href: "/cmts-absorption" },
          { label: "Godown Rent History" },
        ]} />
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-[24px] lg:text-[32px] font-bold text-[#0F172A] leading-[32px] lg:leading-[40px]">
            Godown Rent History
          </h1>
        </div>
        <p className="text-[14px] text-[#64748B] max-w-3xl">
          Period-by-period rent history with every surcharge, waiver, voucher, and operator stamp.
          75-column parity with the CMTS GODOWNRENT / GODOWNRENTHistory tables.
        </p>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={14} color="#94A3B8" className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={awb}
            onChange={(e) => setAwb(e.target.value)}
            placeholder="Search AWB…"
            className="pl-9 pr-3 py-2 rounded-md border border-[#E2E8F0] text-[13px] outline-none focus:ring-2 focus:ring-[#1B4F8B]/30 focus:border-[#1B4F8B] w-64 font-mono"
          />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B]">
          Showing rent history for: <span className="text-[#0B2545] font-mono">{awb}</span>
        </span>
      </div>

      {/* Totals strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">Periods</div>
          <div className="text-[24px] font-bold text-[#0F172A]">{HISTORY.length}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">Total days</div>
          <div className="text-[24px] font-bold text-[#0F172A]">{totals.days}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-[#FFFBEB] p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#D97706] mb-1">Waived</div>
          <div className="text-[24px] font-bold text-[#D97706]">PKR {totals.waived.toLocaleString()}</div>
        </div>
        <div className="rounded-[16px] border border-[#E2E8F0] bg-[#ECFDF5] p-4 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#16A34A] mb-1">Net rent</div>
          <div className="text-[24px] font-bold text-[#16A34A]">PKR {totals.net.toLocaleString()}</div>
        </div>
      </div>

      {/* History table */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E2E8F0] flex items-center gap-2">
          <History size={16} color="#1B4F8B" />
          <h3 className="text-[14px] font-bold text-[#0F172A]">Rent periods</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="bg-[#0B2545] text-white text-left">
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px]">Period</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px]">From</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px]">To</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px] text-center">Days</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px]">Rate</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px]">Surcharge</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px] text-right">Computed</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px] text-right">Waived</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px] text-right">Net</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px]">Voucher</th>
                <th className="px-3 py-3 font-bold text-[10.5px] uppercase tracking-[0.8px]">User</th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((p, i) => (
                <tr key={p.period} className={`border-b border-[#E2E8F0] ${i % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}`}>
                  <td className="px-3 py-2.5">
                    <div className="text-[12.5px] font-semibold text-[#0F172A]">{p.period}</div>
                    {p.remarks && <div className="text-[11px] text-[#64748B] mt-0.5">{p.remarks}</div>}
                  </td>
                  <td className="px-3 py-2.5 text-[#475569]">{p.from}</td>
                  <td className="px-3 py-2.5 text-[#475569]">{p.to}</td>
                  <td className="px-3 py-2.5 text-center font-mono">{p.days}</td>
                  <td className="px-3 py-2.5 font-mono text-[#1F2937]">{p.rate}</td>
                  <td className="px-3 py-2.5 font-mono text-[12px]">{p.surcharge}</td>
                  <td className="px-3 py-2.5 text-right font-mono">{p.computed.toLocaleString()}</td>
                  <td className={`px-3 py-2.5 text-right font-mono ${p.waived > 0 ? "text-[#D97706]" : "text-[#94A3B8]"}`}>{p.waived.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-mono font-bold text-[#0F172A]">{p.net.toLocaleString()}</td>
                  <td className="px-3 py-2.5 font-mono text-[#1B4F8B] text-[11.5px]">{p.voucher || "—"}</td>
                  <td className="px-3 py-2.5 text-[#475569]">{p.user || "—"}</td>
                </tr>
              ))}
              <tr className="bg-[#F1F5F9] border-t-2 border-[#0B2545]">
                <td colSpan={3} className="px-3 py-3 font-bold text-[#0B2545]">TOTALS</td>
                <td className="px-3 py-3 text-center font-mono font-bold text-[#0B2545]">{totals.days}</td>
                <td colSpan={2} />
                <td className="px-3 py-3 text-right font-mono font-bold text-[#0B2545]">PKR {totals.computed.toLocaleString()}</td>
                <td className="px-3 py-3 text-right font-mono font-bold text-[#D97706]">PKR {totals.waived.toLocaleString()}</td>
                <td className="px-3 py-3 text-right font-mono font-bold text-[#16A34A]">PKR {totals.net.toLocaleString()}</td>
                <td colSpan={2} />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
          <Receipt size={18} color="#1B4F8B" />
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-[#0F172A] mb-1">Vouchers in this history</h4>
          <p className="text-[12.5px] text-[#64748B]">4 vouchers issued (GR-2026-04421, 04498, 04555, 04612). All available in Finance → Invoice Generation → linked invoices. PDF previews open from voucher number.</p>
        </div>
      </div>

      <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm">
        <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#64748B] mb-1">CMTS source tables</div>
        <code className="text-[12px] text-[#475569] font-mono">GODOWNRENT · GODOWNRENTHistory · GODOWNRENTDETAIL · grCharges</code>
      </div>
    </div>
  );
}
