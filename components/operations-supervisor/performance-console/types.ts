export interface OperatorRow {
  operator: string;
  role: string;
  shift: string;
  assignedTasks: number;
  completedTasks: number;
  exceptionCount: number;
  sla: number;
  avgTime: string;
  productivityScore: number;
  status: "Good" | "Excellent" | "At Risk" | "Below Target";
}

export interface TeamZone {
  zone: string;
  taskCount: number;
  slaPercent: number;
  exceptions: number;
  trend: "up" | "down" | "neutral";
}

export interface SLABreakdown {
  name: string;
  target: string;
  actual: string;
  percent: number;
  status: "Met" | "At Risk" | "Missed";
}

export interface DetailData {
  operator: string;
  role: string;
  shift: string;
  assignedZone: string;
  completedTasks: number;
  pendingTasks: number;
  exceptionCount: number;
  sla: number;
  avgTime: string;
  bestArea: string;
  improvementArea: string;
}

export interface TrendPeriod {
  label: string;
  completedTasks: number;
  slaPercent: number;
  exceptionRate: number;
  avgTaskTime: string;
}