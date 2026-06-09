import { X, Plane, Package, Weight, Clock, Tag, MessageSquare, CheckCircle, FileText } from "lucide-react";
import ScopeBadge from "../../ScopeBadge";
import type { FlightForecast } from "./types";

interface DetailDrawerProps {
  flight: FlightForecast | null;
  onClose: () => void;
}

export default function DetailDrawer({ flight, onClose }: DetailDrawerProps) {
  if (!flight) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[480px] h-full bg-white flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-[#0F172A]">Flight Forecast Detail</span>
            <ScopeBadge type="inc" />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F1F5F9] text-[#64748B] cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#EBF0F7]">
            <div className="w-10 h-10 rounded-lg bg-[#1B4F8B] flex items-center justify-center">
              <Plane size={20} className="text-white" />
            </div>
            <div>
              <div className="text-[18px] font-bold text-[#0F172A]">{flight.flightNumber}</div>
              <div className="text-[13px] text-[#64748B]">{flight.airline}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={12} className="text-[#64748B]" />
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">ETA</span>
              </div>
              <div className="text-[14px] font-medium text-[#0F172A]">{flight.eta}</div>
            </div>
            <div className="p-3 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 mb-1">
                <Tag size={12} className="text-[#64748B]" />
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Origin</span>
              </div>
              <div className="text-[14px] font-medium text-[#0F172A]">{flight.origin}</div>
            </div>
            <div className="p-3 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 mb-1">
                <Package size={12} className="text-[#64748B]" />
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Expected AWBs</span>
              </div>
              <div className="text-[14px] font-medium text-[#0F172A]">{flight.expectedAwbs}</div>
            </div>
            <div className="p-3 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 mb-1">
                <Package size={12} className="text-[#64748B]" />
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Expected Pieces</span>
              </div>
              <div className="text-[14px] font-medium text-[#0F172A]">{flight.expectedPieces.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 mb-1">
                <Weight size={12} className="text-[#64748B]" />
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Expected Weight</span>
              </div>
              <div className="text-[14px] font-medium text-[#0F172A]">{flight.expectedWeight.toLocaleString()} kg</div>
            </div>
            <div className="p-3 rounded-lg border border-[#E2E8F0]">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle size={12} className="text-[#64748B]" />
                <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">Message Status</span>
              </div>
              <div className="text-[14px] font-medium text-[#0F172A]">{flight.messageStatus}</div>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Cargo Classes</div>
            <div className="flex flex-wrap gap-2">
              {flight.cargoClasses.map((cls) => (
                <span key={cls} className="px-2 py-1 rounded-lg text-[12px] font-semibold bg-[#F1F5F9] text-[#0F172A]">
                  {cls}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Message Source</div>
            <div className="flex flex-wrap gap-2">
              {flight.messageSource.map((src) => (
                <span key={src} className="px-2 py-1 rounded-lg text-[12px] font-semibold bg-[#EBF0F7] text-[#1B4F8B]">
                  {src}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Message Received At</div>
            <div className="text-[13px] text-[#0F172A]">31 May 2026 04:32 UTC</div>
          </div>

          <div className="p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Forecast Confidence</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                <div className="h-full rounded-full bg-[#16A34A]" style={{ width: "85%" }} />
              </div>
              <span className="text-[13px] font-bold text-[#16A34A]">85%</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Notes</div>
            <div className="text-[13px] text-[#64748B]">Standard cargo mix expected. No ODC or special handling requests flagged.</div>
          </div>

          <div className="p-3 rounded-lg border border-[#E2E8F0]">
            <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">Audit Trail</div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1.5 flex-shrink-0" />
                <div className="text-[12px] text-[#64748B]">FFM received at 04:32 UTC — 31 May 2026</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1.5 flex-shrink-0" />
                <div className="text-[12px] text-[#64748B]">FWB received at 05:15 UTC — 31 May 2026</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] mt-1.5 flex-shrink-0" />
                <div className="text-[12px] text-[#64748B]">FHL pending — expected by 06:00 UTC</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#E2E8F0] flex items-center gap-2">
          <button className="flex-1 h-9 rounded-lg text-[13px] font-semibold text-white cursor-pointer transition-colors hover:opacity-90 bg-[#0B2545]">
            Open Slot Planner
          </button>
          <button className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-semibold border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer transition-colors">
            <FileText size={14} />
            View AWB List
          </button>
        </div>
      </div>
    </div>
  );
}