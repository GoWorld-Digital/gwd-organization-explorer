import test from "node:test";
import assert from "node:assert/strict";
import model from "../content/organization/organization-model.json" with { type: "json" };
import catalog from "../content/agency-agents/divisions.json" with { type: "json" };
import missionsModel from "../content/missions/missions-model.json" with { type: "json" };
import financialModel from "../content/finance/scenarios-model.json" with { type: "json" };
import designTokens from "../design/tokens.json" with { type: "json" };
import {
  OrganizationModelSchema,
  AgencyAgentsCatalogSchema,
  MissionsModelSchema,
  FinancialScenariosModelSchema,
  DesignTokensSchema,
  validateCanonicalDomain,
} from "../lib/schemas.ts";
import {
  calculateScenarioEconomics,
  clampScenarioInputs,
  validateScenarioInputs,
} from "../lib/finance.ts";

test("1. Organization schema integrity: five layers, unit mandates, economic roles and Lab/Venture maturity stages", () => {
  const parsed = OrganizationModelSchema.parse(model);

  assert.deepEqual(
    parsed.layers.map((l) => l.id),
    [
      "governance",
      "executive",
      "shared-services",
      "business-units",
      "labs-innovation",
    ],
  );

  const ids = new Set();
  parsed.layers.forEach((layer, i) => {
    assert.equal(layer.rank, i + 1);
    assert.equal(layer.status, "proposed");
    assert.ok(layer.purpose.length > 10);

    for (const unit of layer.units) {
      assert.ok(!ids.has(unit.id), `Duplicate unit id ${unit.id}`);
      ids.add(unit.id);
      assert.ok(
        ["proposed", "design-principle"].includes(unit.status ?? layer.status),
      );
      assert.ok(unit.mandate.length >= 15);
      assert.ok(unit.candidateCapabilityDivisions.length >= 1);

      if (layer.id === "labs-innovation" || unit.kind === "venture-studio") {
        assert.ok(
          [
            "hypothesis",
            "research",
            "prototype",
            "validation",
            "venture-proposal",
          ].includes(unit.maturityStage),
          `Expected valid maturityStage on ${unit.id}`,
        );
      }
    }
  });

  assert.equal(ids.size, 21);
  assert.equal(
    parsed.layers[3].units.filter(
      (u) => u.economicType === "profit-centre-candidate",
    ).length,
    3,
  );
  assert.equal(
    parsed.layers[3].units.filter(
      (u) => u.economicType === "investment-centre-candidate",
    ).length,
    1,
  );
  assert.equal(parsed.layers[4].units.length, 5);
  assert.ok(parsed.discrepancyNotes.some((n) => n.id === "disc-labs-count"));

  const missingMaturity = structuredClone(model);
  delete missingMaturity.layers[4].units[0].maturityStage;
  assert.throws(
    () => OrganizationModelSchema.parse(missingMaturity),
    /must declare an explicit maturityStage/,
  );
});

test("2. Relationship validity: reports_to, advises, provides_service_to and capabilityMappings referential integrity", () => {
  const validated = validateCanonicalDomain({
    organizationModel: model,
    agencyCatalog: catalog,
    missionsModel,
    financialModel,
    designTokens,
  });

  const rels = validated.organization.relationships;
  assert.ok(rels.length >= 30);

  const byType = {
    reports_to: rels.filter((r) => r.type === "reports_to"),
    advises: rels.filter((r) => r.type === "advises"),
    provides_service_to: rels.filter((r) => r.type === "provides_service_to"),
  };

  assert.equal(byType.reports_to.length, 19);
  assert.equal(byType.advises.length, 1);
  assert.equal(byType.advises[0].from, "advisory-council");
  assert.equal(byType.advises[0].to, "board");
  assert.ok(byType.provides_service_to.length >= 14);

  const allSharedServiceIds = new Set(
    model.layers[2].units.map((u) => u.id),
  );
  for (const sRel of byType.provides_service_to) {
    assert.ok(
      allSharedServiceIds.has(sRel.from),
      `Service relationship ${sRel.id} must originate from a Layer 3 shared service`,
    );
  }

  assert.ok(validated.organization.capabilityMappings.length >= 18);

  const badRelModel = structuredClone(model);
  badRelModel.relationships.push({
    id: "rel-invalid-self",
    from: "board",
    to: "board",
    type: "reports_to",
    status: "proposed",
    rationale: "Invalid self-loop relationship for negative testing.",
  });
  assert.throws(
    () => OrganizationModelSchema.parse(badRelModel),
    /Self-referential relationship/,
  );
});

test("3. Agency Agents provenance and profile counts: verified 40-char commit SHA, tree, MIT license and 18/283 reconciliation", () => {
  const parsed = AgencyAgentsCatalogSchema.parse(catalog);

  assert.equal(
    parsed.source.repository,
    "https://github.com/msitarzewski/agency-agents",
  );
  assert.equal(
    parsed.source.commit,
    "b859c515d813efcfc4755d3471dd9e7686c7706d",
  );
  assert.equal(parsed.source.commit.length, 40);
  assert.equal(
    parsed.source.tree,
    "94d97cfd0c3731995a3b22ae96e2a88a004482a5",
  );
  assert.equal(parsed.source.commitDate, "2026-11-06T01:58:56Z");
  assert.equal(parsed.source.license, "MIT");
  assert.equal(
    parsed.source.licenseBlobSha,
    "523078c01624b9b1b1c551e75054b9d3a9f953ab",
  );
  assert.equal(parsed.source.status, "catalogued-source");
  assert.equal(parsed.divisions.length, 18);
  assert.equal(new Set(parsed.divisions.map((d) => d.id)).size, 18);
  assert.equal(
    parsed.divisions.reduce((sum, d) => sum + d.profileCount, 0),
    283,
  );
  assert.equal(parsed.source.profileCount, 283);

  const typoCatalog = structuredClone(catalog);
  typoCatalog.source.commit = "b859515c813efcfc4755d3471dd9e7686c7706d";
  assert.throws(
    () => AgencyAgentsCatalogSchema.parse(typoCatalog),
    /40-character lowercase hexadecimal Git SHA/,
  );
});

