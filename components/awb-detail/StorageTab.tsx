import { Package, MapPin, Clock, ArrowRight } from "lucide-react";

const storageAllocations = [
  {
    rackId: "AFU-R2-L1",
    row: "R2",
    level: "L1",
    occupancy: "86%",
    pieces: "14",
    awbs: "214-45678901, 157-90811223",
    handling: "AFU, GCR",
    since: "10:42",
  },
  {
    rackId: "AFU-R2-L2",
    row: "R2",
    level: "L2",
    occupancy: "64%",
    pieces: "6",
    awbs: "214-45678901",
    handling: "AFU",
    since: "10:45",
  },
  {
    rackId: "AFU-R2-L3",
    row: "R2",
    level: "L3",
    occupancy: "52%",
    pieces: "4",
    awbs: "214-45678901",
    handling: "AFU",
    since: "10:51",
  },
];

const rackHistory = [
  { action: "Storage Allocated", rack: "AFU-R2-L1", timestamp: "10:40", user: "WMS Auto" },
  { action: "Putaway Completed", rack: "AFU-R2-L1", timestamp: "10:42", user: "Op. Ahmed K." },
  { action: "Overflow Moved", rack: "AFU-R2-L2", timestamp: "10:45", user: "Op. Rashid M." },
  { action: "Overflow Moved", rack: "AFU-R2-L3", timestamp: "10:51", user: "Op. Rashid M." },
];

export default function StorageTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">
            Storage Allocation
          </h3>
        </div>
      </div>

      {/* Allocation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {storageAllocations.map((alloc) => (
          <div
            key={alloc.rackId}
            className="rounded-[12px] border border-[#E2E8F0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-[#EBF0F7] flex items-center justify-center">
                <Package size={18} className="text-[#1B4F8B]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0F172A]">{alloc.rackId}</p>
                <p className="text-[11px] text-[#64748B]">Row {alloc.row} / Level {alloc.level}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#64748B]">Occupancy</span>
                <span className="font-semibold text-[#0F172A]">{alloc.occupancy}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#64748B]">Pieces</span>
                <span className="font-semibold text-[#0F172A]">{alloc.pieces}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#64748B]">Handling</span>
                <span className="font-semibold text-[#0F172A]">{alloc.handling}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[#64748B]">Since</span>
                <span className="font-semibold text-[#0F172A]">{alloc.since}</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0]">
                <span className="text-[11px] text-[#94A3B8]">AWBs: {alloc.awbs}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rack History */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[16px] font-semibold text-[#0F172A]">
            Rack History
          </h3>
        </div>
        <div className="rounded-[12px] border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            <span>Action</span>
            <span>Rack</span>
            <span>Timestamp</span>
            <span>User</span>
            <span></span>
          </div>
          {rackHistory.map((entry, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-[#E2E8F0] last:border-b-0 items-center"
              style={{ backgroundColor: i % 2 === 1 ? "#F8FAFC" : "white" }}
            >
              <span className="text-[13px] font-medium text-[#0F172A]">{entry.action}</span>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-[#1B4F8B]" />
                <span className="text-[13px] font-medium text-[#0F172A]">{entry.rack}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#94A3B8]" />
                <span className="text-[13px] text-[#64748B]">{entry.timestamp}</span>
              </div>
              <span className="text-[13px] text-[#64748B]">{entry.user}</span>
              <button className="flex items-center gap-1 text-[12px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] cursor-pointer transition-colors">
                View <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}