#!/usr/bin/env node
/* Data-integrity verifier for plate-data.js.
   Run: node verify-data.js
   Exit 0 on pass, 1 on any failure. */

const path = require("path");
const data = require(path.join(__dirname, "plate-data.js"));

const VALID_SCORES = new Set(["Verified", "At Risk", "Gate", "Blocked"]);
const VALID_CONFIDENCE = new Set(["high", "medium", "low"]);
const VALID_AUTHORITY = new Set(["decide", "recommend", "surface"]);
const VALID_PHASE_KEYS = ["baseline", "surge", "recovery", "review"];

const failures = [];
const fail = (msg) => failures.push(msg);

function assert(cond, msg) {
  if (!cond) fail(msg);
}

// 1. Top-level shape
assert(data && typeof data === "object", "PLATE_DATA missing or not an object");
assert(data.measures && data.measures.scoreWeights, "measures.scoreWeights missing");
assert(data.claimRegistry, "claimRegistry missing");
assert(data.phaseTransitions, "phaseTransitions missing");
assert(data.phases, "phases missing");
assert(Array.isArray(data.tools), "tools must be an array");
assert(Array.isArray(data.agents), "agents must be an array");
assert(Array.isArray(data.doctrineGaps), "doctrineGaps must be an array");
assert(data.scenarios && data.processMachine, "scenarios and processMachine required");

// 2. Score weights cover the valid set
for (const s of VALID_SCORES) {
  assert(
    typeof data.measures.scoreWeights[s] === "number",
    `measures.scoreWeights missing numeric entry for "${s}"`
  );
}

// 3. Phase transitions reference only valid scores
for (const phaseKey of VALID_PHASE_KEYS) {
  assert(data.phases[phaseKey], `phases.${phaseKey} missing`);
  assert(
    data.phaseTransitions[phaseKey],
    `phaseTransitions.${phaseKey} missing (use {} for identity)`
  );
  for (const [from, to] of Object.entries(data.phaseTransitions[phaseKey])) {
    assert(VALID_SCORES.has(from), `phaseTransitions.${phaseKey} bad from-score: "${from}"`);
    assert(VALID_SCORES.has(to), `phaseTransitions.${phaseKey} bad to-score: "${to}"`);
  }
  const ask = data.phases[phaseKey].executiveAsk;
  assert(ask && ask.sentence && ask.targetToolId, `phases.${phaseKey}.executiveAsk incomplete`);
}

// 4. Block-level integrity
const blockTitles = new Set();
const toolIds = new Set();
for (const tool of data.tools) {
  assert(tool.id && !toolIds.has(tool.id), `tool id missing or duplicate: ${tool.id}`);
  toolIds.add(tool.id);

  assert(tool.qualificationTrigger, `tool ${tool.id} missing qualificationTrigger`);
  assert(tool.supplyChainRisk, `tool ${tool.id} missing supplyChainRisk`);
  assert(tool.datum && tool.datum.design && tool.datum.tooling && tool.datum.inspection,
    `tool ${tool.id} missing complete datum triplet`);

  for (const block of tool.blocks) {
    assert(block.title && !blockTitles.has(block.title),
      `block title missing or duplicate: ${block.title} (tool ${tool.id})`);
    blockTitles.add(block.title);

    assert(VALID_SCORES.has(block.score),
      `block "${block.title}" has invalid score "${block.score}"`);
    assert(VALID_CONFIDENCE.has(block.confidence),
      `block "${block.title}" missing/invalid confidence "${block.confidence}"`);

    // CoVe: claimId must exist in registry and text must match
    assert(block.claimId, `block "${block.title}" missing claimId`);
    assert(data.claimRegistry[block.claimId],
      `block "${block.title}" claimId "${block.claimId}" not in claimRegistry`);
    if (data.claimRegistry[block.claimId] && block.claim) {
      assert(data.claimRegistry[block.claimId] === block.claim,
        `block "${block.title}" claim text drifts from registry[${block.claimId}]`);
    }

    // Recovery/evidence completeness — Blocked must have non-trivial recovery
    if (block.score === "Blocked") {
      assert(block.recoveryAction && !/^no release-blocking/i.test(block.missingEvidence || ""),
        `Blocked block "${block.title}" needs concrete missingEvidence and recoveryAction`);
    }
    assert(block.owner, `block "${block.title}" missing owner`);
    assert(typeof block.impact === "string", `block "${block.title}" missing impact`);
    assert(block.consequence, `block "${block.title}" missing consequence`);
  }
}

// 5. Agents reference real tools and have valid authority
const agentIds = new Set();
for (const agent of data.agents) {
  assert(agent.id && !agentIds.has(agent.id), `agent id missing or duplicate: ${agent.id}`);
  agentIds.add(agent.id);
  assert(toolIds.has(agent.toolId),
    `agent ${agent.id} references unknown toolId "${agent.toolId}"`);
  assert(VALID_AUTHORITY.has(agent.authority),
    `agent ${agent.id} has invalid authority "${agent.authority}"`);
}

// 6. Scenarios reference real blocks, tools, agents, phases
for (const [name, scenario] of Object.entries(data.scenarios)) {
  assert(Array.isArray(scenario.steps), `scenario "${name}" missing steps array`);
  scenario.steps.forEach((step, i) => {
    const where = `scenario "${name}" step ${i}`;
    assert(VALID_PHASE_KEYS.includes(step.phase), `${where} bad phase "${step.phase}"`);
    assert(toolIds.has(step.toolId), `${where} unknown toolId "${step.toolId}"`);
    assert(agentIds.has(step.agent), `${where} unknown agent "${step.agent}"`);
    assert(blockTitles.has(step.blockTitle), `${where} unknown blockTitle "${step.blockTitle}"`);
    assert(step.event && step.action, `${where} missing event/action`);
    /* exposes/unlocks: optional, but every entry must resolve to a real block title */
    for (const arr of ["exposes", "unlocks"]) {
      if (step[arr] === undefined) continue;
      assert(Array.isArray(step[arr]), `${where} ${arr} must be an array`);
      step[arr].forEach((title) => {
        assert(blockTitles.has(title), `${where} ${arr} references unknown block "${title}"`);
      });
    }
  });
}

// 7. Executive ask targets must resolve
for (const phaseKey of VALID_PHASE_KEYS) {
  const ask = data.phases[phaseKey].executiveAsk;
  assert(toolIds.has(ask.targetToolId),
    `phases.${phaseKey}.executiveAsk.targetToolId "${ask.targetToolId}" not a tool`);
}

// 8. Doctrine gaps map to known phases
for (const gap of data.doctrineGaps) {
  assert(gap.id && gap.title && gap.body, `doctrineGap missing id/title/body: ${gap.id}`);
  assert(VALID_PHASE_KEYS.includes(gap.phase),
    `doctrineGap "${gap.id}" bad phase "${gap.phase}"`);
}

// 9. processMachine.activeScenario must exist
assert(
  data.scenarios[data.processMachine.activeScenario],
  `processMachine.activeScenario "${data.processMachine.activeScenario}" not in scenarios`
);

// Report
if (failures.length === 0) {
  console.log(`PLATE data verifier: PASS (${data.tools.length} tools, ` +
    `${blockTitles.size} blocks, ${data.agents.length} agents, ` +
    `${Object.keys(data.claimRegistry).length} claims, ` +
    `${data.doctrineGaps.length} doctrine gaps).`);
  process.exit(0);
} else {
  console.error(`PLATE data verifier: FAIL (${failures.length} issue${failures.length === 1 ? "" : "s"}):`);
  failures.forEach((f) => console.error("  - " + f));
  process.exit(1);
}
