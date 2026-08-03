/**
 * AirVault domain — messaging & notification spine (FC-05, M07 + M08).
 *
 * CMTS sources:
 *   `EmailTemplate` (7) / `EmailHistory` (9)
 *   `SMSTemplate` (5)   / `SmsHistory` (8)
 *   `CredentialIds` (6), `EventLog` (7), `ErrorLog` (10)
 *
 * AirVault adds: WhatsApp as a first-class channel, auto-trigger, and
 * delivery/read receipts. There is no IATA message table in CMTS.
 */

import type { SiteCode } from "./common";

/* ================================================================== *
 * FC-05 group A — pre-arrival (inbound)
 * ================================================================== */

export type PreArrivalMessage = "FFM" | "FWB" | "FHL" | "NOTOC";

/* ================================================================== *
 * FC-05 group B — operational status (outbound)
 * ================================================================== */

export type StatusMessage =
  | "RCF" //  Received from Flight
  | "NFD" //  Notified for Delivery
  | "AWD" //  Awaiting Documentation
  | "DIS" //  Discrepancy Raised
  | "DLV" //  Delivered
  | "RCT" //  Received for Transhipment
  | "TFD" //  Transferred to Carrier
  | "DEP" //  Departed Onward Sector
  | "TGC"; // Transferred to Ground Custody

export type IataMessageType = PreArrivalMessage | StatusMessage;

export const IATA_MESSAGE_LABEL: Record<IataMessageType, string> = {
  FFM: "FFM — Flight Manifest",
  FWB: "FWB — Master AWB Data",
  FHL: "FHL — House Manifest",
  NOTOC: "NOTOC — Special Cargo Notification",
  RCF: "RCF — Received from Flight",
  NFD: "NFD — Notified for Delivery",
  AWD: "AWD — Awaiting Documentation",
  DIS: "DIS — Discrepancy Raised",
  DLV: "DLV — Delivered",
  RCT: "RCT — Received for Transhipment",
  TFD: "TFD — Transferred to Carrier",
  DEP: "DEP — Departed Onward Sector",
  TGC: "TGC — Transferred to Ground Custody",
};

export const PRE_ARRIVAL_MESSAGES: PreArrivalMessage[] = ["FFM", "FWB", "FHL", "NOTOC"];
export const STATUS_MESSAGES: StatusMessage[] = [
  "RCF",
  "NFD",
  "AWD",
  "DIS",
  "DLV",
  "RCT",
  "TFD",
  "DEP",
  "TGC",
];

/* ================================================================== *
 * FC-05 group C — customer / CHA notifications
 * ================================================================== */

export type CustomerNotification =
  | "NOA"
  | "FREE_PERIOD_EXPIRY"
  | "MISSING_DOCUMENT"
  | "CUSTOMS_HOLD"
  | "PAYMENT_DUE"
  | "DO_READY"
  | "DELIVERY_COMPLETED";

export const CUSTOMER_NOTIFICATION_LABEL: Record<CustomerNotification, string> = {
  NOA: "Notice of Arrival",
  FREE_PERIOD_EXPIRY: "Free Period Expiry Alert",
  MISSING_DOCUMENT: "Missing Document Alert",
  CUSTOMS_HOLD: "Customs Hold Alert",
  PAYMENT_DUE: "Payment Due Alert",
  DO_READY: "DO Ready Alert",
  DELIVERY_COMPLETED: "Delivery Completed Alert",
};

/* ================================================================== *
 * FC-05 operational triggers — the wiring diagram of the whole spine
 *
 * Taken verbatim from the flow's Operational Triggers section and its
 * connectors. Note the three triggers that fire two messages.
 * ================================================================== */

export type OperationalTrigger =
  | "cargo-received"
  | "cargo-warehoused"
  | "docs-missing"
  | "discrepancy-raised"
  | "payment-ooc-do-ready"
  | "pod-captured"
  | "transfer-cargo-accepted"
  | "transfer-to-carrier"
  | "onward-flight-departed";

export interface TriggerMapping {
  trigger: OperationalTrigger;
  label: string;
  iata: IataMessageType[];
  customer: CustomerNotification[];
  /** Which module raises this event. */
  source: string;
  enabled: boolean;
}

/** FC-05's nine triggers, exactly as the flow wires them. */
export const TRIGGER_MAP: TriggerMapping[] = [
  { trigger: "cargo-received", label: "Cargo received", iata: ["RCF"], customer: [], source: "M04 Cargo Receipt", enabled: true },
  { trigger: "cargo-warehoused", label: "Cargo warehoused", iata: ["NFD"], customer: ["NOA"], source: "M05 Storage", enabled: true },
  { trigger: "docs-missing", label: "Docs missing", iata: ["AWD"], customer: ["MISSING_DOCUMENT"], source: "M02 Document Mgmt", enabled: true },
  { trigger: "discrepancy-raised", label: "Discrepancy raised", iata: ["DIS"], customer: [], source: "M06 CDR", enabled: true },
  { trigger: "payment-ooc-do-ready", label: "Payment + OOC + DO ready", iata: [], customer: ["DO_READY"], source: "M12 Delivery Order", enabled: true },
  { trigger: "pod-captured", label: "POD captured", iata: ["DLV"], customer: ["DELIVERY_COMPLETED"], source: "M14 POD", enabled: true },
  { trigger: "transfer-cargo-accepted", label: "Transfer cargo accepted", iata: ["RCT"], customer: [], source: "M15 Transhipment", enabled: true },
  { trigger: "transfer-to-carrier", label: "Transfer to carrier", iata: ["TFD"], customer: [], source: "M15 Transhipment", enabled: true },
  { trigger: "onward-flight-departed", label: "Onward flight departed", iata: ["DEP"], customer: [], source: "M15 Transhipment", enabled: true },
];

