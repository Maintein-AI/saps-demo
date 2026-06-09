export default function KeyCapabilities() {
  const capabilities = [
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      title: "Cargo & Warehouse Operations",
      desc: "Putaway, picking, storage mapping, cold chain monitoring, and exception handling — all in one integrated workspace.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7B8FCE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="8" x2="21" y2="8" /><line x1="7" y1="12" x2="7" y2="20" /><line x1="11" y1="12" x2="11" y2="20" />
        </svg>
      ),
      title: "Gate Entry & Dispatch Control",
      desc: "Digital vehicle entry and exit, real-time gate boards, authority letter digitisation, and dispatch document management.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8BB8D0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
      ),
      title: "RFID Visibility & Tracking",
      desc: "Piece-level RFID tracking from inbound to delivery with live read streams, gate integration, and full traceability.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9BACC8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Customs & Compliance Coordination",
      desc: "GD filing, customs channel assignment, OOC capture, hold registers, and Section 82 long-stay compliance tracking.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6BA5C0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      ),
      title: "Finance & Billing Control",
      desc: "Multi-tariff engine, invoice generation, waiver workflows, payment reconciliation, and outstanding aging tracking.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7AA0C8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: "Slot Planning & Capacity Intelligence",
      desc: "Bay calendars, capacity forecasting, resource rostering, and slot conflict detection for optimised terminal throughput.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8CA8D4" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "ULD Messaging & Aviation Workflows",
      desc: "Native IATA message builder (SCM, UCM, LUC), import tools, search, message logs, and airline messaging integration.",
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8E8CC8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="3" /><line x1="2" y1="8" x2="22" y2="8" /><circle cx="7" cy="14" r="1" /><circle cx="12" cy="14" r="1" /><circle cx="17" cy="14" r="1" />
        </svg>
      ),
      title: "Admin, Audit & Reporting",
      desc: "User and role management, full audit trail, session logs, cross-portal reporting, and QA acceptance tracking.",
    },
  ];

  return (
    <section id="capabilities" className="relative py-28 lg:py-36" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, #FAFBFD, transparent)" }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(200,220,245,0.3)", border: "1px solid rgba(200,220,245,0.5)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#7B8FCE" }} />
            <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "#7B8FCE" }}>Capabilities</span>
          </div>
          <h2 className="text-[36px] lg:text-[48px] font-extrabold leading-tight tracking-tight" style={{ color: "#0B2545" }}>
            Everything your terminal needs
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          {capabilities.map((cap, i) => (
            <div key={cap.title} className="flex items-start gap-6 group">
              <div className="w-[72px] h-[72px] rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: "linear-gradient(135deg, rgba(200,230,245,0.4), rgba(220,238,248,0.2))", border: "1px solid rgba(180,210,238,0.4)" }}>
                {cap.icon}
              </div>
              <div className="flex flex-col gap-2 pt-1">
                <h3 className="text-[18px] lg:text-[20px] font-bold" style={{ color: "#0B2545" }}>{cap.title}</h3>
                <p className="text-[14px] lg:text-[15px] leading-relaxed" style={{ color: "#64748B" }}>{cap.desc}</p>
              </div>
            </div>
          ))}
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