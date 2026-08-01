"use client";

import { useState } from "react";
import { Thermometer, Snowflake, AlertTriangle, CheckCircle, Clock, Package, QrCode } from "lucide-react";

interface Regime {
  id: string;
  name: string;
  code: string;
  currentTemp: string;
  threshold: string;
  awbs: string;
  pieces: string;
  lastAnomaly: string;
  sensorStatus: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const regimes: Regime[] = [
  {
    id: "ert",
    name: "Extended Room Temp",
    code: "ERT",
    currentTemp: "+22.4°C",
    threshold: "+15 to +25°C",
    awbs: "12",
    pieces: "34",
    lastAnomaly: "None",
    sensorStatus: "Online",
    color: "#1B4F8B",
    bgColor: "#EBF0F7",
    borderColor: "#DBEAFE",
  },
  {
    id: "col",
    name: "Cool Room",
    code: "COL",
    currentTemp: "+5.2°C",
    threshold: "+2 to +8°C",
    awbs: "18",
    pieces: "52",
    lastAnomaly: "31 May 10:15",
    sensorStatus: "Online",
    color: "#0B2545",
    bgColor: "#F0F9FF",
    borderColor: "#E0F2FE",
  },
  {
    id: "crt",
    name: "Controlled Room Temp",
    code: "CRT",
    currentTemp: "+8.7°C",
    threshold: "+2 to +8°C",
    awbs: "11",
    pieces: "28",
    lastAnomaly: "None",
    sensorStatus: "Online",
    color: "#4338CA",
    bgColor: "#F5F3FF",
    borderColor: "#E0E7FF",
  },
  {
    id: "fro",
    name: "Frozen Room",
    code: "FRO",
    currentTemp: "-18.3°C",
    threshold: "-20 to -15°C",
    awbs: "6",
    pieces: "19",
    lastAnomaly: "31 May 09:40",
    sensorStatus: "Degraded",
    color: "#0369A1",
    bgColor: "#F0F9FF",
    borderColor: "#E0F2FE",
  },
];

interface RegimeCardsProps {
  onSelectRegime: (regime: string | null) => void;
  selectedRegime: string | null;
}

export default function RegimeCards({ onSelectRegime, selectedRegime }: RegimeCardsProps) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[16px] font-bold text-[#0F172A]">Cold Chain Regimes</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {regimes.map((regime) => {
          const isSelected = selectedRegime === regime.id;
          return (
            <button
              key={regime.id}
              onClick={() => onSelectRegime(isSelected ? null : regime.id)}
              className="text-left rounded-xl border p-5 cursor-pointer transition-all hover:shadow-sm"
              style={{
                backgroundColor: isSelected ? regime.bgColor : "white",
                borderColor: isSelected ? regime.color : "#E2E8F0",
                borderWidth: isSelected ? 2 : 1,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: regime.bgColor }}
                  >
                    {regime.id === "fro" ? (
                      <Snowflake size={18} style={{ color: regime.color }} />
                    ) : (
                      <Thermometer size={18} style={{ color: regime.color }} />
                    )}
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      {regime.code}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[14px] font-bold text-[#0F172A] mb-3">{regime.name}</p>

              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Thermometer size={14} style={{ color: regime.color }} />
                  <span className="text-[24px] font-bold" style={{ color: regime.color }}>
                    {regime.currentTemp}
                  </span>
                </div>
                <p className="text-[12px] text-[#64748B]">Threshold: {regime.threshold}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1.5">
                  <Package size={12} className="text-[#94A3B8]" />
                  <span className="text-[12px] text-[#0F172A]">{regime.awbs} AWBs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <QrCode size={12} className="text-[#94A3B8]" />
                  <span className="text-[12px] text-[#0F172A]">{regime.pieces} pieces</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Clock size={12} className="text-[#94A3B8]" />
                <span className="text-[12px] text-[#64748B]">
                  Last anomaly: {regime.lastAnomaly}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {regime.sensorStatus === "Online" ? (
                  <>
                    <CheckCircle size={12} className="text-[#16A34A]" />
                    <span className="text-[12px] font-medium text-[#16A34A]">{regime.sensorStatus}</span>
                  </>
                ) : regime.sensorStatus === "Degraded" ? (
                  <>
                    <AlertTriangle size={12} className="text-[#D97706]" />
                    <span className="text-[12px] font-medium text-[#D97706]">{regime.sensorStatus}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={12} className="text-[#DC2626]" />
                    <span className="text-[12px] font-medium text-[#DC2626]">{regime.sensorStatus}</span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}