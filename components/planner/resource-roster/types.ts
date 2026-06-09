export interface RosterRow {
  id: string;
  shift: string;
  operator: string;
  role: string;
  assignedZone: string;
  assignedAsset: string;
  availability: "Available" | "Busy" | "Off" | "On Break";
  taskCount: number;
  supervisor: string;
  remarks: string;
}

export interface RoleGroup {
  role: string;
  count: number;
  available: number;
  busy: number;
  offShift: number;
  color: string;
}

export interface AssetRow {
  id: string;
  assetType: string;
  assignedTo: string;
  zone: string;
  shift: string;
  status: "Active" | "Idle" | "Charging" | "Fault" | "Offline";
  batteryOrHealth: string;
}

export interface FilterState {
  date: string;
  shift: string;
  role: string;
  zone: string;
  assetType: string;
  availability: string;
  supervisor: string;
}