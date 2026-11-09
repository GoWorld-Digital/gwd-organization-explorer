"use client";
import { useMemo, useState } from "react";
import {
  capabilityMappings,
  divisions,
  formatStatus,
  getUnitById,
  knowledgeGalaxyModel,
  knowledgeLinks,
  knowledgePillars,
  source,
  type KnowledgePillar,
} from "../lib/model";

type GalaxySubTab = "all" | "agents" | "memory" | "obsidian" | "gbrain";

type Props = {
  catalogQuery: string;
  setCatalogQuery: (q: string) => void;
  catalogLayerFilter: string;
  setCatalogLayerFilter: (f: string) => void;
  focusedDivisionId: string;
  setFocusedDivisionId: (id: string) => void;
  onJumpToUnit: (unitId: string) => void;
  onTriggerPulse: () => void;
};

const PILLAR_COORDS: Record<string, { x: number; y: number }> = {
  "pillar-gbrain": { x: 480, y: 215 },
  "pillar-knowledge-hub": { x: 325, y: 135 },
  "pillar-obsidian-vault": { x: 295, y: 275 },
  "pillar-knowledge-graph": { x: 635, y: 135 },
  "pillar-working-memory": { x: 665, y: 275 },
  "pillar-persistent-memory": { x: 545, y: 330 },
  "pillar-smart-retrieval": { x: 480, y: 98 },
  "pillar-agent-identity": { x: 415, y: 330 },
};