test("4. Mission data integrity: illustrative status, valid unit/division references and rejection of shared-service IDs in capability lists", () => {
  const parsed = MissionsModelSchema.parse(missionsModel);
  assert.equal(parsed.modelStatus, "illustrative");
  assert.equal(parsed.missions.length, 3);

  const learningLaunch = parsed.missions.find(
    (m) => m.id === "mission-learning-product-launch",
  );
  assert.ok(learningLaunch);
  assert.equal(learningLaunch.scenarioStatus, "illustrative");
  assert.equal(learningLaunch.steps.length, 6);
  assert.ok(learningLaunch.sharedServices.includes("legal-risk-compliance"));
  assert.ok(
    !learningLaunch.candidateCapabilityDivisions.includes(
      "legal-risk-compliance",
    ),
  );

  const invalidMissionModel = structuredClone(missionsModel);
  invalidMissionModel.missions[0].candidateCapabilityDivisions.push(
    "legal-risk-compliance",
  );
  assert.throws(
    () =>
      validateCanonicalDomain({
        organizationModel: model,
        agencyCatalog: catalog,
        missionsModel: invalidMissionModel,
        financialModel,
      }),
    /not one of the 18 Agency Agents divisions/,
  );
});

test("5. Deterministic financial calculations: presets, formulas, boundary clamping and negative/NaN rejection", () => {
  const parsedFinance = FinancialScenariosModelSchema.parse(financialModel);
  assert.equal(parsedFinance.modelStatus, "illustrative");
  assert.equal(parsedFinance.presets.length, 4);

  const academyPreset = parsedFinance.presets.find(
    (p) => p.id === "preset-academy-cohort",
  );
  assert.ok(academyPreset);

  const academyResult = calculateScenarioEconomics(
    academyPreset.inputs,
    parsedFinance.bounds,
  );
  assert.equal(academyResult.status, "illustrative");
  assert.equal(academyResult.grossRevenue, 120 * 1200);
  assert.equal(academyResult.directDeliveryCosts, 120 * 350);
  assert.equal(academyResult.contribution, 144000 - 42000);
  assert.equal(academyResult.illustrativeMargin, 102000 - 48000);
  assert.equal(academyResult.netPositionAfterExperiments, 54000 - 12000);
  assert.ok(Math.abs(academyResult.contributionMarginRatio - 102000 / 144000) < 1e-9);

  const venturePreset = parsedFinance.presets.find(
    (p) => p.id === "preset-venture-validation",
  );
  assert.ok(venturePreset);
  const ventureResult = calculateScenarioEconomics(
    venturePreset.inputs,
    parsedFinance.bounds,
  );
  assert.equal(ventureResult.grossRevenue, 0);
  assert.equal(ventureResult.contribution, 0);
  assert.equal(ventureResult.contributionMarginRatio, 0);
  assert.equal(ventureResult.illustrativeMargin, -35000);
  assert.equal(ventureResult.netPositionAfterExperiments, -80000);

  const clamped = clampScenarioInputs(
    {
      customers: -50,
      averageRevenuePerCustomer: 999999,
      directCostPerUnit: Number.NaN,
      allocatedSharedServiceCosts: 25000,
      experimentationBudget: 5000000,
    },
    parsedFinance.bounds,
  );
  assert.equal(clamped.customers, 0);
  assert.equal(
    clamped.averageRevenuePerCustomer,
    parsedFinance.bounds.averageRevenuePerCustomer.max,
  );
  assert.equal(clamped.directCostPerUnit, 0);
  assert.equal(clamped.allocatedSharedServiceCosts, 25000);
  assert.equal(
    clamped.experimentationBudget,
    parsedFinance.bounds.experimentationBudget.max,
  );

  assert.throws(
    () =>
      validateScenarioInputs({
        customers: -1,
        averageRevenuePerCustomer: 100,
        directCostPerUnit: 50,
        allocatedSharedServiceCosts: 1000,
        experimentationBudget: 0,
      }),
    /Negative value is not allowed/,
  );
});

test("6. Human approval gates: every mission step enforces a typed humanGate across legal, financial, security, client, strategy and launch", () => {
  const parsed = MissionsModelSchema.parse(missionsModel);
  const gateIds = new Set();
  const observedCategories = new Set();

  for (const mission of parsed.missions) {
    for (const step of mission.steps) {
      assert.ok(step.humanGate, `Missing humanGate on ${mission.id}:${step.id}`);
      assert.ok(
        !gateIds.has(step.humanGate.id),
        `Duplicate humanGate id ${step.humanGate.id}`,
      );
      gateIds.add(step.humanGate.id);
      observedCategories.add(step.humanGate.category);
      assert.ok(step.humanGate.requiredRole.length >= 3);
      assert.ok(step.humanGate.description.length >= 15);
    }
  }

  for (const requiredCategory of [
    "strategy",
    "legal",
    "financial",
    "client",
    "security",
    "launch",
  ]) {
    assert.ok(
      observedCategories.has(requiredCategory),
      `Expected human approval gate coverage for category '${requiredCategory}'`,
    );
  }
});

test("7. Design tokens schema integrity", () => {
  const parsed = DesignTokensSchema.parse(designTokens);
  assert.equal(parsed.colors.abyss, "#07111F");
  assert.equal(parsed.colors.accentCyan, "#67E8D2");
  assert.equal(parsed.layout.gridColumns, 12);
});
