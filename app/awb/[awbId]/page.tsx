import { notFound } from "next/navigation";
import AwbHubContent from "@/components/awb/AwbHubContent";
import { AWBS, getAwb } from "@/lib/domain";

/**
 * P0-3 · AWB hub.
 *
 * FC-12 draws M03 (AWB / MAWB / HAWB indexing) as the hub, wiring it to
 * M04, M05, M06, M09, M10, M15, M16 and M17. This route is that hub: one
 * canonical record every screen in the product can link into.
 */

export function generateStaticParams() {
  return AWBS.map((a) => ({ awbId: String(a.AWBId) }));
}

export default async function AwbHubPage({
  params,
}: {
  params: Promise<{ awbId: string }>;
}) {
  const { awbId } = await params;
  const id = Number(awbId);
  if (!Number.isFinite(id)) notFound();

  const bundle = getAwb(id);
  if (!bundle) notFound();

  return <AwbHubContent bundle={bundle} />;
}
