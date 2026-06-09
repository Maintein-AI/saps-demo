export interface Slot {
  id: string;
  slotId: string;
  bay: string;
  date: string;
  startTime: string;
  endTime: string;
  awbNo: string;
  vehicleNo: string;
  doNo: string;
  cargoClass: string;
  expectedPieces: number;
  expectedWeight: number;
  assignedTeam: string;
  assignedLifter: string;
  conflictStatus: string;
  notes: string;
  status: string;
}

export interface SlotConflict {
  id: string;
  conflictId: string;
  resource: string;
  time: string;
  awbNo: string;
  vehicleNo: string;
  conflictType: string;
  severity: string;
}

export interface ResourceRow {
  name: string;
  type: string;
  slots: Slot[];
}

export type SlotStatus = "Available" | "Booked" | "In Progress" | "Completed" | "Conflict" | "Blocked";

export type ConflictType = "Double booking" | "Capacity exceeded" | "Cold-chain mismatch" | "DGR segregation conflict" | "Vehicle bay unavailable";