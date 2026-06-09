export default function ExecutiveValue() {
  const values = [
    {
      keyword: "Visibility",
      desc: "Complete real-time oversight of cargo, warehouse, gate, and compliance operations from a single glass pane.",
      icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    },
    {
      keyword: "Control",
      desc: "Role-based access, configurable workflows, and granular permissions give you precise operational governance.",
      icon: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    },
    {
      keyword: "Speed",
      desc: "Accelerate cargo throughput with automated workflows, RFID scanning, and digital task routing.",
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
    },
    {
      keyword: "Compliance",
      desc: "Built-in customs coordination, audit trails, and regulatory alignment keep your terminal fully compliant.",
      icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
    },
    {
      keyword: "Productivity",
      desc: "Reduce manual effort, eliminate data silos, and empower teams with digital tools that drive efficiency.",
      icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    },
    {
      keyword: "Scalability",
      desc: "Designed for terminals of any size — from single warehouses to multi-terminal airport cargo operations.",
      icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.3 7l8.7 5 8.7-5 M12 22V12",
    },
  ];

  return (
    <section id="value" className="relative py-28 lg:py-36 overflow-hidden" style={{ backgroundColor: "#FAFBFD" }}>
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, #FFFFFF, transparent)" }} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #C5F0E8 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(220,210,240,0.3)", border: "1px solid rgba(220,210,240,0.5)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#9B8EC8" }} />
            <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "#9B8EC8" }}>Executive Value</span>
          </div>
          <h2 className="text-[36px] lg:text-[48px] font-extrabold leading-tight tracking-tight" style={{ color: "#0B2545" }}>
            The platform advantage
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {values.map((v) => (
            <div key={v.keyword} className="flex flex-col gap-4 group">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: "linear-gradient(135deg, rgba(200,230,245,0.4), rgba(220,238,248,0.2))", border: "1px solid rgba(180,210,238,0.4)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={v.icon} />
                </svg>
              </div>
              <h3 className="text-[28px] lg:text-[34px] font-extrabold tracking-tight leading-none" style={{ color: "#0B2545" }}>{v.keyword}</h3>
              <p className="text-[14px] lg:text-[15px] leading-relaxed" style={{ color: "#64748B" }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}