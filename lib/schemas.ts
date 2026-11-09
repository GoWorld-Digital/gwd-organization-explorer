import { z } from "zod";

export const HexSha40Schema = z
  .string()
  .regex(/^[0-9a-f]{40}$/, "Expected a verified 40-character lowercase hexadecimal Git SHA");

export const UnitStatusSchema = z.enum(["proposed", "design-principle"]);

export const UnitKindSchema = z.enum([
  "governance",
  "advisory",
  "executive",
  "coordination",
  "shared-service",
  "business-unit",
  "venture-studio",
  "lab",
]);

export const EconomicTypeSchema = z.enum([
  "cost-centre",
  "cost-centre-or-allocated-service",
  "profit-centre-candidate",
  "investment-centre-candidate",
  "innovation-cost-centre-candidate",
]);

export const MaturityStageSchema = z.enum([
  "hypothesis",
  "research",
  "prototype",
  "validation",
  "venture-proposal",
]);

export const UnitSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  status: UnitStatusSchema.optional(),
  kind: UnitKindSchema,
  mandate: z.string().min(15),
  economicType: EconomicTypeSchema.optional(),
  maturityStage: MaturityStageSchema.optional(),
  note: z.string().min(1).optional(),
  candidateCapabilityDivisions: z.array(z.string().min(1)).min(1),
});

export const LayerIdSchema = z.enum([
  "governance",
  "executive",
  "shared-services",
  "business-units",
  "labs-innovation",
]);

export const LayerSchema = z.object({
  id: LayerIdSchema,
  label: z.string().min(1),
  rank: z.number().int().min(1).max(5),
  status: z.literal("proposed"),
  purpose: z.string().min(10),
  units: z.array(UnitSchema).min(1),
});

export const RelationshipTypeSchema = z.enum([
  "reports_to",
  "advises",
  "provides_service_to",
]);

export const RelationshipSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  type: RelationshipTypeSchema,
  status: z.literal("proposed"),
  rationale: z.string().min(10),
});

export const CapabilityMappingSchema = z.object({
  id: z.string().min(1),
  divisionId: z.string().min(1),
  unitId: z.string().min(1),
  type: z.literal("capability_supports"),
  status: z.literal("catalogued"),
  rationale: z.string().min(10),
});

export const DiscrepancyNoteSchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  activeBranchModel: z.string().min(1),
  alternativeSeedModel: z.string().min(1),
  resolution: z.string().min(1),
});

