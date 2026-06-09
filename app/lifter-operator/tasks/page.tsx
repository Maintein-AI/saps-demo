"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import KPIStrip from "@/components/lifter-operator/KPIStrip";
import TaskFilters from "@/components/lifter-operator/TaskFilters";
import TaskList from "@/components/lifter-operator/TaskList";
import TodaySummary from "@/components/lifter-operator/TodaySummary";

const taskData = [
  {
    id: "T-2026-0041",
    type: "Putaway",
    priority: "High",
    awb: "214-45678901",
    pieceId: "P-21445678901-07",
    rfid: "EPC-3008-21445678901-0007",
    fromLocation: "Receiving Bay 02",
    toLocation: "AFU-R02-L1-B04",
    cargoClass: "AFU",
    weight: "52 kg",
    handlingCode: "DGR",
    timeAssigned: "31 May 2026 10:15",
    slaRemaining: "18 min",
    assignedBy: "Imran Ali",
    status: "Assigned",
  },
  {
    id: "T-2026-0042",
    type: "Pick",
    priority: "Urgent",
    awb: "157-90811223",
    pieceId: "P-15790811223-03",
    rfid: "EPC-3008-15790811223-0003",
    fromLocation: "Cold-COL-01",
    toLocation: "Vehicle Bay 03",
    cargoClass: "PER",
    weight: "41 kg",
    handlingCode: "PER",
    timeAssigned: "31 May 2026 10:20",
    slaRemaining: "12 min",
    assignedBy: "Sana Khan",
    status: "In Progress",
  },
  {
    id: "T-2026-0043",
    type: "Move",
    priority: "Normal",
    awb: "074-88219033",
    pieceId: "P-07488219033-09",
    rfid: "EPC-3008-07488219033-0009",
    fromLocation: "GCR-R05-L2-B01",
    toLocation: "Inspection Bay",
    cargoClass: "GCR",
    weight: "36 kg",
    handlingCode: "---",
    timeAssigned: "31 May 2026 10:30",
    slaRemaining: "45 min",
    assignedBy: "Ahmed Khan",
    status: "Assigned",
  },
  {
    id: "T-2026-0044",
    type: "Putaway",
    priority: "Normal",
    awb: "176-33445566",
    pieceId: "P-17633445566-02",
    rfid: "EPC-3008-17633445566-0002",
    fromLocation: "Receiving Bay 05",
    toLocation: "GCR-R08-L2-B03",
    cargoClass: "GCR",
    weight: "28 kg",
    handlingCode: "---",
    timeAssigned: "31 May 2026 10:35",
    slaRemaining: "52 min",
    assignedBy: "Imran Ali",
    status: "Assigned",
  },
  {
    id: "T-2026-0045",
    type: "Charge",
    priority: "High",
    awb: "205-77889900",
    pieceId: "P-20577889900-01",
    rfid: "EPC-3008-20577889900-0001",
    fromLocation: "Charging Station A",
    toLocation: "Charging Station A",
    cargoClass: "VAL",
    weight: "85 kg",
    handlingCode: "VAL",
    timeAssigned: "31 May 2026 10:40",
    slaRemaining: "25 min",
    assignedBy: "Sana Khan",
    status: "In Progress",
  },
  {
    id: "T-2026-0046",
    type: "Pick",
    priority: "Normal",
    awb: "118-22334455",
    pieceId: "P-11822334455-05",
    rfid: "EPC-3008-11822334455-0005",
    fromLocation: "AFU-R03-L1-B02",
    toLocation: "Dolly Bay 04",
    cargoClass: "AFU",
    weight: "63 kg",
    handlingCode: "AOG",
    timeAssigned: "31 May 2026 10:45",
    slaRemaining: "38 min",
    assignedBy: "Ahmed Khan",
    status: "Assigned",
  },
  {
    id: "T-2026-0047",
    type: "Move",
    priority: "Urgent",
    awb: "089-55667788",
    pieceId: "P-08955667788-11",
    rfid: "EPC-3008-08955667788-0011",
    fromLocation: "Vault-V01",
    toLocation: "Cold-COL-02",
    cargoClass: "VAL",
    weight: "120 kg",
    handlingCode: "VAL",
    timeAssigned: "31 May 2026 10:50",
    slaRemaining: "8 min",
    assignedBy: "Imran Ali",
    status: "Assigned",
  },
  {
    id: "T-2026-0048",
    type: "Putaway",
    priority: "Normal",
    awb: "132-99887766",
    pieceId: "P-13299887766-04",
    rfid: "EPC-3008-13299887766-0004",
    fromLocation: "Receiving Bay 01",
    toLocation: "PER-COL-03",
    cargoClass: "PER",
    weight: "19 kg",
    handlingCode: "PER",
    timeAssigned: "31 May 2026 10:55",
    slaRemaining: "60 min",
    assignedBy: "Sana Khan",
    status: "Assigned",
  },
];

export default function LifterTasksPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const { addToast } = useToast();

  const filteredTasks =
    activeFilter === "All"
      ? taskData
      : activeFilter === "Completed"
      ? taskData.filter((t) => t.status === "Completed")
      : activeFilter === "Urgent"
      ? taskData.filter((t) => t.priority === "Urgent")
      : taskData.filter((t) => t.type === activeFilter);

  const handleStartTask = (taskId: string) => {
    addToast(`Task ${taskId} started`, "success");
  };

  const handleReportIssue = (taskId: string) => {
    addToast(`Issue reported for ${taskId}`, "success");
  };

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Lifter Operator", href: "#" },
          { label: "My Tasks" },
        ]}
      />

      <div className="flex items-center gap-3">
        <h1 className="text-[22px] font-bold text-[#0F172A]">My Tasks</h1>
        <ScopeBadge type="inc" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setLoading((p) => !p)}
          className="h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          {loading ? "Stop Loading" : "Simulate Loading"}
        </button>
        <button
          onClick={() => setError((p) => !p)}
          className="h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          {error ? "Clear Error" : "Simulate Error"}
        </button>
        <button
          onClick={() => setEmpty((p) => !p)}
          className="h-8 px-3 rounded-lg text-[12px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
        >
          {empty ? "Show Data" : "Simulate Empty"}
        </button>
      </div>

      <KPIStrip />

      <TaskFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <TaskList
        tasks={filteredTasks}
        loading={loading}
        error={error}
        empty={empty}
        onStartTask={handleStartTask}
        onReportIssue={handleReportIssue}
      />

      <TodaySummary />
    </div>
  );
}