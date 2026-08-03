# AirVault Demo — Module & Screen Build Plan
**Source inputs:** Figma board `SAPS` → AirVault flows FC-01 … FC-12 (Rev 2.0) · CMTS legacy MS-SQL schema (106 tables / 1,742 columns) · `saps-demo` repo (Next.js 16, 109 pages, 14 portals, mock data only)
**Scope of this plan:** screens and modules only. No backend, no real APIs. Every screen is built against a typed mock-data layer so that Phase-wise linking (screen → screen) works like the real flows.

---

## 1. What the AirVault flows actually specify

Twelve flowcharts, each with an **"AirVault amendment"** sticky that states how AirVault differs from CMTS. The amendments are the product spec — they are what makes this AirVault and not a CMTS reskin.

| Flow | Process | AirVault amendment (the delta vs CMTS) |
|---|---|---|
| **FC-01** | Master end-to-end, 27 steps: handover → pouch → doc verify → AWB summary → manifest reconciliation → discrepancy? → indexation → piece tagging → split → segregation → acceptance → weigh/dimension → storage → CMTS capture → IATA msg → NOA → customs → charges → invoice → **GR voucher** → DO → gate pass → delivery → POD → DLV → closure | Step 05 becomes **OCR-assisted intake** (05a–05f): scan MAWB/HAWB/manifest → auto-extract line items with **per-item confidence score** → operator accepts/corrects low-confidence items → capture **declared (OCR) vs physical (received)** qty/wt/vol → commit. Variance feeds reconciliation → CDR. |
| **FC-02** | Import detail across 6 swimlanes: Airline/Carrier · Terminal/Warehouse · Documentation/CMTS · Customs/Agencies · Finance/Billing · Consignee/CHA | Documentation lane is OCR-assisted. **Cargo classification (class/subclass) is set at Indexation**, not later. |
| **FC-03** | Classification & storage allocation — A General/Normal (GCR, AFU, ICG, UAB) · B Special (DGR, PER→COL/CRT/ERT/FRO, VAL, AVI, HUM, AOG, DIP, VUN, Pharma) · C Controlled/Exception (bonded, transhipment, customs hold, CDR/OSD, quarantine, re-export, auction) | Allocation is **system-driven**: system suggests rack/bin by class + subclass + capacity using `CARGOSUBCLASSLOCATION` rules, validates availability, offers overflow, then **binds RFID/barcode tag → location**, putaway confirmed by scan. Not manual location entry. |
| **FC-04** | CDR / discrepancy — 9 types (Shortage, Overage, Damage, Leakage/Wet, Tampering, Pilferage, Missing Docs, Wrong Weight, Misrouted) → 6 evidence items → CDR in CMTS → ref no → notify airline/customs → DIS message → quarantine hold → instruction → 5 final actions → close | CDR is **variance-driven**: declared-vs-physical ≥ tolerance auto-raises the CDR. Evidence is a **digital pack** (scan/photos, RFID/AWB-linked, timestamped) attached to the CDR — not remarks-only. CDR numbering must continue the CMTS sequence. |
| **FC-05** | Messaging map — A Pre-arrival (FFM, FWB, FHL, NOTOC) · B Operational (RCF, NFD, AWD, DIS, DLV, RCT, TFD, DEP, TGC) · C Customer/CHA (NOA, Free-period expiry, Missing doc, Customs hold, Payment due, DO ready, Delivery complete) ← 9 operational triggers | **Event-driven auto-dispatch** — no manual sending. Multi-channel Email/SMS/**WhatsApp**; IATA status via **SITA**. Per-recipient templates + **delivery/read receipts**, fully logged. |
| **FC-06** | Pakistan customs — NOA → CHA docs → GD/SD → risk channel → Green (auto) / Yellow (doc scrutiny → query loop) / Red (exam → sampling) → duty/tax/FED/WHT → ANF/ASF → **OOC** → eligible for release | **PSW (Pakistan Single Window) is primary**, WeBOC legacy/parallel-run. **Single Declaration (SD)** replaces GD. SD status, risk channel, OOC fetched electronically. **OOC captured by scanner (OCR)**, verified vs SD. Build behind a provider-abstracted "customs gateway". |
| **FC-07** | Charges → arrival time → free period → storage clock → actual wt → volumetric `L×W×H/6000` → chargeable `max(actual, volumetric)` → category surcharge → tariff slab (D1-3 free / D4-7 / D8-14 / D15+) → invoice → waiver? → approval → credit note → payment → **Godown Rent verification (5 gates: OOC available · AWB authority verified · DO charges paid · cargo not on hold · special clearance done)** → GR voucher | Charges **auto-computed** from a **versioned Tariff Master**. Payment **cash-less via gateway**, auto-reconciled. Waiver = **role-based multi-level approval** + full audit → credit note. **DO release auto-gated**. |
| **FC-08** | DO presented → verify CNIC → verify authority letter → gate pass → picking request → retrieval → available? → piece count → condition → load → security/gate verify → POD (signature, CNIC, pieces, photo, timestamp) → DLV → AWB delivered → finance reconciled → archive → file closed | **RFID/scan-verified end-to-end**: tag bound at putaway is read at retrieval (piece count auto-verified), and at **gate-out** matched vs gate pass + DO with auto-check of OOC / DO charges / no-hold. **Digital POD**: e-signature + CNIC scan + **geo**/timestamp + photo, auto-attached to AWB. |
| **FC-09** | Transhipment bonded transfer — received → identified → indexed → bonded zone → RCT → transhipment permit → bond supervision → await connecting flight → storage charges → re-tender → TFD → DEP → file closed | **RFID-tracked bonded zone** + digital bond supervision. If onward leg is another SAPS site (LHE/PEW): **inter-station ownership handoff**, synced via HQ, bond continuity preserved. |
| **FC-10** | Exception cargo — **A Misrouted** (hold → DIS/CDR → notify airline → recovery instruction → forward/re-route/corrective AWB → re-tender → close) · **B Re-export** (hold → request → re-export SD → permission → settle charges → re-tender as export → close) · **C Long-stay/Abandoned** (alert → notify → escalate → **Section 82** → release/auction/disposal → final disposition → close) | **Aging-driven**: dwell clock auto-fires long-stay alert and drives the **Section 82 statutory timeline**; notices scheduled automatically. Exception/re-export holds are RFID-tracked with a distinct state + **aging dashboard**. |
| **FC-11** | Export — booking → acceptance → doc collection → weighment (gross/net/tare) → customs/ANF check → clearance? → hold till correction → returned/detained → physical check → security screening (X-ray/ETD/EDD) → classification → special cargo? → warehousing → build-up per **PFM/load plan** → FFM/FWB/FHL → payload compatibility → handover to ramp → onboarded → export invoice/closure | **Greenfield — not in CMTS, so this flow IS the spec.** Export docs OCR-captured. **SD + Form-E (EFE) via PSW EDI**, PSW-primary day one. Screening → **tamper-evident record** (method, result, screener ID, RFID seal) → chain of custody (ACC3/known-consignor). **Weighing-scale integration** (gross/net/tare auto-captured). **Handheld RFID** piece-level scan. **ULD build verification** vs PFM → missing/excess → **ULD Build-up Report + Discrepancy Note**. |
| **FC-12** | Functional module map **M01–M20** in 3 tiers + messaging spine + exception spine | **AirVault platform layer** (not in the ACMS map): per-site nodes **KHI/LHE/PEW** (local DB, offline-capable) + **Islamabad HQ** (oversight, cross-site RBAC, backups, CDC/outbox sync). **RBAC two-portal**: HQ creates sites + site-admins; site-admin manages own users/roles. Integration gateways: PSW · SITA · Payment · RFID/HW (fixed + handheld + scales) · Notify. Platform services: System Admin · Analytics & Insights · Ops & Workforce. |