export const OrganizationModelSchema = z
  .object({
    schemaVersion: z.string().min(1),
    organization: z.object({
      id: z.literal("gwd"),
      name: z.literal("GoWorld Digital"),
      shortName: z.literal("GWD"),
      modelStatus: z.literal("proposed"),
      asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      publicDomain: z.literal("explore.goworld.digital"),
      disclaimer: z.string().min(20),
    }),
    layers: z.array(LayerSchema).length(5),
    relationships: z.array(RelationshipSchema).min(20),
    capabilityMappings: z.array(CapabilityMappingSchema).min(18),
    discrepancyNotes: z.array(DiscrepancyNoteSchema).min(1),
    economicModelDisclaimer: z.string().min(20),
  })
  .superRefine((model, ctx) => {
    const expectedOrder = [
      "governance",
      "executive",
      "shared-services",
      "business-units",
      "labs-innovation",
    ] as const;

    const unitMap = new Map<string, { unit: z.infer<typeof UnitSchema>; layerId: string }>();

    model.layers.forEach((layer, idx) => {
      if (layer.id !== expectedOrder[idx]) {
        ctx.addIssue({
          code: "custom",
          path: ["layers", idx, "id"],
          message: `Expected layer ${idx + 1} to be ${expectedOrder[idx]}, got ${layer.id}`,
        });
      }
      if (layer.rank !== idx + 1) {
        ctx.addIssue({
          code: "custom",
          path: ["layers", idx, "rank"],
          message: `Expected layer rank ${idx + 1}, got ${layer.rank}`,
        });
      }

      for (const unit of layer.units) {
        if (unitMap.has(unit.id)) {
          ctx.addIssue({
            code: "custom",
            path: ["layers", idx, "units"],
            message: `Duplicate unit id: ${unit.id}`,
          });
        }
        unitMap.set(unit.id, { unit, layerId: layer.id });

        if (
          (layer.id === "labs-innovation" || unit.kind === "venture-studio") &&
          !unit.maturityStage
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["layers", idx, "units"],
            message: `Lab or Venture unit ${unit.id} must declare an explicit maturityStage`,
          });
        }
      }
    });

    const relIds = new Set<string>();
    const reportingSources = new Set<string>();

    for (const rel of model.relationships) {
      if (relIds.has(rel.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["relationships"],
          message: `Duplicate relationship id: ${rel.id}`,
        });
      }
      relIds.add(rel.id);

      if (rel.from === rel.to) {
        ctx.addIssue({
          code: "custom",
          path: ["relationships"],
          message: `Self-referential relationship not allowed: ${rel.id}`,
        });
      }

      const fromEntry = unitMap.get(rel.from);
      const toEntry = unitMap.get(rel.to);

      if (!fromEntry) {
        ctx.addIssue({
          code: "custom",
          path: ["relationships"],
          message: `Relationship ${rel.id} references unknown source unit ${rel.from}`,
        });
      }
      if (!toEntry) {
        ctx.addIssue({
          code: "custom",
          path: ["relationships"],
          message: `Relationship ${rel.id} references unknown target unit ${rel.to}`,
        });
      }

      if (fromEntry && toEntry) {
        if (rel.type === "advises" && fromEntry.unit.kind !== "advisory") {
          ctx.addIssue({
            code: "custom",
            path: ["relationships"],
            message: `Relationship ${rel.id} of type 'advises' must originate from an advisory unit`,
          });
        }
        if (
          rel.type === "provides_service_to" &&
          fromEntry.layerId !== "shared-services"
        ) {
          ctx.addIssue({
            code: "custom",
            path: ["relationships"],
            message: `Relationship ${rel.id} of type 'provides_service_to' must originate from a shared-services unit`,
          });
        }
        if (rel.type === "reports_to") {
          reportingSources.add(rel.from);
        }
      }
    }

    for (const [unitId, entry] of unitMap.entries()) {
      if (entry.layerId !== "governance" && !reportingSources.has(unitId)) {
        ctx.addIssue({
          code: "custom",
          path: ["relationships"],
          message: `Non-governance unit ${unitId} must have at least one reports_to relationship`,
        });
      }
    }
  });

export const AgencyDivisionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  profileCount: z.number().int().positive(),
  status: z.literal("catalogued"),
  summary: z.string().min(15),
  candidateUnits: z.array(z.string().min(1)).min(1),
});

export const AgencyAgentsCatalogSchema = z
  .object({
    schemaVersion: z.string().min(1),
    source: z.object({
      repository: z.literal("https://github.com/msitarzewski/agency-agents"),
      commit: HexSha40Schema,
      tree: HexSha40Schema,
      commitDate: z.string().datetime(),
      snapshotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      verificationStatus: z.literal("verified-upstream-snapshot"),
      license: z.literal("MIT"),
      licenseFile: z.literal("LICENSE"),
      licenseBlobSha: HexSha40Schema,
      licenseNotice: z.string().min(20),
      profileCount: z.literal(283),
      divisionCount: z.literal(18),
      excludedDirectories: z.array(z.string().min(1)).min(1),
      status: z.literal("catalogued-source"),
      disclaimer: z.string().min(20),
    }),
    divisions: z.array(AgencyDivisionSchema).length(18),
  })
  .superRefine((catalog, ctx) => {
    const ids = new Set<string>();
    let sum = 0;
    for (const div of catalog.divisions) {
      if (ids.has(div.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["divisions"],
          message: `Duplicate division id: ${div.id}`,
        });
      }
      ids.add(div.id);
      sum += div.profileCount;
    }
    if (sum !== catalog.source.profileCount) {
      ctx.addIssue({
        code: "custom",
        path: ["divisions"],
        message: `Division profile counts sum to ${sum}, expected ${catalog.source.profileCount}`,
      });
    }
  });

export const HumanGateCategorySchema = z.enum([
  "strategy",
  "legal",
  "financial",
  "client",
  "security",
  "launch",
]);

export const HumanGateSchema = z.object({
  id: z.string().min(1),
  category: HumanGateCategorySchema,
  requiredRole: z.string().min(3),
  description: z.string().min(15),
});

export const MissionStageSchema = z.enum([
  "STRATEGY",
  "BUILD",
  "GROW",
  "CONTROL",
]);

export const MissionStepSchema = z.object({
  id: z.string().min(1),
  order: z.number().int().positive(),
  stage: MissionStageSchema,
  title: z.string().min(5),
  ownerUnit: z.string().min(1),
  supportUnits: z.array(z.string().min(1)).min(1),
  candidateDivisions: z.array(z.string().min(1)).min(1),
  humanGate: HumanGateSchema,
});

