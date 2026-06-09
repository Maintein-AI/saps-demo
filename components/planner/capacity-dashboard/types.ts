export interface ZoneCapacity {
  zone: string;
  handlingClass: string;
  totalLocations: number;
  occupied: number;
  available: number;
  blocked: number;
  utilization: number;
  forecastInbound: number;
  riskLevel: string;
  used: number;
}

export interface HandlingCodeCapacity {
  code: string;
  label: string;
  occupied: number;
  available: number;
  total: number;
  utilization: number;
}

export interface RiskAlert {
  id: string;
  message: string;
  severity: string;
  zone: string;
  utilization: number;
}

export interface ForecastData {
  expected: number;
  received: number;
  variance: number;
}

export interface KPIData {
  totalCapacity: string;
  occupied: string;
  available: string;
  forecastInbound: number;
  highRiskZones: number;
  coldChainRemaining: string;
}