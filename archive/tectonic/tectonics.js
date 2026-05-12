(function () {
  const data = window.PLATE_DATA;

  if (!data) {
    return;
  }

  const state = {
    selectedToolId: "asm-jig",
    selectedBlockTitle: "Assembly Jig / Datum Continuity",
    phase: "baseline",
    activeStepIndex: 0,
    runTimer: null,
    memoOpen: false
  };

  const els = {
    metricReadiness: document.getElementById("metricReadiness"),
    metricBlocked: document.getElementById("metricBlocked"),
    metricGap: document.getElementById("metricGap"),
    phaseTabs: document.getElementById("phaseTabs"),
    agentStrip: document.getElementById("agentStrip"),
    timelineViewport: document.getElementById("timelineViewport"),
    timeAxis: document.getElementById("timeAxis"),
    laneRows: document.getElementById("laneRows"),
    laneIndexRows: document.getElementById("laneIndexRows"),
    guideLine: document.getElementById("guideLine"),
    runPlotter: document.getElementById("runPlotter"),
    pausePlotter: document.getElementById("pausePlotter"),
    stepPlotter: document.getElementById("stepPlotter"),
    resetPlotter: document.getElementById("resetPlotter"),
    memoToggle: document.getElementById("memoToggle"),
    scrollWindow: document.getElementById("scrollWindow"),
    scenarioNote: document.getElementById("scenarioNote"),
    panLeft: document.getElementById("panLeft"),
    panRight: document.getElementById("panRight"),
    detailTitle: document.getElementById("detailTitle"),
    detailScore: document.getElementById("detailScore"),
    detailBody: document.getElementById("detailBody"),
    momentLink: document.getElementById("momentLink"),
    detailClaim: document.getElementById("detailClaim"),
    detailEvidence: document.getElementById("detailEvidence"),
    detailMissing: document.getElementById("detailMissing"),
    detailRecovery: document.getElementById("detailRecovery"),
    detailOwner: document.getElementById("detailOwner"),
    detailImpact: document.getElementById("detailImpact"),
    detailConsequence: document.getElementById("detailConsequence"),
    datumList: document.getElementById("datumList"),
    eventLog: document.getElementById("eventLog"),
    releaseMemo: document.getElementById("releaseMemo"),
    printMemo: document.getElementById("printMemo"),
    memoTitle: document.getElementById("memoTitle"),
    memoPhase: document.getElementById("memoPhase"),
    memoState: document.getElementById("memoState"),
    memoBlocked: document.getElementById("memoBlocked"),
    memoClaim: document.getElementById("memoClaim"),
    memoEvidence: document.getElementById("memoEvidence"),
    memoMissing: document.getElementById("memoMissing"),
    memoRecovery: document.getElementById("memoRecovery"),
    memoOwnerImpact: document.getElementById("memoOwnerImpact"),
    memoConsequence: document.getElementById("memoConsequence")
  };

  const scoreClass = {
    Verified: "cobalt",
    Blocked: "crimson",
    "At Risk": "ochre",
    Gate: "black"
  };

  function setText(el, value) {
    if (el) {
      el.textContent = value;
    }
  }

  function clearChildren(el) {
    if (el) {
      el.replaceChildren();
    }
  }

  function activeStep() {
    return data.processMachine.steps[state.activeStepIndex] || data.processMachine.steps[0];
  }

  function activeAgent() {
    return data.agents.find((agent) => agent.id === activeStep().agent) || data.agents[0];
  }

  function activePhase() {
    return data.phases[state.phase] || data.phases.baseline;
  }

  function toolById(id) {
    return data.tools.find((tool) => tool.id === id) || data.tools[0];
  }

  function blockFor(tool, title) {
    return tool.blocks.find((block) => block.title === title) || tool.blocks[0];
  }

  function currentSelection() {
    const tool = toolById(state.selectedToolId);
    return { tool, block: blockFor(tool, state.selectedBlockTitle) };
  }

  function renderPhaseTabs() {
    clearChildren(els.phaseTabs);

    Object.entries(data.phases).forEach(([key, phase]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.phase = key;
      button.innerHTML = `${phase.label}<span>${phase.scenario}</span>`;
      button.addEventListener("click", () => {
        state.phase = key;
        const firstStep = data.processMachine.steps.findIndex((step) => step.phase === key);
        if (firstStep >= 0) {
          selectStep(firstStep, false);
        } else {
          render();
        }
      });
      els.phaseTabs.appendChild(button);
    });
  }

  function renderAgents() {
    clearChildren(els.agentStrip);

    data.agents.forEach((agent) => {
      const item = document.createElement("div");
      item.className = "agent-item";
      item.dataset.agent = agent.id;
      item.innerHTML = `<strong>${agent.label}</strong><span>${agent.scope}</span>`;
      els.agentStrip.appendChild(item);
    });
  }

  function renderAxis() {
    clearChildren(els.timeAxis);

    data.ticks.forEach((tick, index) => {
      const item = document.createElement("div");
      item.className = "time-tick";
      item.innerHTML = `<span>${tick}</span>`;
      item.style.gridColumn = `${index + 1}`;
      els.timeAxis.appendChild(item);
    });
  }

  function renderLanes() {
    clearChildren(els.laneIndexRows);
    clearChildren(els.laneRows);

    data.tools.forEach((tool) => {
      const indexRow = document.createElement("div");
      indexRow.className = "lane-index-row";
      indexRow.innerHTML = `<strong>${tool.lane}</strong><span>${tool.datum.tooling}</span>`;
      els.laneIndexRows.appendChild(indexRow);

      const lane = document.createElement("div");
      lane.className = "lane-row";
      lane.dataset.tool = tool.id;

      tool.blocks.forEach((block) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `time-block ${block.className}`;
        button.dataset.tool = tool.id;
        button.dataset.block = block.title;
        button.style.setProperty("--start", `${block.start}%`);
        button.style.setProperty("--span", `${block.span}%`);
        button.innerHTML = `<span>${block.score}</span><strong>${block.title}</strong>`;
        button.addEventListener("click", () => selectBlock(tool.id, block.title));
        button.addEventListener("mouseenter", () => positionGuide(tool.id, block));
        lane.appendChild(button);
      });

      els.laneRows.appendChild(lane);
    });
  }

  function renderMetrics() {
    const phase = activePhase();
    setText(els.metricReadiness, phase.readiness);
    setText(els.metricBlocked, phase.blocked);
    setText(els.metricGap, phase.gap);
    setText(els.scenarioNote, phase.note || phase.scenario);

    document.querySelectorAll(".phase-tabs button").forEach((button) => {
      button.classList.toggle("active", button.dataset.phase === state.phase);
    });
  }

  function renderScenarioPosture() {
    const activeBlocks = new Set(activePhase().activeBlocks || []);
    const hasPosture = activeBlocks.size > 0;

    document.querySelectorAll(".time-block").forEach((button) => {
      const isSelected = button.dataset.tool === state.selectedToolId && button.dataset.block === state.selectedBlockTitle;
      const isPostureBlock = activeBlocks.has(button.dataset.block);
      button.classList.toggle("posture-focus", hasPosture && isPostureBlock);
      button.classList.toggle("posture-dim", hasPosture && !isPostureBlock && !isSelected);
    });
  }

  function renderDetail() {
    const { tool, block } = currentSelection();
    const cssClass = scoreClass[block.score] || "black";

    setText(els.detailTitle, block.title);
    setText(els.detailScore, block.score);
    setText(els.detailBody, block.body);
    setText(els.detailClaim, block.claim);
    setText(els.detailEvidence, block.evidenceMethod);
    setText(els.detailMissing, block.missingEvidence);
    setText(els.detailRecovery, block.recoveryAction);
    setText(els.detailOwner, block.owner);
    setText(els.detailImpact, block.impact);
    setText(els.detailConsequence, block.consequence);

    els.detailScore.className = `status-label ${cssClass}`;
    els.momentLink.classList.toggle("hidden", !block.momentLink);
    els.momentLink.href = block.momentLink || "moment.html";

    clearChildren(els.datumList);
    [
      ["Design", tool.datum.design],
      ["Tooling", tool.datum.tooling],
      ["Inspection", tool.datum.inspection]
    ].forEach(([label, value]) => {
      const item = document.createElement("li");
      item.innerHTML = `<span>${label}</span>${value}`;
      els.datumList.appendChild(item);
    });

    document.querySelectorAll(".time-block").forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.tool === tool.id && button.dataset.block === block.title
      );
    });

    positionGuide(tool.id, block);
    renderScenarioPosture();
    renderMemo();
  }

  function renderEventLog(reset) {
    if (reset) {
      clearChildren(els.eventLog);
    }

    const step = activeStep();
    const item = document.createElement("li");
    item.innerHTML = `<span>${step.state} / ${step.phase}</span>${step.event}`;
    els.eventLog.prepend(item);

    while (els.eventLog.children.length > 5) {
      els.eventLog.removeChild(els.eventLog.lastElementChild);
    }
  }

  function renderAgentState() {
    const agent = activeAgent();

    document.querySelectorAll(".agent-item").forEach((item) => {
      item.classList.toggle("active", item.dataset.agent === agent.id);
    });
  }

  function renderScrollAffordance() {
    const maxScroll = Math.max(0, els.timelineViewport.scrollWidth - els.timelineViewport.clientWidth);
    const scrollLeft = els.timelineViewport.scrollLeft;
    const tickWidth = els.timelineViewport.scrollWidth / data.ticks.length;
    const startIndex = Math.max(0, Math.min(data.ticks.length - 1, Math.floor(scrollLeft / tickWidth)));
    const endIndex = Math.max(
      startIndex,
      Math.min(data.ticks.length - 1, Math.floor((scrollLeft + els.timelineViewport.clientWidth) / tickWidth))
    );

    els.panLeft.classList.toggle("visible", scrollLeft > 8);
    els.panRight.classList.toggle("visible", scrollLeft < maxScroll - 8);
    setText(els.scrollWindow, `Window ${data.ticks[startIndex]} to ${data.ticks[endIndex]}`);
  }

  function renderMemo() {
    const { tool, block } = currentSelection();
    const phase = activePhase();

    els.releaseMemo.classList.toggle("hidden", !state.memoOpen);
    els.memoToggle.classList.toggle("active", state.memoOpen);
    setText(els.memoTitle, block.title);
    setText(els.memoPhase, `${phase.label} / ${phase.scenario}`);
    setText(els.memoState, block.score);
    setText(els.memoBlocked, phase.blocked);
    setText(els.memoClaim, block.claim);
    setText(els.memoEvidence, block.evidenceMethod);
    setText(els.memoMissing, block.missingEvidence);
    setText(els.memoRecovery, block.recoveryAction);
    setText(els.memoOwnerImpact, `${block.owner} / ${block.impact}`);
    setText(els.memoConsequence, `${tool.label}: ${block.consequence}`);
  }

  function positionGuide(toolId, block) {
    const rowIndex = Math.max(0, data.tools.findIndex((tool) => tool.id === toolId));
    const styles = window.getComputedStyle(document.documentElement);
    const axisHeight = parseFloat(styles.getPropertyValue("--axis-height")) || 38;
    const laneHeight = parseFloat(styles.getPropertyValue("--lane-height")) || 53;
    const left = block.start + block.span;
    els.guideLine.style.left = `${left}%`;
    els.guideLine.style.top = `${axisHeight + rowIndex * laneHeight}px`;
    els.guideLine.classList.add("active");
  }

  function selectBlock(toolId, blockTitle) {
    state.selectedToolId = toolId;
    state.selectedBlockTitle = blockTitle;
    renderDetail();
  }

  function selectStep(index, logEvent) {
    const step = data.processMachine.steps[index];
    if (!step) {
      return;
    }

    state.activeStepIndex = index;
    state.phase = step.phase;
    state.selectedToolId = step.toolId;
    state.selectedBlockTitle = step.blockTitle;
    render();

    if (logEvent) {
      renderEventLog(false);
    }
  }

  function stepPlotter() {
    const nextIndex = (state.activeStepIndex + 1) % data.processMachine.steps.length;
    selectStep(nextIndex, true);
  }

  function runPlotter() {
    window.clearInterval(state.runTimer);
    els.runPlotter.classList.add("active");
    state.runTimer = window.setInterval(stepPlotter, 900);
  }

  function pausePlotter() {
    window.clearInterval(state.runTimer);
    state.runTimer = null;
    els.runPlotter.classList.remove("active");
  }

  function resetPlotter() {
    pausePlotter();
    state.activeStepIndex = 0;
    state.phase = "baseline";
    state.selectedToolId = "asm-jig";
    state.selectedBlockTitle = "Assembly Jig / Datum Continuity";
    render();
    renderEventLog(true);
  }

  function toggleMemo() {
    state.memoOpen = !state.memoOpen;
    renderMemo();
  }

  function render() {
    renderMetrics();
    renderAgentState();
    renderDetail();
    renderScrollAffordance();
  }

  els.timelineViewport.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      event.preventDefault();
      els.timelineViewport.scrollLeft += event.deltaY;
    }
  }, { passive: false });

  els.timelineViewport.addEventListener("scroll", renderScrollAffordance);
  els.runPlotter.addEventListener("click", runPlotter);
  els.pausePlotter.addEventListener("click", pausePlotter);
  els.stepPlotter.addEventListener("click", stepPlotter);
  els.resetPlotter.addEventListener("click", resetPlotter);
  els.memoToggle.addEventListener("click", toggleMemo);
  els.printMemo.addEventListener("click", () => window.print());

  renderPhaseTabs();
  renderAgents();
  renderAxis();
  renderLanes();
  render();
  renderEventLog(true);
  renderScrollAffordance();
})();
