export interface CargoState {
  state: string;
  count: number;
  avgDwell: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

export interface AssetTile {
  name: string;
  total: number;
  active: number;
  fault: number;
  offline: number;
}

export interface ExceptionItem {
  type: string;
  count: number;
  severity: "High" | "Medium" | "Low";
  oldestAge: string;
  owner: string;
}

export interface LiveEvent {
  timestamp: string;
  module: string;
  actor: string;
  action: string;
  entity: string;
  severity: "High" | "Medium" | "Low";
  scope: "inc" | "exc";
}