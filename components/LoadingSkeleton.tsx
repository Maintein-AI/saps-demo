export default function LoadingSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center h-12 rounded-lg bg-[#F1F5F9] animate-pulse px-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className="h-4 rounded bg-[#E2E8F0]"
              style={{ width: `${28 + ((i * 7 + j * 13) % 35)}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}