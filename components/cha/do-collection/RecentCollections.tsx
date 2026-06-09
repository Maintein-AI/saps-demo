"use client";

import { useToast } from "@/components/ToastContext";
import ScopeBadge from "@/components/ScopeBadge";
import { FileCheck, Eye, Download, ArrowRight } from "lucide-react";

interface RecentCollectionItem {
  id: string;
  collectionDate: string;
  doNo: string;
  awb: string;
  driver: string;
  vehicle: string;
  gatePass: string;
  status: "Completed" | "Returned" | "Pending";
}

const recentItems: RecentCollectionItem[] = [
  {
    id: "RC-001",
    collectionDate: "01 Jun 2026, 10:30",
    doNo: "DO-90905",
    awb: "214-66778844",
    driver: "Ahmed Raza",
    vehicle: "KHI-4582",
    gatePass: "GP-2026-00408",
    status: "Completed",
  },
  {
    id: "RC-002",
    collectionDate: "01 Jun 2026, 09:15",
    doNo: "DO-90906",
    awb: "157-55443399",
    driver: "Imran Ali",
    vehicle: "BJU-7721",
    gatePass: "GP-2026-00409",
    status: "Completed",
  },
  {
    id: "RC-003",
    collectionDate: "31 May 2026, 16:00",
    doNo: "DO-90907",
    awb: "074-99887722",
    driver: "Kashif Khan",
    vehicle: "KHI-9934",
    gatePass: "GP-2026-00410",
    status: "Returned",
  },
  {
    id: "RC-004",
    collectionDate: "31 May 2026, 14:45",
    doNo: "DO-90908",
    awb: "117-44556688",
    driver: "Bilal Ahmed",
    vehicle: "LHE-2217",
    gatePass: "GP-2026-00411",
    status: "Completed",
  },
  {
    id: "RC-005",
    collectionDate: "31 May 2026, 11:30",
    doNo: "DO-90909",
    awb: "214-22334466",
    driver: "Nadeem Hussain",
    vehicle: "KHI-9921",
    gatePass: "GP-2026-00407",
    status: "Completed",
  },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  Completed: { bg: "#DCFCE7", text: "#16A34A" },
  Returned: { bg: "#FEE2E2", text: "#DC2626" },
  Pending: { bg: "#FEF3C7", text: "#D97706" },
};

export default function RecentCollections() {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Recent Collections</h3>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{recentItems.length} records</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Collection Date</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Driver</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Vehicle</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Gate Pass #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {recentItems.map((item) => {
              const sc = statusConfig[item.status];
              return (
                <tr key={item.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.collectionDate}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{item.doNo}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{item.driver}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">{item.vehicle}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.gatePass}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => addToast(`Collection ${item.doNo} details opened.`, "success")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => addToast(`DO ${item.doNo} downloaded.`, "success")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Download DO"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={() => addToast(`AWB ${item.awb} opened.`, "success")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="View AWB"
                      >
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}