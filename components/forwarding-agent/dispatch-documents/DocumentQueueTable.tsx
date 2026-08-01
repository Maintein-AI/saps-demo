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
  Ban,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useToast } from "../../ToastContext";

interface QueueItem {
  id: string;
  awb: string;
  do: string;
  docType: string;
  driver: string;
  vehicle: string;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  submittedAt: string;
  reviewedBy: string;
  remarks: string;
}

const queueItems: QueueItem[] = [
  { id: "Q001", awb: "157-90811223", do: "DO-90872", docType: "DO Endorsement", driver: "Ahmed Raza", vehicle: "KHI-4582", status: "Approved", submittedAt: "28 May 2026", reviewedBy: "SAPS Officer Ahmed", remarks: "Endorsed for cold chain" },
  { id: "Q002", awb: "214-45678901", do: "DO-90871", docType: "Authority Letter", driver: "Ahmed Raza", vehicle: "KHI-4582", status: "Approved", submittedAt: "30 May 2026", reviewedBy: "SAPS Officer Raza", remarks: "Valid for 30 days" },
  { id: "Q003", awb: "117-55443321", do: "DO-90873", docType: "Vehicle Entry Pre-registration", driver: "Imran Ali", vehicle: "BJU-7721", status: "Draft", submittedAt: "-", reviewedBy: "-", remarks: "Pending driver details" },
  { id: "Q004", awb: "074-88219033", do: "DO-90874", docType: "Driver Assignment", driver: "Kamran Khan", vehicle: "KHI-9921", status: "Submitted", submittedAt: "31 May 2026", reviewedBy: "Pending", remarks: "Awaiting CHA confirmation" },
  { id: "Q005", awb: "117-98765432", do: "DO-90875", docType: "Pickup Slot", driver: "Nadeem Hussain", vehicle: "KHI-3344", status: "Approved", submittedAt: "29 May 2026", reviewedBy: "SAPS Officer Zafar", remarks: "Slot confirmed" },
  { id: "Q006", awb: "157-90811223", do: "DO-90872", docType: "Authority Letter", driver: "Ahmed Raza", vehicle: "KHI-4582", status: "Rejected", submittedAt: "27 May 2026", reviewedBy: "SAPS Officer Ahmed", remarks: "CNIC mismatch" },
  { id: "Q007", awb: "074-11223344", do: "DO-90876", docType: "DO Endorsement", driver: "-", vehicle: "-", status: "Draft", submittedAt: "-", reviewedBy: "-", remarks: "Missing invoice" },
  { id: "Q008", awb: "214-99887766", do: "DO-90877", docType: "Vehicle Entry Pre-registration", driver: "Rashid Mehmood", vehicle: "BJU-5544", status: "Submitted", submittedAt: "01 Jun 2026", reviewedBy: "Pending", remarks: "DGR cargo inspection" },
  { id: "Q009", awb: "117-44556677", do: "DO-90878", docType: "Pickup Slot", driver: "Faisal Khan", vehicle: "KHI-7788", status: "Draft", submittedAt: "-", reviewedBy: "-", remarks: "Pending slot confirmation" },
  { id: "Q010", awb: "074-55667788", do: "DO-90879", docType: "Driver Assignment", driver: "Javed Iqbal", vehicle: "KHI-1122", status: "Submitted", submittedAt: "31 May 2026", reviewedBy: "Pending", remarks: "New driver registration" },
  { id: "Q011", awb: "157-11223344", do: "DO-90880", docType: "Authority Letter", driver: "Nadeem Hussain", vehicle: "KHI-3344", status: "Draft", submittedAt: "-", reviewedBy: "-", remarks: "Generate letter" },
  { id: "Q012", awb: "214-44556677", do: "DO-90881", docType: "DO Endorsement", driver: "-", vehicle: "-", status: "Approved", submittedAt: "26 May 2026", reviewedBy: "SAPS Officer Farooq", remarks: "Standard endorsement" },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Draft: { bg: "#F1F5F9", text: "#64748B", icon: <FileText size={12} /> },
  Submitted: { bg: "#DBEAFE", text: "#1B4F8B", icon: <Send size={12} /> },
  Approved: { bg: "#DCFCE7", text: "#16A34A", icon: <Shield size={12} /> },
  Rejected: { bg: "#FEE2E2", text: "#DC2626", icon: <Ban size={12} /> },
};

interface DocumentQueueTableProps {
  onGenerateAuthority: (item: QueueItem) => void;
  onPreReg: (item: QueueItem) => void;
}

export default function DocumentQueueTable({
  onGenerateAuthority,
  onPreReg,
}: DocumentQueueTableProps) {
  const { addToast } = useToast();

  const handleSubmit = (item: QueueItem) => {
    addToast(`Document ${item.docType} submitted to SAPS.`, "success");
  };

  const handleDownload = (item: QueueItem) => {
    addToast(`Downloading ${item.docType} PDF...`, "success");
  };

  const handleResubmit = (item: QueueItem) => {
    addToast(`Document ${item.docType} resubmitted to SAPS.`, "success");
  };

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Dispatch Document Queue</h3>
        </div>
        <span className="text-[12px] text-[#64748B]">{queueItems.length} documents</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">DO #</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Document Type</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Driver</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Vehicle</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Submitted At</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Reviewed By</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Remarks</th>
              <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {queueItems.map((item) => {
              const sc = statusConfig[item.status];
              return (
                <tr key={item.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#1B4F8B]">{item.awb}</td>
                  <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A]">{item.do}</td>
                  <td className="py-3 px-3 text-[12px] text-[#0F172A]">{item.docType}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.driver}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.vehicle}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                      {sc.icon}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.submittedAt}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.reviewedBy}</td>
                  <td className="py-3 px-3 text-[12px] text-[#64748B] max-w-[160px] truncate">{item.remarks}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1">
                      {item.status === "Draft" && (
                        <>
                          <button
                            onClick={() => handleSubmit(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#EBF0F7] text-[#1B4F8B] cursor-pointer transition-colors"
                            title="Submit"
                          >
                            <Send size={14} />
                          </button>
                          <button
                            onClick={() => {}}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Upload"
                          >
                            <Upload size={14} />
                          </button>
                        </>
                      )}
                      {item.status === "Submitted" && (
                        <>
                          <button
                            onClick={() => handleDownload(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Download"
                          >
                            <Download size={14} />
                          </button>
                          <span className="w-7 h-7 flex items-center justify-center text-[#94A3B8]">
                            <Shield size={14} />
                          </span>
                        </>
                      )}
                      {item.status === "Approved" && (
                        <>
                          <button
                            onClick={() => handleDownload(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Download"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => {}}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                        </>
                      )}
                      {item.status === "Rejected" && (
                        <>
                          <button
                            onClick={() => handleResubmit(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Resubmit"
                          >
                            <RotateCcw size={14} />
                          </button>
                          <button
                            onClick={() => handleDownload(item)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Download"
                          >
                            <Download size={14} />
                          </button>
                        </>
                      )}
                      {item.docType === "Authority Letter" && item.status === "Draft" && (
                        <button
                          onClick={() => onGenerateAuthority(item)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="Generate"
                        >
                          <Shield size={14} />
                        </button>
                      )}
                      {item.docType === "Vehicle Entry Pre-registration" && item.status === "Draft" && (
                        <button
                          onClick={() => onPreReg(item)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="Pre-register"
                        >
                          <Truck size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => {}}
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