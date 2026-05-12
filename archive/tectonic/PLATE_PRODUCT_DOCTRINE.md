# PLATE Product Doctrine

## Mission

PLATE is a tooling release authority surface for fictional aerospace manufacturing readiness. It helps a director-level user decide which fixtures, jigs, EOAT packages, inspection nests, certification records, and maintenance plans can release at surge rate with traceable evidence.

The product does not report generic factory health. It links tooling status to the authority to release hardware.

## Primary Users

- Manufacturing director: scans readiness, blockers, takt exposure, and release consequences.
- Manufacturing engineer: owns tooling package evidence, access constraints, sustainment logic, and recovery actions.
- Metrology or quality lead: verifies datum transfer, calibration cadence, golden-part baselines, and drift thresholds.
- Automation lead: verifies robot EOAT path, TCP release, collision envelope, grip margin, and recovery evidence.
- Release authority: reviews CoVe-style claims, evidence methods, package closure, and residual risk.

## Product Rules

- Release authority over status reporting: every surface must answer whether the package can release and why.
- Datum lineage is the spine: every tooling package carries design datum, tooling datum, and inspection datum.
- Claims before colors: every state is backed by a claim and evidence method.
- Time is the main analytical axis: evidence appears as chronological strata across tooling lanes.
- Moment view is escalation: the factory-envelope map explains one physical conflict selected from the timeline.
- Fictional and safe: all content is synthetic and limited to tooling, fixtures, jigs, EOAT, nests, calibration, handling, access, sustainment, and release evidence.

## Core Workflows

1. Director opens the Release Chronograph and scans the horizontal tooling lanes for blocked or at-risk release authority.
2. User selects an evidence block to inspect the claim, evidence method, missing evidence or physical constraint, datum lineage, recovery action, owner, impact, and consequence.
3. User runs the plotter to simulate surge pressure exposing blockers over time.
4. User opens Surge Moment from a blocked physical conflict to understand the map-level release failure.
5. User returns to the chronograph and reviews whether recovery moves the package toward release review.
6. User opens Release Memo to review or print the selected release decision as a static handoff artifact.

## Data Model

The local demo model lives in `plate-data.js`.

Each tooling package should define:

- `id`, `label`, and `lane`
- `datum.design`, `datum.tooling`, and `datum.inspection`
- `releasePackage` evidence contents
- chronological `blocks`

Each block should define:

- `score`: Verified, At Risk, Blocked, or Gate
- `claim`: CoVe-style release claim
- `evidenceMethod`: how the claim is verified
- `missingEvidence`: missing evidence or physical tooling constraint
- `recoveryAction`, `owner`, `impact`, and `consequence`
- optional `momentLink` when the block should escalate to the Moment view

## Interface Doctrine

Release Chronograph:

- Warm museum substrate, square geometry, one-pixel structural rules.
- X-axis is time, Y-axis is tooling taxonomy.
- Lists become horizontal lanes, not cards.
- Selection updates a bottom detail register.
- Plotter motion is linear and mechanical.
- Scenario phases visibly change evidence posture across the same timeline rather than changing only top-line metrics.
- Release Memo produces a static, printable summary of the selected claim, evidence, recovery owner, impact, and consequence.

Surge Moment:

- Used only as a focused drill-down for the release-failure beat.
- Shows an abstract final-assembly cell with robot EOAT, drill/rivet jig, transport datum, inspection evidence, and physical conflict.
- Must remain synthetic and director-facing.

## Validation Criteria

- Every blocked or at-risk state explains a missing evidence item or physical tooling constraint.
- Every release decision references a claim and an evidence method.
- Run Plotter updates phase metrics, selected block, active agent, and event log.
- Phase changes update scenario note and visibly distinguish phase-relevant evidence blocks.
- Release Memo reflects the currently selected evidence block and prints as a flat document artifact.
- Chronograph renders correctly via `file://` without a server.
- Desktop render has no clipped headings, overlapping labels, accidental rounded corners, shadows, glow, blur, or palette drift in the Chronological Tectonics surface.
- Narrow screens use the same desktop board with horizontal panning; there is no dedicated mobile Tectonics layout.