### The M01–M20 module map (FC-12) — the canonical module list for this plan

| Tier | Modules |
|---|---|
| **Tier 1 — Input** | M01 Flight & Airline Data · M02 Document Management · **M03 AWB/MAWB/HAWB Indexing (HUB)** |
| **Tier 2 — Core** | M04 Cargo Receipt & Acceptance · M05 Storage & Warehouse · M06 CDR/Exception · M09 Customs Clearance Tracking · M10 Tariff & Billing Engine · M11 Invoice/Payment/Waiver · M12 Delivery Order Management |
| **Messaging spine** | M07 Messaging Engine · M08 Notification Engine |
| **Exception spine** | M15 Transhipment · M16 Re-export · M17 Mishandled Cargo · M18 Long-Stay/Auction/Disposal |
| **Tier 3 — Output** | M13 Gate Pass & Dispatch · M14 POD Capture · M19 Reports & Dashboards · M20 Audit Trail & Archive |

**M03 is the hub** — FC-12 wires M03 → M04, M05, M06, M09, M10, M15, M16, M17. Every screen in this plan must deep-link back to the AWB record.

---

## 2. Critical analysis of the flows

Things the flows leave open — these become explicit assumptions in the demo, and sign-off items with SAPS:

1. **FC-01 has two dangling nodes.** Step 23 Gate Pass has no inbound edge except via the GR Voucher branch, and `142:1933` duplicates the "08. Discrepancy Found?" diamond with a self-referencing connector (`142:1934` starts and ends on the section). Demo assumption: `21 Invoice → GR Voucher → 23 Gate Pass`, and a single discrepancy decision after step 07/14.
2. **FC-06 labels the Red-channel edge "Normal".** Green/Yellow/Normal, where Normal → Red Channel physical examination. Demo will render channels as **Green / Yellow / Red** and treat "Normal" as the Red synonym; flag for confirmation.
3. **PSW vs WeBOC is a live migration.** The amendment says build behind a provider-abstracted customs gateway. The demo must therefore show a **gateway switch (PSW primary / WeBOC parallel)** on screen, not hard-code PSW.
4. **FC-07's Godown-Rent verification is drawn as a 5-way fan-out, not an AND-gate.** Business intent is clearly AND (all five must pass). Demo builds it as an explicit 5-condition gate with per-condition pass/fail, which is also what makes the "DO release auto-gated" amendment visible.
5. **FC-11 is greenfield.** There is no CMTS export module beyond `ExportGodownrent`, `CARGOBOOKING`, `INTERNATIONALCARGO` and `CARGOACCEPTANCE`. Everything else (screening, chain of custody, ULD build verification, PFM) has no legacy field to inherit — it must be designed fresh. This is the highest design-risk area and should be sequenced late.
6. **Section 82 is statutory.** `Section82Days` in CMTS is a single-row config (`Id`, `Days`). The demo must surface the timeline as a configurable statutory clock, not a hard-coded number.
7. **Multi-site is already in CMTS.** `CityId` appears on ~30 tables and `Comp_Code`/`Off_Code` on ~20 — the legacy system is *already* multi-site. AirVault's contribution is the HQ tier + two-portal RBAC, not multi-site itself. The demo needs a **site context switcher** everywhere, from Phase 0.
8. **Doc-numbering continuity is called out in four separate amendments** (FC-04 CDR refs, FC-07 invoices/vouchers, FC-08 gate passes, FC-10 notices). CMTS implements this via `AutoIncrementValues` + `TABLESEQUENCE`. It cannot be an afterthought — it is a Phase 0 primitive.

