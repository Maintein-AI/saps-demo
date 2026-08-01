interface SectionBProps {
  data: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: string[];
}

const iataAirports = [
  { code: "DXB", name: "Dubai (DXB)" },
  { code: "JED", name: "Jeddah (JED)" },
  { code: "IST", name: "Istanbul (IST)" },
  { code: "LHR", name: "London Heathrow (LHR)" },
  { code: "FRA", name: "Frankfurt (FRA)" },
  { code: "AMS", name: "Amsterdam (AMS)" },
  { code: "CAN", name: "Guangzhou (CAN)" },
  { code: "HKG", name: "Hong Kong (HKG)" },
  { code: "SIN", name: "Singapore (SIN)" },
  { code: "BKK", name: "Bangkok (BKK)" },
  { code: "DOH", name: "Doha (DOH)" },
  { code: "AUH", name: "Abu Dhabi (AUH)" },
  { code: "SHJ", name: "Sharjah (SHJ)" },
  { code: "DEL", name: "Delhi (DEL)" },
  { code: "BOM", name: "Mumbai (BOM)" },
  { code: "PEK", name: "Beijing (PEK)" },
  { code: "PVG", name: "Shanghai (PVG)" },
  { code: "NBO", name: "Nairobi (NBO)" },
  { code: "JNB", name: "Johannesburg (JNB)" },
  { code: "KHI", name: "Karachi (KHI)" },
];

const airlines = [
  "Emirates SkyCargo",
  "Qatar Airways Cargo",
  "Turkish Airlines Cargo",
  "Saudia Cargo",
  "Etihad Cargo",
  "PIA Cargo",
  "AirBlue Cargo",
  "Shaheen Air Cargo",
  "Cathay Pacific Cargo",
  "Lufthansa Cargo",
  "Singapore Airlines Cargo",
  "Ethiopian Airlines Cargo",
  "China Southern Cargo",
  "DHL Aviation",
  "FedEx Express",
  "UPS Airlines",
];

export default function SectionB({ data, onChange, errors }: SectionBProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-[14px] font-bold text-[#0F172A]">B. Flight & Routing</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Origin Airport (IATA) <span className="text-[#DC2626]">*</span>
          </label>
          <select
            value={data.origin || ""}
            onChange={(e) => onChange("origin", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            style={{ borderColor: errors.includes("origin") ? "#DC2626" : "#E2E8F0" }}
          >
            <option value="">Select origin</option>
            {iataAirports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name}
              </option>
            ))}
          </select>
          {errors.includes("origin") && <p className="text-[11px] text-[#DC2626]">Origin is required.</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Destination Airport <span className="text-[#DC2626]">*</span>
          </label>
          <select
            value={data.destination || "KHI"}
            onChange={(e) => onChange("destination", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            style={{ borderColor: errors.includes("destination") ? "#DC2626" : "#E2E8F0" }}
          >
            {iataAirports.map((a) => (
              <option key={a.code} value={a.code}>
                {a.name}
              </option>
            ))}
          </select>
          {errors.includes("destination") && <p className="text-[11px] text-[#DC2626]">Destination is required.</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Carrier Airline <span className="text-[#DC2626]">*</span>
          </label>
          <select
            value={data.carrier || ""}
            onChange={(e) => onChange("carrier", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors appearance-none bg-white"
            style={{ borderColor: errors.includes("carrier") ? "#DC2626" : "#E2E8F0" }}
          >
            <option value="">Select carrier</option>
            {airlines.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          {errors.includes("carrier") && <p className="text-[11px] text-[#DC2626]">Carrier is required.</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Flight # <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="text"
            value={data.flightNumber || ""}
            onChange={(e) => onChange("flightNumber", e.target.value)}
            placeholder="e.g. EK602"
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none focus:border-[#1B4F8B] transition-colors"
            style={{ borderColor: errors.includes("flightNumber") ? "#DC2626" : "#E2E8F0" }}
          />
          {errors.includes("flightNumber") && <p className="text-[11px] text-[#DC2626]">Flight number is required.</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Flight Date <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="date"
            value={data.flightDate || ""}
            onChange={(e) => onChange("flightDate", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
            style={{ borderColor: errors.includes("flightDate") ? "#DC2626" : "#E2E8F0" }}
          />
          {errors.includes("flightDate") && <p className="text-[11px] text-[#DC2626]">Flight date is required.</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">
            Scheduled Arrival <span className="text-[#DC2626]">*</span>
          </label>
          <input
            type="datetime-local"
            value={data.scheduledArrival || ""}
            onChange={(e) => onChange("scheduledArrival", e.target.value)}
            className="w-full h-10 px-3 rounded-lg border text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
            style={{ borderColor: errors.includes("scheduledArrival") ? "#DC2626" : "#E2E8F0" }}
          />
          {errors.includes("scheduledArrival") && <p className="text-[11px] text-[#DC2626]">Scheduled arrival is required.</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[12px] font-semibold text-[#0F172A]">Number of Stops</label>
          <input
            type="number"
            min={0}
            max={10}
            value={data.stops || 0}
            onChange={(e) => onChange("stops", parseInt(e.target.value) || 0)}
            className="w-full h-10 px-3 rounded-lg border border-[#E2E8F0] text-[13px] text-[#0F172A] outline-none focus:border-[#1B4F8B] transition-colors"
          />
        </div>
      </div>
    </div>
  );
}