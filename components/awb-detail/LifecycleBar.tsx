interface Step {
  label: string;
  done: boolean;
  current: boolean;
}

interface LifecycleBarProps {
  steps: string[];
  current: string;
}

export default function LifecycleBar({ steps, current }: LifecycleBarProps) {
  const currentIndex = steps.indexOf(current);

  const processedSteps: Step[] = steps.map((label, index) => ({
    label,
    done: index < currentIndex,
    current: index === currentIndex,
  }));

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center min-w-max px-2 py-3">
        {processedSteps.map((step, index) => (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5 min-w-[80px] max-w-[110px]">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{
                  backgroundColor: step.current
                    ? "#0B2545"
                    : step.done
                      ? "#16A34A"
                      : "#F1F5F9",
                  color: step.current || step.done ? "white" : "#94A3B8",
                  border: step.current ? "2px solid #1B4F8B" : "none",
                }}
              >
                {step.done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className="text-[10px] font-medium text-center leading-tight"
                style={{
                  color: step.current ? "#0B2545" : step.done ? "#16A34A" : "#94A3B8",
                  fontWeight: step.current ? 700 : 500,
                }}
              >
                {step.label}
              </span>
            </div>
            {index < processedSteps.length - 1 && (
              <div
                className="w-8 h-[2px] mx-1 flex-shrink-0"
                style={{
                  backgroundColor: step.done ? "#16A34A" : "#E2E8F0",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}