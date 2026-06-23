export default function LandingFooter() {
  return (
    <footer className="relative py-12" style={{ backgroundColor: "#F0F4FA" }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="/airvault-logo.png"
              alt="AirVault"
              className="h-6 w-auto"
            />
            <span className="text-[12px] ml-2" style={{ color: "#94A3B8" }}>&copy; 2026 AirVault Solutions</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[12px] cursor-pointer transition-colors" style={{ color: "#64748B" }} onMouseEnter={(e) => e.currentTarget.style.color = "#0B2545"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}>
              Support
            </span>
            <span className="text-[12px] cursor-pointer transition-colors" style={{ color: "#64748B" }} onMouseEnter={(e) => e.currentTarget.style.color = "#0B2545"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}>
              Privacy
            </span>
            <span className="text-[12px]" style={{ color: "#94A3B8" }}>
              Smart Air Cargo Operations Platform
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}