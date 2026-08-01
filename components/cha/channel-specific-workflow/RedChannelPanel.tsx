"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastContext";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Beaker,
  Camera,
  CheckCircle,
  Plus,
  Eye,
  Save,
  X,
  Gavel,
  AlertTriangle,
  FileText,
} from "lucide-react";

interface RedExam {
  id: string;
  examId: string;
  awb: string;
  gd: string;
  scheduledTime: string;
  location: string;
  sampleRequired: boolean;
  examStatus: "Scheduled" | "In Progress" | "Completed" | "Failed" | "Pending Reschedule";
  examResult: "pending" | "cleared" | "rejected";
  customsOfficer: string;
  sampleType: string;
  sampleCollected: boolean;
  examRemarks: string;
  photosCount: number;
}

const initialExams: RedExam[] = [
  {
    id: "RE-001",
    examId: "EXM-2026-KHI-00438",
    awb: "074-55443322",
    gd: "2026-KHI-00438",
    scheduledTime: "01 Jun 2026, 10:00",
    location: "Customs Exam Bay A",
    sampleRequired: true,
    examStatus: "Scheduled",
    examResult: "pending",
    customsOfficer: "Inspector Tariq Ahmed",
    sampleType: "Chemical / Lab test",
    sampleCollected: false,
    examRemarks: "Electronics shipment requires verification of declared specifications.",
    photosCount: 0,
  },
  {
    id: "RE-002",
    examId: "EXM-2026-KHI-00434",
    awb: "074-44556677",
    gd: "2026-KHI-00434",
    scheduledTime: "31 May 2026, 14:00",
    location: "Customs Exam Bay B",
    sampleRequired: false,
    examStatus: "Completed",
    examResult: "cleared",
    customsOfficer: "Inspector Sajid Khan",
    sampleType: "",
    sampleCollected: false,
    examRemarks: "Physical examination confirmed goods match declaration. Cleared for release.",
    photosCount: 4,
  },
  {
    id: "RE-003",
    examId: "EXM-2026-KHI-00439",
    awb: "157-66778899",
    gd: "2026-KHI-00439",
    scheduledTime: "02 Jun 2026, 09:30",
    location: "Customs Exam Bay A",
    sampleRequired: true,
    examStatus: "Pending Reschedule",
    examResult: "pending",
    customsOfficer: "Inspector Faisal Ali",
    sampleType: "Food / Pharmaceutical",
    sampleCollected: false,
    examRemarks: "Previous exam postponed due to officer unavailability.",
    photosCount: 0,
  },
  {
    id: "RE-004",
    examId: "EXM-2026-KHI-00432",
    awb: "117-55667788",
    gd: "2026-KHI-00432",
    scheduledTime: "31 May 2026, 11:00",
    location: "Customs Exam Bay C",
    sampleRequired: true,
    examStatus: "Failed",
    examResult: "rejected",
    customsOfficer: "Inspector Tariq Ahmed",
    sampleType: "Textile / Fabric",
    sampleCollected: true,
    examRemarks: "Goods did not match declared HS code. Sample sent to lab for further analysis.",
    photosCount: 6,
  },
];

const examStatusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  "Scheduled": { bg: "#DBEAFE", text: "#1D4ED8", icon: <Calendar size={12} /> },
  "In Progress": { bg: "#FEF3C7", text: "#D97706", icon: <Clock size={12} /> },
  "Completed": { bg: "#DCFCE7", text: "#16A34A", icon: <CheckCircle size={12} /> },
  "Failed": { bg: "#FEE2E2", text: "#DC2626", icon: <AlertTriangle size={12} /> },
  "Pending Reschedule": { bg: "#FEF3C7", text: "#D97706", icon: <Calendar size={12} /> },
};

interface RedChannelPanelProps {
  onViewDetail: (exam: RedExam) => void;
}

