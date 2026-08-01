import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Shield,
  Ban,
  PackageCheck,
  ArrowRight,
  Eye,
} from "lucide-react";
import { useToast } from "@/components/ToastContext";

interface GDRecord {
  id: string;
  gdNumber: string;
  awb: string;
  channel: "Green" | "Yellow" | "Red";
  consignee: string;
  declaredValue: string;
  filedAt: string;
  status: "Draft" | "Submitted" | "Under Review" | "Query" | "Exam Scheduled" | "OOC Issued" | "Rejected";
}

const records: GDRecord[] = [
  {
    id: "GD-001",
    gdNumber: "GD-KHI-2026-00091",
    awb: "214-77890123",
    channel: "Green",
    consignee: "Al Noor Traders",
    declaredValue: "Rs 2,500,000",
    filedAt: "01 Jun 2026, 09:15",
    status: "OOC Issued",
  },
  {
    id: "GD-002",
    gdNumber: "GD-KHI-2026-00089",
    awb: "157-66778899",
    channel: "Yellow",
    consignee: "Pakistan Textile Mills",
    declaredValue: "Rs 1,800,000",
    filedAt: "31 May 2026, 14:30",
    status: "Query",
  },
  {
    id: "GD-003",
    gdNumber: "GD-KHI-2026-00087",
    awb: "074-55443322",
    channel: "Red",
    consignee: "Indus Pharma",
    declaredValue: "Rs 3,200,000",
    filedAt: "31 May 2026, 10:00",
    status: "Exam Scheduled",
  },
  {
    id: "GD-004",
    gdNumber: "GD-KHI-2026-00085",
    awb: "117-99887766",
    channel: "Green",
    consignee: "Fauji Fertilizer",
    declaredValue: "Rs 950,000",
    filedAt: "30 May 2026, 16:45",
    status: "Submitted",
  },
  {
    id: "GD-005",
    gdNumber: "GD-KHI-2026-00083",
    awb: "214-11223344",
    channel: "Yellow",
    consignee: "Engro Corporation",
    declaredValue: "Rs 4,100,000",
    filedAt: "30 May 2026, 08:20",
    status: "Under Review",
  },
  {
    id: "GD-006",
    gdNumber: "GD-KHI-2026-00081",
    awb: "074-44556677",
    channel: "Red",
    consignee: "Gerry's Dnata",
    declaredValue: "Rs 1,450,000",
    filedAt: "29 May 2026, 11:10",
    status: "Rejected",
  },
  {
    id: "GD-007",
    gdNumber: "GD-KHI-2026-00079",
    awb: "157-22334455",
    channel: "Green",
    consignee: "DB Schenker Pakistan",
    declaredValue: "Rs 2,100,000",
    filedAt: "29 May 2026, 09:00",
    status: "OOC Issued",
  },
  {
    id: "GD-008",
    gdNumber: "GD-KHI-2026-00077",
    awb: "117-55667788",
    channel: "Yellow",
    consignee: "Kuehne+Nagel KHI",
    declaredValue: "Rs 875,000",
    filedAt: "28 May 2026, 15:30",
    status: "Draft",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Draft: { bg: "#F1F5F9", text: "#64748B", icon: <Clock size={12} /> },
  Submitted: { bg: "#DBEAFE", text: "#1D4ED8", icon: <FileText size={12} /> },
  "Under Review": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Query: { bg: "#FEF3C7", text: "#D97706", icon: <AlertTriangle size={12} /> },
  "Exam Scheduled": { bg: "#FEE2E2", text: "#DC2626", icon: <Shield size={12} /> },
  "OOC Issued": { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Rejected: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
};

const channelConfig: Record<string, { bg: string; text: string }> = {
  Green: { bg: "#DCFCE7", text: "#16A34A" },
  Yellow: { bg: "#FEF3C7", text: "#D97706" },
  Red: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function RecentGDRecords() {
  const { addToast } = useToast();

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Recent GD Records</h3>
        </div>
        <span className="text-[12px] text-[#64748B]">{records.length} records</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">GD #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Channel</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Consignee</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Declared Value PKR</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Filed At</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => {
              const sc = statusConfig[record.status];
              const cc = channelConfig[record.channel];
              return (
                <tr key={record.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{record.gdNumber}</td>
                  <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{record.awb}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: cc.bg, color: cc.text }}>
                      {record.channel}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{record.consignee}</td>
                  <td className="py-3 px-3 text-[12px] font-bold text-[#0F172A]">{record.declaredValue}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{record.filedAt}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => addToast(`GD ${record.gdNumber} details opened.`, "success")}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => {} }
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                        title="Details"
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