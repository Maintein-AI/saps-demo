# `lib/domain` — AirVault domain layer

**Ticket:** P0-1 · Phase 0 foundation
**Rule:** no screen built after Phase 0 declares its own inline mock data. Everything reads from here.

```ts
import { getAwb, listAwbs, portalKpis } from "@/lib/domain";
```

---

## Why this exists

Before Phase 0 the demo had 109 screens and no shared data model. `"214-45678901"` was a string literal repeated across `OverviewTab`, `AwbSummaryCard` and `PiecesTab`, with no type behind it and no way for one screen to link to another. `lib/` contained a single file.

This layer fixes three things at once:

1. **Field names mirror CMTS**, so parity is checkable by reading the type, and the migration mapping is direct rather than interpretive.
2. **One identity per record**, so screens can link to each other — which is what makes the flow walkthroughs possible.
3. **Deterministic data**, so the demo shows the same numbers on every render and in every session.

### On determinism

`lib/rackData.ts` uses `Math.random()` at module scope. That produces a different tree on the server than on the client, which Next flags as a hydration mismatch — and it means a dwell clock or an aging badge changes every time you refresh. Fixtures here use a seeded `mulberry32` (`seeded()` in `common.ts`) and a fixed `DEMO_NOW`, so a walkthrough is reproducible.

---

## Files

| File | Contents |
|---|---|
| `common.ts` | Site keys, audit columns, doc numbering, weight/volumetric maths, OCR confidence, variance, dwell, seeded RNG, formatting |
| `masters.ts` | Sites, cargo classes/subclasses, storage locations + allocation rules, airlines, airports, parties, tariff slabs, surcharges, taxes |
| `cargo.ts` | Lifecycle stages, manifest, AWB, AWB detail, pieces, location assignment, consolidation/split, detend, arrival advice |
| `finance.ts` | Charge calculation (FC-07 §01–08), godown rent, waiver, delivery order, the five-condition release gate, invoices, payments |
| `dispatch.ts` | Gate pass, picking, physical delivery, gate-out check, digital POD, closure |
| `exceptions.ts` | CDR, damage, holds, and the three FC-10 branches + the unified exception queue |
| `messaging.ts` | IATA Cargo-IMP types, customer notifications, the FC-05 trigger map, templates, receipts, gateways |
| `fixtures.ts` | The seeded dataset |
| `index.ts` | Public API — `getAwb`, `listAwbs`, `portalKpis`, scoped list queries |

---

## Type → CMTS table map

| Type | CMTS table | Cols |
|---|---|---|
| `Manifest` | `IMPORTMANIFIEST` | 31 |
| `AWB` | `IMPORTAWB` | 64 — all present |
| `AWBDetail` | `IMPORTAWBDETAIL` | 32 |
| `AWBLocation` | `IMPORTAWBLOCATION` | 26 |
| `HouseAWB` | `AWBCONSOLE` | 41 |
| `AWBSplitRecord` | `AWBSplit` | 10 |
| `DetendDetail` | `AwbDetendDetail` | 7 (+ identifier on 12 other tables) |
| `ArrivalAdvice` | `AWBARRIVALADVICE` | 15 |
| `GodownRent` | `GODOWNRENT` | 75 — all present |
| `GodownRentDetail` | `GODOWNRENTDETAIL` | 26 |
| `GodownRentDuplicate` | `GODOWNRENTDUPLICATE` | 10 |
| `DeliveryOrder` | `AWBDELEIVERYORDER` | 39 — all present |
| `GatePass` | `GATEPASS` | 43 — all present |
| `PhysicalDelivery` | `PHYSICALDELIVERY` | 22 |
| `DeliveryInfo` | `DELIVERYINFO` | 20 |
| `HoldRecord` | `HOLDINGSTATUS` | 29 — incl. all 7 release-side columns |
| `DamageDetail` | `DamageDetail` | 8 |
| `LongStayCase` | `AWBSECTION82` | 22 |
| `CargoClass` | `CARGOCLASS` | 16 |
| `CargoSubClass` | `CARGOSUBCLASS` | 17 |
| `StorageLocation` | `LOCATION` | 17 |
| `SubClassLocationRule` | `CARGOSUBCLASSLOCATION` | 4 |
| `LocationCharge` | `LOCATIONCHARGES` | 10 |
| `TaxType` | `TaxType` | 12 |
| `Airline` | `AIRLINE` | 19 |
| `Airport` | `AIRPORT` + `Flight_Airport` | 16 + 6 |
| `Party` | `SHIPPER` / `CONSIGNEE` / `AGENCY` | 11 / 13 / 11 |
| `NotificationTemplate` | `EmailTemplate` / `SMSTemplate` | 7 / 5 |
| `NotificationDispatch` | `EmailHistory` / `SmsHistory` | 9 / 8 |
| `DocNumberRef` | `AutoIncrementValues` + `TABLESEQUENCE` | 5 + 3 |
| `Site` | `City` / `CCompany` / `COffice` | 9 / 18 / 18 |

