"use client";

import Breadcrumb from "@/components/Breadcrumb";
import KPIStrip from "@/components/cha/re-export-long-stay/KPIStrip";
import FilterBar from "@/components/cha/re-export-long-stay/FilterBar";
import WorkflowStageCards from "@/components/cha/re-export-long-stay/WorkflowStageCards";
import ReexportTab from "@/components/cha/re-export-long-stay/ReexportTab";
import LongStayTab from "@/components/cha/re-export-long-stay/LongStayTab";
import { useState } from "react";

export default function ReexportLongStayPage() {
  const [activeTab, setActiveTab] = useState<"reexport" | "longstay">("reexport");

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "CHA", href: "/cha" }, { label: "Re-export / Long-Stay Console" }]} />

      <div className="flex items-center gap-3">
        <h1 className="text-[24px] font-bold text-[#0F172A]">Re-export / Long-Stay Console</h1>
      </div>

      <KPIStrip />

      <FilterBar />

      <WorkflowStageCards activeTab={activeTab} />

      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-1 shadow-sm">
        <div className="flex gap-1 p-1">
          <button
            onClick={() => setActiveTab("reexport")}
            className={`flex-1 h-10 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${activeTab === "reexport" ? "bg-[#0B2545] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}
          >
            Re-export
          </button>
          <button
            onClick={() => setActiveTab("longstay")}
            className={`flex-1 h-10 rounded-xl text-[13px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${activeTab === "longstay" ? "bg-[#0B2545] text-white" : "text-[#64748B] hover:bg-[#F8FAFC]"}`}
          >
            Long-Stay / Section 82
          </button>
        </div>
      </div>

      {activeTab === "reexport" ? <ReexportTab /> : <LongStayTab />}
    </div>
  );
}