---

## 3. CMTS schema → demo gap analysis

**CMTS: 106 tables, 1,742 columns.** Method: normalised every CMTS column name and every string/identifier in the demo source (3.4 MB corpus across `app/`, `components/`, `lib/`), then probed ~150 domain concepts.

### 3.1 Entire CMTS subsystems with **no screen at all** in the demo

| # | CMTS tables | Domain | Flow owner |
|---|---|---|---|
| G1 | `AwbDetendDetail` + `DetendIdentification` / `DetendUniqueIdentification` on 12 tables | **Customs-detained cargo sub-identity** — a detained part of an AWB gets its own identity that carries through DO, gate pass, godown rent, delivery, location | FC-06, FC-10 |
| G2 | `AWBARRIVALADVICE` (15 cols) | Arrival Advice document (advice no, advice date, SAPS no, consignee, goods, arrival date) | FC-01 §18 |
| G3 | `IMPORTAWBBOUNDEDAREA` (21 cols) | Bonded-area handover — airline rep name, good description, handover date/time, deliver-by | FC-03 §C, FC-09 |
| G4 | `AIRMAILDELIVERYBILL` (25), `AIRMAILTRANSFERMANIFEST` (19), `POMailType` (3) | **Airmail / postal cargo** — dispatch no, AV7 no, PO origin/destination, mail type, loose-parcels gross/physical wt, irregularity | not in any FC — **flag to SAPS** |
| G5 | `INTERNATIONALCARGO` (44), `INTERNATIONALCARGODETAIL` (6) | Export revenue — tariff rate, IATA rate, IATA freight, NN freight, special rate, incentive amount, agency commission, payable, **SAPS share** | FC-11 §15 |
| G6 | `CARGOBOOKING` (19), `CARGOBOOKINGDETAIL` (7) | Export booking from airline | FC-11 §01 |
| G7 | `CARGOACCEPTANCE` (31), `CARGOACCEPTANCEHWB` (7), `ACCEPTENCEDETAIL` (10) | Export acceptance — revenue code, bag no, loaded/unloaded weight, time of weighment, time of acceptance, vehicle no, leashing weight, pallet weight, discrepancy | FC-11 §03 |
| G8 | `CARGOSUBCLASS` (17), `CARGOSUBCLASSCHARGES` (15), `CARGOSUBCLASSLOCATION` (4), `LOCATIONCHARGES` (10), `CargoClassCharges` (7), `CargoClassGroupwise` (3) | **The class → subclass → location rules & charge engine.** FC-03's amendment names `CARGOSUBCLASSLOCATION` explicitly. Demo has flat "Cargo Classes" only | FC-03, FC-07 |
| G9 | `GODOWNRENTDETAIL` (26), `GODOWNRENTDUPLICATE` (10), `grCharges` (48), `FreeHandGR` (16), `ImportFreeHandedCalc` (23), `TempImportCalculation` (39) | **Godown-rent calculation chain** — per-line handling/storage/location units & charges, free days, supplement days, AFU amount, minimum charges, duplicate GR with reason + amount + tax | FC-07 |
| G10 | `CEmployee` (58), `CDepartment`, `CDesignation`, `CEmployeeDependent`, `CEmployeeExperience`, `CEmployeeQualification`, `CJobStatus`, `SHIFT` | **HR / workforce** — FC-12 platform layer lists "Ops & Workforce" as a platform service | FC-12 |
| G11 | `AutoIncrementValues` (5), `TABLESEQUENCE` (3) | **Document-numbering continuity engine** | FC-04/07/08/10 |
| G12 | `CPages`, `CGroups`, `CGroupWithPages`, `CUserWithGroups`, `CPageForCity`, `CPageForClass`, `ACTION`, `PARENTACTION`, `APPLICATIONACCESSIBILITY` | **Page-level RBAC**, scoped per city and per cargo class. Demo RBAC is a flat role×feature matrix | FC-12 |
| G13 | `CUSTOMIGM` (17), `AWBINFORMATION` (35) | Customs IGM header + GD line data — LC number, import licence no, national tax no, PCT code, unit of measure, value per unit, country of origin, case markings, consignment value, insurance | FC-06 |
| G14 | `CCompany`, `COffice`, `Country`, `City`, `AGENCY`, `SHIPPER`, `Origin`, `ORIGINDESTINATION`, `Flight_Airport`, `CBankInformation`, `CPaymentMode`, `UnitType`, `TaxType`, `Chargestype`, `CHARGETYPE`, `Lookup`, `REMARKS`, `Section82Days`, `Setting` | Master-data set the demo's Master Data Editor does not cover | FC-12 |

