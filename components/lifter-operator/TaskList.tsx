"use client";

import LoadingSkeleton from "@/components/LoadingSkeleton";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import TaskCard from "./TaskCard";
import TaskCardSkeleton from "./TaskCardSkeleton";

interface Task {
  id: string;
  type: string;
  priority: string;
  awb: string;
  pieceId: string;
  rfid: string;
  fromLocation: string;
  toLocation: string;
  cargoClass: string;
  weight: string;
  handlingCode: string;
  timeAssigned: string;
  slaRemaining: string;
  assignedBy: string;
  status: string;
}

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: boolean;
  empty: boolean;
  onStartTask: (id: string) => void;
  onReportIssue: (id: string) => void;
}

export default function TaskList({ tasks, loading, error, empty, onStartTask, onReportIssue }: TaskListProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-[15px] font-bold text-[#0F172A]">Task List</h3>
        <span className="text-[12px] text-[#64748B] ml-auto">
          {tasks.length} tasks
        </span>
      </div>

      {loading && <TaskCardSkeleton count={3} />}

      {error && (
        <ErrorState
          title="Failed to load tasks"
          message="Could not retrieve task list from the server. Please retry."
          onRetry={() => window.location.reload()}
        />
      )}

      {empty && (
        <EmptyState
          title="No tasks assigned"
          description="You are currently available. Tasks will appear here when assigned by the supervisor."
          icon={<span className="text-[#94A3B8] text-[28px]">✓</span>}
        />
      )}

      {!loading && !error && !empty && (
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <EmptyState
              title="No matching tasks"
              description="No tasks match the selected filter. Try a different filter."
            />
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStartTask={onStartTask}
                onReportIssue={onReportIssue}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}