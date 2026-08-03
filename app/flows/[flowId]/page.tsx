import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CircleSlash } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { FLOWS, flow } from "@/lib/architecture";

/**
 * P0-5 · Flow walkthrough.
 *
 * Renders a flowchart as an ordered list of screens so a stakeholder can be
 * walked through FC-01 (or any other) end to end. Steps with no screen
 * behind them say so and name the ticket that will build them — the gaps
 * are as informative as the coverage.
 */

export function generateStaticParams() {
  return FLOWS.map((f) => ({ flowId: f.id }));
}

export default async function FlowWalkthroughPage({
  params,
}: {
  params: Promise<{ flowId: string }>;
}) {
  const { flowId } = await params;
  const f = flow(decodeURIComponent(flowId));
  if (!f) notFound();

  const implemented = f.steps.filter((s) => s.href).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: "Module Map", href: "/modules" }, { label: f.id }]} />
        <div className="flex items-start gap-3">
          <Link
            href="/modules"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#E2E8F0] text-[#64748B] cursor-pointer transition-colors no-underline flex-shrink-0"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-[#94A3B8] font-mono">{f.docNo}</span>
              <span className="h-[18px] px-1.5 rounded bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold inline-flex items-center">
                {f.rev}
              </span>
            </div>
            <h1 className="text-[24px] lg:text-[30px] font-bold text-[#0F172A] leading-tight mt-1">
              {f.title}
            </h1>
            <p className="text-[13px] text-[#64748B] mt-1">{f.subtitle}</p>
          </div>
        </div>
      </div>

      {/* The amendment — the thing that makes this AirVault and not CMTS */}
      <div className="rounded-[16px] border border-[#DDD6FE] bg-[#F5F3FF] p-5">
        <p className="text-[11px] font-bold text-[#7C3AED] uppercase tracking-wider">
          AirVault amendment
        </p>
        <p className="text-[13px] text-[#4C1D95] mt-1.5 leading-relaxed">{f.amendment}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[13px] text-[#64748B]">
          <span className="font-semibold text-[#0F172A]">{implemented}</span> of {f.steps.length}{" "}
          steps reachable in the demo
        </span>
        <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden max-w-[240px]">
          <div
            className="h-full bg-[#16A34A]"
            style={{ width: `${(implemented / f.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps.
          Swimlane flows (FC-02) carry a `lane` per step. The flow crosses
          lanes and crosses back, so we group *consecutive runs* rather
          than collecting by lane name — collecting would reorder the
          sequence, which is the one thing a flow walkthrough must not do. */}
      <ol className="flex flex-col">
        {f.steps.map((s, i) => {
          const last = i === f.steps.length - 1;
          const live = !!s.href;
          const laneStarts = !!s.lane && s.lane !== f.steps[i - 1]?.lane;
          return (
            <li
              key={`${s.ref}-${i}`}
              className="relative flex gap-4 pb-4 last:pb-0"
              style={laneStarts && i > 0 ? { marginTop: 18 } : undefined}
            >
              {laneStarts && (
                <span className="absolute -top-[15px] left-0 right-0 flex items-center gap-2">
                  <span className="h-[18px] px-2 rounded bg-[#0B2545] text-white text-[10px] font-bold inline-flex items-center uppercase tracking-wider">
                    {s.lane}
                  </span>
                  <span className="flex-1 h-[1px] bg-[#E2E8F0]" />
                </span>
              )}
              {!last && (
                <span
                  className="absolute left-[15px] top-8 bottom-0 w-[2px]"
                  style={{ backgroundColor: live ? "#BBF7D0" : "#E2E8F0" }}
                />
              )}
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0 z-10 text-[10px] font-bold font-mono"
                style={{
                  backgroundColor: live ? "#DCFCE7" : "#F1F5F9",
                  color: live ? "#16A34A" : "#94A3B8",
                  // A decision node is drawn as a diamond in the flowchart,
                  // so it is drawn as one here too.
                  borderRadius: s.decision ? 6 : 9999,
                  transform: s.decision ? "rotate(45deg)" : undefined,
                }}
              >
                <span style={s.decision ? { transform: "rotate(-45deg)" } : undefined}>
                  {s.ref === "—" ? "•" : s.ref.split("–")[0]}
                </span>
              </div>

              <div
                className="flex-1 min-w-0 rounded-[14px] border bg-white px-4 py-3"
                style={{ borderColor: live ? "#E2E8F0" : "#F1F5F9" }}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#0F172A]">{s.label}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="h-[18px] px-1.5 rounded bg-[#EBF0F7] text-[#0B2545] text-[10px] font-bold inline-flex items-center font-mono">
                        {s.module}
                      </span>
                      <span className="text-[11px] text-[#94A3B8] font-mono">step {s.ref}</span>
                    </div>
                  </div>

                  {live ? (
                    <Link
                      href={s.href!}
                      className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[12px] font-semibold text-[#1B4F8B] no-underline transition-colors flex-shrink-0"
                    >
                      Open screen
                      <ArrowUpRight size={12} />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#FEF2F2] text-[12px] font-semibold text-[#DC2626] flex-shrink-0">
                      <CircleSlash size={12} />
                      Not built
                    </span>
                  )}
                </div>

                {s.note && <p className="text-[12px] text-[#64748B] mt-2">{s.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
