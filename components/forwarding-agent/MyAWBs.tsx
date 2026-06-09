import ScopeBadge from "@/components/ScopeBadge";
import { FileText, CreditCard, ArrowRight, CheckCircle, Clock, AlertTriangle, PackageCheck } from "lucide-react";

const awbs = [
  { awb: "214-45678901", hawb: "HAWB-001742", consignee: "Pak Pharma Ltd", carrier: "Shaheen Air Cargo", cargoClass: "PER", pieces: 24, status: "In Storage", documents: "Complete", payment: "Paid" },
  { awb: "157-90811223", hawb: "HAWB-001743", consignee: "MediCare Distributors", carrier: "Gerry’s International", cargoClass: "GEN", pieces: 8, status: "Customs Hold", documents: "Missing FHL", payment: "Pending" },
  { awb: "074-88219033", hawb: "HAWB-001744", consignee: "AutoParts Karachi", carrier: "Kuehne+Nagel", cargoClass: "VAL", pieces: 16, status: "Documents Pending", documents: "Authority letter", payment: "Outstanding" },
  { awb: "117-55443321", hawb: "HAWB-001745", consignee: "Fresh Produce Co", carrier: "DB Schenker", cargoClass: "PER", pieces: 42, status: "Ready for Pickup", documents: "Complete", payment: "Due Today" },
  { awb: "117-98765432", hawb: "HAWB-001746", consignee: "TechSource Global", carrier: "Kuehne+Nagel", cargoClass: "DGR", pieces: 12, status: "Awaiting DO", documents: "Complete", payment: "Paid" },
  { awb: "074-11223344", hawb: "HAWB-001747", consignee: "Pak Textile Mills", carrier: "Gerry’s International", cargoClass: "GEN", pieces: 156, status: "In Storage", documents: "Complete", payment: "Paid" },
  { awb: "214-99887766", hawb: "HAWB-001748", consignee: "Chemicals Pakistan", carrier: "DB Schenker", cargoClass: "DGR", pieces: 8, status: "Customs Hold", documents: "Missing SDS", payment: "Outstanding" },
  { awb: "157-44556677", hawb: "HAWB-001749", consignee: "Fresh Foods Int", carrier: "Shaheen Air Cargo", cargoClass: "PER", pieces: 36, status: "Ready for Pickup", documents: "Complete", payment: "Paid" },
  { awb: "117-66778899", hawb: "HAWB-001750", consignee: "Luxury Imports Pvt", carrier: "Kuehne+Nagel", cargoClass: "VAL", pieces: 4, status: "In Storage", documents: "Complete", payment: "Paid" },
  { awb: "074-55667788", hawb: "HAWB-001751", consignee: "Industrial Parts Co", carrier: "Gerry’s International", cargoClass: "GEN", pieces: 24, status: "Documents Pending", documents: "Invoice copy", payment: "Pending" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "In Storage": { bg: "#F1F5F9", text: "#64748B", icon: <PackageCheck size={12} /> },
  "Customs Hold": { bg: "#FEE2E2", text: "#DC2626", icon: <AlertTriangle size={12} /> },
  "Documents Pending": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  "Ready for Pickup": { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  "Awaiting DO": { bg: "#DBEAFE", text: "#1B4F8B", icon: <Clock size={12} /> },
};

const paymentConfig: Record<string, { bg: string; text: string }> = {
  "Paid": { bg: "#DCFCE7", text: "#16A34A" },
  "Pending": { bg: "#FEF3C7", text: "#D97706" },
  "Outstanding": { bg: "#FEE2E2", text: "#DC2626" },
  "Due Today": { bg: "#DBEAFE", text: "#1B4F8B" },
};

export default function MyAWBs() {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">My AWBs</h3>
          <ScopeBadge type="exc" />
        </div>
        <span className="text-[12px] text-[#64748B]">{awbs.length} AWBs</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">HAWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Consignee</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Carrier</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Cargo Class</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Pieces</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Current Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Documents</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Payment</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {awbs.map((a, i) => {
              const sc = statusConfig[a.status];
              const pc = paymentConfig[a.payment];
              return (
                <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#1B4F8B]">{a.awb}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{a.hawb}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{a.consignee}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{a.carrier}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{a.cargoClass}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{a.pieces}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{a.documents}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: pc.bg, color: pc.text }}>
                      {a.payment}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors">
                      <ArrowRight size={14} />
                    </button>
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