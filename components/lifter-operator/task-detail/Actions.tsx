"use client";

import { useState } from "react";
import {
  Play,
  ArrowUpFromLine,
  ArrowDownToLine,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
  ShieldAlert,
  X,
} from "lucide-react";
import Modal from "@/components/Modal";

interface ActionsProps {
  taskStatus: string;
  currentStep: number;
  onStartTask: () => void;
  onConfirmPickup: () => void;
  onConfirmDropoff: () => void;
  onCompleteTask: () => void;
  onBackToTasks: () => void;
  addToast: (message: string, type: "success" | "error") => void;
}

export default function Actions({
  taskStatus,
  currentStep,
  onStartTask,
  onConfirmPickup,
  onConfirmDropoff,
  onCompleteTask,
  onBackToTasks,
  addToast,
}: ActionsProps) {
  const [obstacleOpen, setObstacleOpen] = useState(false);
  const [damageOpen, setDamageOpen] = useState(false);
  const [obstacleType, setObstacleType] = useState("");
  const [obstacleDesc, setObstacleDesc] = useState("");
  const [obstacleNotes, setObstacleNotes] = useState("");
  const [damageType, setDamageType] = useState("");
  const [damageDesc, setDamageDesc] = useState("");
  const [damageSeverity, setDamageSeverity] = useState("");
  const [damageNotes, setDamageNotes] = useState("");
  const [cannotCompleteOpen, setCannotCompleteOpen] = useState(false);
  const [cannotCompleteReason, setCannotCompleteReason] = useState("");

  const handleSubmitObstacle = () => {
    if (!obstacleType || !obstacleDesc) {
      addToast("Please fill all required fields", "error");
      return;
    }
    addToast("Obstacle report submitted", "success");
    setObstacleOpen(false);
    setObstacleType("");
    setObstacleDesc("");
    setObstacleNotes("");
  };

  const handleSubmitDamage = () => {
    if (!damageType || !damageDesc || !damageSeverity) {
      addToast("Please fill all required fields", "error");
      return;
    }
    addToast("Damage report submitted", "success");
    setDamageOpen(false);
    setDamageType("");
    setDamageDesc("");
    setDamageSeverity("");
    setDamageNotes("");
  };

  const handleCannotComplete = () => {
    if (!cannotCompleteReason) {
      addToast("Please provide a reason", "error");
      return;
    }
    addToast("Task marked as cannot complete", "error");
    setCannotCompleteOpen(false);
    setCannotCompleteReason("");
  };

  return (
    <>
      {/* Primary Actions */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[15px] font-bold text-[#0F172A]">Actions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {taskStatus === "Assigned" && (
            <button
              onClick={onStartTask}
              className="flex items-center justify-center gap-2 h-16 rounded-xl text-[16px] font-bold text-white cursor-pointer transition-colors hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#0B2545" }}
            >
              <Play size={20} />
              Start Task
            </button>
          )}

          {currentStep >= 3 && currentStep < 4 && (
            <button
              onClick={onConfirmPickup}
              className="flex items-center justify-center gap-2 h-16 rounded-xl text-[16px] font-bold text-white cursor-pointer transition-colors hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#0B2545" }}
            >
              <ArrowUpFromLine size={20} />
              Confirm Pickup
            </button>
          )}

          {currentStep >= 4 && currentStep < 5 && (
            <button
              onClick={onConfirmDropoff}
              className="flex items-center justify-center gap-2 h-16 rounded-xl text-[16px] font-bold text-white cursor-pointer transition-colors hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#0B2545" }}
            >
              <ArrowDownToLine size={20} />
              Confirm Drop-off
            </button>
          )}

          {currentStep >= 5 && (
            <button
              onClick={onCompleteTask}
              className="flex items-center justify-center gap-2 h-16 rounded-xl text-[16px] font-bold text-white cursor-pointer transition-colors hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "#16A34A" }}
            >
              <CheckCircle2 size={20} />
              Complete Task
            </button>
          )}
        </div>

        {/* Secondary / Issue buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setObstacleOpen(true)}
            className="flex items-center justify-center gap-2 h-14 rounded-xl text-[15px] font-semibold border border-[#F59E0B]/30 text-[#D97706] hover:bg-[#FEF3C7] cursor-pointer transition-colors active:scale-[0.98]"
          >
            <AlertTriangle size={18} />
            Report Obstacle
          </button>
          <button
            onClick={() => setDamageOpen(true)}
            className="flex items-center justify-center gap-2 h-14 rounded-xl text-[15px] font-semibold border border-[#DC2626]/30 text-[#DC2626] hover:bg-[#FEF2F2] cursor-pointer transition-colors active:scale-[0.98]"
          >
            <ShieldAlert size={18} />
            Damage Report
          </button>
          <button
            onClick={() => setCannotCompleteOpen(true)}
            className="flex items-center justify-center gap-2 h-14 rounded-xl text-[15px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors active:scale-[0.98]"
          >
            <X size={18} />
            Cannot Complete
          </button>
          <button
            onClick={onBackToTasks}
            className="flex items-center justify-center gap-2 h-14 rounded-xl text-[15px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Back to My Tasks
          </button>
        </div>
      </div>

      {/* Obstacle Report Modal */}
      <Modal
        isOpen={obstacleOpen}
        onClose={() => setObstacleOpen(false)}
        title="Obstacle Report"
        maxWidth={480}
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setObstacleOpen(false)}
              className="flex-1 h-12 rounded-xl text-[14px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitObstacle}
              className="flex-1 h-12 rounded-xl text-[14px] font-bold text-white cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: "#D97706" }}
            >
              Submit Obstacle
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[14px] font-bold text-[#0F172A]">Obstacle Report</h4>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Obstacle Type
            </label>
            <div className="flex flex-wrap gap-2">
              {["Blocked Path", "Equipment Failure", "Missing Tools", "Other"].map((t) => (
                <button
                  key={t}
                  onClick={() => setObstacleType(t)}
                  className="h-11 px-4 rounded-xl text-[13px] font-semibold border whitespace-nowrap cursor-pointer transition-colors"
                  style={{
                    backgroundColor: obstacleType === t ? "#D97706" : "#F8FAFC",
                    color: obstacleType === t ? "#FFFFFF" : "#64748B",
                    borderColor: obstacleType === t ? "#D97706" : "#E2E8F0",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Description
            </label>
            <textarea
              value={obstacleDesc}
              onChange={(e) => setObstacleDesc(e.target.value)}
              placeholder="Describe the obstacle..."
              maxLength={500}
              className="w-full h-24 rounded-xl text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] p-3 border border-[#E2E8F0] outline-none focus:border-[#D97706] resize-none"
              style={{ backgroundColor: "#F8FAFC" }}
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Current Location
            </label>
            <input
              type="text"
              value="Receiving Bay 02"
              readOnly
              className="w-full h-12 rounded-xl text-[14px] text-[#0F172A] p-3 border border-[#E2E8F0] bg-[#F1F5F9] font-medium"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Notes
            </label>
            <textarea
              value={obstacleNotes}
              onChange={(e) => setObstacleNotes(e.target.value)}
              placeholder="Additional notes..."
              maxLength={500}
              className="w-full h-20 rounded-xl text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] p-3 border border-[#E2E8F0] outline-none focus:border-[#D97706] resize-none"
              style={{ backgroundColor: "#F8FAFC" }}
            />
          </div>
        </div>
      </Modal>

      {/* Damage Report Modal */}
      <Modal
        isOpen={damageOpen}
        onClose={() => setDamageOpen(false)}
        title="Damage Report"
        maxWidth={480}
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setDamageOpen(false)}
              className="flex-1 h-12 rounded-xl text-[14px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitDamage}
              className="flex-1 h-12 rounded-xl text-[14px] font-bold text-white cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: "#DC2626" }}
            >
              Submit Damage Report
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[14px] font-bold text-[#0F172A]">Damage Report</h4>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Damage Type
            </label>
            <div className="flex flex-wrap gap-2">
              {["Crush", "Tear", "Water", "Dent", "Other"].map((t) => (
                <button
                  key={t}
                  onClick={() => setDamageType(t)}
                  className="h-11 px-4 rounded-xl text-[13px] font-semibold border whitespace-nowrap cursor-pointer transition-colors"
                  style={{
                    backgroundColor: damageType === t ? "#DC2626" : "#F8FAFC",
                    color: damageType === t ? "#FFFFFF" : "#64748B",
                    borderColor: damageType === t ? "#DC2626" : "#E2E8F0",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Description
            </label>
            <textarea
              value={damageDesc}
              onChange={(e) => setDamageDesc(e.target.value)}
              placeholder="Describe the damage..."
              maxLength={500}
              className="w-full h-24 rounded-xl text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] p-3 border border-[#E2E8F0] outline-none focus:border-[#DC2626] resize-none"
              style={{ backgroundColor: "#F8FAFC" }}
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Severity
            </label>
            <div className="flex flex-wrap gap-2">
              {["Minor", "Moderate", "Severe", "Critical"].map((s) => (
                <button
                  key={s}
                  onClick={() => setDamageSeverity(s)}
                  className="h-11 px-4 rounded-xl text-[13px] font-semibold border whitespace-nowrap cursor-pointer transition-colors"
                  style={{
                    backgroundColor: damageSeverity === s ? "#DC2626" : "#F8FAFC",
                    color: damageSeverity === s ? "#FFFFFF" : "#64748B",
                    borderColor: damageSeverity === s ? "#DC2626" : "#E2E8F0",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Photos
            </label>
            <div className="w-full h-24 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center cursor-pointer hover:bg-[#F1F5F9] transition-colors">
              <span className="text-[13px] text-[#94A3B8]">Tap to upload photos</span>
            </div>
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Notes
            </label>
            <textarea
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
              placeholder="Additional notes..."
              maxLength={500}
              className="w-full h-20 rounded-xl text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] p-3 border border-[#E2E8F0] outline-none focus:border-[#DC2626] resize-none"
              style={{ backgroundColor: "#F8FAFC" }}
            />
          </div>
        </div>
      </Modal>

      {/* Cannot Complete Modal */}
      <Modal
        isOpen={cannotCompleteOpen}
        onClose={() => setCannotCompleteOpen(false)}
        title="Cannot Complete"
        maxWidth={480}
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setCannotCompleteOpen(false)}
              className="flex-1 h-12 rounded-xl text-[14px] font-semibold border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCannotComplete}
              className="flex-1 h-12 rounded-xl text-[14px] font-bold text-white cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: "#DC2626" }}
            >
              Confirm
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[14px] font-bold text-[#0F172A]">Cannot Complete</h4>
          </div>
          <p className="text-[13px] text-[#64748B]">
            Mark this task as cannot complete. This will notify the supervisor and free the task for reassignment.
          </p>
          <div>
            <label className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wide mb-1.5 block">
              Reason
            </label>
            <textarea
              value={cannotCompleteReason}
              onChange={(e) => setCannotCompleteReason(e.target.value)}
              placeholder="Explain why this task cannot be completed..."
              maxLength={500}
              className="w-full h-28 rounded-xl text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] p-3 border border-[#E2E8F0] outline-none focus:border-[#DC2626] resize-none"
              style={{ backgroundColor: "#F8FAFC" }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}