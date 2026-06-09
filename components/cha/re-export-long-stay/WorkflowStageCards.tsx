"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import { ArrowRight, CheckCircle, Clock, Plus, FileUp } from "lucide-react";

interface ReexportWorkflowStageProps {
  stages: string[];
  currentStage: string;
  counts: Record<string, number>;
}

function ReexportWorkflowStageCards({ stages, currentStage, counts }: ReexportWorkflowStageProps) {
  const currentIndex = stages.indexOf(currentStage);
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stages.map((stage, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const isPending = idx > currentIndex;
        return (
          <div
            key={stage}
            className={`rounded-xl border p-4 flex flex-col gap-2 ${isCompleted ? "border-[#16A34A] bg-[#F0FDF4]" : isCurrent ? "border-[#D97706] bg-[#FEF3C7]" : "border-[#E2E8F0] bg-white"}`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? "bg-[#16A34A]" : isCurrent ? "bg-[#D97706]" : "bg-[#F1F5F9]"}`}>
                {isCompleted ? <CheckCircle size={12} className="text-white" /> : isCurrent ? <Clock size={12} className="text-white" /> : <Clock size={12} className="text-[#94A3B8]" />}
              </div>
              <span className={`text-[12px] font-semibold ${isCompleted ? "text-[#16A34A]" : isCurrent ? "text-[#D97706]" : "text-[#94A3B8]"}`}>{stage}</span>
            </div>
            <span className="text-[20px] font-bold text-[#0F172A]">{counts[stage] || 0}</span>
          </div>
        );
      })}
    </div>
  );
}

interface LongStayWorkflowStageProps {
  stages: string[];
  currentStage: string;
  counts: Record<string, number>;
}

function LongStayWorkflowStageCards({ stages, currentStage, counts }: LongStayWorkflowStageProps) {
  const currentIndex = stages.indexOf(currentStage);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stages.map((stage, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <div
            key={stage}
            className={`rounded-xl border p-4 flex flex-col gap-2 ${isCompleted ? "border-[#16A34A] bg-[#F0FDF4]" : isCurrent ? "border-[#D97706] bg-[#FEF3C7]" : "border-[#E2E8F0] bg-white"}`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? "bg-[#16A34A]" : isCurrent ? "bg-[#D97706]" : "bg-[#F1F5F9]"}`}>
                {isCompleted ? <CheckCircle size={12} className="text-white" /> : isCurrent ? <Clock size={12} className="text-white" /> : <Clock size={12} className="text-[#94A3B8]" />}
              </div>
              <span className={`text-[12px] font-semibold ${isCompleted ? "text-[#16A34A]" : isCurrent ? "text-[#D97706]" : "text-[#94A3B8]"}`}>{stage}</span>
            </div>
            <span className="text-[20px] font-bold text-[#0F172A]">{counts[stage] || 0}</span>
          </div>
        );
      })}
    </div>
  );
}

interface WorkflowStageCardsProps {
  activeTab: "reexport" | "longstay";
}

export default function WorkflowStageCards({ activeTab }: WorkflowStageCardsProps) {
  const { addToast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCase, setNewCase] = useState({ caseNo: "", awb: "", consignee: "", caseType: "Re-export", reason: "" });

  const reexportStages = ["Re-export Request", "Customs GD", "Permission", "Settled", "Re-tendered", "Closed"];
  const reexportCounts = { "Re-export Request": 1, "Customs GD": 1, "Permission": 1, "Settled": 1, "Re-tendered": 1, "Closed": 2 };
  const reexportCurrentStage = "Permission";

  const longStayStages = ["Notify", "Escalate", "Customs Decision", "Final Disposition"];
  const longStayCounts = { "Notify": 1, "Escalate": 1, "Customs Decision": 1, "Final Disposition": 2 };
  const longStayCurrentStage = "Customs Decision";

  const handleCreateCase = () => {
    if (!newCase.caseNo || !newCase.awb) return;
    addToast(`Case ${newCase.caseNo} created.`, "success");
    setShowCreateForm(false);
    setNewCase({ caseNo: "", awb: "", consignee: "", caseType: "Re-export", reason: "" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[13px] font-bold text-[#0F172A]">
          {activeTab === "reexport" ? "Re-export Workflow" : "Long-Stay Workflow"}
        </h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
          style={{ backgroundColor: "#0B2545" }}
        >
          <Plus size={14} />
          Create Case
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-4 p-4 rounded-xl border border-[#E2E8F0] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1">Case #</label>
              <input
                type="text"
                value={newCase.caseNo}
                onChange={(e) => setNewCase((prev) => ({ ...prev, caseNo: e.target.value }))}
                placeholder="RE-2026-XXXXX"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1">AWB #</label>
              <input
                type="text"
                value={newCase.awb}
                onChange={(e) => setNewCase((prev) => ({ ...prev, awb: e.target.value }))}
                placeholder="000-00000000"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1">Consignee</label>
              <input
                type="text"
                value={newCase.consignee}
                onChange={(e) => setNewCase((prev) => ({ ...prev, consignee: e.target.value }))}
                placeholder="Consignee name"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1">Case Type</label>
              <select
                value={newCase.caseType}
                onChange={(e) => setNewCase((prev) => ({ ...prev, caseType: e.target.value }))}
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] bg-white"
              >
                <option value="Re-export">Re-export</option>
                <option value="Long-Stay">Long-Stay</option>
                <option value="Section 82">Section 82</option>
                <option value="Auction">Auction</option>
                <option value="Disposal">Disposal</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1">Reason / Remarks</label>
              <input
                type="text"
                value={newCase.reason}
                onChange={(e) => setNewCase((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter reason for case creation..."
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreateCase}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: "#0B2545" }}
            >
              <CheckCircle size={14} />
              Create Case
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activeTab === "reexport" ? (
        <ReexportWorkflowStageCards stages={reexportStages} currentStage={reexportCurrentStage} counts={reexportCounts} />
      ) : (
        <LongStayWorkflowStageCards stages={longStayStages} currentStage={longStayCurrentStage} counts={longStayCounts} />
      )}
    </div>
  );
}