### 3.2 Field families missing **inside screens that already exist**

| Field family | CMTS home | Where the demo needs it |
|---|---|---|
| `IGMNO`, `INDEXNO`, `SUBINDEXNO`, `SEQUENCE`, `PAGENO` | on ~25 tables — the legacy composite key | Every AWB-bearing screen. Demo mentions "IGM" 3 times total |
| `CHALLANNO` | `AWBDELEIVERYORDER`, `GATEPASS`, `GODOWNRENT`, `IMPORTAWB` | DO, gate pass, GR — **0 occurrences in demo** |
| `PAYORDERNO/DATE/AMOUNT`, `CASHNO`, `Paymode`, `CREDITCARD`, `MASTERCARD`, `ACCTITLE`, `ACCNO`, `BANKNAME`, `BANKBRANCHNAME`, `CHEQUENO`, `CHEQUEDATE` | `GODOWNRENT`, `ExportGodownrent` | Payment screens — **0 occurrences** |
| `NIC`, `PASSPORT`, `AuthAgentName/CNIC/Phone/Email`, `AuthLetterNo`, `AuthAgentPic` | `IMPORTAWB`, `AWBDELEIVERYORDER` | DO collection, gate entry. Demo has CNIC but no passport, no auth-agent record |
| `NTN`, `STN` | `AWBDELEIVERYORDER`, `GODOWNRENT`, `CONSIGNEE` | Tax invoice / DO |
| `WAIVEOFF`, `WAIVEOFFPERCENT`, `WAIVEOFFAMOUNT`, `WAIVEOFFREASON`, `WaivOfStorageOrAmount` | `GODOWNRENT` | Waiver workflow — demo has a waiver screen but not these fields |
| `SUPPLIMENTDAYS`, `GRREFERENCE`, `BILLTYPE`, `DUPLICATECOUNT`, `OverPaidAmount`, `FREE`, `FREECAUSE` | `GODOWNRENT` | Godown rent |
| `DOTYPE`, `DOCARGOCLASSID`, `DOAMOUNT`, `DOFREE`, `IsDuplicate`, `DuplicateReason`, `FIRdate` | `AWBDELEIVERYORDER` | DO issuance |
| `SHORTLANDED`, `SHORTLANDEDREC`, `PartRemaining`, `PartReceievd`, `IsShortDetailed`, `DAMAGEPCS`, `DAMAGEWEIGHT`, `TYPEOFPACK`, `TYPEOFDAM` | `IMPORTAWBDETAIL`, `DamageDetail` | Acceptance & CDR |
| `LOGICALCARGOSUBCLASSID`/`LOGICALLOCATIONID` vs `PHYSICALCARGOSUBCLASSID`/`PHYSICALLOCATIONID` | `IMPORTAWBLOCATION` | **Logical vs physical location is a core CMTS concept entirely absent from the demo's storage map** |
| `IsLock`, `Lock`, `IsHold`, `HOLDINGSTATUS.Release*` (7 release fields) | `IMPORTAWB`, `AWBCONSOLE`, `HOLDINGSTATUS` | Hold register, AWB lock on release |
| `Comp_Code`, `Off_Code`, `CityId` | ~30 tables | Site context — Phase 0 |
| `CreatedBy`, `UpdatedBy`, `CreatedDate`, `UpdatedDate`, `IsActive`, `IsDeleted` | ~60 tables | Audit strip on every record drawer |

