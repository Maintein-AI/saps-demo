export default function LoadingState() {
  return (
    <div className="space-y-5">
      {/* Route skeleton */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm animate-pulse">
        <div className="h-5 w-32 rounded bg-[#F1F5F9] mb-4" />
        <div className="flex items-center gap-3 mb-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex-1 h-12 rounded bg-[#F1F5F9]" />
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9]" />
          <div className="flex-1 h-12 rounded bg-[#F1F5F9]" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-lg bg-[#F1F5F9]" />
          <div className="h-9 w-24 rounded-lg bg-[#F1F5F9]" />
          <div className="h-9 w-32 rounded-lg bg-[#F1F5F9]" />
        </div>
      </div>

      {/* Piece details skeleton */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm animate-pulse">
        <div className="h-5 w-32 rounded bg-[#F1F5F9] mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="h-3 w-20 rounded bg-[#F1F5F9]" />
              <div className="h-4 w-32 rounded bg-[#E2E8F0]" />
            </div>
          ))}
        </div>
      </div>

      {/* Scan skeleton */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm animate-pulse">
        <div className="h-5 w-32 rounded bg-[#F1F5F9] mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="flex-1 h-14 rounded-xl bg-[#F1F5F9]" />
          <div className="h-14 w-20 rounded-xl bg-[#F1F5F9]" />
        </div>
        <div className="h-20 rounded-xl bg-[#F1F5F9]" />
      </div>

      {/* Steps skeleton */}
      <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-5 shadow-sm animate-pulse">
        <div className="h-5 w-24 rounded bg-[#F1F5F9] mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-[#F1F5F9]" />
              <div className="flex-1 h-4 rounded bg-[#F1F5F9]" />
              <div className="h-6 w-20 rounded-full bg-[#F1F5F9]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}