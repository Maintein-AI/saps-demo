export default function LogLoadingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="h-[22px] w-32 rounded-full bg-[#F1F5F9] animate-pulse" />
          <div className="h-[22px] w-20 rounded-full bg-[#F1F5F9] animate-pulse" />
        </div>
        <div className="p-5 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center h-12 rounded-lg bg-[#F1F5F9] animate-pulse px-4">
              <div className="h-4 rounded bg-[#E2E8F0] w-[8%]" />
              <div className="h-4 rounded bg-[#E2E8F0] w-[10%]" />
              <div className="h-4 rounded bg-[#E2E8F0] w-[12%]" />
              <div className="h-4 rounded bg-[#E2E8F0] w-[14%]" />
              <div className="h-4 rounded bg-[#E2E8F0] w-[16%]" />
              <div className="h-4 rounded bg-[#E2E8F0] w-[10%]" />
              <div className="h-4 rounded bg-[#E2E8F0] w-[8%]" />
              <div className="h-4 rounded bg-[#E2E8F0] w-[8%]" />
              <div className="h-4 rounded bg-[#E2E8F0] w-[8%]" />
              <div className="h-4 rounded bg-[#E2E8F0] w-[6%]" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <div className="h-[22px] w-28 rounded-full bg-[#F1F5F9] animate-pulse" />
          <div className="h-[22px] w-20 rounded-full bg-[#F1F5F9] animate-pulse" />
        </div>
        <div className="p-5 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F1F5F9] animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <div className="h-4 rounded bg-[#E2E8F0] w-[8%]" />
                  <div className="h-4 rounded bg-[#E2E8F0] w-[12%]" />
                  <div className="h-4 rounded bg-[#E2E8F0] w-[10%]" />
                </div>
                <div className="h-3 rounded bg-[#E2E8F0] w-[30%]" />
                <div className="h-3 rounded bg-[#E2E8F0] w-[50%]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}