export default function WhyAirVault() {
  const points = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="3" /><line x1="2" y1="8" x2="22" y2="8" />
        </svg>
      ),
      title: "One platform across operations",
      desc: "No more fragmented systems. AirVault connects warehousing, gate, customs, finance, and planning into a unified digital workspace.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: "Faster cargo handling",
      desc: "Automated workflows, digital task assignment, and RFID-driven movement reduce processing time by up to 40%.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
      ),
      title: "Better traceability",
      desc: "Piece-level RFID, full audit trails, and event logs give you complete visibility into every cargo movement.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      title: "Real-time control",
      desc: "Live dashboards, instant alerts, and operational KPIs let supervisors make informed decisions in real time.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: "Reduced manual effort",
      desc: "Digital forms, automated validations, and system-driven workflows eliminate paper, spreadsheets, and repetitive data entry.",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Cleaner operational decision-making",
      desc: "Consolidated reporting, predictive insights, and cross-portal analytics drive smarter, faster decisions.",
    },
  ];

  return (
    <section className="relative py-28 lg:py-36" style={{ backgroundColor: "#FAFBFD" }}>
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, #FFFFFF, transparent)" }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
          <div className="lg:w-[38%] lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(210,200,235,0.3)", border: "1px solid rgba(210,200,235,0.5)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#8B7EC8" }} />
              <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "#8B7EC8" }}>Why AirVault</span>
            </div>
            <h2 className="text-[36px] lg:text-[48px] font-extrabold leading-tight tracking-tight" style={{ color: "#0B2545" }}>
              Built for<br />cargo terminals<br />that demand<br />excellence
            </h2>
            <p className="text-[15px] lg:text-[16px] leading-relaxed mt-6" style={{ color: "#64748B" }}>
              AirVault replaces legacy systems, spreadsheets, and manual processes with a modern, connected digital platform designed specifically for airport cargo and warehouse environments.
            </p>
          </div>

          <div className="lg:w-[62%] flex flex-col gap-10">
            {points.map((point, i) => (
              <div key={point.title} className="flex items-start gap-5 group">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: "linear-gradient(135deg, rgba(200,230,245,0.5), rgba(220,238,248,0.3))", border: "1px solid rgba(180,210,238,0.4)" }}>
                    {point.icon}
                  </div>
                  {i < points.length - 1 && (
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 w-px h-8" style={{ background: "linear-gradient(to bottom, rgba(180,210,238,0.6), transparent)" }} />
                  )}
                </div>
                <div className="flex flex-col gap-1.5 pt-2">
                  <h3 className="text-[18px] lg:text-[20px] font-bold" style={{ color: "#0B2545" }}>{point.title}</h3>
                  <p className="text-[14px] lg:text-[15px] leading-relaxed max-w-[520px]" style={{ color: "#64748B" }}>{point.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}