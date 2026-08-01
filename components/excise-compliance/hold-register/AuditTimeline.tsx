import { X, CheckCircle, Clock, ArrowRight, ArrowLeft, Plus, AlertTriangle } from "lucide-react";

interface AuditEvent {
  action: string;
  user: string;
  timestamp: string;
  oldStatus: string;
  newStatus: string;
  remarks: string;
}

interface AuditTimelineProps {
  holdNum: string;
  events: AuditEvent[];
  onClose: () => void;
}

export default function AuditTimeline({ holdNum, events, onClose }: AuditTimelineProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Hold Audit Trail</h2>
          <span className="text-[12px] text-[#64748B] ml-1">{holdNum}</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#64748B] cursor-pointer transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-5">
        <div className="relative">
          <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-[#E2E8F0]" />
          <div className="space-y-4">
            {events.map((event, index) => {
              const isRelease = event.action === "Hold Released";
              const isCreate = event.action === "Hold Created";
              return (
                <div key={index} className="flex items-start gap-4 relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2"
                    style={{
                      backgroundColor: isRelease
                        ? "#16A34A"
                        : isCreate
                        ? "#1B4F8B"
                        : "#D97706",
                      borderColor: isRelease
                        ? "#16A34A"
                        : isCreate
                        ? "#1B4F8B"
                        : "#D97706",
                    }}
                  >
                    {isRelease && <CheckCircle size={18} className="text-white" />}
                    {isCreate && <Plus size={18} className="text-white" />}
                    {!isRelease && !isCreate && (
                      <ArrowRight size={18} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13px] font-bold text-[#0F172A]">
                        {event.action}
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">by {event.user}</span>
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-0.5">{event.timestamp}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[12px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-lg">
                        {event.oldStatus}
                      </span>
                      <ArrowRight size={14} className="text-[#94A3B8]" />
                      <span
                        className="text-[12px] font-medium px-2 py-0.5 rounded-lg"
                        style={{
                          backgroundColor: event.newStatus === "Released" ? "#DCFCE7" : "#F1F5F9",
                          color: event.newStatus === "Released" ? "#16A34A" : "#64748B",
                        }}
                      >
                        {event.newStatus}
                      </span>
                    </div>

                    <p className="text-[12px] text-[#475569] mt-1.5">{event.remarks}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}