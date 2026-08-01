"use client";

import { useState } from "react";
import {
  FileText,
  Shield,
  Truck,
  User,
  Calendar,
  Upload,
  Send,
  Download,
  Eye,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Ban,
  RotateCcw,
} from "lucide-react";
import { useToast } from "../../ToastContext";

interface DocumentCard {
  id: string;
  type: string;
  awb: string;
  do: string;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  submittedAt: string;
  reviewedBy: string;
  remarks: string;
  driver?: string;
  vehicle?: string;
  rejectionReason?: string;
}

const documents: DocumentCard[] = [
  {
    id: "D001",
    type: "DO Endorsement",
    awb: "157-90811223",
    do: "DO-90872",
    status: "Approved",
    submittedAt: "28 May 2026 09:15",
    reviewedBy: "SAPS Officer Ahmed",
    remarks: "Endorsed for cold chain cargo",
  },
  {
    id: "D002",
    type: "Authority Letter",
    awb: "214-45678901",
    do: "DO-90871",
    status: "Approved",
    submittedAt: "30 May 2026 11:30",
    reviewedBy: "SAPS Officer Raza",
    remarks: "Valid for 30 days",
    driver: "Ahmed Raza",
    vehicle: "KHI-4582",
  },
  {
    id: "D003",
    type: "Vehicle Entry Pre-registration",
    awb: "117-55443321",
    do: "DO-90873",
    status: "Draft",
    submittedAt: "-",
    reviewedBy: "-",
    remarks: "Pending driver details",
    driver: "Imran Ali",
    vehicle: "BJU-7721",
  },
  {
    id: "D004",
    type: "Driver Assignment",
    awb: "074-88219033",
    do: "DO-90874",
    status: "Submitted",
    submittedAt: "31 May 2026 08:45",
    reviewedBy: "Pending",
    remarks: "Awaiting CHA confirmation",
    driver: "Kamran Khan",
    vehicle: "KHI-9921",
  },
  {
    id: "D005",
    type: "Pickup Slot",
    awb: "117-98765432",
    do: "DO-90875",
    status: "Approved",
    submittedAt: "29 May 2026 14:00",
    reviewedBy: "SAPS Officer Zafar",
    remarks: "Slot confirmed for 14:00",
    driver: "Nadeem Hussain",
    vehicle: "KHI-3344",
  },
  {
    id: "D006",
    type: "Authority Letter",
    awb: "157-90811223",
    do: "DO-90872",
    status: "Rejected",
    submittedAt: "27 May 2026 10:00",
    reviewedBy: "SAPS Officer Ahmed",
    remarks: "Driver CNIC mismatch",
    driver: "Ahmed Raza",
    vehicle: "KHI-4582",
    rejectionReason: "Driver CNIC on authority letter does not match gate register. Please re-submit with corrected CNIC number or register the driver first.",
  },
  {
    id: "D007",
    type: "DO Endorsement",
    awb: "074-11223344",
    do: "DO-90876",
    status: "Draft",
    submittedAt: "-",
    reviewedBy: "-",
    remarks: "Missing commercial invoice",
  },
  {
    id: "D008",
    type: "Vehicle Entry Pre-registration",
    awb: "214-99887766",
    do: "DO-90877",
    status: "Submitted",
    submittedAt: "01 Jun 2026 07:30",
    reviewedBy: "Pending",
    remarks: "DGR cargo — additional inspection",
    driver: "Rashid Mehmood",
    vehicle: "BJU-5544",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Draft: { bg: "#F1F5F9", text: "#64748B", icon: <FileText size={12} /> },
  Submitted: { bg: "#DBEAFE", text: "#1B4F8B", icon: <Send size={12} /> },
  Approved: { bg: "#DCFCE7", text: "#16A34A", icon: <Shield size={12} /> },
  Rejected: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
};

const typeIcons: Record<string, React.ReactNode> = {
  "DO Endorsement": <FileText size={16} />,
  "Authority Letter": <Shield size={16} />,
  "Vehicle Entry Pre-registration": <Truck size={16} />,
  "Driver Assignment": <User size={16} />,
  "Pickup Slot": <Calendar size={16} />,
};

interface DocumentCardGridProps {
  onGenerateAuthority: (doc: DocumentCard) => void;
  onPreReg: (doc: DocumentCard) => void;
  onUpload: (doc: DocumentCard) => void;
}

export default function DocumentCardGrid({
  onGenerateAuthority,
  onPreReg,
  onUpload,
}: DocumentCardGridProps) {
  const { addToast } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSubmit = (doc: DocumentCard) => {
    addToast(`Document ${doc.type} submitted to SAPS.`, "success");
  };

  const handleDownload = (doc: DocumentCard) => {
    addToast(`Downloading ${doc.type} PDF...`, "success");
  };

  const handleResubmit = (doc: DocumentCard) => {
    addToast(`Document ${doc.type} resubmitted to SAPS.`, "success");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Document Cards</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {documents.map((doc) => {
          const sc = statusConfig[doc.status];
          const isExpanded = expanded === doc.id;

          return (
            <div
              key={doc.id}
              className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#EBF0F7] flex items-center justify-center text-[#1B4F8B]">
                  {typeIcons[doc.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#0F172A] truncate">{doc.type}</p>
                  <p className="text-[11px] text-[#94A3B8]">{doc.awb}</p>
                </div>
                <span
                  className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold"
                  style={{ backgroundColor: sc.bg, color: sc.text }}
                >
                  {sc.icon}
                  {doc.status}
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#94A3B8]">DO #</span>
                  <span className="font-medium text-[#0F172A]">{doc.do}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#94A3B8]">Submitted</span>
                  <span className="font-medium text-[#0F172A]">{doc.submittedAt}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-[#94A3B8]">Reviewed By</span>
                  <span className="font-medium text-[#0F172A]">{doc.reviewedBy}</span>
                </div>
                {doc.driver && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#94A3B8]">Driver</span>
                    <span className="font-medium text-[#0F172A]">{doc.driver}</span>
                  </div>
                )}
                {doc.vehicle && (
                  <div className="flex justify-between text-[12px]">
                    <span className="text-[#94A3B8]">Vehicle</span>
                    <span className="font-medium text-[#0F172A]">{doc.vehicle}</span>
                  </div>
                )}
              </div>

              {doc.status === "Rejected" && doc.rejectionReason && (
                <div className="mb-3 p-2.5 rounded-lg bg-[#FEE2E2]/50 border border-[#DC2626]/10">
                  <div className="flex items-center gap-1.5 mb-1">
                    <AlertTriangle size={12} className="text-[#DC2626]" />
                    <span className="text-[11px] font-semibold text-[#DC2626]">Rejection Reason</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{doc.rejectionReason}</p>
                </div>
              )}

              <div className="flex items-center gap-1.5 mb-2">
                <button
                  onClick={() => setExpanded(isExpanded ? null : doc.id)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors"
                >
                  Remarks
                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
              {isExpanded && (
                <p className="text-[12px] text-[#64748B] mb-3 leading-relaxed">{doc.remarks}</p>
              )}

              <div className="flex flex-wrap gap-1.5">
                {doc.status === "Draft" && (
                  <>
                    <button
                      onClick={() => onUpload(doc)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
                    >
                      <Upload size={12} />
                      Upload
                    </button>
                    <button
                      onClick={() => handleSubmit(doc)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                      style={{ backgroundColor: "#0B2545" }}
                    >
                      <Send size={12} />
                      Submit
                    </button>
                  </>
                )}
                {doc.status === "Submitted" && (
                  <>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
                    >
                      <Download size={12} />
                      PDF
                    </button>
                    <span className="inline-flex items-center h-7 px-2.5 rounded-lg text-[11px] font-semibold text-[#94A3B8] bg-[#F1F5F9]">
                      Awaiting review
                    </span>
                  </>
                )}
                {doc.status === "Approved" && (
                  <>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
                    >
                      <Download size={12} />
                      PDF
                    </button>
                    <button
                      onClick={() => {}}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold text-[#16A34A] border border-[#16A34A]/30 hover:bg-[#16A34A]/5 cursor-pointer transition-colors"
                    >
                      <Eye size={12} />
                      View
                    </button>
                  </>
                )}
                {doc.status === "Rejected" && (
                  <>
                    <button
                      onClick={() => handleResubmit(doc)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0B2545] cursor-pointer transition-colors"
                    >
                      <RotateCcw size={12} />
                      Resubmit
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
                    >
                      <Download size={12} />
                      PDF
                    </button>
                  </>
                )}
                {doc.type === "Authority Letter" && doc.status === "Draft" && (
                  <button
                    onClick={() => onGenerateAuthority(doc)}
                    className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
                  >
                    <Shield size={12} />
                    Generate
                  </button>
                )}
                {doc.type === "Vehicle Entry Pre-registration" && doc.status === "Draft" && (
                  <button
                    onClick={() => onPreReg(doc)}
                    className="flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] cursor-pointer transition-colors"
                  >
                    <Truck size={12} />
                    Pre-register
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}