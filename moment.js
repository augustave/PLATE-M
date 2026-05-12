(function () {
  const data = window.PLATE_DATA;

  if (!data) {
    return;
  }

  const activeScenario = data.scenarios[data.processMachine.activeScenario];
  const steps = activeScenario.steps;

  const state = {
    selectedToolId: "robot-eoat",
    selectedBlockTitle: "Robot EOAT / Collision Envelope",
    activeStepIndex: 1,
    runTimer: null,
    cleared: false
  };

  const els = {
    mapShell: document.getElementById("mapShell"),
    momentReadiness: document.getElementById("momentReadiness"),
    momentGap: document.getElementById("momentGap"),
    momentRelease: document.getElementById("momentRelease"),
    momentAgent: document.getElementById("momentAgent"),
    momentDecision: document.getElementById("momentDecision"),
    momentAuthority: document.getElementById("momentAuthority"),
    executiveAsk: document.getElementById("executiveAsk"),
    executiveAskTarget: document.getElementById("executiveAskTarget"),
    asksQueue: document.getElementById("asksQueue"),
    asksCount: document.getElementById("asksCount"),
    stageTitle: document.getElementById("stageTitle"),
    pulseEyebrow: document.getElementById("pulseEyebrow"),
    pulseTitle: document.getElementById("pulseTitle"),
    pulseCopy: document.getElementById("pulseCopy"),
    selectedName: document.getElementById("selectedName"),
    selectedState: document.getElementById("selectedState"),
    selectedConfidence: document.getElementById("selectedConfidence"),
    selectedBody: document.getElementById("selectedBody"),
    actionTitle: document.getElementById("actionTitle"),
    actionBody: document.getElementById("actionBody"),
    actionOwner: document.getElementById("actionOwner"),
    actionImpact: document.getElementById("actionImpact"),
    missingEvidence: document.getElementById("missingEvidence"),
    releaseConsequence: document.getElementById("releaseConsequence"),
    gateState: document.getElementById("gateState"),
    gateConditions: document.getElementById("gateConditions"),
    gateCopy: document.getElementById("gateCopy"),
    stepStack: document.getElementById("stepStack"),
    packageStrip: document.getElementById("packageStrip"),
    lineageChain: document.getElementById("lineageChain"),
    claimLedger: document.getElementById("claimLedger"),
    doctrineGap: document.getElementById("doctrineGap"),
    doctrineGapTitle: document.getElementById("doctrineGapTitle"),
    doctrineGapBody: document.getElementById("doctrineGapBody"),
    qualificationTrigger: document.getElementById("qualificationTrigger"),
    supplyChainRisk: document.getElementById("supplyChainRisk"),
    runMoment: document.getElementById("runMoment"),
    clearMoment: document.getElementById("clearMoment")
  };

  const statusClass = {
    verified: "verified",
    "at risk": "warning",
    blocked: "blocked",
    gate: "gate"
  };

  function byId(id) {
    return data.tools.find((tool) => tool.id === id) || data.tools[0];
  }

  function activeStep() {
    return steps[state.activeStepIndex] || steps[0];
  }

  function activeAgent() {
    return data.agents.find((a) => a.id === activeStep().agent) || data.agents[0];
  }

  function blockFor(tool, title) {
    return (
      tool.blocks.find((block) => block.title === title) ||
      tool.blocks.find((block) => block.score === "Blocked") ||
      tool.blocks[0]
    );
  }

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function clearChildren(el) {
    if (el) el.replaceChildren();
  }

  function classForScore(score) {
    return statusClass[String(score).toLowerCase()] || "open";
  }

  function scoreRank(score) {
    const ranks = { blocked: 0, gate: 1, "at risk": 2, verified: 3 };
    return ranks[String(score).toLowerCase()] ?? 4;
  }

  /* Score-transition + readiness math (item 1: computed, not authored) */

  /* Linear severity scale used by degrade/improve. */
  const SCORE_LADDER = ["Blocked", "Gate", "At Risk", "Verified"];

  function degrade(score) {
    const i = SCORE_LADDER.indexOf(score);
    if (i <= 0) return "Blocked";
    return SCORE_LADDER[i - 1];
  }

  function improve(score) {
    const i = SCORE_LADDER.indexOf(score);
    if (i < 0 || i >= SCORE_LADDER.length - 1) return "Verified";
    return SCORE_LADDER[i + 1];
  }

  function phaseScore(phaseKey, block) {
    const transitions = data.phaseTransitions[phaseKey] || {};
    return transitions[block.score] || block.score;
  }

  /* Apply cumulative exposes/unlocks from scenario steps 0..stepIndex.
     Each `exposes` entry pushes the block one tier worse;
     each `unlocks` entry pushes it one tier better. */
  function effectiveScore(phaseKey, block, stepIndex) {
    let s = phaseScore(phaseKey, block);
    const upto = typeof stepIndex === "number" ? stepIndex : state.activeStepIndex;
    for (let i = 0; i <= upto && i < steps.length; i += 1) {
      const step = steps[i];
      if (step.exposes && step.exposes.includes(block.title)) {
        s = degrade(s);
      }
      if (step.unlocks && step.unlocks.includes(block.title)) {
        s = improve(s);
      }
    }
    /* When user attaches evidence, the active blocker softens one tier. */
    if (state.cleared && block.title === state.selectedBlockTitle && s === "Blocked") {
      s = "At Risk";
    }
    return s;
  }

  function computeReadiness(phaseKey, stepIndex) {
    const weights = data.measures.scoreWeights;
    let sum = 0;
    let n = 0;
    let blocked = 0;
    data.tools.forEach((tool) => {
      tool.blocks.forEach((block) => {
        const s = effectiveScore(phaseKey, block, stepIndex);
        sum += weights[s] ?? 0;
        n += 1;
        if (s === "Blocked") blocked += 1;
      });
    });
    const readiness = n ? Math.round((sum / n) * 100) : 0;
    return { readiness, blocked, gap: readiness - 100 };
  }

  /* Asks queue: enumerate decisions the director still owes a signature on. */

  function asksQueue(phaseKey) {
    const items = [];
    data.tools.forEach((tool) => {
      tool.blocks.forEach((block) => {
        const s = effectiveScore(phaseKey, block);
        if (s === "Blocked" || s === "Gate") {
          items.push({
            toolId: tool.id,
            label: tool.label,
            blockTitle: block.title,
            score: s,
            recoveryAction: block.recoveryAction,
            owner: block.owner,
            impact: block.impact
          });
        }
      });
    });
    /* Blocked first, then Gate; then by impact descending where parsable. */
    items.sort((a, b) => {
      if (a.score !== b.score) return a.score === "Blocked" ? -1 : 1;
      const ai = parseInt(a.impact, 10) || 0;
      const bi = parseInt(b.impact, 10) || 0;
      return bi - ai;
    });
    return items;
  }

  function gateFor(block, score) {
    const normalized = String(score).toLowerCase();
    const evidenceAttached = state.cleared || normalized === "verified";
    const authorityApproved = normalized === "verified";
    const toolingSustained = state.cleared || normalized === "verified" || normalized === "at risk";
    const clear = evidenceAttached && authorityApproved && toolingSustained;

    return {
      clear,
      copy: clear
        ? "All gate conditions are met; release remains a formal signature action."
        : evidenceAttached
          ? "Evidence is attached for review; authority signature remains pending."
          : `${block.missingEvidence} Gate remains held until evidence is attached.`,
      conditions: [
        ["Evidence attached", evidenceAttached],
        ["Authority approved", authorityApproved],
        ["Tooling sustained", toolingSustained]
      ]
    };
  }

  function renderSteps() {
    clearChildren(els.stepStack);
    steps.forEach((step, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "step-button";
      button.dataset.index = String(index);
      button.innerHTML = `<strong>${step.state}</strong><span>${step.event}</span>`;
      button.addEventListener("click", () => selectStep(index));
      els.stepStack.appendChild(button);
    });
  }

  function renderPackages(phaseKey) {
    clearChildren(els.packageStrip);
    data.tools
      .map((tool) => {
        const block = blockFor(tool);
        const score = effectiveScore(phaseKey, block);
        return { tool, block, score };
      })
      .sort((a, b) => scoreRank(a.score) - scoreRank(b.score) || a.tool.label.localeCompare(b.tool.label))
      .forEach(({ tool, block, score }) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `package-card ${classForScore(score)}`;
        button.dataset.tool = tool.id;
        button.innerHTML = `
          <span>${score}</span>
          <strong>${tool.label}</strong>
          <small>${block.claim}</small>
        `;
        button.addEventListener("click", () => selectTool(tool.id));
        els.packageStrip.appendChild(button);
      });
  }

  function renderLineage(tool) {
    clearChildren(els.lineageChain);
    [
      ["Design Datum", tool.datum.design],
      ["Tooling Datum", tool.datum.tooling],
      ["Inspection Datum", tool.datum.inspection]
    ].forEach(([label, value]) => {
      const item = document.createElement("li");
      item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
      els.lineageChain.appendChild(item);
    });
  }

  function renderClaims(tool, phaseKey) {
    clearChildren(els.claimLedger);
    tool.blocks.forEach((block) => {
      const s = effectiveScore(phaseKey, block);
      const item = document.createElement("li");
      item.innerHTML = `
        <span>${s}</span>
        <strong>${block.claim}</strong>
        <p><em>${block.claimId}</em> — ${block.evidenceMethod}</p>
      `;
      els.claimLedger.appendChild(item);
    });
  }

  function renderGate(block, score) {
    const gate = gateFor(block, score);
    clearChildren(els.gateConditions);
    setText(els.gateState, gate.clear ? "CLEAR" : "HOLD");
    setText(els.gateCopy, gate.copy);
    els.gateState.className = gate.clear ? "clear" : "";
    gate.conditions.forEach(([label, met]) => {
      const item = document.createElement("div");
      item.className = `gate-condition ${met ? "met" : "review"}`;
      item.textContent = label;
      els.gateConditions.appendChild(item);
    });
  }

  function renderAsksQueue(phaseKey) {
    if (!els.asksQueue) return;
    clearChildren(els.asksQueue);
    const items = asksQueue(phaseKey);
    setText(els.asksCount, String(items.length));
    items.slice(0, 6).forEach((ask) => {
      const li = document.createElement("li");
      li.className = `ask-item ${classForScore(ask.score)}`;
      li.innerHTML = `
        <span class="ask-tag">${ask.score}</span>
        <strong>${ask.label}</strong>
        <p>${ask.recoveryAction}</p>
        <small>${ask.owner} · ${ask.impact}</small>
      `;
      li.addEventListener("click", () => {
        state.selectedToolId = ask.toolId;
        state.selectedBlockTitle = ask.blockTitle;
        state.cleared = false;
        renderSelection();
      });
      els.asksQueue.appendChild(li);
    });
  }

  function renderDoctrineGap(phaseKey) {
    if (!els.doctrineGap) return;
    const gap = data.doctrineGaps.find((g) => g.phase === phaseKey);
    if (!gap) {
      els.doctrineGap.hidden = true;
      return;
    }
    els.doctrineGap.hidden = false;
    setText(els.doctrineGapTitle, gap.title);
    setText(els.doctrineGapBody, gap.body);
  }

  function renderExecutiveAsk(phaseKey) {
    const phase = data.phases[phaseKey];
    if (!phase || !phase.executiveAsk) return;
    setText(els.executiveAsk, phase.executiveAsk.sentence);
    const target = byId(phase.executiveAsk.targetToolId);
    setText(els.executiveAskTarget, `→ ${target.label}`);
  }

  function renderSelection() {
    const step = activeStep();
    const phaseKey = step.phase;
    const tool = byId(state.selectedToolId);
    const block = blockFor(tool, state.selectedBlockTitle);
    const agent = activeAgent();
    const score = effectiveScore(phaseKey, block);

    document.body.classList.toggle("moment-cleared", state.cleared);

    const metrics = computeReadiness(phaseKey);
    setText(els.momentReadiness, String(metrics.readiness));
    setText(els.momentGap, `${metrics.gap}% takt`);
    setText(els.momentRelease, state.cleared ? "Review" : score);
    setText(els.momentAgent, agent.label.replace(" Agent", ""));
    setText(els.momentAuthority, agent.authority);
    setText(els.momentDecision, state.cleared ? "Advance package review" : step.action);

    setText(els.stageTitle, state.cleared ? "Recovery evidence attached for release review" : block.title);
    setText(
      els.pulseEyebrow,
      state.cleared ? "Evidence Attached" : score === "Blocked" ? "Active Blocker" : `${score} Claim`
    );
    setText(els.pulseTitle, state.cleared ? "Primary conflict cleared for review." : block.body);
    setText(els.pulseCopy, state.cleared ? "Release authority still depends on attached evidence and final claim closure." : step.action);
    setText(els.selectedName, tool.label);
    setText(els.selectedState, score);
    setText(els.selectedConfidence, `confidence: ${block.confidence}`);
    setText(els.selectedBody, block.body);
    setText(els.actionTitle, block.recoveryAction);
    setText(els.actionBody, `${block.missingEvidence} ${step.action}`);
    setText(els.actionOwner, `Owner: ${block.owner}`);
    setText(els.actionImpact, `Impact: ${block.impact}`);
    setText(els.missingEvidence, block.missingEvidence);
    setText(els.releaseConsequence, block.consequence);
    setText(els.qualificationTrigger, tool.qualificationTrigger);
    setText(els.supplyChainRisk, tool.supplyChainRisk);

    if (els.selectedState) {
      els.selectedState.className = `state-pill ${classForScore(score)}`;
    }
    if (els.selectedConfidence) {
      els.selectedConfidence.className = `confidence-pill conf-${block.confidence}`;
    }

    document.querySelectorAll(".step-button").forEach((button) => {
      button.classList.toggle("active", Number(button.dataset.index) === state.activeStepIndex);
    });

    document.querySelectorAll(".package-card").forEach((button) => {
      const isActive = button.dataset.tool === tool.id;
      button.classList.toggle("active", isActive);
    });

    document.querySelectorAll(".map-node").forEach((button) => {
      const nodeTool = byId(button.dataset.tool);
      const nodeBlock = blockFor(nodeTool);
      const nodeScore = effectiveScore(phaseKey, nodeBlock);
      const nodeClass = classForScore(nodeScore);
      const isSelected = button.dataset.tool === tool.id;
      button.classList.remove("verified", "warning", "blocked", "gate", "open", "active-blocker");
      button.classList.add(nodeClass);
      button.classList.toggle("selected", isSelected);
      button.classList.toggle("active-blocker", isSelected && !state.cleared && nodeClass === "blocked");
    });

    renderLineage(tool);
    renderClaims(tool, phaseKey);
    renderGate(block, score);
    renderPackages(phaseKey);
    renderAsksQueue(phaseKey);
    renderDoctrineGap(phaseKey);
    renderExecutiveAsk(phaseKey);
  }

  function selectStep(index) {
    const step = steps[index];
    if (!step) return;
    state.activeStepIndex = index;
    state.selectedToolId = step.toolId;
    state.selectedBlockTitle = step.blockTitle;
    state.cleared = false;
    renderSelection();
  }

  function selectTool(toolId) {
    const tool = byId(toolId);
    const block = blockFor(tool);
    const matchingStepIndex = steps.findIndex((step) => step.toolId === tool.id);
    state.selectedToolId = tool.id;
    state.selectedBlockTitle = block.title;
    state.activeStepIndex = matchingStepIndex >= 0 ? matchingStepIndex : state.activeStepIndex;
    state.cleared = false;
    renderSelection();
  }

  function runMoment() {
    window.clearInterval(state.runTimer);
    state.cleared = false;
    selectStep(0);
    state.runTimer = window.setInterval(() => {
      if (state.activeStepIndex >= steps.length - 1) {
        window.clearInterval(state.runTimer);
        state.runTimer = null;
        return;
      }
      selectStep(state.activeStepIndex + 1);
    }, 900);
  }

  function clearMoment() {
    window.clearInterval(state.runTimer);
    state.runTimer = null;
    state.cleared = true;
    renderSelection();
  }

  document.querySelectorAll(".map-node").forEach((button) => {
    button.addEventListener("click", () => selectTool(button.dataset.tool));
  });

  els.runMoment.addEventListener("click", runMoment);
  els.clearMoment.addEventListener("click", clearMoment);

  renderSteps();
  renderSelection();
})();
