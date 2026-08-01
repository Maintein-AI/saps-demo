"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ToastContext";
import {
  FileText,
  Clock,
  AlertTriangle,
  Shield,
  CheckCircle,
  PackageCheck,
  Eye,
  Upload,
  Download,
  ArrowRight,
  Link,
  Pencil,
  X,
  RefreshCw,
  Truck,
  FileUp,
} from "lucide-react";

interface OOCTrackingItem {
  id: string;
  awb: string;
  gd: string;
  consignee: string;
  channel: "Green" | "Yellow" | "Red";
  filedAt: string;
  currentStatus: "Filed" | "Under Review" | "Query" | "Examined" | "OOC Issued" | "Released";
  oocRef: string;
  oocIssuedAt: string;
  age: string;
  hsCodes: string;
  declaredValue: string;
  duty: string;
  tax: string;
  fed: string;
  wht: string;
  oocPdf: string;
  remarks: string;
}

const trackingItems: OOCTrackingItem[] = [
  {
    id: "OT-001",
    awb: "214-77890123",
    gd: "2026-KHI-00441",
    consignee: "Gerry's Dnata",
    channel: "Yellow",
    filedAt: "30 May 2026, 14:30",
    currentStatus: "Query",
    oocRef: "",
    oocIssuedAt: "",
    age: "2d 4h",
    hsCodes: "8501.5290, 8471.3000",
    declaredValue: "Rs 2,500,000",
    duty: "Rs 450,000",
    tax: "Rs 125,000",
    fed: "Rs 25,000",
    wht: "Rs 50,000",
    oocPdf: "",
    remarks: "Commercial invoice query pending response",
  },
  {
    id: "OT-002",
    awb: "157-66778899",
    gd: "2026-KHI-00439",
    consignee: "DB Schenker Pakistan",
    channel: "Green",
    filedAt: "31 May 2026, 08:15",
    currentStatus: "Released",
    oocRef: "OOC-2026-KHI-00439",
    oocIssuedAt: "31 May 2026, 09:45",
    age: "4h",
    hsCodes: "8471.3000",
    declaredValue: "Rs 1,800,000",
    duty: "Rs 320,000",
    tax: "Rs 90,000",
    fed: "Rs 18,000",
    wht: "Rs 36,000",
    oocPdf: "OOC-2026-KHI-00439.pdf",
    remarks: "Green channel auto-clearance. DO collected.",
  },
  {
    id: "OT-003",
    awb: "074-55443322",
    gd: "2026-KHI-00438",
    consignee: "Kuehne+Nagel KHI",
    channel: "Red",
    filedAt: "30 May 2026, 09:00",
    currentStatus: "Examined",
    oocRef: "",
    oocIssuedAt: "",
    age: "1d 9h",
    hsCodes: "3004.9000",
    declaredValue: "Rs 3,200,000",
    duty: "Rs 580,000",
    tax: "Rs 160,000",
    fed: "Rs 32,000",
    wht: "Rs 64,000",
    oocPdf: "",
    remarks: "Physical exam completed. Awaiting OOC issuance.",
  },
  {
    id: "OT-004",
    awb: "117-99887766",
    gd: "2026-KHI-00436",
    consignee: "Agility Pakistan",
    channel: "Yellow",
    filedAt: "29 May 2026, 16:00",
    currentStatus: "OOC Issued",
    oocRef: "OOC-2026-KHI-00436",
    oocIssuedAt: "31 May 2026, 14:00",
    age: "3d 2h",
    hsCodes: "3004.9000, 3822.0010",
    declaredValue: "Rs 950,000",
    duty: "Rs 170,000",
    tax: "Rs 48,000",
    fed: "Rs 9,500",
    wht: "Rs 19,000",
    oocPdf: "OOC-2026-KHI-00436.pdf",
    remarks: "Query cleared. OOC issued. Pending DO collection.",
  },
  {
    id: "OT-005",
    awb: "074-44556677",
    gd: "2026-KHI-00434",
    consignee: "Gerry's Dnata",
    channel: "Red",
    filedAt: "28 May 2026, 11:00",
    currentStatus: "Released",
    oocRef: "OOC-2026-KHI-00434",
    oocIssuedAt: "30 May 2026, 11:00",
    age: "4d 1h",
    hsCodes: "8501.5290",
    declaredValue: "Rs 1,450,000",
    duty: "Rs 260,000",
    tax: "Rs 73,000",
    fed: "Rs 14,500",
    wht: "Rs 29,000",
    oocPdf: "OOC-2026-KHI-00434.pdf",
    remarks: "Exam cleared. DO collected by driver Ahmed Raza.",
  },
  {
    id: "OT-006",
    awb: "157-22334455",
    gd: "2026-KHI-00433",
    consignee: "DB Schenker Pakistan",
    channel: "Green",
    filedAt: "31 May 2026, 07:30",
    currentStatus: "OOC Issued",
    oocRef: "OOC-2026-KHI-00433",
    oocIssuedAt: "31 May 2026, 08:00",
    age: "1d",
    hsCodes: "8471.3000",
    declaredValue: "Rs 2,100,000",
    duty: "Rs 378,000",
    tax: "Rs 105,000",
    fed: "Rs 21,000",
    wht: "Rs 42,000",
    oocPdf: "OOC-2026-KHI-00433.pdf",
    remarks: "Auto-clearance. Awaiting payment.",
  },
  {
    id: "OT-007",
    awb: "117-55667788",
    gd: "2026-KHI-00432",
    consignee: "Kuehne+Nagel KHI",
    channel: "Yellow",
    filedAt: "31 May 2026, 05:40",
    currentStatus: "Under Review",
    oocRef: "",
    oocIssuedAt: "",
    age: "1d 4h",
    hsCodes: "3822.0010",
    declaredValue: "Rs 875,000",
    duty: "Rs 157,000",
    tax: "Rs 44,000",
    fed: "Rs 8,750",
    wht: "Rs 17,500",
    oocPdf: "",
    remarks: "Documents under review by examiner.",
  },
  {
    id: "OT-008",
    awb: "214-11223344",
    gd: "2026-KHI-00435",
    consignee: "Pakistan Cargo Services",
    channel: "Green",
    filedAt: "01 Jun 2026, 06:00",
    currentStatus: "Filed",
    oocRef: "",
    oocIssuedAt: "",
    age: "4h",
    hsCodes: "8501.5290, 8471.3000",
    declaredValue: "Rs 4,100,000",
    duty: "Rs 738,000",
    tax: "Rs 205,000",
    fed: "Rs 41,000",
    wht: "Rs 82,000",
    oocPdf: "",
    remarks: "Just filed. Awaiting channel assignment.",
  },
];

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  Filed: { bg: "#F1F5F9", text: "#64748B", icon: <FileText size={12} /> },
  "Under Review": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  Query: { bg: "#FEF3C7", text: "#D97706", icon: <AlertTriangle size={12} /> },
  Examined: { bg: "#DBEAFE", text: "#1D4ED8", icon: <Shield size={12} /> },
  "OOC Issued": { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  Released: { bg: "#DCFCE7", text: "#16A34A", icon: <PackageCheck size={12} /> },
};