### 3.3 Flow → demo module coverage

| Flow | Demo today | Verdict |
|---|---|---|
| FC-01 Master | spread across portals, no single lifecycle view | **partial** |
| FC-02 Import detail | `warehouse-manager/*`, `cmts-absorption/*` (6 shallow screens) | **partial** |
| FC-03 Classification & storage | `storage-map`, `putaway`, `picking` | **partial** — no class/subclass/location rules |
| FC-04 CDR | `warehouse-manager/exceptions-queue` | **good** |
| FC-05 Messaging | `notifications-messaging`, `excise-compliance/customs-messaging` | **partial** — no trigger map, no receipts |
| FC-06 Customs | `excise-compliance/*` (6 screens) | **good** |
| FC-07 Charges/DO | `finance-manager/*` (8 screens) | **good** — but GR chain fields missing |
| FC-08 Gate pass/POD | `gate-entry/*` (6), `picking` | **good** — no operator-side POD capture |
| **FC-09 Transhipment** | — | **MISSING ENTIRELY** |
| FC-10 Exceptions | `cha/re-export-long-stay`, `excise-compliance/section-82-long-stay` | **partial** — **no misrouted-cargo module** |
| FC-11 Export | `export-cargo/*` — 4 screens, 533 LOC total | **thin** vs a very detailed flow |
| FC-12 Module map | `admin/*`, `auditor/*`, `reports` | **partial** — no M01, M02, no HQ/site tier |