export const MissionScenarioSchema = z.object({
  id: z.string().min(1),
  code: z.string().min(1),
  shortLabel: z.string().min(1),
  title: z.string().min(10),
  scenarioStatus: z.literal("illustrative"),
  badge: z.string().includes("Illustrative"),
  objective: z.string().min(20),
  assumptions: z.array(z.string().min(10)).min(2),
  exclusions: z.array(z.string().min(10)).min(1),
  leadUnit: z.string().min(1),
  participatingUnits: z.array(z.string().min(1)).min(1),
  sharedServices: z.array(z.string().min(1)).min(1),
  candidateCapabilityDivisions: z.array(z.string().min(1)).min(1),
  financialPresetId: z.string().min(1),
  steps: z.array(MissionStepSchema).min(4),
});

export const MissionsModelSchema = z.object({
  schemaVersion: z.string().min(1),
  modelStatus: z.literal("illustrative"),
  badge: z.string().includes("Illustrative"),
  disclaimer: z.string().min(20),
  missions: z.array(MissionScenarioSchema).min(1),
});

export const BoundRangeSchema = z.object({
  min: z.number().min(0),
  max: z.number().positive(),
  step: z.number().positive(),
});

export const FinancialInputsSchema = z.object({
  customers: z.number().min(0),
  averageRevenuePerCustomer: z.number().min(0),
  directCostPerUnit: z.number().min(0),
  allocatedSharedServiceCosts: z.number().min(0),
  experimentationBudget: z.number().min(0),
});

export const FinancialPresetSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(10),
  unitId: z.string().min(1),
  centreType: z.enum([
    "cost-centre",
    "profit-centre-candidate",
    "investment-centre-candidate",
  ]),
  scenarioStatus: z.literal("illustrative"),
  currency: z.literal("USD"),
  period: z.string().min(5),
  description: z.string().min(20),
  inputs: FinancialInputsSchema,
  allocatedSharedServices: z.array(z.string().min(1)).min(1),
  exclusions: z.array(z.string().min(10)).min(1),
});

export const FinancialScenariosModelSchema = z.object({
  schemaVersion: z.string().min(1),
  modelStatus: z.literal("illustrative"),
  badge: z.string().includes("Illustrative"),
  disclaimer: z.string().min(20),
  currency: z.literal("USD"),
  defaultPeriod: z.string().min(5),
  formulas: z.object({
    grossRevenue: z.string().min(5),
    directDeliveryCosts: z.string().min(5),
    contribution: z.string().min(5),
    illustrativeMargin: z.string().min(5),
    netPositionAfterExperiments: z.string().min(5),
  }),
  bounds: z.object({
    customers: BoundRangeSchema,
    averageRevenuePerCustomer: BoundRangeSchema,
    directCostPerUnit: BoundRangeSchema,
    allocatedSharedServiceCosts: BoundRangeSchema,
    experimentationBudget: BoundRangeSchema,
  }),
  centreDefinitions: z
    .array(
      z.object({
        id: z.enum([
          "cost-centre",
          "profit-centre-candidate",
          "investment-centre-candidate",
        ]),
        label: z.string().min(1),
        status: z.literal("proposed"),
        description: z.string().min(20),
      }),
    )
    .length(3),
  presets: z.array(FinancialPresetSchema).min(1),
});

