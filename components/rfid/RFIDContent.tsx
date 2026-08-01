"use client";

import { useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import EmptyState from "../EmptyState";
import ErrorState from "../ErrorState";
import { useToast } from "../ToastContext";
import {
  Radio,
  Wifi,
  WifiOff,
  Activity,
  Tag,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  Clock,
  Search,
  Play,
  Pause,
  X,
} from "lucide-react";

const fixedGates = [
  { id: "GATE-IN-01", direction: "Inbound", reader: "Impinj R420", antenna: "ANT-01", power: "30 dBm", epcFilter: "Filter-IN", dupWindow: "500ms", status: "Active" },
  { id: "GATE-IN-02", direction: "Inbound", reader: "Impinj R420", antenna: "ANT-02", power: "30 dBm", epcFilter: "Filter-IN", dupWindow: "500ms", status: "Active" },
  { id: "GATE-OUT-01", direction: "Outbound", reader: "Zebra FX9600", antenna: "ANT-03", power: "32 dBm", epcFilter: "Filter-OUT", dupWindow: "500ms", status: "Active" },
  { id: "GATE-OUT-02", direction: "Outbound", reader: "Zebra FX9600", antenna: "ANT-04", power: "32 dBm", epcFilter: "Filter-OUT", dupWindow: "500ms", status: "Maintenance" },
];

const pieceBindings = [
  { awb: "176-1234-5678", pieceId: "P-001", epc: "urn:epc:tag:sgtin-96:1.0614141.100001.1", boundAt: "2026-06-08 09:15", boundBy: "operator@airvault.pk", status: "Bound" },
  { awb: "176-1234-5678", pieceId: "P-002", epc: "urn:epc:tag:sgtin-96:1.0614141.100002.2", boundAt: "2026-06-08 09:16", boundBy: "operator@airvault.pk", status: "Bound" },
  { awb: "176-2345-6789", pieceId: "P-003", epc: "urn:epc:tag:sgtin-96:1.0614141.100003.3", boundAt: "2026-06-08 09:30", boundBy: "lifter@airvault.pk", status: "Bound" },
  { awb: "176-3456-7890", pieceId: "P-004", epc: "", boundAt: "", boundBy: "", status: "Unbound" },
  { awb: "176-4567-8901", pieceId: "P-005", epc: "urn:epc:tag:sgtin-96:1.0614141.100005.5", boundAt: "2026-06-08 10:00", boundBy: "lifter@airvault.pk", status: "Bound" },
];

const liveReadStream = [
  { timestamp: "2026-06-08 09:15:01", reader: "GATE-IN-01", antenna: "ANT-01", epc: "urn:epc:tag:sgtin-96:1.0614141.100001.1", pieceId: "P-001", awb: "176-1234-5678", direction: "Inbound", result: "Matched", dupFilter: "Passed" },
  { timestamp: "2026-06-08 09:15:02", reader: "GATE-IN-01", antenna: "ANT-01", epc: "urn:epc:tag:sgtin-96:1.0614141.100001.1", pieceId: "P-001", awb: "176-1234-5678", direction: "Inbound", result: "Duplicate", dupFilter: "Blocked" },
  { timestamp: "2026-06-08 09:15:03", reader: "GATE-IN-01", antenna: "ANT-02", epc: "urn:epc:tag:sgtin-96:1.0614141.100002.2", pieceId: "P-002", awb: "176-1234-5678", direction: "Inbound", result: "Matched", dupFilter: "Passed" },
  { timestamp: "2026-06-08 09:30:15", reader: "GATE-IN-02", antenna: "ANT-03", epc: "urn:epc:tag:sgtin-96:1.0614141.100003.3", pieceId: "P-003", awb: "176-2345-6789", direction: "Inbound", result: "Matched", dupFilter: "Passed" },
  { timestamp: "2026-06-08 10:00:22", reader: "GATE-OUT-01", antenna: "ANT-04", epc: "urn:epc:tag:sgtin-96:1.0614141.100005.5", pieceId: "P-005", awb: "176-4567-8901", direction: "Outbound", result: "Matched", dupFilter: "Passed" },
  { timestamp: "2026-06-08 10:05:30", reader: "GATE-OUT-01", antenna: "ANT-04", epc: "urn:epc:tag:sgtin-96:1.0614141.199999.9", pieceId: "", awb: "", direction: "Outbound", result: "Unmatched", dupFilter: "Passed" },
  { timestamp: "2026-06-08 10:12:00", reader: "GATE-IN-01", antenna: "ANT-01", epc: "urn:epc:tag:sgtin-96:1.0614141.100010.10", pieceId: "P-010", awb: "176-5678-9012", direction: "Inbound", result: "Matched", dupFilter: "Passed" },
];

export default function RFIDContent() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<"fixed" | "handheld-import" | "handheld-export" | "binding" | "stream">("fixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGate, setSelectedGate] = useState<typeof fixedGates[0] | null>(null);
  const [streamPaused, setStreamPaused] = useState(false);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleTestGate = (gateId: string) => {
    addToast(`Test read triggered on ${gateId}`, "success");
  };

  const handleBindPiece = () => {
    addToast("Piece tag binding completed", "success");
  };

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} onRetry={handleRetry} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={8} columns={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RFIDCard
          title="Fixed RFID Gates Inbound"
          description="Permanent dock-door RFID readers for inbound cargo"
          icon={<ArrowRight size={18} />}
          active={activeTab === "fixed"}
          onClick={() => setActiveTab("fixed")}
        />
        <RFIDCard
          title="Fixed RFID Gates Outbound"
          description="Permanent dock-door RFID readers for outbound cargo"
          icon={<ArrowLeft size={18} />}
          active={activeTab === "fixed"}
          onClick={() => setActiveTab("fixed")}
        />
        <RFIDCard
          title="Handheld Import Workflows"
          description="Mobile RFID scanning for import piece verification"
          icon={<Radio size={18} />}
          active={activeTab === "handheld-import"}
          onClick={() => setActiveTab("handheld-import")}
        />
        <RFIDCard
          title="Piece-level Tag Binding"
          description="Bind RFID EPC tags to individual cargo pieces"
          icon={<Tag size={18} />}
          active={activeTab === "binding"}
          onClick={() => setActiveTab("binding")}
        />
        <RFIDCard
          title="Live Read Stream"
          description="Real-time RFID read event stream from all readers"
          icon={<Activity size={18} />}
          active={activeTab === "stream"}
          onClick={() => setActiveTab("stream")}
        />
        <RFIDCard
          title="Handheld Export Workflows"
          description="Mobile RFID scanning for export piece verification"
          icon={<Radio size={18} />}
          active={activeTab === "handheld-export"}
          onClick={() => setActiveTab("handheld-export")}
        />
      </div>

      {activeTab === "fixed" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-[#0F172A]">Fixed Gate Configuration</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {fixedGates.map((gate) => (
              <div key={gate.id} className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-[13px] font-bold text-[#0F172A]">{gate.id}</h4>
                    <p className="text-[11px] text-[#64748B]">{gate.direction}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-bold ${gate.status === "Active" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"}`}>
                    {gate.status === "Active" ? <Wifi size={10} /> : <WifiOff size={10} />}
                    {gate.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px]">
                  <div>
                    <span className="text-[#94A3B8]">Reader: </span>
                    <span className="text-[#0F172A] font-medium">{gate.reader}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">Antenna: </span>
                    <span className="text-[#0F172A] font-medium">{gate.antenna}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">Power: </span>
                    <span className="text-[#0F172A] font-medium">{gate.power}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8]">EPC Filter: </span>
                    <span className="text-[#0F172A] font-medium">{gate.epcFilter}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#94A3B8]">Dup Window: </span>
                    <span className="text-[#0F172A] font-medium">{gate.dupWindow}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E2E8F0]">
                  <button
                    onClick={() => handleTestGate(gate.id)}
                    className="h-7 px-3 rounded-lg text-[11px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                    style={{ backgroundColor: "#0B2545" }}
                  >
                    Test Connection
                  </button>
                  <button
                    onClick={() => setSelectedGate(gate)}
                    className="h-7 px-3 rounded-lg text-[11px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "handheld-import" && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-[14px] font-bold text-[#0F172A]">Handheld RFID Import Workflows</h3>
          </div>
          <div className="space-y-3">
            {[
              { step: 1, label: "Scan arrival manifest barcode", status: "Ready" },
              { step: 2, label: "Inventory scan all pieces on pallet", status: "Ready" },
              { step: 3, label: "Auto-match against FFM/FWB", status: "Ready" },
              { step: 4, label: "Flag discrepancies from manifest", status: "Ready" },
              { step: 5, label: "Generate CDR if mismatch detected", status: "Ready" },
              { step: 6, label: "Confirm putaway location scan", status: "Ready" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="w-6 h-6 rounded-full bg-[#EBF0F7] flex items-center justify-center text-[11px] font-bold text-[#1B4F8B] flex-shrink-0">
                  {s.step}
                </div>
                <span className="text-[13px] text-[#0F172A] flex-1">{s.label}</span>
                <span className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-[#64748B] flex items-center gap-1">
            <Clock size={13} />
            Connect a handheld RFID reader to begin import workflows
          </p>
        </div>
      )}

      {activeTab === "handheld-export" && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-[14px] font-bold text-[#0F172A]">Handheld RFID Export Workflows</h3>
          </div>
          <div className="space-y-3">
            {[
              { step: 1, label: "Scan export booking reference", status: "Ready" },
              { step: 2, label: "Pick verification scan at bay", status: "Ready" },
              { step: 3, label: "ULD build scan — piece to ULD mapping", status: "Ready" },
              { step: 4, label: "Generate UCM / SCM message", status: "Ready" },
              { step: 5, label: "Gate-out departure scan", status: "Ready" },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="w-6 h-6 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[11px] font-bold text-[#DC2626] flex-shrink-0">
                  {s.step}
                </div>
                <span className="text-[13px] text-[#0F172A] flex-1">{s.label}</span>
                <span className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[12px] text-[#F59E0B] flex items-center gap-1">
            <AlertTriangle size={13} />
            Export workflows are outside awarded scope (exc.)
          </p>
        </div>
      )}

      {activeTab === "binding" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-bold text-[#0F172A]">Piece-Level Tag Binding</h3>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">AWB #</label>
                <input type="text" placeholder="176-1234-5678" className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Piece ID</label>
                <input type="text" placeholder="P-001" className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
              </div>
              <div>
                <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">RFID EPC</label>
                <input type="text" placeholder="Scan or enter EPC..." className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
              </div>
            </div>
            <button
              onClick={handleBindPiece}
              className="h-8 px-4 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: "#0B2545" }}
            >
              Bind Tag
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B2545" }}>
                <tr>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">AWB #</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Piece ID</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">RFID EPC</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Bound At</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Bound By</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {pieceBindings.map((p, i) => (
                  <tr key={p.pieceId} className="border-b border-[#E2E8F0] transition-colors hover:bg-[#F1F5F9]" style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "white" }}>
                    <td className="px-4 py-3 text-[12px] font-medium text-[#0F172A]">{p.awb}</td>
                    <td className="px-4 py-3 text-[12px] text-[#0F172A]">{p.pieceId}</td>
                    <td className="px-4 py-3 text-[11px] font-mono text-[#64748B] max-w-[200px] truncate">{p.epc || "—"}</td>
                    <td className="px-4 py-3 text-[12px] text-[#64748B]">{p.boundAt || "—"}</td>
                    <td className="px-4 py-3 text-[12px] text-[#64748B]">{p.boundBy || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-bold ${p.status === "Bound" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"}`}>
                        {p.status === "Bound" ? <Check size={10} /> : <AlertTriangle size={10} />}
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "stream" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-bold text-[#0F172A]">Live Read Stream</h3>
              <span className={`inline-flex items-center gap-1 h-5 px-2 rounded-full text-[10px] font-bold ${streamPaused ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#DCFCE7] text-[#16A34A]"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${streamPaused ? "bg-[#D97706]" : "bg-[#16A34A] animate-pulse"}`} />
                {streamPaused ? "Paused" : "Live"}
              </span>
            </div>
            <button
              onClick={() => setStreamPaused(!streamPaused)}
              className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                streamPaused ? "bg-[#16A34A] text-white" : "bg-[#DC2626] text-white"
              }`}
            >
              {streamPaused ? <Play size={13} /> : <Pause size={13} />}
              {streamPaused ? "Resume" : "Pause"}
            </button>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#0B2545", position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Timestamp</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Reader</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Antenna</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">EPC</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Piece ID</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">AWB #</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Dir.</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Result</th>
                  <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Dup Filter</th>
                </tr>
              </thead>
              <tbody>
                {liveReadStream.map((r, i) => (
                  <tr key={i} className="border-b border-[#E2E8F0] transition-colors hover:bg-[#F1F5F9]" style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "white" }}>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-[#64748B]">{r.timestamp}</td>
                    <td className="px-4 py-2.5 text-[11px] text-[#0F172A]">{r.reader}</td>
                    <td className="px-4 py-2.5 text-[11px] text-[#64748B]">{r.antenna}</td>
                    <td className="px-4 py-2.5 text-[11px] font-mono text-[#64748B] max-w-[200px] truncate">{r.epc}</td>
                    <td className="px-4 py-2.5 text-[11px] text-[#0F172A]">{r.pieceId || "—"}</td>
                    <td className="px-4 py-2.5 text-[11px] text-[#0F172A]">{r.awb || "—"}</td>
                    <td className="px-4 py-2.5">
                      {r.direction === "Inbound" ? <ArrowRight size={13} className="text-[#16A34A]" /> : <ArrowLeft size={13} className="text-[#1B4F8B]" />}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-bold ${r.result === "Matched" ? "bg-[#DCFCE7] text-[#16A34A]" : r.result === "Duplicate" ? "bg-[#FEF3C7] text-[#D97706]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>
                        {r.result}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-bold ${r.dupFilter === "Passed" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"}`}>
                        {r.dupFilter}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedGate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setSelectedGate(null)}>
          <div className="w-full max-w-[560px] bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 h-[56px] border-b border-[#E2E8F0]">
              <h3 className="text-[16px] font-bold text-[#0F172A]">Configure {selectedGate.id}</h3>
              <button onClick={() => setSelectedGate(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Gate ID</label>
                  <input type="text" defaultValue={selectedGate.id} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-[#F8FAFC]" readOnly />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Direction</label>
                  <select defaultValue={selectedGate.direction} className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
                    <option value="Inbound">Inbound</option>
                    <option value="Outbound">Outbound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Reader</label>
                  <select defaultValue={selectedGate.reader} className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
                    <option value="Impinj R420">Impinj R420</option>
                    <option value="Zebra FX9600">Zebra FX9600</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Antenna</label>
                  <input type="text" defaultValue={selectedGate.antenna} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Antenna Power</label>
                  <input type="text" defaultValue={selectedGate.power} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">EPC Filter</label>
                  <input type="text" defaultValue={selectedGate.epcFilter} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Duplicate Read Window</label>
                  <input type="text" defaultValue={selectedGate.dupWindow} className="w-full h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#0F172A] mb-1">Status</label>
                  <select defaultValue={selectedGate.status} className="w-full h-9 px-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white appearance-none cursor-pointer">
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2">
              <button onClick={() => setSelectedGate(null)} className="h-8 px-4 rounded-lg text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer whitespace-nowrap">
                Cancel
              </button>
              <button
                onClick={() => { setSelectedGate(null); addToast(`Gate ${selectedGate.id} configuration saved`, "success"); }}
                className="h-8 px-4 rounded-lg text-[12px] font-semibold text-white cursor-pointer hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: "#0B2545" }}
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RFIDCard({
  title,
  description,
  icon,
  active,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
        active
          ? "border-[#2E75B6] bg-[#EBF0F7] shadow-sm"
          : "border-[#E2E8F0] bg-white hover:shadow-sm hover:border-[#CBD5E1]"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#1B4F8B]">
          {icon}
        </div>
      </div>
      <h4 className="text-[13px] font-bold text-[#0F172A] mb-1">{title}</h4>
      <p className="text-[11px] text-[#64748B]">{description}</p>
    </button>
  );
}