**Demo portals today (14):** Warehouse Manager · Gate Entry · Lifter Operator · Excise/Compliance · Finance Manager · Planner · Operations Supervisor · Forwarding Agent · CHA · Consignee · ULD Management · CMTS Absorption · Export Cargo · Admin · Auditor (+ Reports, Notifications, RFID, Integration Status, QA Checklist).

---

## 4. Build plan — 11 phases

**Ground rules for every ticket**
- Screen-only. Mock data from the shared typed fixture layer; no API calls.
- Every screen carries: site context (KHI/LHE/PEW/HQ), an audit strip (`CreatedBy`/`UpdatedBy`/dates/`IsActive`/`IsDeleted`), and a deep link to the AWB hub.
- CMTS field parity is stated per ticket. Fields render even when the flow doesn't use them — parity is a migration requirement.
- Definition of done: route renders, empty/loading/error states, responsive, links to its declared neighbours, walkthrough-able against its flow.

### Phase 0 — Foundation (blocks everything)
| Ticket | Module | Summary |
|---|---|---|
| P0-1 | Platform | Typed domain + mock fixture layer (`lib/domain/`) — AWB, Manifest, IGM, Piece, Location, Charge, DO, GatePass, POD, CDR, Message, Party, Tariff. CMTS-named fields. |
| P0-2 | Platform | Site & HQ context switcher (KHI/LHE/PEW/HQ) + `CityId`/`Comp_Code`/`Off_Code` propagation. |
| P0-3 | M03 | **AWB hub route** `/awb/[awbId]` — the spine every screen links into. |
| P0-4 | Platform | Shared primitives: OCRConfidenceField, EvidencePack, ApprovalStepper, AgingBadge, DocNumber, AuditStrip, GatewaySwitch. |
| P0-5 | Platform | IA restructure — navigation grouped by M01–M20 tiers + the four spines. |

### Phase 1 — Import spine (FC-01, FC-02 · M01–M04)
P1-1 M01 Flight & Airline Data console · P1-2 M02 Document Management repository · P1-3 OCR Intake Workbench (05a–05f) · P1-4 M03 AWB Indexing Workbench (full `IMPORTAWB` 64 fields) · P1-5 Manifest & IGM intake (`IMPORTMANIFIEST`, `CUSTOMIGM`) · P1-6 M04 Cargo Receipt & Acceptance (`IMPORTAWBDETAIL` incl. shortlanded/damage) · P1-7 Consolidation & Split (`AWBCONSOLE`, `AWBSplit`, `AWBConsolDetail`) · P1-8 Arrival Advice (`AWBARRIVALADVICE`)

### Phase 2 — Storage & warehouse (FC-03 · M05)
P2-1 Class/Subclass/Location master + `CARGOSUBCLASSLOCATION` rules editor · P2-2 Storage Allocation Engine (suggest → validate → overflow) · P2-3 Logical vs Physical location view · P2-4 RFID tag-bind putaway · P2-5 Bonded-area handover (`IMPORTAWBBOUNDEDAREA`)

### Phase 3 — Exceptions & CDR (FC-04, FC-10 · M06, M16–M18)
P3-1 CDR Workbench (variance auto-raise, 9 types, digital evidence pack) · P3-2 Damage Detail register · P3-3 Hold Register + release (`HOLDINGSTATUS` 29 fields) · P3-4 **Misrouted Cargo module (new)** · P3-5 Re-export console (`FC-10-B`) · P3-6 Long-Stay / Section 82 / auction / disposal + aging dashboard

### Phase 4 — Customs (FC-06 · M09)
P4-1 Customs Gateway console (PSW primary / WeBOC parallel switch) · P4-2 SD/GD filing + IGM document screens (`CUSTOMIGM`, `AWBINFORMATION` 35 fields) · P4-3 OOC scanner capture + verify-vs-SD · P4-4 **Detained-cargo (Detend) register (new)**

