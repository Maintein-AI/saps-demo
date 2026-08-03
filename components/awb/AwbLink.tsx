"use client";

/**
 * P0-3 · The link that makes the AWB hub a hub.
 *
 * FC-12 wires M03 (AWB indexing) outward to eight modules. Any AWB number
 * shown anywhere in the product should land on the same canonical record —
 * this component is how. Replaces hard-coded AWB strings across screens.
 */

import Link from "next/link";
import { awbByNo } from "@/lib/domain";

interface Props {
  /** Either is enough — the number is resolved to an id when not given. */
  awbNo: string;
  awbId?: number;
  /** Deep-link straight to a tab. */
  tab?: "overview" | "pieces" | "storage" | "customs" | "charges" | "dispatch" | "messaging" | "exceptions" | "audit";
  className?: string;
  children?: React.ReactNode;
}

export default function AwbLink({ awbNo, awbId, tab, className, children }: Props) {
  const id = awbId ?? awbByNo(awbNo)?.AWBId;

  // An AWB we have no record for is shown as plain text rather than a dead link.
  if (!id) {
    return <span className={className ?? "font-mono text-[13px] text-[#64748B]"}>{children ?? awbNo}</span>;
  }

  return (
    <Link
      href={`/awb/${id}${tab ? `?tab=${tab}` : ""}`}
      className={
        className ??
        "font-mono text-[13px] font-semibold text-[#1B4F8B] hover:text-[#0B2545] hover:underline no-underline transition-colors"
      }
    >
      {children ?? awbNo}
    </Link>
  );
}
