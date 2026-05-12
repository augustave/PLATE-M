# PLATE Agent Instructions

## Knowledge Vault

Path: `/Users/taoconrad/Documents/Obsidian Vault`

When saving any output, research, or generated note to the vault, write to `00 - Inbox/` with filename `YYYY-MM-DD_CDX_title.md` and frontmatter:

```yaml
---
date: YYYY-MM-DD
source: codex
tags: [inbox]
---
```

See `/Users/taoconrad/Documents/Obsidian Vault/VAULT_MAP.md` for the full folder structure and project index.

## Active PLATE Surface

- This project is now focused only on the **Moment desktop variant** of the UI.
- `moment.html`, `moment.css`, and `moment.js` are the active product surface.
- `index.html` should open `moment.html`.
- `plate-data.js` remains the structured local demo data source for Moment package states, datum lineage, CoVe claims, simulation agents, and process-machine steps.
- The project is static HTML, CSS, and vanilla JavaScript. There is no bundler, framework, component compiler, package manager, Tailwind, React, Vue, or build step.
- New UI work should preserve local file loading via `file://` and must not require a server unless explicitly requested.

## Archived Tectonics Surface

- Chronological Tectonics work has been archived under `archive/tectonic/`.
- Do not use `archive/tectonic/tectonics.html`, `archive/tectonic/tectonics.css`, or `archive/tectonic/tectonics.js` as the active product baseline in this project.
- Do not link the active Moment UI back to archived Tectonics.
- Future Tectonics work will happen in another project.

## Moment Desktop Direction

- PLATE Moment is a director-facing release-failure surface.
- It should show the instant a tooling package loses release authority because robot EOAT motion, drill/rivet jig access, datum transfer, inspection evidence, or certification evidence conflicts under surge pressure.
- The UI may preserve the dark operating-map language already present in `moment.css`.
- Prioritize the desktop experience. Do not add or optimize a separate Moment mobile design unless explicitly requested.
- Keep the layout centered on:
  - left control/readiness rail
  - central factory-envelope map
  - package strip
  - right evidence inspector
  - run/clear simulation controls

## Domain Rules For PLATE Tooling

- PLATE stays inside aerospace manufacturing tooling and production readiness.
- Do not redesign aircraft, primary structure, propulsion architecture, facility infrastructure, or PLC/workcell control software.
- Keep content focused on fixtures, jigs, nests, EOAT, datum transfer, inspection linkage, calibration, sustainment, access, collision, handling, and release evidence.
- Every tooling package should have a datum lineage concept: design datum, tooling datum, and inspection datum.
- Every blocked or at-risk state must explain the missing evidence or physical tooling constraint.
- Every release decision should reference a CoVe-style claim or verification method.
- Simulation agents are product/demo agents, not autonomous code agents. They should model tooling readiness functions such as datum, metrology, automation, tooling, and release authority.
- Process-machine events should mutate the UI by selecting evidence blocks, updating readiness metrics, changing active agent state, and appending event-log entries where present.
- Use fictional defense-flavored content only. Do not introduce real controlled technical data, real program details, or real procedures.
- Do not use fiducial marker language or fiducial-marker UI motifs.

## File And Naming Conventions

- Keep active Moment files as:
  - `moment.html`
  - `moment.css`
  - `moment.js`
- Keep structured demo data in `plate-data.js`.
- Keep archived experiments under `archive/`.
- Use semantic, descriptive CSS class names; avoid generated class names.
- Do not move data back into inline HTML attributes unless the user requests a disposable visual sketch.

## Verification

- Run `node --check moment.js` after JavaScript edits.
- Run `node --check plate-data.js` after shared data edits.
- Capture at least one desktop screenshot at `1440x900` after visual Moment changes.
- Check for:
  - clipped headings
  - overlapping labels
  - broken desktop rail/stage/inspector alignment
  - inaccessible or broken run/clear controls
  - evidence copy that no longer matches the selected package