### AirVault additions (no CMTS column)

Marked `AirVault addition` in the source. These come from the flow amendments:

- `Piece` + RFID EPC binding — FC-03 amendment
- `OcrValue<T>` per-item confidence — FC-01 05b/05c
- `EvidenceItem` digital evidence pack — FC-04 amendment
- `ProofOfDelivery` e-signature, CNIC scan, geo — FC-08 amendment
- `deliveredAt` / `readAt` receipts, WhatsApp channel — FC-05 amendment
- `GatewayState` provider abstraction — FC-06 amendment
- `AWBLocation.divergedAt` — supports the logical/physical divergence queue
- `MishandledCase`, `ReExportCase` — FC-10 A and B have no dedicated CMTS table
- HQ tier + `Site.pendingOutbox` — FC-12 platform amendment

---

## Flow logic implemented here (not just typed)

These are computed, so screens show real derivations rather than hard-coded outputs:

| Function | Flow |
|---|---|
| `volumetricKg()` / `chargeableKg()` | FC-07 §05–06 — `L×W×H/6000`, then `max(actual, volumetric)` |
| `slabBreakdown()` | FC-07 §08 — splits a stay across the four day bands |
| `surchargesFor()` | FC-07 §07 — the nine category surcharges |
| `calculateCharges()` | FC-07 §01–08 end to end, every intermediate retained |
| `evaluateReleaseGate()` | FC-07 Godown Rent Verification — the five conditions |
| `allocationCandidates()` | FC-03 amendment — suggests rack/bin from `CARGOSUBCLASSLOCATION` rules + capacity, and explains why |
| `variance()` | FC-01 05e → FC-04 — declared vs physical, with tolerance |
| `dwell()` | FC-07 §02–03 storage clock, FC-10 Section 82 countdown |
| `podComplete()` | FC-08 "POD Complete?" gate |
| `lifecycleSteps()` | FC-01's 27 steps as a progress bar |

---

## Fixture coverage

`FIXTURE_COVERAGE` is exported so the QA checklist screen can assert these rather than trusting them:

- **29 AWBs** across **3 sites** (KHI / LHE / PEW)
- **All 17 lifecycle stages** occupied — every step of FC-01 has a live example
- **All 5 FC-01 branches** populated: CDR, mishandled, re-export, long-stay, transhipment
- **1 detend**, **4 house AWBs**, **1 live hold + 1 released hold** (both sides of `HOLDINGSTATUS`)
- **2 diverged locations** — logical ≠ physical, for the divergence queue
- **All 9 FC-05 triggers** mapped, with the 3 unwired notifications documented in `UNWIRED_NOTIFICATIONS`
- One deliberately **unreadable RFID tag**, one **failed IATA message**, one **overdue Section 82 notice**, and two flights **missing pre-arrival messages** — so the exception paths are not empty

### A note on cargo-class coverage

14 of the 20 classes appear as a primary `CARGOCLASSID`. The other six — bonded, customs hold, CDR/OSD, mishandled, re-export, long-stay — are reached through `branch` and hold-zone placement rather than by reassigning the cargo's class. That matches how CMTS behaves: cargo keeps its class and acquires a hold, rather than becoming a different kind of cargo.

---

## Open questions this layer encodes

Where a blocker is unresolved, the layer takes the **superset** position so narrowing later is cheap:

| Blocker | Position taken here |
|---|---|
| **BLK-07** Section 82 days | `SECTION_82_DAYS` is a constant now, typed per-site-ready. A national value is the same number at every site. |
| **BLK-08** logical vs physical location | Dual model retained (`AWBLocation` has both pairs). Collapsing later is straightforward; re-introducing it would not be. |
| **BLK-10** DO release gate | Treated as AND. `special-clearance` is **conditional** on `CargoClass.requiresSpecialClearance` and renders N/A rather than blocking — the FC-07 amendment lists only four conditions. |
| **BLK-03** FC-06 "Normal" channel | Not encoded here; belongs to Phase 4. |
| **BLK-02** export revenue share | Not modelled — Phase 9, behind a flag. |
