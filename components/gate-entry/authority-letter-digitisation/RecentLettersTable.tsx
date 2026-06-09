"use client";

import { useState } from "react";
import { FileText, Eye, Download, Link2, X, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";

interface AuthorityLetter {
  id: string;
  uploadedAt: string;
  issuer: string;
  awb: string;
  do: string;
  driver: string;
  vehicle: string;
  validUntil: string;
  ocrConfidence: number;
  status: "Linked" | "Pending" | "Rejected" | "Expired";
}

const MOCK_LETTERS: AuthorityLetter[] = [
  {
    id: "AL-2026-001",
    uploadedAt: "2026-05-31 09:14",
    issuer: "DB Schenker Pakistan",
    awb: "157-44891233",
    do: "DO-2026-8891",
    driver: "Ahmed Khan",
    vehicle: "LHR-2847",
    validUntil: "2026-06-28",
    ocrConfidence: 94,
    status: "Linked",
  },
  {
    id: "AL-2026-002",
    uploadedAt: "2026-05-31 08:42",
    issuer: "Gerry's International",
    awb: "157-33219876",
    do: "DO-2026-4452",
    driver: "Muhammad Ali",
    vehicle: "KHI-9912",
    validUntil: "2026-06-15",
    ocrConfidence: 88,
    status: "Pending",
  },
  {
    id: "AL-2026-003",
    uploadedAt: "2026-05-30 16:20",
    issuer: "DHL Global Forwarding",
    awb: "157-77823456",
    do: "DO-2026-7782",
    driver: "Tariq Mehmood",
    vehicle: "ISB-3345",
    validUntil: "2026-05-25",
    ocrConfidence: 91,
    status: "Expired",
  },
  {
    id: "AL-2026-004",
    uploadedAt: "2026-05-30 11:05",
    issuer: "Agility Logistics",
    awb: "157-11223344",
    do: "DO-2026-1122",
    driver: "Sajid Hussain",
    vehicle: "LHR-7781",
    validUntil: "2026-07-10",
    ocrConfidence: 76,
    status: "Rejected",
  },
  {
    id: "AL-2026-005",
    uploadedAt: "2026-05-29 14:33",
    issuer: "Kerry Logistics",
    awb: "157-55667788",
    do: "DO-2026-5566",
    driver: "Imran Ahmed",
    vehicle: "KHI-5543",
    validUntil: "2026-07-05",
    ocrConfidence: 96,
    status: "Linked",
  },
  {
    id: "AL-2026-006",
    uploadedAt: "2026-05-29 10:18",
    issuer: "DB Schenker Pakistan",
    awb: "157-99887766",
    do: "DO-2026-9988",
    driver: "Naveed Khan",
    vehicle: "LHR-9900",
    validUntil: "2026-06-20",
    ocrConfidence: 83,
    status: "Pending",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Linked: { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Pending: { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Rejected: { bg: "#FEE2E2", text: "#DC2626", icon: <X size={12} /> },
  Expired: { bg: "#F1F5F9", text: "#64748B", icon: <AlertTriangle size={12} /> },
};

interface RecentLettersTableProps {
  loading?: boolean;
}

export default function RecentLettersTable({ loading }: RecentLettersTableProps) {
  const { addToast } = useToast();
  const [letters, setLetters] = useState<AuthorityLetter[]>(MOCK_LETTERS);

  const handleLink = (id: string) => {
    addToast(`Authority letter ${id} linked to vehicle entry`, "success");
  };

  const handleView = (id: string) => {
    addToast(`Opening detail view for ${id}`, "success");
  };

  const handleDownload = (id: string) => {
    addToast(`Downloading record for ${id}`, "success");
  };

  if (loading) {
    return (
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold text-[#0F172A]">Recent Authority Letters</h3>
          <ScopeBadge type="exc" />
        </div>
        <LoadingSkeleton rows={5} columns={6} />
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[14px] font-bold text-[#0F172A]">Recent Authority Letters</h3>
          <ScopeBadge type="exc" />
        </div>
        <EmptyState
          title="No authority letters"
          description="Upload an authority letter to begin digitisation."
        />
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-bold text-[#0F172A]">Recent Authority Letters</h3>
        <ScopeBadge type="exc" />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                Uploaded At
              </th>
              <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                Issuer
              </th>
              <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                AWB #
              </th>
              <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                DO #
              </th>
              <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                Driver
              </th>
              <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                Vehicle
              </th>
              <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                Valid Until
              </th>
              <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                OCR
              </th>
              <th className="text-left text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                Status
              </th>
              <th className="text-right text-[11px] font-bold text-[#64748B] uppercase tracking-wider py-3 px-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {letters.map((letter) => {
              const s = statusConfig[letter.status];
              const ocrColor =
                letter.ocrConfidence >= 90
                  ? "#16A34A"
                  : letter.ocrConfidence >= 75
                  ? "#D97706"
                  : "#DC2626";

              return (
                <tr
                  key={letter.id}
                  className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">
                    {letter.uploadedAt}
                  </td>
                  <td className="py-3 px-3 text-[13px] font-medium text-[#0F172A]">
                    {letter.issuer}
                  </td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#0F172A]">
                    {letter.awb}
                  </td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#0F172A]">
                    {letter.do}
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">
                    {letter.driver}
                  </td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#64748B]">
                    {letter.vehicle}
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B] whitespace-nowrap">
                    {letter.validUntil}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="h-5 px-2 rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: ocrColor + "15", color: ocrColor }}
                    >
                      {letter.ocrConfidence}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: s.bg, color: s.text }}
                    >
                      {s.icon}
                      {letter.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleView(letter.id)}
                        className="w-7 h-7 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] cursor-pointer"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDownload(letter.id)}
                        className="w-7 h-7 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] cursor-pointer"
                        title="Download"
                      >
                        <Download size={14} />
                      </button>
                      {letter.status === "Pending" && (
                        <button
                          onClick={() => handleLink(letter.id)}
                          className="w-7 h-7 rounded-lg hover:bg-[#EBF0F7] flex items-center justify-center text-[#0B2545] cursor-pointer"
                          title="Link to Vehicle Entry"
                        >
                          <Link2 size={14} />
                        </button>
                      )}
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