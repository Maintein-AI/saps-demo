export default function TaskCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm animate-pulse">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex gap-2">
              <div className="h-8 w-20 rounded-lg bg-[#F1F5F9]" />
              <div className="h-8 w-16 rounded-lg bg-[#F1F5F9]" />
            </div>
            <div className="h-4 w-24 rounded bg-[#F1F5F9]" />
          </div>
          <div className="h-5 w-32 rounded bg-[#F1F5F9] mb-1" />
          <div className="h-4 w-48 rounded bg-[#F1F5F9] mb-3" />
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-8 rounded bg-[#F1F5F9]" />
            <div className="w-8 h-8 rounded-full bg-[#F1F5F9]" />
            <div className="flex-1 h-8 rounded bg-[#F1F5F9]" />
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="h-8 rounded bg-[#F1F5F9]" />
            <div className="h-8 rounded bg-[#F1F5F9]" />
            <div className="h-8 rounded bg-[#F1F5F9]" />
            <div className="h-8 rounded bg-[#F1F5F9]" />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-14 rounded-xl bg-[#F1F5F9]" />
            <div className="h-14 w-20 rounded-xl bg-[#F1F5F9]" />
            <div className="h-14 w-20 rounded-xl bg-[#F1F5F9]" />
          </div>
        </div>
      ))}
    </div>
  );
}