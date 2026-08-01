"use client";
import { WaiverRequest } from "@/app/finance-manager/waiver-workflow/page";

interface RequesterFormProps {
  waiver: WaiverRequest;
}

function formatPKR(value: number) {
  return `Rs. ${value.toLocaleString("en-PK")}`;
}

const reasonOptions = [
  "Airline delay",
  "Customs hold",
  "Force majeure",
  "Concession",
  "Govt cargo",
  "Billing correction",
];

export default function RequesterForm({ waiver }: RequesterFormProps) {
  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px] font-bold text-[#0F172A]">Waiver Request</h2>
        </div>
        <span className="text-[12px] font-semibold text-[#64748B]">
          {waiver.id}
        </span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Invoice #
            </label>
            <div className="text-[13px] font-semibold text-[#0B2545]">
              {waiver.invoiceId}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              AWB #
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.awb}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Consignee
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.consignee}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Original Invoice Amount
            </label>
            <div className="text-[13px] font-semibold text-[#0F172A]">
              {formatPKR(waiver.originalAmount)}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Reason
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.reason}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Waiver Type
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.waiverType}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Waiver Value
            </label>
            <div className="text-[13px] font-semibold text-[#0F172A]">
              {waiver.waiverType === "Percentage"
                ? `${waiver.waiverValue}%`
                : formatPKR(waiver.waiverValue)}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Supporting Document
            </label>
            <div className="text-[13px] font-medium text-[#1B4F8B] underline cursor-pointer">
              {waiver.documentUploaded ? "attached.pdf" : "Not uploaded"}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Requested By
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.requestedBy}
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Requested At
            </label>
            <div className="text-[13px] font-medium text-[#0F172A]">
              {waiver.requestedAt}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Request Notes
            </label>
            <div className="text-[13px] font-medium text-[#0F172A] leading-relaxed">
              {waiver.reason === "Airline delay"
                ? "Flight was delayed by 12 hours due to technical issue. Consignee was unable to collect cargo within free period."
                : waiver.reason === "Customs hold"
                ? "Customs examination held shipment for 3 days. Client should not bear storage charges during hold period."
                : waiver.reason === "Force majeure"
                ? "City-wide flooding prevented cargo retrieval. Client requests full waiver on demurrage."
                : waiver.reason === "Concession"
                ? "Repeat client with annual contract. Agreed concession rate applies per commercial terms."
                : waiver.reason === "Govt cargo"
                ? "Government consignment under exempt category. No storage charges applicable as per FBR notification."
                : "Billing discrepancy identified. Correct rate should be Rs. 8/kg not Rs. 12/kg. Overcharge needs adjustment."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}