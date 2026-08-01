const filters = [
  "All",
  "Putaway",
  "Pick",
  "Move",
  "Charge",
  "Completed",
  "Urgent",
];

interface TaskFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function TaskFilters({ activeFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-[13px] font-semibold text-[#64748B]">Task Filters</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = activeFilter === f;
          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className="h-11 px-4 rounded-xl text-[13px] font-semibold whitespace-nowrap cursor-pointer transition-colors border"
              style={{
                backgroundColor: active ? "#0B2545" : "#F8FAFC",
                color: active ? "#FFFFFF" : "#64748B",
                borderColor: active ? "#0B2545" : "#E2E8F0",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>
    </div>
  );
}