### Phase 5 — Billing, invoice & DO (FC-07 · M10–M12)
P5-1 Tariff Master (versioned; class/subclass/location charges, slabs, tax types, units) · P5-2 Charges Calculator (volumetric, chargeable, surcharge, slab) · P5-3 Godown Rent voucher + `GODOWNRENTDETAIL` line breakdown · P5-4 GR duplicate + history + free-hand GR · P5-5 Invoice & payment (pay order, challan, bank, payment modes, cash-less gateway) · P5-6 Waiver workflow (percent/amount/reason, multi-level approval, credit note) · P5-7 **DO issuance** (`AWBDELEIVERYORDER` 39 fields) + 5-gate release check

### Phase 6 — Dispatch & closure (FC-08 · M13–M14)
P6-1 Gate Pass generation (`GATEPASS` 43 fields) · P6-2 Picking & piece verification via RFID · P6-3 Physical delivery (`PHYSICALDELIVERY`, `DELIVERYINFO`) · P6-4 **Digital POD capture** (e-sign, CNIC scan, geo, photo) · P6-5 AWB closure & archive

### Phase 7 — Messaging & notification (FC-05 · M07–M08)
P7-1 IATA message console (13 message types) · P7-2 Notification engine (templates, Email/SMS/WhatsApp, history, read receipts) · P7-3 Trigger map admin (9 triggers → messages)

### Phase 8 — Transhipment (FC-09 · M15) — **new module**
P8-1 Transhipment register + bonded zone + permit + re-tender + RCT/TFD/DEP · P8-2 Inter-station ownership handoff (KHI↔LHE↔PEW via HQ)

### Phase 9 — Export expansion (FC-11) + other cargo types
P9-1 Export booking (`CARGOBOOKING`, `INTERNATIONALCARGO` revenue/commission/SAPS share) · P9-2 Export acceptance + weighment (`CARGOACCEPTANCE` 31 fields, scale capture) · P9-3 Security screening + chain of custody + RFID seal · P9-4 Build-up / PFM / ULD verification + Discrepancy Note · P9-5 Export manifest & ramp handover · P9-6 **Airmail/Postal module (new)** — `AIRMAILDELIVERYBILL`, `AIRMAILTRANSFERMANIFEST`, `POMailType`

### Phase 10 — Platform, admin & analytics (M19, M20, FC-12 platform layer)
P10-1 HQ console + two-portal RBAC (HQ creates sites/site-admins; site-admin manages users) · P10-2 Page-level RBAC (`CPages`/`CGroups`/`CPageForCity`/`CPageForClass`) · P10-3 Master Data Editor — full CMTS master set · P10-4 Document-numbering continuity console (`AutoIncrementValues`, `TABLESEQUENCE`) · P10-5 Audit trail / session log / event log / error log · P10-6 M19 Reports & dashboards expansion

---

## 5. Dependency graph

```
P0 ──► P1 ──► P2 ──► P3
       │      │       │
       │      └──────►P5 ──► P6
       ├──► P4 ───────┘      │
       │                     ▼
       └──► P7 ◄─────────────┘   (messaging consumes events from P1–P6)
P2 ──► P8            (transhipment needs bonded zone + storage)
P1 ──► P9            (export reuses OCR intake + acceptance patterns)
P0 ──► P10           (platform can run parallel from Phase 0)
```

Hard gates: **P0 blocks all.** P5 needs P2 (location charges) and P4 (OOC gate). P6 needs P5 (DO). P8 needs P2. P9 needs P1.

---

## 6. Open items to confirm with SAPS
1. Airmail/postal — in AirVault scope, or CMTS-only legacy? (no flow covers it)
2. `INTERNATIONALCARGO` revenue-share model (agency commission, SAPS share) — retained in AirVault?
3. HR / Ops & Workforce depth — full CEmployee (58 fields) or roster-only?
4. FC-06 "Normal" channel = Red channel? Confirm naming.
5. PSW air-cargo go-live timeline at JIAP; WeBOC parallel-run duration.
6. ACC3 / known-consignor regime + screening exemptions (FC-11).
7. Section 82 statutory day count — configurable per site?
8. Logical vs physical location — retain the CMTS dual model?
