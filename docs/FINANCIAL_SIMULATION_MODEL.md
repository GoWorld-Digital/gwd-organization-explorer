# Financial and Operating Model Simulator

## Purpose and disclaimer
Illustrate how an AI-Native organization might allocate shared costs and measure unit economics. This is a deterministic demonstration, not GWD accounting, forecast, investment projection or financial advice.

## Centre types
- Cost centre: shared capabilities such as platform, security, governance, finance and central research.
- Profit centre: product/service unit with its own attributable revenue, direct costs and margin, only after real offers and accountability exist.
- Investment centre: time-boxed portfolio of experiments; track hypothetical allocation, milestones and outcomes, never fictional return/valuation as fact.

## V1 scenarios
Every sample scenario must show currency, period, volume, average ticket, direct delivery costs, allocated shared-service costs, exclusions, formulas and an explicit “Illustrative scenario / assumptions” label.

Example formulas:
`grossRevenue = customers × averageRevenuePerCustomer`
`contribution = grossRevenue − directDeliveryCosts`
`illustrativeMargin = contribution − allocatedSharedServiceCosts`

## Controls
Bounded inputs: customer/participant volume, average ticket, direct cost/unit, shared-service allocation and hypothetical experimentation budget. Calculations are local and deterministic. Unit tests cover zero, boundary and invalid values.

## Presentation rules
Never label simulated values “GWD revenue”, “GWD profit” or “GWD valuation”. No promised return, tax claims, fundraising offer or regulated investment product. Every result is explicitly illustrative.
