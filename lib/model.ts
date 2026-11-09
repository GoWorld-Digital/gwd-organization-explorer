import rawModel from "../content/organization/organization-model.json";
import rawCatalog from "../content/agency-agents/divisions.json";
import rawMissions from "../content/missions/missions-model.json";
import rawFinance from "../content/finance/scenarios-model.json";
import rawTokens from "../design/tokens.json";
import rawTerritories from "../content/organization/territories-model.json";
import rawKnowledgeGalaxy from "../content/knowledge/knowledge-galaxy.json";
import { validateCanonicalDomain } from "./schemas";
import {
  calculateScenarioEconomics,
  clampScenarioInputs,
  validateScenarioInputs,
} from "./finance";

const validated = validateCanonicalDomain({
  organizationModel: rawModel,
  agencyCatalog: rawCatalog,
  missionsModel: rawMissions,
  financialModel: rawFinance,
  designTokens: rawTokens,
  territoriesModel: rawTerritories,
  knowledgeGalaxyModel: rawKnowledgeGalaxy,
});

export type Unit = (typeof validated.organization.layers)[number]["units"][number];
export type Layer = (typeof validated.organization.layers)[number];
export type Relationship = (typeof validated.organization.relationships)[number];
export type CapabilityMapping =
  (typeof validated.organization.capabilityMappings)[number];
export type DiscrepancyNote =
  (typeof validated.organization.discrepancyNotes)[number];
export type AgencyDivision = (typeof validated.catalog.divisions)[number];
export type MissionScenario = (typeof validated.missions.missions)[number];
export type FinancialPreset = (typeof validated.finance.presets)[number];
export type Territory =
  NonNullable<typeof validated.territories>["territories"][number];
export type TerritoryId = Territory["id"];
export type GenesisAct =
  NonNullable<typeof validated.territories>["genesisFilm"]["acts"][number];
export type PulseState =
  NonNullable<typeof validated.territories>["pulseModel"]["states"][number];
export type PulseEvent =
  NonNullable<typeof validated.territories>["pulseModel"]["events"][number];
export type KnowledgePillar =
  NonNullable<typeof validated.knowledgeGalaxy>["corePillars"][number];
export type KnowledgeLink =
  NonNullable<typeof validated.knowledgeGalaxy>["links"][number];

export const organizationMeta = validated.organization.organization;
export const layers: Layer[] = validated.organization.layers;
export const relationships: Relationship[] = validated.organization.relationships;
export const capabilityMappings: CapabilityMapping[] =
  validated.organization.capabilityMappings;
export const discrepancyNotes: DiscrepancyNote[] =
  validated.organization.discrepancyNotes;
export const { source, divisions } = validated.catalog;
export const missionsModel = validated.missions;
export const missions: MissionScenario[] = validated.missions.missions;
export const financialModel = validated.finance;
export const financialPresets: FinancialPreset[] = validated.finance.presets;
export const designTokens = validated.tokens!;
export const territoriesModel = validated.territories!;
export const territories: Territory[] = validated.territories!.territories;
export const genesisFilm = validated.territories!.genesisFilm;
export const pulseModel = validated.territories!.pulseModel;
export const knowledgeGalaxyModel = validated.knowledgeGalaxy!;
export const knowledgePillars: KnowledgePillar[] =
  validated.knowledgeGalaxy!.corePillars;
export const knowledgeLinks: KnowledgeLink[] = validated.knowledgeGalaxy!.links;

export const formatStatus = (status: string) => status.replaceAll("-", " ");
export const yFor = (index: number) => (2 - index) * 1.13;

export function getUnitById(unitId: string): { unit: Unit; layer: Layer } | null {
  for (const layer of layers) {
    const found = layer.units.find((u) => u.id === unitId);
    if (found) return { unit: found, layer };
  }
  return null;
}

export function getTerritoryById(territoryId: string): Territory | null {
  return territories.find((t) => t.id === territoryId) ?? null;
}

export function getRelationshipsForUnit(unitId: string): Relationship[] {
  return relationships.filter((r) => r.from === unitId || r.to === unitId);
}

export function getDivisionsForUnit(unitId: string): AgencyDivision[] {
  const entry = getUnitById(unitId);
  if (!entry) return [];
  const allowed = new Set(entry.unit.candidateCapabilityDivisions);
  return divisions.filter((d) => allowed.has(d.id));
}

export {
  calculateScenarioEconomics,
  clampScenarioInputs,
  validateScenarioInputs,
};