const channelConfig: Record<string, { bg: string; text: string }> = {
  Green: { bg: "#DCFCE7", text: "#16A34A" },
  Yellow: { bg: "#FEF3C7", text: "#D97706" },
  Red: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function OOCTrackingTable() {
  const { addToast } = useToast();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [oocRefInput, setOocRefInput] = useState("");
  const [remarksInput, setRemarksInput] = useState("");
  const [uploadedPdf, setUploadedPdf] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<OOCTrackingItem[]>(trackingItems);

  const handleUploadPDF = () => {
    setUploadedPdf("OOC-2026-KHI-00441.pdf");
    addToast("OOC PDF uploaded successfully.", "success");
  };

  const handleUpdateOOCRef = () => {
    if (!oocRefInput.trim()) {
      addToast("Please enter an OOC reference.", "error");
      return;
    }
    addToast(`OOC reference updated to ${oocRefInput}.`, "success");
    setOocRefInput("");
  };

  const handleAssignDO = () => {
    addToast("DO collection assigned to driver.", "success");
  };

  const handleDownloadOOC = () => {
    addToast("OOC PDF downloaded.", "success");
  };

  const handleAddRemark = () => {
    if (!remarksInput.trim()) {
      addToast("Please enter a remark.", "error");
      return;
    }
    addToast("OOC tracking updated.", "success");
    setRemarksInput("");
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setItems(trackingItems);
      addToast("OOC tracking updated.", "success");
    }, 1500);
  };

  const activeItem = items.find((t) => t.id === selectedItem);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">OOC Tracking Queue</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#64748B]">{items.length} records</span>
        </div>
      </div>

      <div className="p-5">
        {error && (
          <div className="flex items-center gap-3 mb-4 p-4 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5]">
            <AlertTriangle size={16} className="text-[#DC2626]" />
            <span className="text-[13px] font-semibold text-[#DC2626]">Failed to load OOC tracking data. Please try again.</span>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold bg-[#DC2626] text-white hover:opacity-90 cursor-pointer transition-opacity"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">GD #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Consignee</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Channel</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Filed At</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Current Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">OOC Ref #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">OOC Issued At</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Age</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#F1F5F9]">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="py-3 px-3">
                        <div className="h-4 bg-[#F1F5F9] rounded animate-pulse" style={{ width: j === 0 ? "80px" : j === 1 ? "100px" : j === 2 ? "120px" : j === 4 ? "90px" : j === 5 ? "90px" : j === 8 ? "50px" : "60px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center">
                        <FileText size={24} className="text-[#94A3B8]" />
                      </div>
                      <p className="text-[13px] font-semibold text-[#64748B]">No OOC tracking records found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const sc = statusConfig[item.currentStatus];
                  const cc = channelConfig[item.channel];
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    >
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.awb}</td>
                      <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{item.gd}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.consignee}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: cc.bg, color: cc.text }}>
                          {item.channel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.filedAt}</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                          {sc.icon}
                          {item.currentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{item.oocRef || "—"}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.oocIssuedAt || "—"}</td>
                      <td className="py-3 px-3 text-[12px] text-[#64748B]">{item.age}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedItem(item.id); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="View Detail"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToast(`AWB ${item.awb} opened.`, "success"); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="View AWB"
                          >
                            <ArrowRight size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToast(`OOC ${item.oocRef || "N/A"} downloaded.`, "success"); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                            title="Download OOC"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {activeItem && (
          <div className="mt-5 p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileUp size={16} className="text-[#1B4F8B]" />
                <h3 className="text-[13px] font-bold text-[#0F172A]">OOC Detail</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">AWB #</label>
                <input type="text" value={activeItem.awb} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">GD #</label>
                <input type="text" value={activeItem.gd} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Channel</label>
                <input type="text" value={activeItem.channel} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Filed At</label>
                <input type="text" value={activeItem.filedAt} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">HS Code(s)</label>
                <input type="text" value={activeItem.hsCodes} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Current Status</label>
                <span className="inline-flex items-center gap-1 h-9 px-3 rounded-lg text-[12px] font-semibold" style={{ backgroundColor: statusConfig[activeItem.currentStatus].bg, color: statusConfig[activeItem.currentStatus].text }}>
                  {statusConfig[activeItem.currentStatus].icon}
                  {activeItem.currentStatus}
                </span>
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Declared Value PKR</label>
                <input type="text" value={activeItem.declaredValue} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Duty PKR</label>
                <input type="text" value={activeItem.duty} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Tax PKR</label>
                <input type="text" value={activeItem.tax} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">FED</label>
                <input type="text" value={activeItem.fed} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">WHT</label>
                <input type="text" value={activeItem.wht} readOnly className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">OOC Reference</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={oocRefInput || activeItem.oocRef}
                    onChange={(e) => setOocRefInput(e.target.value)}
                    placeholder="Enter OOC reference"
                    className="flex-1 h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
                  />
                  <button
                    onClick={handleUpdateOOCRef}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#EBF0F7] text-[#1B4F8B] cursor-pointer transition-colors"
                    title="Update OOC Reference"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">OOC PDF</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleUploadPDF}
                    className="flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-[#CBD5E1] text-[13px] text-[#64748B] cursor-pointer hover:border-[#1B4F8B] hover:text-[#1B4F8B] transition-colors"
                  >
                    <Upload size={16} />
                    Upload OOC PDF
                    {uploadedPdf && <span className="text-[12px] font-semibold text-[#16A34A]">({uploadedPdf})</span>}
                    {activeItem.oocPdf && !uploadedPdf && <span className="text-[12px] font-semibold text-[#16A34A]">({activeItem.oocPdf})</span>}
                  </button>
                  {(activeItem.oocPdf || uploadedPdf) && (
                    <button
                      onClick={handleDownloadOOC}
                      className="flex items-center gap-2 h-10 px-4 rounded-lg border border-[#E2E8F0] text-[13px] text-[#64748B] cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                    >
                      <Download size={14} />
                      Download OOC
                    </button>
                  )}
                </div>
              </div>
              <div className="md:col-span-3">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Remarks</label>
                <textarea
                  value={activeItem.remarks}
                  readOnly
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F1F5F9] resize-none"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Add Remark</label>
                <textarea
                  value={remarksInput}
                  onChange={(e) => setRemarksInput(e.target.value)}
                  placeholder="Enter new remark"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={handleUploadPDF}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: "#0B2545" }}
              >
                <Upload size={14} />
                Upload OOC PDF
              </button>
              <button
                onClick={handleUpdateOOCRef}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <Link size={14} />
                Update OOC Reference
              </button>
              <button
                onClick={handleAssignDO}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <Truck size={14} />
                Assign DO Collection
              </button>
              <button
                onClick={() => addToast(`AWB ${activeItem.awb} opened.`, "success")}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <ArrowRight size={14} />
                View AWB
              </button>
              <button
                onClick={handleDownloadOOC}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <Download size={14} />
                Download OOC
              </button>
              <button
                onClick={handleAddRemark}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <FileText size={14} />
                Add Remark
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}