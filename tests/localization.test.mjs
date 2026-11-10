import test from 'node:test';
import assert from 'node:assert/strict';
import { translate, normalizeSearch } from '../lib/translations.ts';
import organization from '../content/organization/organization-model.json' with { type: 'json' };
import catalog from '../content/agency-agents/divisions.json' with { type: 'json' };
import missions from '../content/missions/missions-model.json' with { type: 'json' };
import finance from '../content/finance/scenarios-model.json' with { type: 'json' };

test('PT and FR cover organization mandates, relationships, source summaries and analytical scenarios', () => {
  const strings = organization.layers.flatMap(layer => [layer.label, layer.purpose, ...layer.units.flatMap(unit => [unit.mandate, ...(unit.note ? [unit.note] : [])])]);
  strings.push(...organization.relationships.map(r => r.rationale));
  strings.push(...catalog.divisions.flatMap(d => [d.summary]));
  strings.push(...missions.missions.flatMap(m => [m.title, m.objective, m.badge, ...m.assumptions, ...m.exclusions, ...m.steps.flatMap(s => [s.title, s.humanGate.requiredRole, s.humanGate.description])]));
  strings.push(finance.disclaimer, finance.badge, ...finance.presets.flatMap(p => [p.title, p.description, p.period, ...p.exclusions]));
  for (const locale of ['pt', 'fr']) for (const text of strings) assert.notEqual(translate(text, locale), text, `${locale} missing: ${text}`);
});

test('All languages preserve brands, IDs, provenance, values and equations', () => {
  for (const locale of ['en', 'pt', 'fr']) for (const text of ['GoWorld', 'GoWorld.Digital', 'GWD', 'Genesis', 'Diana', 'Agency Agents', 'GWD Academy', catalog.source.commit, 'USD', 'customers * averageRevenuePerCustomer', '144000', 'ai-platform-engineering']) assert.equal(translate(text, locale), text);
  assert.equal(translate('Governance', 'en'), 'Governance');
  assert.equal(normalizeSearch('Gouvernance · Governança'), 'gouvernance · governanca');
});
