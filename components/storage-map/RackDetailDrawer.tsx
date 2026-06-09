"use client";

import { useState } from "react";
import ScopeBadge from "@/components/ScopeBadge";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";
import { X, MapPin, Thermometer, Clock, CheckCircle2 } from "lucide-react";
import type { RackData } from "@/app/warehouse-manager/storage-map/page";

interface RackDetailDrawerProps {
  rack: RackData;
  onClose: () => void;
}

export default function RackDetailDrawer({ rack, onClose }: RackDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState("details");

  const detailRows = [
    { label: "Rack ID", value: rack.rackId },
    { label: "Row", value: rack.row },
    { label: "Level", value: rack.level },
    { label: "Bin", value: rack.bin },
    { label: "Zone", value: rack.zone },
    { label: "Occupancy", value: `${rack.occupancy}%` },
    { label: "Capacity", value: `${rack.capacity} pieces` },
    { label: "Current Pieces", value: rack.currentPieces.toString() },
    { label: "Handling Code", value: rack.handlingCode },
    { label: "Temperature", value: rack.temperature },
    { label: "Last Scan", value: rack.lastScanTime },
  ];

  const columns = [
    { key: "awb", header: "AWB #" },
    { key: "hawb", header: "HAWB #" },
    { key: "pieceId", header: "Piece ID" },
    { key: "rfid", header: "RFID EPC" },
    { key: "cargoClass", header: "Cargo Class" },
    { key: "weight", header: "Weight" },
    { key: "storedAt", header: "Stored At" },
    { key: "dwellTime", header: "Dwell Time" },
    { key: "status", header: "Status" },
  ];

  const rows = rack.awbs.map((awb) => ({
    awb: awb.awb,
    hawb: awb.hawb || "—",
    pieceId: awb.pieceId,
    rfid: awb.rfid,
    cargoClass: awb.cargoClass,
    weight: awb.weight,
    storedAt: awb.storedAt,
    dwellTime: awb.dwellTime,
    status: <StatusBadge status={awb.status} />,
  }));

  const statusColor = rack.status === "available" ? "#16A34A" : rack.status === "partial" ? "#D97706" : rack.status === "full" ? "#DC2626" : "#94A3B8";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-[520px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${statusColor}15` }}>
              <MapPin size={20} style={{ color: statusColor }} />
            </div>
            <div>
              <h2 className="text-[18px] font-semibold text-[#0F172A] leading-[28px]">
                Rack Occupancy Detail
              </h2>
              <p className="text-[12px] text-[#64748B] font-mono">{rack.rackId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ScopeBadge type="inc" />
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Status banner */}
        <div className="px-6 py-3 border-b border-[#E2E8F0]"
          style={{ backgroundColor: `${statusColor}08` }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} style={{ color: statusColor }} />
            <span className="text-[13px] font-semibold" style={{ color: statusColor }}>
              {rack.status.charAt(0).toUpperCase() + rack.status.slice(1)} — {rack.occupancy}% occupied
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-0 px-6 border-b border-[#E2E8F0]">
          {[
            { key: "details", label: "Details" },
            { key: "awbs", label: `Stored AWBs (${rack.awbs.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="h-10 px-4 text-[13px] font-semibold cursor-pointer transition-colors border-b-2 whitespace-nowrap"
              style={{
                color: activeTab === tab.key ? "#0B2545" : "#64748B",
                borderColor: activeTab === tab.key ? "#0B2545" : "transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" && (
            <div className="flex flex-col gap-0">
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-3 border-b border-[#E2E8F0] last:border-b-0"
                >
                  <span className="text-[13px] text-[#64748B]">{row.label}</span>
                  <span className="text-[13px] font-semibold text-[#0F172A]">{row.value}</span>
                </div>
              ))}

              {/* Occupancy bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold text-[#64748B]">Occupancy</span>
                  <span className="text-[12px] font-bold text-[#0F172A]">{rack.occupancy}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${rack.occupancy}%`,
                      backgroundColor: statusColor,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-[#94A3B8]">0%</span>
                  <span className="text-[11px] text-[#94A3B8]">100%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "awbs" && (
            <div>
              {rows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mb-3">
                    <Clock size={28} className="text-[#94A3B8]" />
                  </div>
                  <p className="text-[14px] font-semibold text-[#0F172A] mb-1">No AWBs stored</p>
                  <p className="text-[12px] text-[#64748B]">This rack is empty.</p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  rows={rows}
                  zebra
                  sortable
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}