export default function RedChannelPanel({ onViewDetail }: RedChannelPanelProps) {
  const { addToast } = useToast();
  const [exams, setExams] = useState<RedExam[]>(initialExams);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [examLocation, setExamLocation] = useState("");
  const [customsOfficer, setCustomsOfficer] = useState("");
  const [sampleRequired, setSampleRequired] = useState(false);
  const [sampleType, setSampleType] = useState("");
  const [examRemarks, setExamRemarks] = useState("");
  const [examResult, setExamResult] = useState("pending");
  const [showForm, setShowForm] = useState(false);
  const [newExamId, setNewExamId] = useState("");
  const [newAwb, setNewAwb] = useState("");

  const handleScheduleExam = (examId: string) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === examId
          ? {
              ...e,
              scheduledTime: `${examDate}, ${examTime}`,
              location: examLocation,
              customsOfficer,
              sampleRequired,
              sampleType,
              examStatus: "Scheduled",
            }
          : e
      )
    );
    addToast("Exam scheduled successfully.", "success");
    setSelectedExam(null);
    setExamDate("");
    setExamTime("");
    setExamLocation("");
    setCustomsOfficer("");
    setSampleRequired(false);
    setSampleType("");
  };

  const handleRecordResult = (examId: string) => {
    setExams((prev) =>
      prev.map((e) =>
        e.id === examId
          ? {
              ...e,
              examResult: examResult as "pending" | "cleared" | "rejected",
              examStatus: examResult === "cleared" ? "Completed" : examResult === "rejected" ? "Failed" : e.examStatus,
              examRemarks,
            }
          : e
      )
    );
    addToast(`Exam result recorded: ${examResult}.`, "success");
    setSelectedExam(null);
    setExamRemarks("");
    setExamResult("pending");
  };

  const handleUploadEvidence = (examId: string) => {
    setExams((prev) =>
      prev.map((e) => (e.id === examId ? { ...e, photosCount: e.photosCount + 3 } : e))
    );
    addToast("Exam evidence uploaded (3 photos).", "success");
  };

  const handleAddRemark = () => {
    addToast("Customs remark added.", "success");
  };

  const handleAddNewExam = () => {
    if (!newExamId || !newAwb) {
      addToast("Please fill all required fields.", "error");
      return;
    }
    const newExam: RedExam = {
      id: `RE-${String(exams.length + 1).padStart(3, "0")}`,
      examId: newExamId,
      awb: newAwb,
      gd: "2026-KHI-00441",
      scheduledTime: "TBD",
      location: "TBD",
      sampleRequired: false,
      examStatus: "Scheduled",
      examResult: "pending",
      customsOfficer: "TBD",
      sampleType: "",
      sampleCollected: false,
      examRemarks: "",
      photosCount: 0,
    };
    setExams((prev) => [newExam, ...prev]);
    setShowForm(false);
    setNewExamId("");
    setNewAwb("");
    addToast("New exam case added.", "success");
  };

  const activeExam = exams.find((e) => e.id === selectedExam);

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Red Channel Physical Exam</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-[#64748B]">{exams.length} exams</span>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 h-8 px-3 rounded-lg text-[12px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
            style={{ backgroundColor: "#DC2626" }}
          >
            <Plus size={14} />
            Add Exam
          </button>
        </div>
      </div>

      {showForm && (
        <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">Exam ID</label>
              <input
                type="text"
                value={newExamId}
                onChange={(e) => setNewExamId(e.target.value)}
                placeholder="e.g., EXM-2026-KHI-00xxx"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#64748B] mb-1.5">AWB #</label>
              <input
                type="text"
                value={newAwb}
                onChange={(e) => setNewAwb(e.target.value)}
                placeholder="e.g., 214-77890123"
                className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#DC2626] transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddNewExam}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
              style={{ backgroundColor: "#DC2626" }}
            >
              <Save size={14} />
              Save Exam
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Exam ID</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">AWB #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">GD #</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Scheduled Time</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Location</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Sample Required</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Exam Status</th>
                <th className="py-2 px-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => {
                const sc = examStatusConfig[exam.examStatus];
                return (
                  <tr
                    key={exam.id}
                    className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    onClick={() => setSelectedExam(selectedExam === exam.id ? null : exam.id)}
                  >
                    <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{exam.examId}</td>
                    <td className="py-3 px-3 text-[12px] font-mono text-[#1B4F8B]">{exam.awb}</td>
                    <td className="py-3 px-3 text-[12px] font-semibold text-[#0F172A] font-mono">{exam.gd}</td>
                    <td className="py-3 px-3 text-[12px] text-[#64748B]">{exam.scheduledTime}</td>
                    <td className="py-3 px-3 text-[12px] text-[#64748B]">{exam.location}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: exam.sampleRequired ? "#FEE2E2" : "#F1F5F9", color: exam.sampleRequired ? "#DC2626" : "#64748B" }}>
                        {exam.sampleRequired ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[11px] font-semibold" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {sc.icon}
                        {exam.examStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetail(exam);
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUploadEvidence(exam.id);
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
                          title="Upload Evidence"
                        >
                          <Camera size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {activeExam && (
          <div className="mt-5 p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center gap-2 mb-4">
              <Gavel size={16} className="text-[#DC2626]" />
              <h3 className="text-[13px] font-bold text-[#0F172A]">Exam Detail: {activeExam.examId}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] mb-1.5">
                  <Calendar size={14} className="text-[#DC2626]" />
                  Exam Scheduled Date
                </label>
                <input
                  type="text"
                  value={examDate || activeExam.scheduledTime.split(", ")[0]}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#DC2626] transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] mb-1.5">
                  <Clock size={14} className="text-[#DC2626]" />
                  Exam Scheduled Time
                </label>
                <input
                  type="text"
                  value={examTime || activeExam.scheduledTime.split(", ")[1]}
                  onChange={(e) => setExamTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#DC2626] transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] mb-1.5">
                  <MapPin size={14} className="text-[#DC2626]" />
                  Exam Location
                </label>
                <input
                  type="text"
                  value={examLocation || activeExam.location}
                  onChange={(e) => setExamLocation(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#DC2626] transition-colors"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] mb-1.5">
                  <User size={14} className="text-[#DC2626]" />
                  Customs Officer
                </label>
                <input
                  type="text"
                  value={customsOfficer || activeExam.customsOfficer}
                  onChange={(e) => setCustomsOfficer(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#DC2626] transition-colors"
                />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sampleRequired || activeExam.sampleRequired}
                    onChange={() => setSampleRequired(!sampleRequired)}
                    className="w-4 h-4 cursor-pointer accent-[#DC2626]"
                  />
                  <span className="text-[13px] font-semibold text-[#0F172A]">Sample Required</span>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] mb-1.5">
                  <Beaker size={14} className="text-[#DC2626]" />
                  Sample Type
                </label>
                <input
                  type="text"
                  value={sampleType || activeExam.sampleType}
                  onChange={(e) => setSampleType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#DC2626] transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] mb-1.5">
                  <FileText size={14} className="text-[#DC2626]" />
                  Exam Remarks
                </label>
                <textarea
                  value={examRemarks || activeExam.examRemarks}
                  onChange={(e) => setExamRemarks(e.target.value)}
                  placeholder="Enter physical examination remarks"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#DC2626] transition-colors resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] mb-1.5">
                  <CheckCircle size={14} className="text-[#DC2626]" />
                  Exam Result
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setExamResult("pending")}
                    className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-semibold border cursor-pointer transition-colors"
                    style={{
                      borderColor: examResult === "pending" ? "#D97706" : "#E2E8F0",
                      color: examResult === "pending" ? "#D97706" : "#64748B",
                      backgroundColor: examResult === "pending" ? "#FEF3C7" : "white",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                    Pending
                  </button>
                  <button
                    onClick={() => setExamResult("cleared")}
                    className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-semibold border cursor-pointer transition-colors"
                    style={{
                      borderColor: examResult === "cleared" ? "#16A34A" : "#E2E8F0",
                      color: examResult === "cleared" ? "#16A34A" : "#64748B",
                      backgroundColor: examResult === "cleared" ? "#DCFCE7" : "white",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    Cleared
                  </button>
                  <button
                    onClick={() => setExamResult("rejected")}
                    className="flex items-center gap-2 h-9 px-4 rounded-lg text-[13px] font-semibold border cursor-pointer transition-colors"
                    style={{
                      borderColor: examResult === "rejected" ? "#DC2626" : "#E2E8F0",
                      color: examResult === "rejected" ? "#DC2626" : "#64748B",
                      backgroundColor: examResult === "rejected" ? "#FEE2E2" : "white",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                    Rejected
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] mb-1.5">
                  <Camera size={14} className="text-[#DC2626]" />
                  Supporting Photos / Evidence
                </label>
                <button
                  onClick={() => handleUploadEvidence(activeExam.id)}
                  className="flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-[#CBD5E1] text-[13px] text-[#64748B] cursor-pointer hover:border-[#DC2626] hover:text-[#DC2626] transition-colors"
                >
                  <Camera size={16} />
                  Upload photos / evidence
                  {activeExam.photosCount > 0 && (
                    <span className="text-[12px] font-semibold text-[#DC2626]">({activeExam.photosCount} uploaded)</span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={() => handleScheduleExam(activeExam.id)}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: "#DC2626" }}
              >
                <Calendar size={14} />
                Schedule Exam
              </button>
              <button
                onClick={() => handleRecordResult(activeExam.id)}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border cursor-pointer transition-colors hover:bg-[#F8FAFC]"
                style={{ borderColor: "#DC2626", color: "#DC2626" }}
              >
                <CheckCircle size={14} />
                Record Exam Result
              </button>
              <button
                onClick={handleAddRemark}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold border border-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors hover:bg-[#F8FAFC]"
              >
                <FileText size={14} />
                Add Customs Remark
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}