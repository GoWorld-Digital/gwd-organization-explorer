import test from "node:test";
import assert from "node:assert/strict";
import model from "../content/organization/organization-model.json" with { type: "json" };
import catalog from "../content/agency-agents/divisions.json" with { type: "json" };
test("Canonical five layers preserve order, identities and explicit or inherited truth labels", () => {
  assert.deepEqual(
    model.layers.map((l) => l.id),
    [
      "governance",
      "executive",
      "shared-services",
      "business-units",
      "labs-innovation",
    ],
  );
  const ids = new Set();
  model.layers.forEach((layer, i) => {
    assert.equal(layer.rank, i + 1);
    assert.equal(layer.status, "proposed");
    assert.ok(layer.purpose);
    for (const unit of layer.units) {
      assert.ok(!ids.has(unit.id));
      ids.add(unit.id);
      assert.ok(
        ["proposed", "design-principle"].includes(unit.status ?? layer.status),
      );
    }
  });
  assert.equal(
    model.layers[3].units.filter(
      (u) => u.economicType === "profit-centre-candidate",
    ).length,
    3,
  );
});
test("Recorded capability inventory reconciles with the attributed upstream snapshot", () => {
  assert.equal(new Set(catalog.divisions.map((d) => d.id)).size, 18);
  assert.equal(catalog.divisions.length, catalog.source.divisionCount);
  assert.equal(
    catalog.divisions.reduce((sum, d) => sum + d.profileCount, 0),
    283,
  );
  assert.equal(catalog.source.profileCount, 283);
  assert.equal(catalog.source.status, "catalogued-source");
  assert.equal(
    catalog.source.commit,
    "b859515c813efcfc4755d3471dd9e7686c7706d",
  );
});
