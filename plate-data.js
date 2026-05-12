(typeof window !== "undefined" ? window : globalThis).PLATE_DATA = {
  doctrine: {
    title: "Tooling Release Authority",
    thesis: "PLATE proves which tooling packages can release at surge rate by linking datum lineage, CoVe claims, evidence methods, blockers, and recovery actions.",
    safeBoundary: "Synthetic defense-flavored tooling data only. No real platform, facility, primary structure, propulsion, or workcell-control procedure is represented."
  },

  measures: {
    note: "Readiness is computed, not authored. Each block contributes a score weight; phase readiness is the weighted mean across all blocks after the phase score-transition table is applied.",
    scoreWeights: {
      Verified: 1.0,
      "At Risk": 0.6,
      Gate: 0.5,
      Blocked: 0.0
    },
    targets: {
      releaseable: 80,
      conditional: 60,
      hold: 0
    }
  },

  claimRegistry: {
    DATUM_INTENT: "Tool preserves design datum intent.",
    OPERATOR_TASK: "Operators can perform required tasks in-tool.",
    GRIP_HOLDS: "EOAT will not drop the payload.",
    COLLISION_FREE: "Tool will not crash in operation.",
    TOLERANCE_BUDGET: "Tolerances will not stack to failure.",
    SUSTAINMENT: "Tooling can be sustained in production.",
    RELEASE_EVIDENCE: "Release package has required evidence.",
    RECOVERY_CONTROLLED: "Failure recovery is controlled.",
    SAFE_HANDLING: "Tool will not create unsafe lifting conditions.",
    FIRST_ARTICLE: "Release package has first-article evidence."
  },

  phaseTransitions: {
    baseline: { Blocked: "Verified", Gate: "Verified", "At Risk": "Verified" },
    surge: { Blocked: "At Risk" },
    recovery: { Blocked: "At Risk" },
    review: { Blocked: "At Risk", Gate: "Verified" }
  },

  phases: {
    baseline: {
      label: "Baseline",
      scenario: "LRIP serviceability scan",
      note: "Baseline posture isolates packages with traceable datum continuity and current-rate serviceability.",
      executiveAsk: {
        sentence: "Approve baseline release package; no surge evidence required yet.",
        targetToolId: "asm-jig"
      }
    },
    surge: {
      label: "Surge",
      scenario: "Rate-pressure exposure",
      note: "Surge posture exposes physical access, collision, datum-transform, and cadence evidence gaps.",
      executiveAsk: {
        sentence: "Hold robot EOAT release pending repeat collision sweep and TCP certification.",
        targetToolId: "robot-eoat"
      }
    },
    recovery: {
      label: "Recovery",
      scenario: "Evidence attachment and tooling cut",
      note: "Recovery posture tracks evidence attachment, access-window recovery, and remaining tolerance budget.",
      executiveAsk: {
        sentence: "Approve drill/rivet jig access cut and updated bushing replacement interval.",
        targetToolId: "drill-jig"
      }
    },
    review: {
      label: "Review",
      scenario: "Release authority package review",
      note: "Review posture concentrates on release authority, calibration approval, and final package closure.",
      executiveAsk: {
        sentence: "Sign release memo once certification drift limits and TCP record are attached.",
        targetToolId: "cert-record"
      }
    }
  },

  doctrineGaps: [
    {
      id: "calibration-cadence",
      phase: "surge",
      title: "AS9100 calibration cadence is pre-surge",
      body: "Calibration intervals were qualified at LRIP cadence; surge takt has no qualified path. Metrology approval is currently ad-hoc."
    },
    {
      id: "tcp-requalification",
      phase: "surge",
      title: "Robot TCP requalification is time-based, not load-based",
      body: "Existing requalification triggers fire on calendar time. Surge load cycles fall outside the qualification envelope before the next trigger."
    },
    {
      id: "datum-transform",
      phase: "recovery",
      title: "Transport surrogate datum has no reversible transform standard",
      body: "Current MFG quality doctrine does not specify a reversible transform between transport surrogate and inspection frame. Each program improvises."
    },
    {
      id: "release-evidence-aggregation",
      phase: "review",
      title: "Release authority lacks a closed-set claim ledger",
      body: "Release memos accept free-text claims. Without an enumerated claim registry, completeness is unverifiable across packages."
    },
    {
      id: "baseline-pm-shape",
      phase: "baseline",
      title: "PM schedule shape unchallenged at baseline",
      body: "Baseline cadence inherits PM intervals from prior program; no doctrine forces a re-derivation when rate is later raised."
    }
  ],

  ticks: ["LRIP +00", "+01 WK", "+02 WK", "+03 WK", "+04 WK", "+05 WK", "+06 WK", "+07 WK", "+08 WK", "+09 WK"],

  taxonomies: [
    { label: "DATUM", className: "datum" },
    { label: "RELEASE", className: "release" },
    { label: "SURGE", className: "surge" }
  ],

  tools: [
    {
      id: "asm-jig",
      label: "Assembly Jig",
      lane: "Assembly Jig",
      datum: {
        design: "CAD Datum A/B/C",
        tooling: "Hard stops J1-A/J1-B",
        inspection: "Laser tracker nest frame"
      },
      releasePackage: ["First article alignment", "Calibration interval", "Hard-stop wear plan", "Technician SOP"],
      qualificationTrigger: "Re-qualify on first-article alignment delta > 0.15 mm or after 12 months.",
      supplyChainRisk: "Hard stops single-sourced from in-house machine shop; 4-week lead.",
      blocks: [
        {
          className: "cobalt",
          start: 4,
          span: 18,
          title: "Assembly Jig / Datum Continuity",
          body: "Design datum A/B/C remains traceable through hard stops and tracker frame.",
          score: "Verified",
          claimId: "DATUM_INTENT",
          claim: "Tool preserves design datum intent.",
          confidence: "high",
          evidenceMethod: "Tracker-frame alignment check against hard-stop baseline.",
          missingEvidence: "No release-blocking evidence gap logged.",
          recoveryAction: "Keep first-article alignment package attached.",
          owner: "Tooling",
          impact: "0 days",
          consequence: "Package remains releaseable for baseline rate."
        },
        {
          className: "ochre",
          start: 27,
          span: 13,
          title: "Assembly Jig / Surge Stand",
          body: "Surge support stand narrows one operator path; reach audit remains open.",
          score: "At Risk",
          claimId: "OPERATOR_TASK",
          claim: "Operators can perform required tasks in-tool.",
          confidence: "medium",
          evidenceMethod: "Operator reach audit and access-window confirmation.",
          missingEvidence: "Reach audit for the surge support stand is not attached.",
          recoveryAction: "Run reach audit and mark any restricted access windows.",
          owner: "Tooling",
          impact: "1 day",
          consequence: "Cannot approve surge posture until access evidence is attached."
        },
        {
          className: "black",
          start: 44,
          span: 18,
          title: "Assembly Jig / First Article",
          body: "First article alignment record is the release gate for the jig package.",
          score: "Gate",
          claimId: "FIRST_ARTICLE",
          claim: "Release package has first-article evidence.",
          confidence: "high",
          evidenceMethod: "First-article alignment record review.",
          missingEvidence: "Gate remains open until release authority signs the record.",
          recoveryAction: "Attach first-article record and close release gate.",
          owner: "Release",
          impact: "1 day",
          consequence: "Package cannot close without first-article authority."
        }
      ]
    },
    {
      id: "transport-fixture",
      label: "Transport Fixture",
      lane: "Transport Fixture",
      datum: {
        design: "Mate datum A with transport surrogate",
        tooling: "Replaceable cradle pads T2-P",
        inspection: "Post-move tracker check"
      },
      releasePackage: ["Lift plan", "Pad replacement criteria", "Post-move validation", "Surrogate transform"],
      qualificationTrigger: "Re-qualify on lift-plan change or after 50 surge moves.",
      supplyChainRisk: "Cradle pads consumable; 6-week lead from one approved vendor.",
      blocks: [
        {
          className: "cobalt",
          start: 9,
          span: 16,
          title: "Transport Fixture / Cradle Pads",
          body: "Replaceable cradle pads preserve handling contact without non-marring damage.",
          score: "Verified",
          claimId: "SUSTAINMENT",
          claim: "Tooling can be sustained in production.",
          confidence: "high",
          evidenceMethod: "Pad replacement criteria and handling-contact inspection.",
          missingEvidence: "No release-blocking evidence gap logged.",
          recoveryAction: "Keep pad replacement criteria in release package.",
          owner: "Sustainment",
          impact: "0 days",
          consequence: "Transport fixture remains serviceable at current rate."
        },
        {
          className: "crimson",
          start: 34,
          span: 11,
          title: "Transport Fixture / Datum Break",
          body: "Assisted-lift surrogate datum lacks reversible transform to inspection frame.",
          score: "Blocked",
          claimId: "DATUM_INTENT",
          claim: "Tool preserves design datum intent.",
          confidence: "low",
          evidenceMethod: "Reversible transform from transport surrogate to inspection frame.",
          missingEvidence: "Tracker target transform and post-move validation are missing.",
          recoveryAction: "Attach tracker target transform and repeat post-move validation.",
          owner: "Datum",
          impact: "2 days",
          consequence: "Hold transport release for surge moves."
        },
        {
          className: "ochre",
          start: 50,
          span: 21,
          title: "Transport Fixture / Move Cadence",
          body: "Surge cadence requires lifting review and post-move validation.",
          score: "At Risk",
          claimId: "SAFE_HANDLING",
          claim: "Tool will not create unsafe lifting conditions.",
          confidence: "medium",
          evidenceMethod: "Lift-plan review and post-move tracker sampling.",
          missingEvidence: "Surge-rate lift cadence approval is not attached.",
          recoveryAction: "Approve lift cadence and set post-move validation interval.",
          owner: "Tooling",
          impact: "2 days",
          consequence: "Surge-rate moves remain conditional."
        }
      ]
    },
    {
      id: "robot-eoat",
      label: "Robot EOAT",
      lane: "Robot EOAT",
      datum: {
        design: "Fastener pattern datum F1/F2",
        tooling: "EOAT wrist frame R3-W",
        inspection: "Robot TCP plus tracker target"
      },
      releasePackage: ["Grip force validation", "Robot TCP certification", "Collision sweep", "Loss-of-air recovery"],
      qualificationTrigger: "Re-qualify TCP on every cell layout change or surge cycle threshold.",
      supplyChainRisk: "EOAT wrist subassembly long-lead (14 weeks); spare on hand: 1.",
      blocks: [
        {
          className: "ochre",
          start: 1,
          span: 15,
          title: "Robot EOAT / Grip Margin",
          body: "Fail-safe grip margin exceeds the planned motion profile.",
          score: "At Risk",
          claimId: "GRIP_HOLDS",
          claim: "EOAT will not drop the payload.",
          confidence: "medium",
          evidenceMethod: "Grip-force validation against planned motion profile.",
          missingEvidence: "Loss-of-air recovery evidence remains incomplete.",
          recoveryAction: "Attach loss-of-air recovery check and grip validation summary.",
          owner: "Automation",
          impact: "1 day",
          consequence: "Robot EOAT cannot be released for unattended surge motion."
        },
        {
          className: "crimson",
          start: 24,
          span: 20,
          title: "Robot EOAT / Collision Envelope",
          body: "Surge path conflicts with the drill/rivet jig access envelope at two poses.",
          score: "Blocked",
          claimId: "COLLISION_FREE",
          claim: "Tool will not crash in operation.",
          confidence: "low",
          evidenceMethod: "Kinematic collision sweep and TCP certification review.",
          missingEvidence: "Repeat collision sweep and TCP release evidence are missing.",
          recoveryAction: "Revise surge path or D5 bracket envelope, then repeat collision and TCP checks.",
          owner: "Automation",
          impact: "2 days",
          consequence: "Hold robot-mounted release until collision evidence is attached.",
          momentLink: "moment.html"
        },
        {
          className: "black",
          start: 49,
          span: 10,
          title: "Robot EOAT / TCP Certification",
          body: "Robot frame transform and TCP certification are required before release.",
          score: "Gate",
          claimId: "DATUM_INTENT",
          claim: "Tool preserves design datum intent.",
          confidence: "high",
          evidenceMethod: "TCP certification and robot-frame transform record.",
          missingEvidence: "Gate remains open until certification record is signed.",
          recoveryAction: "Attach TCP certification to release package.",
          owner: "Release",
          impact: "1 day",
          consequence: "Robot EOAT cannot close release package without TCP authority."
        }
      ]
    },
    {
      id: "inspection-nest",
      label: "Inspection Nest",
      lane: "Inspection Nest",
      datum: {
        design: "Key characteristic datum K1",
        tooling: "Nest pins I4-P/I4-Q",
        inspection: "Golden-part baseline"
      },
      releasePackage: ["Golden-part baseline", "Drift threshold", "Calibration record", "Tolerance stack report"],
      qualificationTrigger: "Re-qualify on calibration interval or drift threshold exceedance.",
      supplyChainRisk: "Nest pins in-house; tracker calibration vendor 3-week schedule.",
      blocks: [
        {
          className: "cobalt",
          start: 13,
          span: 18,
          title: "Inspection Nest / Golden Part",
          body: "Golden-part baseline maps to key characteristic datum K1.",
          score: "Verified",
          claimId: "DATUM_INTENT",
          claim: "Tool preserves design datum intent.",
          confidence: "high",
          evidenceMethod: "Golden-part baseline and nest-pin inspection.",
          missingEvidence: "No release-blocking evidence gap logged.",
          recoveryAction: "Keep golden-part baseline in release package.",
          owner: "Metrology",
          impact: "0 days",
          consequence: "Inspection nest remains releaseable for baseline checks."
        },
        {
          className: "ochre",
          start: 36,
          span: 17,
          title: "Inspection Nest / Calibration Interval",
          body: "Surge interval shortens recalibration window and requires metrology approval.",
          score: "At Risk",
          claimId: "SUSTAINMENT",
          claim: "Tooling can be sustained in production.",
          confidence: "medium",
          evidenceMethod: "Calibration interval approval and drift-threshold review.",
          missingEvidence: "Metrology approval for surge cadence is not attached.",
          recoveryAction: "Approve temporary surge cadence and attach drift threshold update.",
          owner: "Metrology",
          impact: "1 day",
          consequence: "Inspection release remains conditional during surge cadence."
        },
        {
          className: "cobalt",
          start: 59,
          span: 16,
          title: "Inspection Nest / Tolerance Stack",
          body: "RSS and worst-case alignment budget remain inside release threshold.",
          score: "Verified",
          claimId: "TOLERANCE_BUDGET",
          claim: "Tolerances will not stack to failure.",
          confidence: "high",
          evidenceMethod: "RSS and worst-case alignment budget review.",
          missingEvidence: "No release-blocking evidence gap logged.",
          recoveryAction: "Keep tolerance stack report attached.",
          owner: "Metrology",
          impact: "0 days",
          consequence: "Tolerance claim supports release authority."
        }
      ]
    },
    {
      id: "drill-jig",
      label: "Drill/Rivet Jig",
      lane: "Drill/Rivet Jig",
      datum: {
        design: "Hole pattern datum H1/H2",
        tooling: "Bushing plate D5-B",
        inspection: "Borescope and gauge access"
      },
      releasePackage: ["Reach audit", "Bushing replacement", "Access window drawing", "Hole-position stack"],
      qualificationTrigger: "Re-qualify on bushing wear > 60% allowance or bracket envelope change.",
      supplyChainRisk: "Precision bushings single-sourced; 8-week lead and rising scrap rate.",
      blocks: [
        {
          className: "black",
          start: 5,
          span: 10,
          title: "Drill/Rivet Jig / Wear Bushings",
          body: "Guide bushings are serviceable wear items with line-side replacement path.",
          score: "Gate",
          claimId: "SUSTAINMENT",
          claim: "Tooling can be sustained in production.",
          confidence: "high",
          evidenceMethod: "Wear-item replacement criteria review.",
          missingEvidence: "Gate remains open until replacement criteria are accepted.",
          recoveryAction: "Attach bushing replacement criteria.",
          owner: "Sustainment",
          impact: "1 day",
          consequence: "Release package cannot close without wear-item authority."
        },
        {
          className: "crimson",
          start: 21,
          span: 13,
          title: "Drill/Rivet Jig / Probe Access",
          body: "Two inspection points are blocked when the surge support bracket is installed.",
          score: "Blocked",
          claimId: "OPERATOR_TASK",
          claim: "Operators can perform required tasks in-tool.",
          confidence: "low",
          evidenceMethod: "Probe reach audit and access-window drawing.",
          missingEvidence: "Probe access drawing and reach audit are missing for two points.",
          recoveryAction: "Cut access window, rerun reach audit, and update bracket envelope.",
          owner: "Tooling",
          impact: "3 days",
          consequence: "Hold drill/rivet jig release at surge rate.",
          momentLink: "moment.html"
        },
        {
          className: "ochre",
          start: 41,
          span: 28,
          title: "Drill/Rivet Jig / Bushing Budget",
          body: "Bushing wear allowance consumes most remaining hole-position tolerance budget.",
          score: "At Risk",
          claimId: "TOLERANCE_BUDGET",
          claim: "Tolerances will not stack to failure.",
          confidence: "medium",
          evidenceMethod: "Hole-position stack and bushing wear budget review.",
          missingEvidence: "Updated wear allowance is not signed for surge interval.",
          recoveryAction: "Reduce replacement interval and attach hole-position stack update.",
          owner: "Tooling",
          impact: "2 days",
          consequence: "Surge release remains at risk until wear budget is approved."
        }
      ]
    },
    {
      id: "cert-record",
      label: "Certification Record",
      lane: "Certification Record",
      datum: {
        design: "Design authority release baseline",
        tooling: "Master reference points",
        inspection: "Certification record"
      },
      releasePackage: ["Master reference points", "Initial alignment baseline", "Drift limits", "Requalification triggers"],
      qualificationTrigger: "Re-qualify on rate change, design baseline revision, or drift exceedance.",
      supplyChainRisk: "Authority signature dependent on single release officer; backup not designated.",
      blocks: [
        {
          className: "cobalt",
          start: 2,
          span: 20,
          title: "Certification / Master Reference",
          body: "Master reference points exist for the baseline tooling state.",
          score: "Verified",
          claimId: "DATUM_INTENT",
          claim: "Tool preserves design datum intent.",
          confidence: "high",
          evidenceMethod: "Master reference point record review.",
          missingEvidence: "No release-blocking evidence gap logged.",
          recoveryAction: "Keep master reference package attached.",
          owner: "Release",
          impact: "0 days",
          consequence: "Baseline release authority remains supportable."
        },
        {
          className: "crimson",
          start: 39,
          span: 15,
          title: "Certification / Drift Limits",
          body: "Surge drift thresholds are not approved for the new cadence.",
          score: "Blocked",
          claimId: "SUSTAINMENT",
          claim: "Tooling can be sustained in production.",
          confidence: "low",
          evidenceMethod: "Drift-limit approval and requalification trigger review.",
          missingEvidence: "Surge drift threshold approval is missing.",
          recoveryAction: "Approve drift limits and attach requalification triggers.",
          owner: "Release",
          impact: "2 days",
          consequence: "Certification record blocks final surge release."
        },
        {
          className: "black",
          start: 63,
          span: 18,
          title: "Certification / Release Record",
          body: "Release package cannot close until blocked claims have attached evidence.",
          score: "Gate",
          claimId: "RELEASE_EVIDENCE",
          claim: "Release package has required evidence.",
          confidence: "high",
          evidenceMethod: "Release authority ledger review.",
          missingEvidence: "Gate remains open until blocked claims are closed.",
          recoveryAction: "Close attached evidence ledger and prepare release memo.",
          owner: "Release",
          impact: "1 day",
          consequence: "Executive release remains conditional."
        }
      ]
    },
    {
      id: "maintenance",
      label: "Maintenance Plan",
      lane: "Maintenance Plan",
      datum: {
        design: "Production sustainment requirement",
        tooling: "Wear surfaces and consumables",
        inspection: "PM and drift checks"
      },
      releasePackage: ["Wear items", "Inspection interval", "Replacement criteria", "Failure escalation logic"],
      qualificationTrigger: "Re-qualify PM schedule on rate change or repeat-failure event.",
      supplyChainRisk: "Consumables sourced from three vendors; PM technicians shared across cells.",
      blocks: [
        {
          className: "ochre",
          start: 12,
          span: 12,
          title: "Maintenance / Wear Surfaces",
          body: "Wear surfaces are replaceable but inspection interval must follow surge plan.",
          score: "At Risk",
          claimId: "SUSTAINMENT",
          claim: "Tooling can be sustained in production.",
          confidence: "medium",
          evidenceMethod: "Wear-surface inspection interval review.",
          missingEvidence: "Surge interval is not attached to the PM package.",
          recoveryAction: "Attach surge PM interval and wear-surface inspection trigger.",
          owner: "Sustainment",
          impact: "1 day",
          consequence: "Sustainment claim remains conditional."
        },
        {
          className: "cobalt",
          start: 31,
          span: 24,
          title: "Maintenance / PM Schedule",
          body: "Preventive maintenance schedule is documented and owner-assigned.",
          score: "Verified",
          claimId: "SUSTAINMENT",
          claim: "Tooling can be sustained in production.",
          confidence: "high",
          evidenceMethod: "Owner-assigned PM schedule review.",
          missingEvidence: "No release-blocking evidence gap logged.",
          recoveryAction: "Keep PM schedule in release package.",
          owner: "Sustainment",
          impact: "0 days",
          consequence: "Maintenance plan supports baseline release."
        },
        {
          className: "crimson",
          start: 73,
          span: 12,
          title: "Maintenance / Downtime Escalation",
          body: "Failure escalation logic is incomplete for repeated access-block events.",
          score: "Blocked",
          claimId: "RECOVERY_CONTROLLED",
          claim: "Failure recovery is controlled.",
          confidence: "low",
          evidenceMethod: "Downtime escalation and repeated-failure review.",
          missingEvidence: "Repeated access-block escalation path is not defined.",
          recoveryAction: "Define escalation trigger and owner path for repeated access blocks.",
          owner: "Sustainment",
          impact: "2 days",
          consequence: "Recovery control blocks final surge release."
        }
      ]
    }
  ],

  agents: [
    {
      id: "datum-agent",
      label: "Datum Agent",
      scope: "Design-to-tool-to-inspection lineage",
      toolId: "transport-fixture",
      normal: "Watching datum transforms",
      authority: "recommend"
    },
    {
      id: "metrology-agent",
      label: "Metrology Agent",
      scope: "Calibration, golden part, drift limits",
      toolId: "inspection-nest",
      normal: "Watching calibration cadence",
      authority: "recommend"
    },
    {
      id: "automation-agent",
      label: "Automation Agent",
      scope: "Robot EOAT, TCP, collision envelope",
      toolId: "robot-eoat",
      normal: "Watching robot path",
      authority: "surface"
    },
    {
      id: "tooling-agent",
      label: "Tooling Agent",
      scope: "Jigs, fixtures, access, wear surfaces",
      toolId: "drill-jig",
      normal: "Watching physical access",
      authority: "recommend"
    },
    {
      id: "release-agent",
      label: "Release Agent",
      scope: "Certification record and package closure",
      toolId: "cert-record",
      normal: "Watching package authority",
      authority: "decide"
    }
  ],

  scenarios: {
    surge_baseline: {
      label: "Surge baseline",
      description: "Default scripted path: ingest → surge exposure → recovery → review.",
      steps: [
        {
          state: "Ingest",
          phase: "baseline",
          agent: "release-agent",
          toolId: "asm-jig",
          blockTitle: "Assembly Jig / Datum Continuity",
          event: "Baseline package ingested. Assembly jig datum chain is traceable.",
          action: "Keep package open for first-article alignment evidence.",
          exposes: [],
          unlocks: []
        },
        {
          state: "Assess",
          phase: "surge",
          agent: "automation-agent",
          toolId: "robot-eoat",
          blockTitle: "Robot EOAT / Collision Envelope",
          event: "Surge takt exposes EOAT path conflict against drill/rivet access envelope.",
          action: "Hold robot-mounted release until collision sweep is repeated.",
          exposes: ["Robot EOAT / Collision Envelope", "Robot EOAT / Grip Margin", "Robot EOAT / TCP Certification"],
          unlocks: []
        },
        {
          state: "Expose",
          phase: "surge",
          agent: "datum-agent",
          toolId: "transport-fixture",
          blockTitle: "Transport Fixture / Datum Break",
          event: "Transport surrogate datum lacks reversible inspection transform after assisted lift.",
          action: "Require tracker target transform and post-move validation.",
          exposes: ["Transport Fixture / Datum Break", "Transport Fixture / Move Cadence"],
          unlocks: []
        },
        {
          state: "Recover",
          phase: "recovery",
          agent: "tooling-agent",
          toolId: "drill-jig",
          blockTitle: "Drill/Rivet Jig / Probe Access",
          event: "Tooling recovery cut opens probe path but consumes bushing tolerance budget.",
          action: "Run reach audit and update bushing replacement criteria.",
          exposes: [],
          unlocks: ["Drill/Rivet Jig / Probe Access"]
        },
        {
          state: "Review",
          phase: "review",
          agent: "metrology-agent",
          toolId: "inspection-nest",
          blockTitle: "Inspection Nest / Calibration Interval",
          event: "Metrology approves temporary surge cadence pending drift threshold update.",
          action: "Attach calibration interval approval to release package.",
          exposes: [],
          unlocks: ["Inspection Nest / Calibration Interval"]
        },
        {
          state: "Review",
          phase: "review",
          agent: "release-agent",
          toolId: "cert-record",
          blockTitle: "Certification / Release Record",
          event: "Release package can advance after collision and datum evidence are attached.",
          action: "Prepare executive release memo with one remaining blocker.",
          exposes: [],
          unlocks: ["Certification / Drift Limits"]
        }
      ]
    },
    supplier_substitution: {
      label: "Supplier substitution",
      description: "Precision bushing vendor delivers off-spec stock. Drill/rivet jig wear plan and tolerance package degrade before alt vendor can be qualified.",
      steps: [
        {
          state: "Ingest",
          phase: "baseline",
          agent: "release-agent",
          toolId: "drill-jig",
          blockTitle: "Drill/Rivet Jig / Wear Bushings",
          event: "Baseline package ingested. Bushing budget and replacement criteria current.",
          action: "Keep current supplier package attached.",
          exposes: [],
          unlocks: []
        },
        {
          state: "Assess",
          phase: "surge",
          agent: "tooling-agent",
          toolId: "drill-jig",
          blockTitle: "Drill/Rivet Jig / Wear Bushings",
          event: "Vendor flags imminent shortage on D5-B bushings; line burns through buffer.",
          action: "Open alt-vendor qualification queue and protect existing inventory.",
          exposes: ["Drill/Rivet Jig / Wear Bushings", "Drill/Rivet Jig / Bushing Budget"],
          unlocks: []
        },
        {
          state: "Expose",
          phase: "surge",
          agent: "tooling-agent",
          toolId: "drill-jig",
          blockTitle: "Drill/Rivet Jig / Bushing Budget",
          event: "Hole-position stack consumes wear allowance; downstream tolerance budget contracts.",
          action: "Hold drill-jig release and reduce replacement interval.",
          exposes: ["Maintenance / Wear Surfaces"],
          unlocks: []
        },
        {
          state: "Recover",
          phase: "recovery",
          agent: "tooling-agent",
          toolId: "drill-jig",
          blockTitle: "Drill/Rivet Jig / Wear Bushings",
          event: "Alt vendor qualified on partial run; bushing supply restored at reduced cadence.",
          action: "Attach alt-vendor qualification record.",
          exposes: [],
          unlocks: ["Drill/Rivet Jig / Wear Bushings"]
        },
        {
          state: "Review",
          phase: "review",
          agent: "metrology-agent",
          toolId: "drill-jig",
          blockTitle: "Drill/Rivet Jig / Bushing Budget",
          event: "Hole-position stack re-baselined under new bushing tolerance.",
          action: "Re-attach hole-position stack update.",
          exposes: [],
          unlocks: ["Drill/Rivet Jig / Bushing Budget"]
        },
        {
          state: "Review",
          phase: "review",
          agent: "release-agent",
          toolId: "cert-record",
          blockTitle: "Certification / Release Record",
          event: "Release record updated with alt vendor requalification path.",
          action: "Sign updated release memo.",
          exposes: [],
          unlocks: ["Maintenance / Wear Surfaces"]
        }
      ]
    }
  },

  processMachine: {
    clockLabel: "Sim Clock",
    states: ["Ingest", "Assess", "Expose", "Recover", "Review"],
    activeScenario: "surge_baseline"
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = (typeof window !== "undefined" ? window : globalThis).PLATE_DATA;
}