export const DesignTokensSchema = z.object({
  schemaVersion: z.string().min(1),
  name: z.string().min(1),
  colors: z.record(z.string(), z.string().regex(/^#[0-9A-Fa-f]{6}$/)),
  typography: z.object({
    sans: z.string().min(1),
    mono: z.string().min(1),
  }),
  motion: z.object({
    microMs: z.number().int().positive(),
    panelMs: z.number().int().positive(),
    focusMs: z.number().int().positive(),
    cameraFlightSec: z.number().positive(),
    reducedMotionPolicy: z.string().min(1),
  }),
  layout: z.object({
    maxWidthPx: z.number().int().positive(),
    spatialBreakpointPx: z.number().int().positive(),
    gridColumns: z.number().int().positive(),
  }),
});

export function validateCanonicalDomain(input: {
  organizationModel: unknown;
  agencyCatalog: unknown;
  missionsModel: unknown;
  financialModel: unknown;
  designTokens?: unknown;
}) {
  const organization = OrganizationModelSchema.parse(input.organizationModel);
  const catalog = AgencyAgentsCatalogSchema.parse(input.agencyCatalog);
  const missions = MissionsModelSchema.parse(input.missionsModel);
  const finance = FinancialScenariosModelSchema.parse(input.financialModel);
  const tokens = input.designTokens
    ? DesignTokensSchema.parse(input.designTokens)
    : undefined;

  const unitIds = new Set<string>();
  const sharedServiceIds = new Set<string>();
  for (const layer of organization.layers) {
    for (const unit of layer.units) {
      unitIds.add(unit.id);
      if (layer.id === "shared-services") {
        sharedServiceIds.add(unit.id);
      }
    }
  }

  const divisionIds = new Set(catalog.divisions.map((d) => d.id));
  const presetIds = new Set(finance.presets.map((p) => p.id));

  for (const layer of organization.layers) {
    for (const unit of layer.units) {
      for (const divId of unit.candidateCapabilityDivisions) {
        if (!divisionIds.has(divId)) {
          throw new Error(
            `Unit ${unit.id} references unknown Agency Agents division '${divId}'`,
          );
        }
      }
    }
  }

  for (const div of catalog.divisions) {
    for (const uId of div.candidateUnits) {
      if (!unitIds.has(uId)) {
        throw new Error(
          `Division ${div.id} references unknown GWD unit '${uId}'`,
        );
      }
    }
  }

  for (const mapping of organization.capabilityMappings) {
    if (!divisionIds.has(mapping.divisionId)) {
      throw new Error(
        `Capability mapping ${mapping.id} references unknown division '${mapping.divisionId}'`,
      );
    }
    if (!unitIds.has(mapping.unitId)) {
      throw new Error(
        `Capability mapping ${mapping.id} references unknown unit '${mapping.unitId}'`,
      );
    }
  }

  for (const mission of missions.missions) {
    if (!unitIds.has(mission.leadUnit)) {
      throw new Error(
        `Mission ${mission.id} leadUnit '${mission.leadUnit}' is not a valid GWD unit`,
      );
    }
    for (const uId of mission.participatingUnits) {
      if (!unitIds.has(uId)) {
        throw new Error(
          `Mission ${mission.id} participatingUnit '${uId}' is not a valid GWD unit`,
        );
      }
    }
    for (const sId of mission.sharedServices) {
      if (!sharedServiceIds.has(sId)) {
        throw new Error(
          `Mission ${mission.id} sharedService '${sId}' is not a valid Layer 3 shared-services unit`,
        );
      }
    }
    for (const divId of mission.candidateCapabilityDivisions) {
      if (!divisionIds.has(divId)) {
        throw new Error(
          `Mission ${mission.id} candidateCapabilityDivision '${divId}' is not one of the 18 Agency Agents divisions`,
        );
      }
    }
    if (!presetIds.has(mission.financialPresetId)) {
      throw new Error(
        `Mission ${mission.id} financialPresetId '${mission.financialPresetId}' does not exist in financial presets`,
      );
    }

    mission.steps.forEach((step, idx) => {
      if (step.order !== idx + 1) {
        throw new Error(
          `Mission ${mission.id} step ${step.id} has out-of-sequence order ${step.order} (expected ${idx + 1})`,
        );
      }
      if (!unitIds.has(step.ownerUnit)) {
        throw new Error(
          `Mission ${mission.id} step ${step.id} ownerUnit '${step.ownerUnit}' is not a valid GWD unit`,
        );
      }
      for (const supId of step.supportUnits) {
        if (!unitIds.has(supId)) {
          throw new Error(
            `Mission ${mission.id} step ${step.id} supportUnit '${supId}' is not a valid GWD unit`,
          );
        }
      }
      for (const divId of step.candidateDivisions) {
        if (!divisionIds.has(divId)) {
          throw new Error(
            `Mission ${mission.id} step ${step.id} candidateDivision '${divId}' is not a valid Agency Agents division`,
          );
        }
      }
    });
  }

  for (const preset of finance.presets) {
    if (!unitIds.has(preset.unitId)) {
      throw new Error(
        `Financial preset ${preset.id} references unknown GWD unit '${preset.unitId}'`,
      );
    }
    for (const sId of preset.allocatedSharedServices) {
      if (!sharedServiceIds.has(sId)) {
        throw new Error(
          `Financial preset ${preset.id} allocatedSharedService '${sId}' is not a Layer 3 shared service`,
        );
      }
    }
  }

  return { organization, catalog, missions, finance, tokens };
}
