export default function OperationalFlow() {
  const steps = [
    { label: "Inbound", icon: "M21 10H3M21 10l-4-4M21 10l-4 4M3 10l4-4M3 10l4 4" },
    { label: "Storage", icon: "M3 3h18v18H3z M3 9h18 M9 3v18" },
    { label: "Customs", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { label: "Billing", icon: "M2 7h20 M2 12h20 M2 17h20" },
    { label: "Delivery Order", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
    { label: "Pickup", icon: "M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2 M15 14h6v6h-6z M19 14v6" },
    { label: "Dispatch", icon: "M4 14h16 M4 14l4-4 M4 14l4 4 M20 14l-4-4 M20 14l-4 4" },
    { label: "Reporting", icon: "M12 20V10 M18 20V4 M6 20v-4" },
  ];

  return (
    <section id="flow" className="relative py-28 lg:py-36" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(180,220,235,0.3)", border: "1px solid rgba(180,220,235,0.5)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#5BA4C5" }} />
            <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "#5BA4C5" }}>Operational Flow</span>
          </div>
          <h2 className="text-[36px] lg:text-[48px] font-extrabold leading-tight tracking-tight" style={{ color: "#0B2545" }}>
            From inbound to reporting
          </h2>
          <p className="text-[15px] lg:text-[16px] mt-4 max-w-[560px] mx-auto leading-relaxed" style={{ color: "#64748B" }}>
            A seamless digital journey across every stage of cargo terminal operations.
          </p>
        </div>

        <div className="relative">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] hidden lg:block" style={{ background: "linear-gradient(to right, rgba(180,210,238,0.2), rgba(180,210,238,0.8), rgba(180,210,238,0.2))" }} />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 lg:gap-4">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center gap-3 group">
                <div className="relative">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl z-10 relative"
                    style={{
                      background: "linear-gradient(135deg, rgba(200,230,245,0.6), rgba(220,238,248,0.4))",
                      border: "1px solid rgba(180,210,238,0.5)",
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d={step.icon} />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #7EC8E3, #5BA4C5)" }}>
                    <span className="text-[11px] font-bold text-white">{i + 1}</span>
                  </div>
                </div>
                <span className="text-[13px] lg:text-[14px] font-semibold text-center whitespace-nowrap" style={{ color: "#0B2545" }}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-20">
          <path d="M0 80 C360 0 720 80 1440 40 L1440 80 Z" fill="#FAFBFD" />
        </svg>
      </div>
    </section>
  );
}