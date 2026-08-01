"use client";

import { useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton";
import EmptyState from "../EmptyState";
import ErrorState from "../ErrorState";
import { useToast } from "../ToastContext";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  Search,
  Download,
  ChevronDown,
  Calendar,
  Filter,
  LayoutGrid,
  Table2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface ReportCard {
  id: string;
  category: string;
  title: string;
  description: string;
  scope: "inc" | "exc";
  lastUpdated: string;
  trend: "up" | "down" | "neutral";
  chartData: { label: string; value: number }[];
}

const reportCards: ReportCard[] = [
  {
    id: "inbound-by-day",
    category: "Cargo & Operations",
    title: "Inbound by Day",
    description: "Daily inbound cargo volume trend across all stations",
    scope: "inc",
    lastUpdated: "2026-06-08 09:15",
    trend: "up",
    chartData: [
      { label: "Mon", value: 42 }, { label: "Tue", value: 38 },
      { label: "Wed", value: 55 }, { label: "Thu", value: 48 },
      { label: "Fri", value: 62 }, { label: "Sat", value: 35 },
      { label: "Sun", value: 28 },
    ],
  },
  {
    id: "pieces-by-class",
    category: "Cargo & Operations",
    title: "Pieces by Class",
    description: "Distribution of pieces across cargo handling classes",
    scope: "inc",
    lastUpdated: "2026-06-08 09:15",
    trend: "neutral",
    chartData: [
      { label: "GCR", value: 120 }, { label: "ICG", value: 85 },
      { label: "DGR", value: 42 }, { label: "VAL", value: 18 },
      { label: "PER", value: 9 },
    ],
  },
  {
    id: "storage-occupancy",
    category: "Cargo & Operations",
    title: "Storage Occupancy",
    description: "Real-time warehouse storage occupancy by zone",
    scope: "inc",
    lastUpdated: "2026-06-08 09:15",
    trend: "up",
    chartData: [
      { label: "A", value: 78 }, { label: "B", value: 92 },
      { label: "C", value: 65 }, { label: "D", value: 54 },
      { label: "E", value: 88 },
    ],
  },
  {
    id: "cdr-rate",
    category: "Cargo & Operations",
    title: "CDR Rate",
    description: "Cargo Discrepancy Report rate across imports",
    scope: "inc",
    lastUpdated: "2026-06-08 09:15",
    trend: "down",
    chartData: [
      { label: "W1", value: 8 }, { label: "W2", value: 12 },
      { label: "W3", value: 6 }, { label: "W4", value: 4 },
    ],
  },
  {
    id: "sla-conformance",
    category: "Cargo & Operations",
    title: "SLA Conformance",
    description: "Service level agreement conformance percentage by process",
    scope: "inc",
    lastUpdated: "2026-06-08 09:15",
    trend: "up",
    chartData: [
      { label: "Putaway", value: 94 }, { label: "Picking", value: 88 },
      { label: "Customs", value: 76 }, { label: "Dispatch", value: 91 },
      { label: "Gate", value: 97 },
    ],
  },
  {
    id: "rack-utilisation",
    category: "Storage",
    title: "Rack Utilisation",
    description: "Rack occupancy percentage across warehouse zones",
    scope: "inc",
    lastUpdated: "2026-06-08 08:45",
    trend: "neutral",
    chartData: [
      { label: "R1", value: 85 }, { label: "R2", value: 72 },
      { label: "R3", value: 91 }, { label: "R4", value: 63 },
    ],
  },
  {
    id: "average-dwell",
    category: "Storage",
    title: "Average Dwell",
    description: "Average cargo dwell time in storage before dispatch",
    scope: "inc",
    lastUpdated: "2026-06-08 08:45",
    trend: "down",
    chartData: [
      { label: "May1", value: 4.2 }, { label: "May2", value: 3.8 },
      { label: "Jun1", value: 3.5 }, { label: "Jun2", value: 3.1 },
    ],
  },
  {
    id: "cold-chain-anomalies",
    category: "Storage",
    title: "Cold-chain Anomalies",
    description: "Temperature excursions and cold-chain breach incidents",
    scope: "inc",
    lastUpdated: "2026-06-08 08:45",
    trend: "up",
    chartData: [
      { label: "W1", value: 2 }, { label: "W2", value: 5 },
      { label: "W3", value: 3 }, { label: "W4", value: 7 },
    ],
  },
  {
    id: "dos-issued",
    category: "Dispatch",
    title: "DOs Issued",
    description: "Delivery orders issued count by day and terminal",
    scope: "inc",
    lastUpdated: "2026-06-08 09:00",
    trend: "up",
    chartData: [
      { label: "Mon", value: 18 }, { label: "Tue", value: 22 },
      { label: "Wed", value: 15 }, { label: "Thu", value: 28 },
      { label: "Fri", value: 31 },
    ],
  },
  {
    id: "pod-compliance",
    category: "Dispatch",
    title: "POD Compliance",
    description: "Proof of delivery capture rate and compliance tracking",
    scope: "inc",
    lastUpdated: "2026-06-08 09:00",
    trend: "up",
    chartData: [
      { label: "Apr", value: 82 }, { label: "May", value: 88 },
      { label: "Jun", value: 93 },
    ],
  },
  {
    id: "vehicle-dwell-gate",
    category: "Dispatch",
    title: "Vehicle Dwell at Gate",
    description: "Average vehicle dwell time at entry/exit gates in minutes",
    scope: "inc",
    lastUpdated: "2026-06-08 09:00",
    trend: "down",
    chartData: [
      { label: "Entry", value: 12 }, { label: "Exit", value: 18 },
      { label: "Peak", value: 25 }, { label: "Off-Peak", value: 8 },
    ],
  },
  {
    id: "operator-productivity",
    category: "Workforce",
    title: "Operator Productivity",
    description: "Moves per hour by lifter operator and shift",
    scope: "inc",
    lastUpdated: "2026-06-08 09:30",
    trend: "up",
    chartData: [
      { label: "Shift A", value: 22 }, { label: "Shift B", value: 19 },
      { label: "Shift C", value: 24 },
    ],
  },
  {
    id: "lifter-utilisation",
    category: "Workforce",
    title: "Lifter Utilisation",
    description: "Lifter equipment utilisation percentage by asset",
    scope: "inc",
    lastUpdated: "2026-06-08 09:30",
    trend: "neutral",
    chartData: [
      { label: "LF-01", value: 78 }, { label: "LF-02", value: 85 },
      { label: "LF-03", value: 62 }, { label: "LF-04", value: 91 },
    ],
  },
  {
    id: "shift-comparison",
    category: "Workforce",
    title: "Shift Comparison",
    description: "Side-by-side throughput comparison across shifts",
    scope: "inc",
    lastUpdated: "2026-06-08 09:30",
    trend: "neutral",
    chartData: [
      { label: "A-Ton", value: 340 }, { label: "B-Ton", value: 295 },
      { label: "A-Moves", value: 180 }, { label: "B-Moves", value: 210 },
    ],
  },
  {
    id: "daily-billing",
    category: "Financial",
    title: "Daily Billing",
    description: "Daily invoiced amount in PKR with trend indicator",
    scope: "inc",
    lastUpdated: "2026-06-08 10:00",
    trend: "up",
    chartData: [
      { label: "Mon", value: 245000 }, { label: "Tue", value: 312000 },
      { label: "Wed", value: 198000 }, { label: "Thu", value: 389000 },
      { label: "Fri", value: 425000 },
    ],
  },
  {
    id: "waiver-rate",
    category: "Financial",
    title: "Waiver Rate",
    description: "Percentage of charges waived vs total chargeable amount",
    scope: "inc",
    lastUpdated: "2026-06-08 10:00",
    trend: "down",
    chartData: [
      { label: "Apr", value: 4.8 }, { label: "May", value: 3.9 },
      { label: "Jun", value: 2.7 },
    ],
  },
  {
    id: "outstanding-aging",
    category: "Financial",
    title: "Outstanding Aging",
    description: "Accounts receivable aging distribution in days",
    scope: "inc",
    lastUpdated: "2026-06-08 10:00",
    trend: "up",
    chartData: [
      { label: "0-30", value: 1200000 }, { label: "31-60", value: 560000 },
      { label: "61-90", value: 230000 }, { label: "90+", value: 89000 },
    ],
  },
  {
    id: "tariff-slab-distribution",
    category: "Financial",
    title: "Tariff Slab Distribution",
    description: "Volume distribution across applicable tariff slabs",
    scope: "inc",
    lastUpdated: "2026-06-08 10:00",
    trend: "neutral",
    chartData: [
      { label: "0-50", value: 210 }, { label: "51-100", value: 145 },
      { label: "101-500", value: 88 }, { label: "500+", value: 42 },
    ],
  },
  {
    id: "dolley-utilisation",
    category: "Dolley / GSE",
    title: "GSE Utilisation",
    description: "Ground support equipment utilisation rate",
    scope: "exc",
    lastUpdated: "2026-06-08 08:00",
    trend: "neutral",
    chartData: [
      { label: "Dolley", value: 67 }, { label: "Tug", value: 73 },
      { label: "Belt", value: 58 },
    ],
  },
  {
    id: "gse-maintenance",
    category: "Dolley / GSE",
    title: "Maintenance Compliance",
    description: "Scheduled maintenance completion rate for GSE fleet",
    scope: "exc",
    lastUpdated: "2026-06-08 08:00",
    trend: "down",
    chartData: [
      { label: "Q1", value: 94 }, { label: "Q2", value: 87 },
      { label: "Q3", value: 82 },
    ],
  },
  {
    id: "gse-mtbf",
    category: "Dolley / GSE",
    title: "MTBF",
    description: "Mean time between failures for GSE assets in hours",
    scope: "exc",
    lastUpdated: "2026-06-08 08:00",
    trend: "up",
    chartData: [
      { label: "Dolley", value: 340 }, { label: "Tug", value: 520 },
    ],
  },
  {
    id: "demand-forecast",
    category: "Predictive Layer",
    title: "Demand Forecast",
    description: "AI-driven 7-day demand forecast with confidence bands",
    scope: "exc",
    lastUpdated: "2026-06-08 07:00",
    trend: "up",
    chartData: [
      { label: "D1", value: 280 }, { label: "D2", value: 310 },
      { label: "D3", value: 265 }, { label: "D4", value: 340 },
      { label: "D5", value: 390 }, { label: "D6", value: 250 },
      { label: "D7", value: 300 },
    ],
  },
  {
    id: "anomaly-detection",
    category: "Predictive Layer",
    title: "Anomaly Detection",
    description: "Machine learning anomaly scores for operational events",
    scope: "exc",
    lastUpdated: "2026-06-08 07:00",
    trend: "neutral",
    chartData: [
      { label: "Mon", value: 0.2 }, { label: "Tue", value: 0.8 },
      { label: "Wed", value: 0.3 }, { label: "Thu", value: 0.9 },
      { label: "Fri", value: 0.4 },
    ],
  },
  {
    id: "auction-risk",
    category: "Predictive Layer",
    title: "Auction-risk Score",
    description: "Predictive risk scoring for cargo approaching auction threshold",
    scope: "exc",
    lastUpdated: "2026-06-08 07:00",
    trend: "up",
    chartData: [
      { label: "AWB1", value: 62 }, { label: "AWB2", value: 45 },
      { label: "AWB3", value: 78 }, { label: "AWB4", value: 33 },
    ],
  },
];

const cargoClasses = ["All", "GCR", "ICG", "DGR", "VAL", "PER", "VUN", "AVI"];
const channels = ["All", "Green", "Yellow", "Red"];
const stations = ["All", "KHI", "LHE", "ISB", "PEW", "MUX"];

export default function ReportsContent() {
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [dateFrom, setDateFrom] = useState("2026-06-01");
  const [dateTo, setDateTo] = useState("2026-06-08");
  const [cargoClass, setCargoClass] = useState("All");
  const [channel, setChannel] = useState("All");
  const [station, setStation] = useState("All");
  const [agent, setAgent] = useState("");
  const [consignee, setConsignee] = useState("");
  const [airline, setAirline] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Cargo & Operations");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);

  const categories = Array.from(new Set(reportCards.map((r) => r.category)));

  const filteredReports = reportCards.filter((r) => {
    if (cargoClass !== "All" && !r.title.toLowerCase().includes(cargoClass.toLowerCase())) return false;
    return true;
  });

  const handleExport = (format: string) => {
    addToast(`Report exported as ${format}`, "success");
  };

  const handleScheduleExport = () => {
    addToast("Recurring email export scheduled", "success");
  };

  const handleOpenReport = (report: ReportCard) => {
    setSelectedReport(report);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
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
        <LoadingSkeleton rows={6} columns={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-[#64748B]" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white cursor-pointer"
          />
          <span className="text-[13px] text-[#64748B]">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white cursor-pointer"
          />
        </div>

        <div className="relative">
          <select
            value={cargoClass}
            onChange={(e) => setCargoClass(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white cursor-pointer appearance-none"
          >
            {cargoClasses.map((c) => (
              <option key={c} value={c}>{c === "All" ? "Cargo Class" : c}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white cursor-pointer appearance-none"
          >
            {channels.map((c) => (
              <option key={c} value={c}>{c === "All" ? "Customs Channel" : c}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white cursor-pointer appearance-none"
          >
            {stations.map((s) => (
              <option key={s} value={s}>{s === "All" ? "Station" : s}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>

        <input
          type="text"
          placeholder="Agent"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white w-[120px]"
        />

        <input
          type="text"
          placeholder="Consignee"
          value={consignee}
          onChange={(e) => setConsignee(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white w-[120px]"
        />

        <input
          type="text"
          placeholder="Airline"
          value={airline}
          onChange={(e) => setAirline(e.target.value)}
          className="h-9 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] bg-white w-[110px]"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-[#E2E8F0] p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-all whitespace-nowrap ${
              viewMode === "grid" ? "bg-[#0B2545] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            <LayoutGrid size={14} />
            Grid
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold cursor-pointer transition-all whitespace-nowrap ${
              viewMode === "table" ? "bg-[#0B2545] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"
            }`}
          >
            <Table2 size={14} />
            Table
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("CSV")}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Download size={13} />
            CSV
          </button>
          <button
            onClick={() => handleExport("XLSX")}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Download size={13} />
            XLSX
          </button>
          <button
            onClick={() => handleExport("PDF")}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F8FAFC] cursor-pointer transition-colors whitespace-nowrap"
          >
            <Download size={13} />
            PDF
          </button>
          <button
            onClick={handleScheduleExport}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: "#0B2545" }}
          >
            Schedule Email
          </button>
        </div>
      </div>

      {filteredReports.length === 0 ? (
        <EmptyState
          title="No reports found"
          description="No reports match the selected filters. Try adjusting your criteria."
        />
      ) : viewMode === "grid" ? (
        <div className="space-y-6">
          {categories.map((category) => {
            const catReports = filteredReports.filter((r) => r.category === category);
            const isExpanded = expandedCategory === category;
            return (
              <div key={category}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category)}
                  className="flex items-center gap-3 w-full text-left mb-3 cursor-pointer group"
                >
                  <h3 className="text-[14px] font-bold text-[#0B2545]">{category}</h3>
                  <span className="text-[12px] text-[#94A3B8]">{catReports.length} reports</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#94A3B8] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
                {isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catReports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        onOpen={() => handleOpenReport(report)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "#0B2545" }}>
              <tr>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Report</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Category</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Trend</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Last Updated</th>
                <th className="text-left text-[11px] font-bold uppercase tracking-wider px-4 py-3 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report, i) => (
                <tr
                  key={report.id}
                  className="border-b border-[#E2E8F0] transition-colors hover:bg-[#F1F5F9]"
                  style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "white" }}
                >
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold text-[#0F172A]">{report.title}</span>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{report.description}</p>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#64748B]">{report.category}</td>
                  <td className="px-4 py-3">
                    {report.trend === "up" ? (
                      <TrendingUp size={16} className="text-[#16A34A]" />
                    ) : report.trend === "down" ? (
                      <TrendingDown size={16} className="text-[#DC2626]" />
                    ) : (
                      <Minus size={16} className="text-[#64748B]" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#64748B]">{report.lastUpdated}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleOpenReport(report)}
                      className="h-7 px-3 rounded-lg text-[11px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
                      style={{ backgroundColor: "#0B2545" }}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
}

function ReportCard({ report, onOpen }: { report: ReportCard; onOpen: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={onOpen}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-[13px] font-bold text-[#0F172A]">{report.title}</h4>
        </div>
        {report.trend === "up" ? (
          <TrendingUp size={16} className="text-[#16A34A]" />
        ) : report.trend === "down" ? (
          <TrendingDown size={16} className="text-[#DC2626]" />
        ) : (
          <Minus size={16} className="text-[#64748B]" />
        )}
      </div>
      <p className="text-[12px] text-[#64748B] mb-3">{report.description}</p>
      <div className="h-[60px] mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={report.chartData}>
            <Bar dataKey="value" fill="#2E75B6" radius={[3, 3, 0, 0]} />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: "1px solid #E2E8F0",
                backgroundColor: "white",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[#94A3B8]">{report.lastUpdated}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="h-7 px-3 rounded-lg text-[11px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap"
          style={{ backgroundColor: "#0B2545" }}
        >
          Open Report
        </button>
      </div>
    </div>
  );
}

function ReportDetailModal({ report, onClose }: { report: ReportCard; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="w-full max-w-[720px] bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 h-[56px] border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold text-[#0F172A]">{report.title}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[13px] text-[#64748B] mb-1">Category</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">{report.category}</p>
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-[#64748B] mb-1">Last Updated</p>
              <p className="text-[14px] font-semibold text-[#0F172A]">{report.lastUpdated}</p>
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-[#64748B] mb-1">Trend</p>
              <div className="flex items-center gap-1">
                {report.trend === "up" ? (
                  <TrendingUp size={16} className="text-[#16A34A]" />
                ) : report.trend === "down" ? (
                  <TrendingDown size={16} className="text-[#DC2626]" />
                ) : (
                  <Minus size={16} className="text-[#64748B]" />
                )}
                <span className="text-[14px] font-semibold capitalize">{report.trend}</span>
              </div>
            </div>
          </div>
          <p className="text-[13px] text-[#64748B]">{report.description}</p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.chartData}>
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748B" }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E2E8F0", backgroundColor: "white" }} />
                <Bar dataKey="value" fill="#2E75B6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
              <Download size={13} />
              Export CSV
            </button>
            <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: "#0B2545" }}>
              <Download size={13} />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}