import ScopeBadge from "@/components/ScopeBadge";
import { User, Clock, FileText, ArrowRight, Globe, Box, Scale, MapPin, CheckCircle } from "lucide-react";

interface AuditEntry {
  user: string;
  action: string;
  timestamp: string;
  module: string;
  evidence: string;
  remarks: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
}

const auditEntries: AuditEntry[] = [
  {
    user: "Op. Ahmed K.",
    action: "AWB Received",
    timestamp: "31 May 2026, 08:15",
    module: "Gate Entry",
    evidence: "GE-2026-03421",
    remarks: "Vehicle AJK-4211, driver verified",
    icon: <Globe size={14} />,
    iconColor: "#1B4F8B",
    iconBg: "#DBEAFE",
  },
  {
    user: "Op. Rashid M.",
    action: "Pouch Opened",
    timestamp: "31 May 2026, 08:32",
    module: "Warehouse",
    evidence: "P-2026-88712",
    remarks: "Pouch seal intact, manifest present",
    icon: <FileText size={14} />,
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
  },
  {
    user: "WMS Auto",
    action: "Manifest Reconciled",
    timestamp: "31 May 2026, 08:40",
    module: "Warehouse",
    evidence: "MR-2026-03421",
    remarks: "24 pieces match manifest, no discrepancies",
    icon: <CheckCircle size={14} />,
    iconColor: "#16A34A",
    iconBg: "#DCFCE7",
  },
  {
    user: "Op. Sara B.",
    action: "Indexed & Tagged",
    timestamp: "31 May 2026, 09:10",
    module: "Warehouse",
    evidence: "RF-2026-03421",
    remarks: "All 24 pieces RFID-tagged",
    icon: <Box size={14} />,
    iconColor: "#7C3AED",
    iconBg: "#F3E8FF",
  },
  {
    user: "Op. Ahmed K.",
    action: "Segregated & Accepted",
    timestamp: "31 May 2026, 09:25",
    module: "Warehouse",
    evidence: "AC-2026-03421",
    remarks: "Cargo class AFU confirmed, no damage",
    icon: <CheckCircle size={14} />,
    iconColor: "#16A34A",
    iconBg: "#DCFCE7",
  },
  {
    user: "Op. Rashid M.",
    action: "Weighed & Inspected",
    timestamp: "31 May 2026, 09:38",
    module: "Warehouse",
    evidence: "WI-2026-03421",
    remarks: "Actual weight 1,240 kg, chargeable 1,240 kg",
    icon: <Scale size={14} />,
    iconColor: "#D97706",
    iconBg: "#FEF3C7",
  },
  {
    user: "WMS Auto",
    action: "Storage Allocated",
    timestamp: "31 May 2026, 09:40",
    module: "Warehouse",
    evidence: "SA-2026-03421",
    remarks: "Rack AFU-R2-L1 assigned, compatible with AFU class",
    icon: <MapPin size={14} />,
    iconColor: "#1B4F8B",
    iconBg: "#DBEAFE",
  },
  {
    user: "Op. Ahmed K.",
    action: "Putaway Completed",
    timestamp: "31 May 2026, 10:42",
    module: "Warehouse",
    evidence: "PY-2026-03421",
    remarks: "All 24 pieces placed in assigned racks",
    icon: <Box size={14} />,
    iconColor: "#16A34A",
    iconBg: "#DCFCE7",
  },
  {
    user: "CHA Farooq H.",
    action: "Customs Filed",
    timestamp: "31 May 2026, 11:05",
    module: "Customs",
    evidence: "GD-KHI-2026-034521",
    remarks: "Green channel assigned, duty exempt",
    icon: <FileText size={14} />,
    iconColor: "#16A34A",
    iconBg: "#DCFCE7",
  },
  {
    user: "WMS Auto",
    action: "OOC Cleared",
    timestamp: "31 May 2026, 12:45",
    module: "Customs",
    evidence: "OOC-2026-03421",
    remarks: "Out of customs, ready for delivery",
    icon: <CheckCircle size={14} />,
    iconColor: "#16A34A",
    iconBg: "#DCFCE7",
  },
];

export default function AuditTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">
            Audit Trail
          </h3>
          <ScopeBadge type="inc" />
        </div>
        <span className="text-[12px] text-[#94A3B8] font-medium">{auditEntries.length} entries</span>
      </div>

      <div className="flex flex-col gap-0">
        {auditEntries.map((entry, i) => {
          const isLast = i === auditEntries.length - 1;
          return (
            <div key={i} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: entry.iconBg, color: entry.iconColor }}
                >
                  {entry.icon}
                </div>
                {!isLast && (
                  <div className="w-[2px] flex-1 bg-[#E2E8F0] my-1" />
                )}
              </div>
              {/* Content */}
              <div className="flex-1 pb-5">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[14px] font-bold text-[#0F172A]">{entry.action}</span>
                  <span className="text-[11px] font-semibold text-[#94A3B8] px-2 py-0.5 rounded-md bg-[#F1F5F9]">
                    {entry.module}
                  </span>
                </div>
                <p className="text-[13px] text-[#334155] leading-relaxed mb-2">
                  {entry.remarks}
                </p>
                <div className="flex items-center gap-4 text-[12px] text-[#94A3B8]">
                  <div className="flex items-center gap-1.5">
                    <User size={12} />
                    <span className="font-medium text-[#64748B]">{entry.user}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span>{entry.timestamp}</span>
                  </div>
                  <button className="flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">
                    <FileText size={12} />
                    {entry.evidence}
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}