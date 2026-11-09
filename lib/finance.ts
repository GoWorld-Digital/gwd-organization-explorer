export type ScenarioBounds = {
  customers: { min: number; max: number; step: number };
  averageRevenuePerCustomer: { min: number; max: number; step: number };
  directCostPerUnit: { min: number; max: number; step: number };
  allocatedSharedServiceCosts: { min: number; max: number; step: number };
  experimentationBudget: { min: number; max: number; step: number };
};

export type ScenarioInputs = {
  customers: number;
  averageRevenuePerCustomer: number;
  directCostPerUnit: number;
  allocatedSharedServiceCosts: number;
  experimentationBudget: number;
};

export type ScenarioCalculationResult = {
  status: "illustrative";
  disclaimer: string;
  inputs: ScenarioInputs;
  grossRevenue: number;
  directDeliveryCosts: number;
  contribution: number;
  illustrativeMargin: number;
  netPositionAfterExperiments: number;
  contributionMarginRatio: number;
};

const DEFAULT_DISCLAIMER =
  "Illustrative scenario / assumptions — not actual GWD revenue, cost, profit or forecast.";

function clampField(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

export function clampScenarioInputs(
  inputs: ScenarioInputs,
  bounds: ScenarioBounds,
): ScenarioInputs {
  return {
    customers: Math.round(
      clampField(inputs.customers, bounds.customers.min, bounds.customers.max),
    ),
    averageRevenuePerCustomer: clampField(
      inputs.averageRevenuePerCustomer,
      bounds.averageRevenuePerCustomer.min,
      bounds.averageRevenuePerCustomer.max,
    ),
    directCostPerUnit: clampField(
      inputs.directCostPerUnit,
      bounds.directCostPerUnit.min,
      bounds.directCostPerUnit.max,
    ),
    allocatedSharedServiceCosts: clampField(
      inputs.allocatedSharedServiceCosts,
      bounds.allocatedSharedServiceCosts.min,
      bounds.allocatedSharedServiceCosts.max,
    ),
    experimentationBudget: clampField(
      inputs.experimentationBudget,
      bounds.experimentationBudget.min,
      bounds.experimentationBudget.max,
    ),
  };
}

export function validateScenarioInputs(
  inputs: ScenarioInputs,
  bounds?: ScenarioBounds,
): void {
  const entries = Object.entries(inputs) as [keyof ScenarioInputs, number][];
  for (const [key, value] of entries) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new RangeError(`Invalid non-finite number for ${key}`);
    }
    if (value < 0) {
      throw new RangeError(`Negative value is not allowed for ${key}: ${value}`);
    }
    if (bounds) {
      const range = bounds[key];
      if (value < range.min || value > range.max) {
        throw new RangeError(
          `Value for ${key} (${value}) is outside bounds [${range.min}, ${range.max}]`,
        );
      }
    }
  }
}

export function calculateScenarioEconomics(
  inputs: ScenarioInputs,
  bounds?: ScenarioBounds,
): ScenarioCalculationResult {
  validateScenarioInputs(inputs, bounds);

  const grossRevenue = inputs.customers * inputs.averageRevenuePerCustomer;
  const directDeliveryCosts = inputs.customers * inputs.directCostPerUnit;
  const contribution = grossRevenue - directDeliveryCosts;
  const illustrativeMargin = contribution - inputs.allocatedSharedServiceCosts;
  const netPositionAfterExperiments =
    illustrativeMargin - inputs.experimentationBudget;
  const contributionMarginRatio =
    grossRevenue > 0 ? contribution / grossRevenue : 0;

  return {
    status: "illustrative",
    disclaimer: DEFAULT_DISCLAIMER,
    inputs: { ...inputs },
    grossRevenue,
    directDeliveryCosts,
    contribution,
    illustrativeMargin,
    netPositionAfterExperiments,
    contributionMarginRatio,
  };
}
