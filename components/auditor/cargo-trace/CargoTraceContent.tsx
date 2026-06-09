"use client";

import { useState } from "react";
import LoadingSkeleton from "../../LoadingSkeleton";
import EmptyState from "../../EmptyState";
import ErrorState from "../../ErrorState";
import DataTable from "../../DataTable";
import ScopeBadge from "../../ScopeBadge";
import { Search, ChevronDown, ExternalLink, Clock } from "lucide-react";

interface TimelineEvent {
  state: string;
  user: string;
  timestamp: string;
  module: string;
  sourceSystem: string;
  location: string;
  evidenceLink: string;
  remarks: string;
}

interface PieceTrace {
  pieceId: string;
  rfidEpc: string;
  awb: string;
  location: string;
  event: string;
  user: string;
  timestamp: string;
  evidence: string;
}

const mockCargoTimeline: TimelineEvent[] = [
  { state: "Awaited", user: "system", timestamp: "2026-06-07 22:15:00", module: "FSU/FFM", sourceSystem: "Airline MSG", location: "DXB", evidenceLink: "ffm_23456123.xml", remarks: "FFM received from carrier" },
  { state: "Received", user: "ahmed.shaikh", timestamp: "2026-06-08 06:42:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "Bay A-12, LHE", evidenceLink: "rcv_scan_001.png", remarks: "Physical receipt confirmed at dock" },
  { state: "Pouch Opened", user: "fatima.siddiqui", timestamp: "2026-06-08 07:05:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "Doc Room, LHE", evidenceLink: "pouch_log_06.pdf", remarks: "Manifest pouch opened and verified" },
  { state: "Manifest Reconciled", user: "fatima.siddiqui", timestamp: "2026-06-08 07:22:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "Doc Room, LHE", evidenceLink: "recon_23456123.pdf", remarks: "Pieces matched manifest: 12/12" },
  { state: "Indexed", user: "system", timestamp: "2026-06-08 07:30:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "LHE", evidenceLink: "index_23456123.xml", remarks: "Auto-indexed into inventory" },
  { state: "Tagged RFID", user: "bilal.malik", timestamp: "2026-06-08 08:10:00", module: "Warehouse", sourceSystem: "RFID Middleware", location: "RFID Station 3, LHE", evidenceLink: "rfid_tag_12pcs.txt", remarks: "12 pieces tagged with EPC" },
  { state: "Segregated", user: "bilal.malik", timestamp: "2026-06-08 08:45:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "Sort Area, LHE", evidenceLink: "seg_log_08jun.pdf", remarks: "By cargo class and destination" },
  { state: "Accepted", user: "ahmed.shaikh", timestamp: "2026-06-08 09:00:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "QA Station, LHE", evidenceLink: "accept_scan_full.pdf", remarks: "Condition: all pieces intact" },
  { state: "Weighed & Inspected", user: "fatima.siddiqui", timestamp: "2026-06-08 09:30:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "Weighbridge 2, LHE", evidenceLink: "weight_slip_56123.pdf", remarks: "Gross: 847 kg, chargeable: 852 kg" },
  { state: "Storage Allocated", user: "system", timestamp: "2026-06-08 09:35:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "Zone C-04, LHE", evidenceLink: "slot_alloc_C04.pdf", remarks: "Cold-chain zone assigned" },
  { state: "Stored", user: "umer.iftikhar", timestamp: "2026-06-08 09:52:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "C-04-12, LHE", evidenceLink: "putaway_scan_c04.png", remarks: "Confirmed via RFID scan" },
  { state: "Customs Filed", user: "zainab.khan", timestamp: "2026-06-08 10:20:00", module: "CHA", sourceSystem: "AirVault CHA", location: "LHE", evidenceLink: "gd_filing_56123.pdf", remarks: "GD filed via WeBOC" },
  { state: "Customs Channel Assigned", user: "system", timestamp: "2026-06-08 10:45:00", module: "Compliance", sourceSystem: "WeBOC Gateway", location: "LHE", evidenceLink: "channel_green_resp.json", remarks: "Channel: Green" },
  { state: "Cleared OOC", user: "zainab.khan", timestamp: "2026-06-08 11:10:00", module: "Compliance", sourceSystem: "AirVault Compliance", location: "LHE", evidenceLink: "ooc_clear_56123.pdf", remarks: "No objection — cleared" },
  { state: "Charges Invoiced", user: "omer.farooq", timestamp: "2026-06-08 11:30:00", module: "Finance", sourceSystem: "AirVault Billing", location: "LHE", evidenceLink: "inv_2026_0042.pdf", remarks: "Invoice INV-2026-0042 generated" },
  { state: "Paid", user: "system", timestamp: "2026-06-08 12:05:00", module: "Finance", sourceSystem: "Payment Gateway", location: "LHE", evidenceLink: "pmt_rcpt_0042.pdf", remarks: "PKR 48,250 paid via HBL" },
  { state: "DO Issued", user: "zainab.khan", timestamp: "2026-06-08 12:20:00", module: "CHA", sourceSystem: "AirVault CHA", location: "LHE", evidenceLink: "do_56123_0812.pdf", remarks: "Delivery Order DO-0812 issued" },
  { state: "Gate Pass Issued", user: "khalid.mehmood", timestamp: "2026-06-08 13:00:00", module: "Gate Entry", sourceSystem: "AirVault Gate", location: "Gate 3, LHE", evidenceLink: "gatepass_V1356.pdf", remarks: "Vehicle V-1356 authorized" },
  { state: "Picked", user: "umer.iftikhar", timestamp: "2026-06-08 13:25:00", module: "Warehouse", sourceSystem: "AirVault WMS", location: "C-04-12, LHE", evidenceLink: "pick_scan_56123.png", remarks: "12 pieces picked, RFID verified" },
  { state: "POD Captured", user: "khalid.mehmood", timestamp: "2026-06-08 13:45:00", module: "Gate Entry", sourceSystem: "AirVault Gate", location: "Gate 3, LHE", evidenceLink: "pod_V1356_56123.pdf", remarks: "POD signed and scanned" },
  { state: "Dispatched", user: "system", timestamp: "2026-06-08 13:50:00", module: "Gate Entry", sourceSystem: "AirVault Gate", location: "Gate 3, LHE", evidenceLink: "exit_log_V1356.txt", remarks: "Vehicle exited premises" },
  { state: "DLV Sent", user: "system", timestamp: "2026-06-08 14:00:00", module: "ULD Builder", sourceSystem: "AirVault MSG", location: "LHE", evidenceLink: "dlv_msg_56123.txt", remarks: "DLV message transmitted" },
  { state: "Closed", user: "system", timestamp: "2026-06-08 14:05:00", module: "System", sourceSystem: "AirVault Core", location: "LHE", evidenceLink: "closure_23456123.pdf", remarks: "Shipment lifecycle complete" },
];

const mockPieceTrace: PieceTrace[] = [
  { pieceId: "PC-001", rfidEpc: "EPC-3008-33B2-DDD9-0001", awb: "117-23456123", location: "Dispatched", event: "POD Captured", user: "khalid.mehmood", timestamp: "2026-06-08 13:45", evidence: "pod_scan_001.png" },
  { pieceId: "PC-002", rfidEpc: "EPC-3008-33B2-DDD9-0002", awb: "117-23456123", location: "Dispatched", event: "POD Captured", user: "khalid.mehmood", timestamp: "2026-06-08 13:45", evidence: "pod_scan_002.png" },
  { pieceId: "PC-003", rfidEpc: "EPC-3008-33B2-DDD9-0003", awb: "117-23456123", location: "Dispatched", event: "POD Captured", user: "khalid.mehmood", timestamp: "2026-06-08 13:45", evidence: "pod_scan_003.png" },
  { pieceId: "PC-004", rfidEpc: "EPC-3008-33B2-DDD9-0004", awb: "117-23456123", location: "Stored", event: "Stored", user: "umer.iftikhar", timestamp: "2026-06-08 09:52", evidence: "store_scan_004.png" },
  { pieceId: "PC-005", rfidEpc: "EPC-3008-33B2-DDD9-0005", awb: "117-23456123", location: "Stored", event: "Stored", user: "umer.iftikhar", timestamp: "2026-06-08 09:52", evidence: "store_scan_005.png" },
  { pieceId: "PC-006", rfidEpc: "EPC-3008-33B2-DDD9-0006", awb: "117-23456123", location: "Stored", event: "Stored", user: "umer.iftikhar", timestamp: "2026-06-08 09:52", evidence: "store_scan_006.png" },
  { pieceId: "PC-007", rfidEpc: "EPC-3008-33B2-DDD9-0007", awb: "117-23456123", location: "Dispatched", event: "POD Captured", user: "khalid.mehmood", timestamp: "2026-06-08 13:45", evidence: "pod_scan_007.png" },
  { pieceId: "PC-008", rfidEpc: "EPC-3008-33B2-DDD9-0008", awb: "117-23456123", location: "Dispatched", event: "POD Captured", user: "khalid.mehmood", timestamp: "2026-06-08 13:45", evidence: "pod_scan_008.png" },
];

export default function CargoTraceContent() {
  const [searchType, setSearchType] = useState("awb");
  const [searchValue, setSearchValue] = useState("117-23456123");
  const [searched, setSearched] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchOptions = [
    { value: "awb", label: "AWB #" },
    { value: "hawb", label: "HAWB #" },
    { value: "rfid", label: "RFID EPC" },
    { value: "gatepass", label: "Gate Pass #" },
    { value: "do", label: "DO #" },
  ];

  const handleSearch = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 600);
  };

  if (loading) return <LoadingSkeleton rows={8} columns={6} />;
  if (error) return <ErrorState message={error} onRetry={() => setError("")} />;

  return (
    <div className="space-y-6">
      <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-lg border border-[#E2E8F0] overflow-hidden">
            {searchOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSearchType(opt.value)}
                className="h-9 px-3 text-[12px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                style={{
                  backgroundColor: searchType === opt.value ? "#0B2545" : "white",
                  color: searchType === opt.value ? "white" : "#64748B",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={`Enter ${searchOptions.find((o) => o.value === searchType)?.label}...`}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#2E75B6]"
            />
          </div>
          <button
            onClick={handleSearch}
            className="h-9 px-5 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            Trace
          </button>
        </div>
      </div>

      {searched && (
        <>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold text-[#0F172A]">
                  End-to-End Timeline — AWB 117-23456123
                </h2>
                <ScopeBadge type="inc" />
              </div>
              <span className="text-[12px] text-[#64748B] font-medium">
                23 events
              </span>
            </div>

            <div className="relative pl-8">
              <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-[#E2E8F0]" />

              {mockCargoTimeline.map((event, idx) => (
                <div key={idx} className="relative pb-5 last:pb-0">
                  <div
                    className="absolute left-[-1.65rem] top-1 w-[14px] h-[14px] rounded-full border-2 border-white ring-2 z-10"
                    style={{ backgroundColor: idx < 12 ? "#2E75B6" : idx < 16 ? "#D97706" : "#16A34A", "--tw-ring-color": idx < 12 ? "#2E75B6" : idx < 16 ? "#D97706" : "#16A34A" } as React.CSSProperties}
                  />
                  <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 ml-2">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[14px] font-bold text-[#0F172A]">{event.state}</span>
                        <span className="text-[12px] text-[#64748B] ml-2">by {event.user}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                        <Clock size={12} />
                        {event.timestamp}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
                      <div>
                        <span className="text-[#94A3B8]">Module: </span>
                        <span className="text-[#334155] font-medium">{event.module}</span>
                      </div>
                      <div>
                        <span className="text-[#94A3B8]">Source: </span>
                        <span className="text-[#334155] font-medium">{event.sourceSystem}</span>
                      </div>
                      <div>
                        <span className="text-[#94A3B8]">Location: </span>
                        <span className="text-[#334155] font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ExternalLink size={12} className="text-[#2E75B6]" />
                        <button className="text-[12px] text-[#2E75B6] hover:underline cursor-pointer font-medium">
                          {event.evidenceLink}
                        </button>
                      </div>
                    </div>
                    {event.remarks && (
                      <p className="text-[11px] text-[#94A3B8] mt-2 italic">{event.remarks}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-[16px] font-bold text-[#0F172A]">Piece Trace</h2>
              <ScopeBadge type="inc" />
            </div>
            <DataTable
              columns={[
                { key: "pieceId", header: "Piece ID", width: "100px" },
                { key: "rfidEpc", header: "RFID EPC", width: "200px" },
                { key: "awb", header: "AWB #", width: "130px" },
                { key: "location", header: "Location", width: "110px" },
                { key: "event", header: "Event", width: "110px" },
                { key: "user", header: "User", width: "130px" },
                { key: "timestamp", header: "Timestamp", width: "140px" },
                { key: "evidence", header: "Evidence", width: "130px" },
              ]}
              rows={mockPieceTrace.map((p) => ({
                pieceId: <span className="text-[12px] font-mono font-medium text-[#0F172A]">{p.pieceId}</span>,
                rfidEpc: <span className="text-[12px] font-mono text-[#334155]">{p.rfidEpc}</span>,
                awb: <span className="text-[12px] font-medium text-[#1B4F8B]">{p.awb}</span>,
                location: (
                  <span className="inline-flex items-center h-6 px-2 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#16A34A]">
                    {p.location}
                  </span>
                ),
                event: <span className="text-[12px] text-[#334155]">{p.event}</span>,
                user: <span className="text-[12px] text-[#0F172A]">{p.user}</span>,
                timestamp: <span className="text-[12px] font-mono text-[#64748B]">{p.timestamp}</span>,
                evidence: (
                  <button className="text-[12px] text-[#2E75B6] hover:underline cursor-pointer font-medium">
                    {p.evidence}
                  </button>
                ),
              }))}
              headerStyle="navy"
            />
          </div>

          <div className="rounded-lg border border-[#FEF3C7] bg-[#FFFBEB] p-4">
            <h3 className="text-[13px] font-bold text-[#D97706] mb-2">Exception Branches</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { label: "Discrepancy CDR", status: "Not triggered", icon: "⚠" },
                { label: "Transhipment", status: "Not applicable", icon: "↔" },
                { label: "Re-export", status: "Not triggered", icon: "↩" },
                { label: "Long-stay Section 82", status: "Not triggered", icon: "⏳" },
              ].map((ex) => (
                <div key={ex.label} className="flex items-center gap-2 text-[12px]">
                  <span className="text-base">{ex.icon}</span>
                  <div>
                    <span className="font-medium text-[#0F172A]">{ex.label}: </span>
                    <span className="text-[#16A34A] font-medium">{ex.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!searched && (
        <EmptyState
          title="No cargo trace"
          description="Enter an AWB, HAWB, RFID, Gate Pass, or DO number to trace."
        />
      )}
    </div>
  );
}