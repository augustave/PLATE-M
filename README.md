# PLATE Surge Moment

## Active Direction

This project now focuses only on the **Moment desktop variant** of PLATE.

The active UI is:

- `moment.html`
- `moment.css`
- `moment.js`
- `plate-data.js`

`index.html` opens `moment.html` directly. Chronological Tectonics has been archived and is no longer the active surface in this project.

## Thesis

Modern aerospace production does not fail only because a part is hard to build. It fails when the factory cannot prove that the tooling system is still preserving design intent as rate, operators, robots, suppliers, and inspection cadence change.

PLATE treats aerospace tooling as an operational readiness system. Final assembly jigs, transport fixtures, inspection nests, drill/rivet guides, and robotic EOAT are the physical interface between design engineering, manufacturing engineering, metrology, automation, and production leadership. If their datum lineage, access envelope, calibration state, grip margin, maintenance plan, or verification evidence breaks, the line loses release authority.

## Moment Desktop Surface

The Moment view preserves the strongest beat from the original PLATE concept: a live operating map where an envelope, route, restricted zone, and decision panel converge at the instant a release blocker becomes visible.

The map is not a tactical airspace view. It is an abstract final-assembly cell showing:

- robot EOAT motion
- drill/rivet jig access
- transport datum transfer
- inspection evidence
- collision/access conflict
- release authority impact

The goal is to make a physical tooling release failure legible to a director-level user without exposing real aircraft, facility, production, or control-system detail.

## Core Workflow

1. Review computed readiness, active agent (with authority tier), executive ask, and the director asks queue in the left rail.
2. Run the Moment simulation to step through baseline → surge exposure → datum break → recovery → review states. Readiness, gap, and the asks queue recompute at every step.
3. Select a map node, package card, or asks-queue entry to inspect datum lineage, CoVe claim ledger, missing evidence, recovery action, doctrine gap, qualification trigger, and supply-chain risk.
4. Use the attach-evidence action to show how attached recovery evidence moves the active package toward review.

## Tooling Scope

PLATE stays inside the manufacturing tooling domain. It does not redesign the aircraft, primary structure, propulsion system, facility, or PLC logic.

The modeled tooling families are:

- Final assembly jig
- Transport and handling fixture
- Robot-mounted EOAT
- Inspection holding fixture
- Drill/rivet jig
- Certification record
- Maintenance plan

The modeled release concerns are:

- Datum lineage
- Kinematic collision and reach
- Grip and safe handling
- Calibration and golden-part evidence
- Tool-induced deformation risk
- Wear item sustainment
- Takt and cycle-time exposure
- Release package closure

## Data And Simulation

`plate-data.js` is the synthetic demo model. Readiness is **computed**, not authored — there are no hand-written percentage strings.

Top-level shape:

- `measures.scoreWeights` — Verified=1.0, At Risk=0.6, Gate=0.5, Blocked=0.0. Phase readiness is the weighted mean across all 21 blocks.
- `claimRegistry` — closed set of 10 enumerated CoVe claims. Every block carries a `claimId` that resolves to this registry; free-text claims are not allowed.
- `phaseTransitions` — per-phase score-transition table (baseline clears, surge softens Blocked → At Risk so step exposes have tier headroom, recovery and review soften further).
- `phases[*].executiveAsk` — the single director-facing decision for each phase, with a target tool id.
- `doctrineGaps` — named places where manufacturing quality doctrine lags surge-rate reality, mapped to phases.
- `scenarios` — a library of named simulation paths. The active scenario is `processMachine.activeScenario`. Each step has `exposes`/`unlocks` arrays that cumulatively degrade or improve specific blocks along the closed score ladder.
- `tools[*]` — each tool has `qualificationTrigger`, `supplyChainRisk`, datum triplet (design / tooling / inspection), release package contents, and `blocks` with score, `claimId`, `confidence` (high/medium/low), evidence method, missing evidence, recovery action, owner, impact, and consequence.
- `agents[*]` — each agent has an `authority` tier: `decide`, `recommend`, or `surface`.

`moment.js` reads this data and drives the UI. `effectiveScore(phase, block, stepIndex)` applies the phase transition then walks all step deltas through `stepIndex`. `computeReadiness()` aggregates across the full block set every render — every tick of the simulation moves the needle.

## Data Integrity Check

Run `node verify-data.js` to validate the model. The verifier asserts:

- every block uses a closed-set score and confidence
- every `claimId` exists in `claimRegistry` and the rendered `claim` text matches
- every scenario step's `toolId`, `agent`, `phase`, `blockTitle`, and `exposes`/`unlocks` titles resolve to real entities
- every `phases[*].executiveAsk.targetToolId` is a real tool
- every doctrine gap is bound to a real phase
- `processMachine.activeScenario` points at a defined scenario
- every Blocked block has a concrete `missingEvidence` and `recoveryAction`

Also run `node --check moment.js` and `node --check plate-data.js` after edits, per `AGENTS.md`.

## Archived Tectonics Work

Chronological Tectonics has been archived in:

`archive/tectonic/`

Archived files include:

- `tectonics.html`
- `tectonics.css`
- `tectonics.js`
- `PLATE_PRODUCT_DOCTRINE.md`
- prior Tectonics screenshots

Do not treat archived Tectonics files as the active baseline for this project. Future Tectonics work will happen in another project.

## Boundary

This is a fictional, defense-flavored manufacturing readiness demo. It must remain free of controlled technical data, real aircraft design detail, real production procedures, and real facility-specific automation logic.

Do not use fiducial marker language or fiducial-marker UI motifs.