export default function KnowledgeGalaxyView({
  catalogQuery,
  setCatalogQuery,
  catalogLayerFilter,
  setCatalogLayerFilter,
  focusedDivisionId,
  setFocusedDivisionId,
  onJumpToUnit,
  onTriggerPulse,
}: Props) {
  const [subTab, setSubTab] = useState<GalaxySubTab>("all");
  const [selectedPillarId, setSelectedPillarId] =
    useState<string>("pillar-gbrain");

  const selectedPillar: KnowledgePillar =
    knowledgePillars.find((p) => p.id === selectedPillarId) ??
    knowledgePillars[0];

  const visiblePillars = useMemo(() => {
    if (subTab === "obsidian") {
      return knowledgePillars.filter((p) =>
        [
          "pillar-obsidian-vault",
          "pillar-knowledge-hub",
          "pillar-knowledge-graph",
        ].includes(p.id),
      );
    }
    if (subTab === "gbrain") {
      return knowledgePillars.filter((p) =>
        [
          "pillar-gbrain",
          "pillar-knowledge-graph",
          "pillar-smart-retrieval",
          "pillar-persistent-memory",
        ].includes(p.id),
      );
    }
    if (subTab === "memory") {
      return knowledgePillars.filter((p) =>
        [
          "pillar-working-memory",
          "pillar-persistent-memory",
          "pillar-smart-retrieval",
          "pillar-gbrain",
        ].includes(p.id),
      );
    }
    return knowledgePillars;
  }, [subTab]);

  const filteredDivisions = useMemo(() => {
    const q = catalogQuery.trim().toLowerCase();
    return divisions.filter((d) => {
      const matchesQuery =
        !q ||
        d.label.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.candidateUnits.some((u) => u.toLowerCase().includes(q));
      if (!matchesQuery) return false;
      if (catalogLayerFilter === "all") return true;
      return d.candidateUnits.some((uId) => {
        const entry = getUnitById(uId);
        return entry?.layer.id === catalogLayerFilter;
      });
    });
  }, [catalogQuery, catalogLayerFilter]);

  const focusedDivision =
    divisions.find((d) => d.id === focusedDivisionId) ?? divisions[0];
  const focusedDivisionMappings = useMemo(
    () =>
      capabilityMappings.filter((m) => m.divisionId === focusedDivision.id),
    [focusedDivision.id],
  );

  return (
    <section
      className="catalog galaxy-experience"
      aria-label="Agency Agents Explorer and Knowledge Galaxy"
    >
      {/* Screen C — Knowledge Galaxy Header & Sub-Navigation */}
      <div className="galaxy-topbar">
        <div>
          <span className="eyebrow">
            TERRITORY 02 · THE INTELLIGENCE &amp; KNOWLEDGE GALAXY
          </span>
          <h2>{knowledgeGalaxyModel.title}</h2>
          <p>{knowledgeGalaxyModel.subtitle}</p>
        </div>
        <div
          className="galaxy-subtabs"
          role="group"
          aria-label="Knowledge Galaxy lenses"
        >
          {[
            ["all", "Knowledge Galaxy"],
            ["agents", `Agents (${divisions.length} / ${source.profileCount})`],
            ["memory", "Memory & Retrieval"],
            ["obsidian", "Obsidian Vault"],
            ["gbrain", "GBrain"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={"galaxy-tab-btn" + (subTab === id ? " active" : "")}
              aria-pressed={subTab === id}
              onClick={() => {
                setSubTab(id as GalaxySubTab);
                if (id === "obsidian")
                  setSelectedPillarId("pillar-obsidian-vault");
                if (id === "gbrain") setSelectedPillarId("pillar-gbrain");
                if (id === "memory")
                  setSelectedPillarId("pillar-working-memory");
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Truth & Provenance Banner */}
      <div className="truth-banner">
        <span className="badge badge-warn">
          Proposed Knowledge Architecture · Catalogued Source Profiles
        </span>
        <span>{knowledgeGalaxyModel.disclaimer}</span>
      </div>

      {/* Interactive Spiral Knowledge Galaxy Map + Selected Pillar Dossier */}
      <div className="galaxy-stage-grid">
        <div
          className="galaxy-constellation-panel"
          aria-label="Interactive Knowledge Galaxy Constellation"
        >
          <div className="galaxy-panel-head">
            <span className="eyebrow">
              SPIRAL CONSTELLATION · 8 KNOWLEDGE PILLARS &amp; 18 CAPABILITY
              CLUSTERS
            </span>
            <button
              type="button"
              className="pill-action"
              onClick={onTriggerPulse}
            >
              ✦ Pulse Knowledge Signal
            </button>
          </div>

          <svg
            viewBox="0 0 960 430"
            className="galaxy-svg"
            role="img"
            aria-label="Knowledge Galaxy Graph connecting GBrain, Knowledge Hub, Obsidian Vault, Knowledge Graph, Working Memory, Persistent Memory and 18 capability divisions"
          >
            <defs>
              <radialGradient id="gbrainCore" cx="50%" cy="50%" r="48%">
                <stop offset="0%" stopColor="#fff4d1" stopOpacity="0.95" />
                <stop offset="28%" stopColor="#d9a64a" stopOpacity="0.65" />
                <stop offset="68%" stopColor="#168dff" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#050811" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Spiral Galaxy Arms */}
            <ellipse
              cx="480"
              cy="215"
              rx="330"
              ry="155"
              fill="url(#gbrainCore)"
            />
            <ellipse
              cx="480"
              cy="215"
              rx="315"
              ry="148"
              fill="none"
              stroke="#168dff"
              strokeOpacity="0.32"
              strokeDasharray="6 6"
            />
            <ellipse
              cx="480"
              cy="215"
              rx="220"
              ry="104"
              fill="none"
              stroke="#55d9e8"
              strokeOpacity="0.4"
            />
            <ellipse
              cx="480"
              cy="215"
              rx="120"
              ry="56"
              fill="none"
              stroke="#d9a64a"
              strokeOpacity="0.55"
            />

            {/* Outer Ring: 18 Agency Agents Capability Division Nodes */}
            {divisions.map((div, idx) => {
              const angle = (idx * 2 * Math.PI) / divisions.length - Math.PI / 2;
              const cx = 480 + Math.cos(angle) * 320;
              const cy = 215 + Math.sin(angle) * 156;
              const isDivFocused = focusedDivision.id === div.id;
              return (
                <g
                  key={div.id}
                  className="galaxy-div-node"
                  onClick={() => setFocusedDivisionId(div.id)}
                  style={{ cursor: "pointer" }}
                >
                  <line
                    x1={480}
                    y1={215}
                    x2={cx}
                    y2={cy}
                    stroke={isDivFocused ? "#d9a64a" : "#168dff"}
                    strokeOpacity={isDivFocused ? 0.65 : 0.18}
                    strokeWidth={isDivFocused ? 1.5 : 0.8}
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isDivFocused ? 7.5 : 5}
                    fill={isDivFocused ? "#d9a64a" : "#55d9e8"}
                    stroke="#050811"
                    strokeWidth="1.5"
                  />
                  <text
                    x={cx + (cx >= 480 ? 10 : -10)}
                    y={cy + 3}
                    textAnchor={cx >= 480 ? "start" : "end"}
                    fill={isDivFocused ? "#ffe7b3" : "#9cb6cc"}
                    fontSize="10"
                  >
                    {div.label} ({div.profileCount})
                  </text>
                </g>
              );
            })}

            {/* Knowledge Pillar Synaptic Links */}
            {knowledgeLinks.map((lnk) => {
              const from = PILLAR_COORDS[lnk.from];
              const to = PILLAR_COORDS[lnk.to];
              if (!from || !to) return null;
              const active =
                selectedPillar.id === lnk.from || selectedPillar.id === lnk.to;
              return (
                <line
                  key={lnk.id}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={active ? "#d9a64a" : "#55d9e8"}
                  strokeOpacity={active ? 0.9 : 0.42}
                  strokeWidth={active ? 2.2 : 1.2}
                  strokeDasharray={active ? undefined : "4 4"}
                />
              );
            })}

            {/* 8 Core Knowledge & Memory Pillars */}
            {visiblePillars.map((pillar) => {
              const coord = PILLAR_COORDS[pillar.id] ?? { x: 450, y: 215 };
              const isSelected = selectedPillar.id === pillar.id;
              return (
                <g
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  style={{ cursor: "pointer" }}
                >
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? 22 : 15}
                    fill={pillar.color}
                    fillOpacity={isSelected ? 0.28 : 0.14}
                    stroke={pillar.color}
                    strokeWidth={isSelected ? 2.4 : 1.3}
                  />
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? 8 : 6}
                    fill={isSelected ? "#fff6dc" : pillar.color}
                  />
                  <text
                    x={coord.x}
                    y={coord.y - (isSelected ? 27 : 20)}
                    textAnchor="middle"
                    fill="#eaf3f8"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {pillar.code} · {pillar.label.split("·")[0].trim()}
                  </text>
                </g>
              );
            })}
          </svg>

          <div
            className="galaxy-pillar-pills"
            role="group"
            aria-label="Select Knowledge Architecture Pillar"
          >
            {knowledgePillars.map((pillar) => (
              <button
                key={pillar.id}
                type="button"
                className={
                  "pillar-pill" +
                  (selectedPillar.id === pillar.id ? " active" : "")
                }
                aria-pressed={selectedPillar.id === pillar.id}
                onClick={() => setSelectedPillarId(pillar.id)}
              >
                <small>{pillar.code}</small>
                <strong>{pillar.label.split("·")[0].trim()}</strong>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Knowledge Pillar Dossier */}
        <aside
          className="galaxy-pillar-dossier"
          aria-label="Selected Knowledge Pillar Details"
        >
          <div className="badge-row">
            <span className="badge">{selectedPillar.code}</span>
            <span className="badge badge-econ">
              {formatStatus(selectedPillar.kind)}
            </span>
            <span className="badge badge-stage">
              status: {selectedPillar.status}
            </span>
          </div>

          <h3>{selectedPillar.label}</h3>
          <p>{selectedPillar.summary}</p>

          <div className="dual-world-box">
            <div className="dual-world-item">
              <span className="eyebrow">NATURAL WORLD PARALLEL</span>
              <p>{selectedPillar.naturalParallel}</p>
            </div>
            <div className="dual-world-item">
              <span className="eyebrow">
                TECHNICAL ARCHITECTURE &amp; GUARDRAIL
              </span>
              <p>{selectedPillar.technicalTruth}</p>
            </div>
          </div>

          <div className="rule">Connected GWD Organizational Units</div>
          <div className="unit-chips">
            {selectedPillar.connectedUnits.map((uId) => {
              const entry = getUnitById(uId);
              return (
                <button
                  key={uId}
                  type="button"
                  className="chip"
                  onClick={() => onJumpToUnit(uId)}
                >
                  {entry?.unit.label ?? uId} ↗
                </button>
              );
            })}
          </div>

          <div className="rule">Connected Capability Divisions</div>
          <div className="unit-chips">
            {selectedPillar.connectedDivisions.map((dId) => (
              <button
                key={dId}
                type="button"
                className="chip"
                onClick={() => setFocusedDivisionId(dId)}
              >
                {dId} ↗
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* Internal GWD Intelligence Library: 18 Divisions & 283 Source Profiles */}
      <div className="catalog-toolbar">
        <div>
          <span className="eyebrow">
            GWD INTELLIGENCE LIBRARY · INTERNAL CATALOGUE VIEW
          </span>
          <h2>Agency Agents ({source.profileCount} Source Profiles)</h2>
          <p>
            {source.profileCount} upstream source profiles across{" "}
            {divisions.length} divisions. Deployment and staffing are
            unverified. These domains can support multiple organizational
            layers.
          </p>
        </div>
        <div className="catalog-controls">
          <input
            type="search"
            aria-label="Search capability divisions"
            placeholder="Search divisions, summaries or units…"
            value={catalogQuery}
            onChange={(e) => setCatalogQuery(e.target.value)}
          />
          <div
            className="filter-pills"
            role="group"
            aria-label="Filter divisions by organizational layer"
          >
            {[
              ["all", `All (${divisions.length})`],
              ["governance", "Governance"],
              ["executive", "Executive"],
              ["shared-services", "Shared Services"],
              ["business-units", "Business Units"],
              ["labs-innovation", "Labs & Innovation"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={catalogLayerFilter === id}
                onClick={() => setCatalogLayerFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="catalog-grid">
        {filteredDivisions.map((d) => {
          const isFocused = focusedDivision.id === d.id;
          return (
            <article
              key={d.id}
              className={isFocused ? "focused" : undefined}
              onClick={() => setFocusedDivisionId(d.id)}
            >
              <div className="card-top">
                <strong>{d.label}</strong>
                <em className="badge">{d.status}</em>
              </div>
              <span>{d.profileCount} profiles</span>
              <small className="div-summary">{d.summary}</small>
              <div className="unit-chips">
                {d.candidateUnits.map((uId) => {
                  const uEntry = getUnitById(uId);
                  return (
                    <button
                      key={uId}
                      type="button"
                      className="chip"
                      onClick={(e) => {
                        e.stopPropagation();
                        onJumpToUnit(uId);
                      }}
                    >
                      {uEntry?.unit.label ?? uId} ↗
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>

      <div className="provenance-drawer">
        <div>
          <span className="eyebrow">
            SELECTED CAPABILITY DOMAIN · {focusedDivision.id.toUpperCase()}
          </span>
          <h3>
            {focusedDivision.label} ({focusedDivision.profileCount} source
            profiles ·{" "}
            {(
              (focusedDivision.profileCount / source.profileCount) *
              100
            ).toFixed(1)}
            % of catalogue)
          </h3>
          <p>{focusedDivision.summary}</p>
          {focusedDivisionMappings.length > 0 && (
            <ul className="mapping-list">
              {focusedDivisionMappings.map((m) => {
                const targetUnit = getUnitById(m.unitId);
                return (
                  <li key={m.id}>
                    <strong>
                      {focusedDivision.label} →{" "}
                      {targetUnit?.unit.label ?? m.unitId}
                    </strong>
                    : {m.rationale}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="provenance-meta">
          <span className="eyebrow">
            VERIFIED UPSTREAM PROVENANCE &amp; TRUST STATUS
          </span>
          <div className="badge-row" style={{ marginBottom: "8px" }}>
            <span className="badge">Catalogue: {source.profileCount}</span>
            <span className="badge badge-econ">Active Deployed Claimed: 0</span>
            <span className="badge badge-stage">License: {source.license}</span>
          </div>
          <p>
            Inventory recorded {source.snapshotDate} · Verified upstream commit{" "}
            <code>{source.commit}</code> ({source.license} · tree{" "}
            <code>{source.tree}</code> · committed {source.commitDate}).
          </p>
          <p className="disclaimer-note">{source.disclaimer}</p>
          <a
            href={`${source.repository}/tree/${source.commit}/${focusedDivision.id}`}
            target="_blank"
            rel="noreferrer"
          >
            Verify upstream snapshot commit ({source.commit.slice(0, 8)}) ↗
          </a>
        </div>
      </div>
    </section>
  );
}