/**
 * Three FC-05 group-C notifications are listed but never wired to a
 * trigger on the board. These are their real sources — raised as part of
 * P7-3 so the map is complete rather than faithful-but-incomplete.
 */
export const UNWIRED_NOTIFICATIONS: Array<{
  notification: CustomerNotification;
  proposedSource: string;
  note: string;
}> = [
  {
    notification: "FREE_PERIOD_EXPIRY",
    proposedSource: "M10 dwell clock (FC-07 §02–03)",
    note: "Fires when dwell crosses the free-period boundary.",
  },
  {
    notification: "CUSTOMS_HOLD",
    proposedSource: "M06 hold register (HOLDINGSTATUS)",
    note: "Fires on placement of a customs-type hold.",
  },
  {
    notification: "PAYMENT_DUE",
    proposedSource: "M11 invoicing",
    note: "Fires on invoice issue and again ahead of the due date.",
  },
];

/* ================================================================== *
 * Channels, templates & receipts
 * ================================================================== */

export type Channel = "email" | "sms" | "whatsapp";

export const CHANNEL_LABEL: Record<Channel, string> = {
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
};

/** CMTS `EmailTemplate` / `SMSTemplate`. WhatsApp is the AirVault addition. */
export interface NotificationTemplate {
  Id: number;
  notification: CustomerNotification;
  channel: Channel;
  DisplayName: string;
  Subject: string | null;
  Body: string;
  IsHtml: boolean;
  /** Template variables available, e.g. {{awbNo}}. */
  variables: string[];
  version: number;
  IsActive: boolean;
  IsDeleted: boolean;
}

export type DeliveryStatus = "queued" | "sent" | "delivered" | "read" | "failed";

/** CMTS `EmailHistory` / `SmsHistory`, plus AirVault receipts. */
export interface NotificationDispatch {
  Id: number;
  notification: CustomerNotification;
  channel: Channel;
  TemplateId: number;
  awbId: number | null;
  AWBNO: string | null;
  IGMNO: string | null;
  recipientPartyId: number;
  recipientName: string;
  /** CMTS `SenderEmail` / `SenderNumber`. */
  SenderName: string;
  destination: string;
  status: DeliveryStatus;
  queuedAt: string;
  sentAt: string | null;
  /** AirVault addition. */
  deliveredAt: string | null;
  /** AirVault addition. */
  readAt: string | null;
  /** CMTS `NoOfTry`. */
  NoOfTry: number;
  failureReason: string | null;
  /** Which trigger produced this — provenance for the trigger map. */
  trigger: OperationalTrigger | null;
  site: SiteCode;
}

/** Outbound/inbound IATA Cargo-IMP message. */
export interface IataMessage {
  id: number;
  type: IataMessageType;
  direction: "inbound" | "outbound";
  awbId: number | null;
  AWBNO: string | null;
  IGMNO: string | null;
  FLIGHT: string | null;
  /** Raw Cargo-IMP payload. */
  raw: string;
  status: "queued" | "sent" | "acknowledged" | "failed" | "received";
  timestamp: string;
  /** Outbound only — which event produced it. */
  trigger: OperationalTrigger | null;
  /** Set when a human sent it manually — the amendment says auto is the norm. */
  manualSendBy: string | null;
  failureReason: string | null;
  site: SiteCode;
}

/* ================================================================== *
 * Integration gateways — FC-12 "Integration gateways: PSW customs ·
 * SITA (IATA) · Payment · RFID/HW · Notify"
 * ================================================================== */

export type GatewayCode = "psw" | "weboc" | "sita" | "payment" | "rfid" | "notify";

export interface GatewayState {
  code: GatewayCode;
  label: string;
  /** FC-06 amendment — provider-abstracted, PSW primary / WeBOC parallel. */
  role: "primary" | "parallel" | "single";
  status: "healthy" | "degraded" | "down";
  lastSyncAt: string;
  queueDepth: number;
  note: string | null;
}

export const GATEWAYS: GatewayState[] = [
  { code: "psw", label: "PSW — Pakistan Single Window", role: "primary", status: "healthy", lastSyncAt: "2026-08-03T14:30:00+05:00", queueDepth: 2, note: "Single Declaration, risk channel & OOC via EDI" },
  { code: "weboc", label: "WeBOC (legacy)", role: "parallel", status: "healthy", lastSyncAt: "2026-08-03T14:22:00+05:00", queueDepth: 0, note: "Parallel-run during phased rollout — see BLK-04" },
  { code: "sita", label: "SITA — IATA Cargo-IMP", role: "single", status: "healthy", lastSyncAt: "2026-08-03T14:31:00+05:00", queueDepth: 5, note: null },
  { code: "payment", label: "Payment gateway", role: "single", status: "healthy", lastSyncAt: "2026-08-03T14:29:00+05:00", queueDepth: 0, note: "Cash-less card / bank / online" },
  { code: "rfid", label: "RFID & hardware", role: "single", status: "degraded", lastSyncAt: "2026-08-03T14:11:00+05:00", queueDepth: 14, note: "PEW handheld reader #3 offline" },
  { code: "notify", label: "Notification — Email / SMS / WhatsApp", role: "single", status: "healthy", lastSyncAt: "2026-08-03T14:32:00+05:00", queueDepth: 1, note: null },
];
