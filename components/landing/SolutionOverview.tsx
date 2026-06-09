export default function SolutionOverview() {
  const items = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="3" /><line x1="2" y1="8" x2="22" y2="8" /><line x1="8" y1="2" x2="8" y2="22" />
        </svg>
      ),
      title: "Unified Cargo Operations",
      desc: "One platform across warehousing, gate entry, and cargo movement — replacing disconnected systems with a single source of truth.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="9" /><line x1="12" y1="15" x2="12" y2="22" />
        </svg>
      ),
      title: "Live Visibility",
      desc: "Real-time RFID tracking, live dashboards, and instant event streams give you complete operational transparency.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      title: "Process Control",
      desc: "Automated workflows from inbound to dispatch reduce manual effort and eliminate operational bottlenecks.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: "Aviation Message Workflows",
      desc: "Native IATA messaging (FFM, FWB, FHL, UCM, SCM) keeps airlines, handlers, and ground teams in sync.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5BA4C5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      title: "Intelligent Planning & Dispatch",
      desc: "Capacity forecasting, slot planning, and resource rostering ensure your terminal runs at peak efficiency.",
    },
  ];

  return (
    <section id="solution" className="relative py-28 lg:py-36" style={{ backgroundColor: "#FAFBFD" }}>
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, #FFFFFF, transparent)" }} />

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: "rgba(165,210,235,0.3)", border: "1px solid rgba(165,210,235,0.5)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#5BA4C5" }} />
            <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "#5BA4C5" }}>Solution</span>
          </div>
          <h2 className="text-[36px] lg:text-[48px] font-extrabold leading-tight tracking-tight" style={{ color: "#0B2545" }}>
            One platform across<br />your entire operation
          </h2>
        </div>

        <div className="flex flex-col gap-14">
          {items.map((item, i) => (
            <div key={item.title} className={`flex items-start gap-8 lg:gap-12 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(165,210,235,0.3), rgba(200,230,245,0.2))", border: "1px solid rgba(165,210,235,0.4)" }}>
                {item.icon}
              </div>
              <div className="flex flex-col gap-2 max-w-[640px]">
                <h3 className="text-[22px] lg:text-[26px] font-bold" style={{ color: "#0B2545" }}>{item.title}</h3>
                <p className="text-[15px] lg:text-[16px] leading-relaxed" style={{ color: "#64748B" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full h-20">
          <path d="M0 80 C360 0 720 80 1440 40 L1440 80 Z" fill="#FFFFFF" />
        </svg>
      </div>
    </section>
  );
}