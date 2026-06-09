"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ScopeBadge from "@/components/ScopeBadge";
import { useToast } from "@/components/ToastContext";
import TaskRoute from "@/components/lifter-operator/task-detail/TaskRoute";
import PieceDetails from "@/components/lifter-operator/task-detail/PieceDetails";
import ScanConfirmation from "@/components/lifter-operator/task-detail/ScanConfirmation";
import StepChecklist from "@/components/lifter-operator/task-detail/StepChecklist";
import Actions from "@/components/lifter-operator/task-detail/Actions";
import LoadingState from "@/components/lifter-operator/task-detail/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

const taskData = {
  id: "T-2026-0041",
  type: "Putaway",
  priority: "High",
  awb: "214-45678901",
  hawb: "HBL-2091",
  pieceId: "P-21445678901-07",
  rfid: "EPC-3008-21445678901-0007",
  weight: "52 kg",
  cargoClass: "AFU",
  handlingCode: "AFU",
  currentStatus: "Awaiting Putaway",
  fromLocation: "Receiving Bay 02",
  toLocation: "AFU-R02-L1-B04",
  assignedBy: "Warehouse Manager",
  lifterAsset: "FL-03",
  slaRemaining: "18 min",
  status: "In Progress",
  timeAssigned: "31 May 2026 10:15",
};

export default function TaskDetailPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [scanStatus, setScanStatus] = useState("waiting");
  const [scanInput, setScanInput] = useState("");
  const [currentStep, setCurrentStep] = useState(2);
  const [taskStatus, setTaskStatus] = useState(taskData.status);
  const { addToast } = useToast();
  const router = useRouter();

  const handleScan = () => {
    if (!scanInput.trim()) {
      addToast("Please scan or enter an RFID", "error");
      return;
    }
    if (scanInput === taskData.rfid || scanInput.includes("21445678901")) {
      setScanStatus("matched");
      setCurrentStep(3);
      addToast("Correct piece scanned", "success");
    } else if (scanInput === "duplicate" || scanInput === taskData.rfid) {
      setScanStatus("duplicate");
      addToast("Duplicate scan detected", "error");
    } else {
      setScanStatus("mismatch");
      addToast("Scanned RFID does not match assigned piece", "error");
    }
  };

  const handleStartTask = () => {
    setTaskStatus("In Progress");
    setCurrentStep(1);
    addToast("Task started", "success");
  };

  const handleConfirmPickup = () => {
    setCurrentStep(4);
    addToast("Pickup confirmed", "success");
  };

  const handleConfirmDropoff = () => {
    setCurrentStep(5);
    addToast("Drop-off confirmed", "success");
  };

  const handleCompleteTask = () => {
    setCurrentStep(6);
    setTaskStatus("Completed");
    addToast("Task completed successfully", "success");
  };

  return (
    <div className="space-y-5">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Lifter Operator", href: "/lifter-operator" },
          { label: "Task Detail" },
        ]}
      />

      <div className="flex items-center gap-3">
        <h1 className="text-[22px] font-bold text-[#0F172A]">Task Detail</h1>
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

      {loading && <LoadingState />}

      {error && (
        <ErrorState
          title="Failed to load task"
          message="Could not retrieve task details from the server. Please retry."
          onRetry={() => window.location.reload()}
        />
      )}

      {empty && (
        <EmptyState
          title="No task selected"
          description="Select a task from My Tasks to view details here."
          icon={<span className="text-[#94A3B8] text-[28px]">?</span>}
          actionLabel="Go to My Tasks"
          onAction={() => router.push("/lifter-operator/tasks")}
        />
      )}

      {!loading && !error && !empty && (
        <>
          <TaskRoute
            task={taskData}
            taskStatus={taskStatus}
            slaRemaining={taskData.slaRemaining}
          />

          <PieceDetails task={taskData} />

          <ScanConfirmation
            scanInput={scanInput}
            setScanInput={setScanInput}
            scanStatus={scanStatus}
            onScan={handleScan}
            expectedRfid={taskData.rfid}
          />

          <StepChecklist currentStep={currentStep} taskType={taskData.type} />

          <Actions
            taskStatus={taskStatus}
            currentStep={currentStep}
            onStartTask={handleStartTask}
            onConfirmPickup={handleConfirmPickup}
            onConfirmDropoff={handleConfirmDropoff}
            onCompleteTask={handleCompleteTask}
            onBackToTasks={() => router.push("/lifter-operator/tasks")}
            addToast={addToast}
          />
        </>
      )}
    </div>
  );
}