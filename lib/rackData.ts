interface RackLevel {
  level: number;
  status: "available" | "partial" | "full" | "blocked";
  occupancy: number;
}

export interface Rack {
  id: string;
  row: number;
  rack: number;
  levels: RackLevel[];
  awbs: string[];
  handlingClass: string;
}

const rackStatuses = ["available", "partial", "full", "blocked"] as const;
const handlingClasses = ["GCR", "PER", "VAL", "DGR", "COL", "AVI", "HEA"];

function getOccupancy(status: typeof rackStatuses[number]) {
  if (status === "available") return 0;
  if (status === "partial") return Math.floor(Math.random() * 60) + 20;
  if (status === "full") return 100;
  return 0;
}

export function generateRacks(): Rack[] {
  return Array.from({ length: 144 }, (_, i) => {
    const row = Math.floor(i / 12) + 1;
    const rack = (i % 12) + 1;
    const baseStatus = rackStatuses[Math.floor(Math.random() * 4)];
    const baseOccupancy = getOccupancy(baseStatus);
    return {
      id: `R${String(row).padStart(2, "0")}-${String(rack).padStart(2, "0")}`,
      row,
      rack,
      levels: [
        { level: 1, status: baseStatus, occupancy: baseOccupancy },
        { level: 2, status: Math.random() > 0.3 ? baseStatus : rackStatuses[Math.floor(Math.random() * 4)], occupancy: baseOccupancy },
        { level: 3, status: Math.random() > 0.5 ? baseStatus : rackStatuses[Math.floor(Math.random() * 4)], occupancy: baseOccupancy },
      ],
      awbs: baseStatus !== "available" && baseStatus !== "blocked"
        ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () =>
            `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90000000) + 10000000}`
          )
        : [],
      handlingClass: handlingClasses[Math.floor(Math.random() * handlingClasses.length)],
    };
  });
}