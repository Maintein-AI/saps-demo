export interface FlightForecast {
  id: string;
  flightNumber: string;
  airline: string;
  eta: string;
  origin: string;
  expectedAwbs: number;
  expectedPieces: number;
  expectedWeight: number;
  cargoClasses: string[];
  messageSource: string[];
  messageStatus: "Complete" | "FWB Pending" | "FHL Pending" | "FFM Missing" | "Partial";
}

export interface MessageGap {
  id: string;
  flightNumber: string;
  gapType: string;
  severity: "High" | "Medium" | "Low";
  description: string;
}

export interface CargoMixItem {
  class: string;
  count: number;
  percentage: number;
}

export interface FilterState {
  date: string;
  airline: string;
  originAirport: string;
  flightNumber: string;
  cargoClass: string;
  messageSource: string;
  etaWindow: string;
}

export interface HourlyForecast {
  hour: string;
  pieces: number;
  weight: number;
}