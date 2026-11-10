"use client";
import dynamic from "next/dynamic";
import { LanguageSelector, Localized, useLanguage } from "./Language";
import { normalizeSearch } from "../lib/translations";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig, motion } from "motion/react";
import {
  layers,
  relationships,
  capabilityMappings,
  discrepancyNotes,
  source,
  divisions,
  missions,
  financialModel,
  financialPresets,
  formatStatus,
  getUnitById,
  getRelationshipsForUnit,
  calculateScenarioEconomics,
  clampScenarioInputs,
} from "../lib/model";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => (
    <p role="status" className="notice">
      Preparing spatial view…
    </p>
  ),
});

class SceneBoundary extends Component<
  { children: ReactNode; fail: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.fail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type TabId = "organization" | "catalog" | "missions" | "finance" | "ventures";

const TAB_ITEMS: { id: TabId; label: string }[] = [
  { id: "organization", label: "Organization" },
  { id: "catalog", label: "Source catalogue" },
  { id: "missions", label: "Missions" },
  { id: "finance", label: "Business simulator" },
  { id: "ventures", label: "Ventures & labs" },
];

const VENTURE_STAGES = [
  {
    id: "hypothesis",
    label: "01 / Hypothesis",
    summary: "Problem framing and initial strategic opportunity thesis.",
  },
  {
    id: "research",
    label: "02 / Research",
    summary: "Applied AI, systems and knowledge-architecture investigation.",
  },
  {
    id: "prototype",
    label: "03 / Prototype",
    summary: "Bounded orchestration and human-AI interface prototypes.",
  },
  {
    id: "validation",
    label: "04 / Validation",
    summary: "Time-boxed market, risk and workflow validation sprints.",
  },
  {
    id: "venture-proposal",
    label: "05 / Venture Proposal",
    summary: "Stage-gated incubation candidate for Venture Studio review.",
  },
  {
    id: "launched",
    label: "06 / Launched",
    summary: "Formally constituted operating entity (none claimed in V1).",
  },
] as const;

export default function Explorer() {
  const { t, locale } = useLanguage();
  const numberLocale = locale === "pt" ? "pt-BR" : locale === "fr" ? "fr-FR" : "en-US";
  const formatMoney = (value: number) => new Intl.NumberFormat(numberLocale, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  const [selected, select] = useState<number | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedDivisionId, setSelectedDivisionId] = useState<string | null>(
    null,
  );
  const [showConnections, setShowConnections] = useState(true);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [spatial, setSpatial] = useState(false);
  const [quiet, setQuiet] = useState(true);
  const [error, setError] = useState("");
  const [reset, setReset] = useState(0);
  const [tab, setTab] = useState<TabId>("organization");

  // Experience 2 — Agency Agents Explorer state
  const [catalogQuery, setCatalogQuery] = useState("");
  const [catalogLayerFilter, setCatalogLayerFilter] = useState<string>("all");
  const [focusedDivisionId, setFocusedDivisionId] = useState<string>("academic");

  // Experience 3 — Mission Simulator state
  const [activeMissionId, setActiveMissionId] = useState<string>(
    missions[0].id,
  );
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // Experience 4 — Business Simulator state
  const [activePresetId, setActivePresetId] = useState<string>(
    financialPresets[0].id,
  );
  const [scenarioInputs, setScenarioInputs] = useState(
    financialPresets[0].inputs,
  );

  // Experience 5 — Ventures & Innovation state
  const [ventureStageFilter, setVentureStageFilter] = useState<string>("all");
  const [focusedVentureUnitId, setFocusedVentureUnitId] =
    useState<string>("ventures");

  const nav = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const section = location.hash.slice(1);
    if (TAB_ITEMS.some(item => item.id === section)) setTab(section as TabId);
    const pref = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setQuiet(pref.matches);
    sync();
    setSpatial(matchMedia("(min-width: 900px)").matches);
    pref.addEventListener("change", sync);
    return () => pref.removeEventListener("change", sync);
  }, []);

  function selectLayer(index: number | null) {
    select(index);
    setSelectedUnitId(null);
    setIntroDismissed(true);
  }

  function overview() {
    select(null);
    setSelectedUnitId(null);
    setSelectedDivisionId(null);
    setReset((n) => n + 1);
  }

  function fail() {
    setSpatial(false);
    setError(
      "3D is unavailable. All five layers are available in the outline.",
    );
  }

  function jumpToUnit(unitId: string) {
    const found = getUnitById(unitId);
    if (!found) return;
    const layerIdx = layers.findIndex((l) => l.id === found.layer.id);
    setTab("organization");
    select(layerIdx >= 0 ? layerIdx : null);
    setSelectedUnitId(unitId);
    setIntroDismissed(true);
  }

  function jumpToDivision(divId: string) {
    setFocusedDivisionId(divId);
    setSelectedDivisionId(divId);
    setTab("catalog");
  }

  function selectPreset(presetId: string) {
    const found =
      financialPresets.find((p) => p.id === presetId) ?? financialPresets[0];
    setActivePresetId(found.id);
    setScenarioInputs({ ...found.inputs });
  }

  function updateInputField(
    field: keyof typeof scenarioInputs,
    rawValue: number,
  ) {
    const next = clampScenarioInputs(
      { ...scenarioInputs, [field]: rawValue },
      financialModel.bounds,
    );
    setScenarioInputs(next);
  }

  const layer = selected === null ? null : layers[selected];
  const selectedUnitEntry = selectedUnitId ? getUnitById(selectedUnitId) : null;
  const selectedUnitRelationships = useMemo(
    () => (selectedUnitId ? getRelationshipsForUnit(selectedUnitId) : []),
    [selectedUnitId],
  );

  const filteredDivisions = useMemo(() => {
    const q = normalizeSearch(catalogQuery.trim());
    return divisions.filter((d) => {
      const matchesQuery =
        !q ||
        normalizeSearch(d.label + " " + t(d.label)).includes(q) ||
        d.id.toLowerCase().includes(q) ||
        normalizeSearch(d.summary + " " + t(d.summary)).includes(q) ||
        d.candidateUnits.some((u) => u.toLowerCase().includes(q));
      if (!matchesQuery) return false;
      if (catalogLayerFilter === "all") return true;
      return d.candidateUnits.some((uId) => {
        const entry = getUnitById(uId);
        return entry?.layer.id === catalogLayerFilter;
      });
    });
  }, [catalogQuery, catalogLayerFilter, t]);

  const focusedDivision =
    divisions.find((d) => d.id === focusedDivisionId) ?? divisions[0];
  const focusedDivisionMappings = useMemo(
    () =>
      capabilityMappings.filter((m) => m.divisionId === focusedDivision.id),
    [focusedDivision.id],
  );

  const activeMission =
    missions.find((m) => m.id === activeMissionId) ?? missions[0];
  const activeStep =
    activeMission.steps[activeStepIndex] ?? activeMission.steps[0];

  const activePreset =
    financialPresets.find((p) => p.id === activePresetId) ??
    financialPresets[0];
  const economics = useMemo(
    () => calculateScenarioEconomics(scenarioInputs, financialModel.bounds),
    [scenarioInputs],
  );

  const ventureUnits = useMemo(() => {
    const venturesBu = layers[3].units.filter((u) => u.id === "ventures");
    const labUnits = layers[4].units;
    return [...venturesBu, ...labUnits];
  }, []);

  const filteredVentureUnits = useMemo(() => {
    if (ventureStageFilter === "all") return ventureUnits;
    return ventureUnits.filter((u) => u.maturityStage === ventureStageFilter);
  }, [ventureUnits, ventureStageFilter]);

  const focusedVentureEntry =
    getUnitById(focusedVentureUnitId) ?? getUnitById("ventures")!;
  const focusedVentureRelationships = useMemo(
    () => getRelationshipsForUnit(focusedVentureEntry.unit.id),
    [focusedVentureEntry.unit.id],
  );

  const headingCopy: Record<
    TabId,
    { eyebrow: string; title: string; subtitle: string }
  > = {
    organization: {
      eyebrow: "GWD / ORGANIZATIONAL ARCHITECTURE",
      title: "Organization Explorer",
      subtitle: "Explore the five layers of a proposed AI-native organization.",
    },
    catalog: {
      eyebrow: "GWD / CAPABILITY ECOSYSTEM",
      title: "Capability Catalogue",
      subtitle:
        "Explore capability domains in the Agency Agents source snapshot.",
    },
    missions: {
      eyebrow: "GWD / MISSION DESIGN",
      title: "Mission Simulator",
      subtitle:
        "Deterministic illustrative scenarios showing how units, capabilities and human approval gates mobilize.",
    },
    finance: {
      eyebrow: "GWD / UNIT ECONOMICS & OPERATING MODEL",
      title: "Business Architecture Simulator",
      subtitle:
        "Illustrative cost, profit and investment-centre models with transparent deterministic formulas.",
    },
    ventures: {
      eyebrow: "GWD / RESEARCH & VENTURE PIPELINE",
      title: "Ventures & Innovation",
      subtitle:
        "Explore proposed research labs, stage-gated experimentation and candidate venture studio hypotheses.",
    },
  };

  return (
    <Localized><MotionConfig reducedMotion={quiet ? "always" : "user"}>
      <main
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (!introDismissed) setIntroDismissed(true);
            if (selected !== null) {
              nav.current[selected]?.focus();
              overview();
            }
          }
        }}
      >
        <header><LanguageSelector />
          <div className="brand">
            <span className="mark" aria-hidden="true">
              ◈
            </span>{" "}
            GoWorld <b>Digital</b>
          </div>
          <nav aria-label="Explorer sections">
            {TAB_ITEMS.map((item) => (
              <button
                key={item.id}
                aria-current={tab === item.id ? "page" : undefined}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <span className="status">
            <i /> Proposed model
          </span>
        </header>

        <div className="heading">
          <div>
            <span className="eyebrow">{headingCopy[tab].eyebrow}</span>
            <h1>{headingCopy[tab].title}</h1>
          </div>
          <p>{headingCopy[tab].subtitle}</p>
        </div>

        {tab === "organization" && (
          <>
            {!introDismissed && (
              <section
                className="intro-strip"
                aria-label="Observatory introduction"
              >
                <div>
                  <span className="eyebrow">
                    ARCHITECTURAL OBSERVATORY · PROPOSED MODEL
                  </span>
                  <p>
                    <strong>5 proposed organizational layers</strong> surrounded
                    by <strong>18 catalogued capability domains</strong> (
                    {source.profileCount} upstream source profiles). Select any
                    layer or unit to inspect its mandate, relationships and
                    economic role, or launch an illustrative mission.
                  </p>
                </div>
                <div className="intro-actions">
                  <button
                    className="pill-action"
                    onClick={() => selectLayer(0)}
                  >
                    Inspect Governance ↗
                  </button>
                  <button
                    className="pill-action"
                    onClick={() => setTab("missions")}
                  >
                    Simulate a mission ↗
                  </button>
                  <button
                    className="pill-subtle"
                    onClick={() => setIntroDismissed(true)}
                  >
                    Skip intro ×
                  </button>
                </div>
              </section>
            )}

            <div className="workspace">
              <section className="viewport" aria-label="Organizational model">
                <div className="viewbar">
                  <span className="eyebrow">
                    {spatial ? "Spatial view" : "Layer outline"}
                  </span>
                  <div className="viewbar-controls">
                    {spatial && (
                      <button
                        className="conn-toggle"
                        aria-pressed={showConnections}
                        onClick={() => setShowConnections((v) => !v)}
                      >
                        Connections · {showConnections ? "On" : "Off"}
                      </button>
                    )}
                    <div className="switch">
                      {["3D", "2D"].map((s, i) => (
                        <button
                          key={s}
                          aria-pressed={spatial === (i === 0)}
                          onClick={() => {
                            setError("");
                            setSpatial(i === 0);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="stage">
                  {spatial ? (
                    <SceneBoundary fail={fail}>
                      <Scene
                        selected={selected}
                        select={selectLayer}
                        selectedUnitId={selectedUnitId}
                        selectUnit={setSelectedUnitId}
                        selectedDivisionId={selectedDivisionId}
                        selectDivision={setSelectedDivisionId}
                        showConnections={showConnections}
                        reset={reset}
                        quiet={quiet}
                        fail={fail}
                      />
                    </SceneBoundary>
                  ) : (
                    <div className="outline">
                      {layers.map((l, i) => (
                        <button
                          aria-pressed={selected === i}
                          onClick={() => selectLayer(i)}
                          key={l.id}
                        >
                          <small>0{l.rank}</small>
                          <strong>{l.label}</strong>
                          <em className="outline-meta">
                            {l.units.length} units
                          </em>
                          <span>↗</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {error && (
                  <p role="status" className="error">
                    {error}
                  </p>
                )}
                <div className="viewfoot">
                  <span>
                    {spatial
                      ? "Drag to orbit · Scroll or pinch to zoom · Click layer or unit block"
                      : "Select a layer to inspect its units and structural relationships"}
                  </span>
                  <button onClick={overview}>↺ Reset view</button>
                </div>
              </section>

              <aside aria-label="Layer details" aria-live="polite">
                <motion.div
                  key={(layer?.id ?? "overview") + (selectedUnitId ?? "")}
                  initial={quiet ? false : { opacity: 0.3, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <span className="eyebrow">
                    {layer
                      ? "Layer dossier / 0" + layer.rank
                      : "Model overview"}
                  </span>
                  <h2>{layer?.label ?? "Organizational model"}</h2>
                  <p>
                    {layer?.purpose ??
                      "Five proposed layers connect strategic oversight, shared capabilities, business activity and research."}
                  </p>
                  {layer ? (
                    <>
                      <div className="rule">Units &amp; mandates</div>
                      <ul>
                        {layer.units.map((u) => {
                          const isFocused = selectedUnitId === u.id;
                          return (
                            <li
                              key={u.id}
                              className={isFocused ? "unit-focused" : undefined}
                            >
                              <button
                                type="button"
                                className="unit-select-btn"
                                aria-pressed={isFocused}
                                onClick={() =>
                                  setSelectedUnitId(isFocused ? null : u.id)
                                }
                              >
                                <strong>{u.label}</strong>
                              </button>
                              <small>
                                {formatStatus(u.status ?? layer.status)}
                                {u.economicType
                                  ? " · " + formatStatus(u.economicType)
                                  : ""}
                                {u.maturityStage
                                  ? " · stage: " + formatStatus(u.maturityStage)
                                  : ""}
                              </small>
                              <small className="mandate">{u.mandate}</small>
                              {u.note && <small>{u.note}</small>}
                              <div className="unit-chips">
                                {u.candidateCapabilityDivisions.map((divId) => (
                                  <button
                                    key={divId}
                                    type="button"
                                    className="chip"
                                    onClick={() => jumpToDivision(divId)}
                                  >
                                    {divId} ↗
                                  </button>
                                ))}
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {selectedUnitEntry && (
                        <div className="unit-relations-box">
                          <div className="rule">
                            Relationships · {selectedUnitEntry.unit.label}
                          </div>
                          {selectedUnitRelationships.map((rel) => {
                            const otherId =
                              rel.from === selectedUnitEntry.unit.id
                                ? rel.to
                                : rel.from;
                            const other = getUnitById(otherId);
                            const directionLabel =
                              rel.from === selectedUnitEntry.unit.id
                                ? `${formatStatus(rel.type)} → ${other?.unit.label ?? otherId}`
                                : `${other?.unit.label ?? otherId} → ${formatStatus(rel.type)}`;
                            return (
                              <div key={rel.id} className="rel-item">
                                <strong>{directionLabel}</strong>
                                <small>{rel.rationale}</small>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="rule">Model composition</div>
                      {[
                        [layers.length, "Proposed layers"],
                        [divisions.length, "Catalogue divisions"],
                        [source.profileCount, "Upstream source profiles"],
                        [relationships.length, "Typed org relationships"],
                      ].map(([n, label]) => (
                        <div key={label} className="metric">
                          <b>{n}</b>
                          <span>{label}</span>
                        </div>
                      ))}
                      <div className="rule">Relationship legend</div>
                      <div className="legend-list">
                        <span>
                          <b className="dot-cobalt" /> Reporting accountability (
                          <code>reports_to</code>)
                        </span>
                        <span>
                          <b className="dot-gold" /> Non-binding counsel (
                          <code>advises</code>)
                        </span>
                        <span>
                          <b className="dot-cyan" /> Transversal shared service (
                          <code>provides_service_to</code>)
                        </span>
                        <span>
                          <b className="dot-violet" /> Candidate capability map (
                          <code>capability_supports</code>)
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>
                <div className="footnote">
                  <i /> Subject to governance and legal formalization.
                </div>
              </aside>
            </div>

            <nav className="layers" aria-label="Organizational layers">
              {layers.map((l, i) => (
                <button
                  ref={(el) => {
                    nav.current[i] = el;
                  }}
                  aria-pressed={selected === i}
                  key={l.id}
                  onClick={() => selectLayer(i)}
                >
                  <small>LAYER 0{l.rank}</small>
                  {l.label}
                </button>
              ))}
            </nav>

            <section
              className="structural-matrix"
              aria-label="2D Structural Architecture"
            >
              <div className="matrix-head">
                <div>
                  <span className="eyebrow">
                    SYNCHRONIZED 2D STRUCTURAL HIERARCHY &amp; ECONOMIC ROLES
                  </span>
                  <h2>Five-Layer Architecture &amp; Relationships</h2>
                </div>
                <p>
                  Canonical 2D representation of all 21 proposed units, their
                  economic centre classifications and reporting/service lines.
                </p>
              </div>
              <div className="matrix-grid">
                {layers.map((l, lIdx) => (
                  <div
                    key={l.id}
                    className={
                      "matrix-layer" + (selected === lIdx ? " active" : "")
                    }
                  >
                    <div className="matrix-layer-head">
                      <button
                        type="button"
                        onClick={() => selectLayer(lIdx)}
                        aria-pressed={selected === lIdx}
                      >
                        <span className="eyebrow">0{l.rank}</span>
                        <strong>{l.label}</strong>
                      </button>
                      <small>status: {formatStatus(l.status)}</small>
                    </div>
                    <div className="matrix-units">
                      {l.units.map((u) => {
                        const unitRels = getRelationshipsForUnit(u.id);
                        const isSelectedUnit = selectedUnitId === u.id;
                        return (
                          <div
                            key={u.id}
                            className={
                              "matrix-unit-card" +
                              (isSelectedUnit ? " selected" : "")
                            }
                          >
                            <button
                              type="button"
                              onClick={() => {
                                selectLayer(lIdx);
                                setSelectedUnitId(u.id);
                              }}
                            >
                              <strong>{u.label}</strong>
                            </button>
                            <div className="badge-row">
                              <span className="badge">
                                status: {formatStatus(u.status ?? l.status)}
                              </span>
                              {u.economicType && (
                                <span className="badge badge-econ">
                                  {formatStatus(u.economicType)}
                                </span>
                              )}
                              {u.maturityStage && (
                                <span className="badge badge-stage">
                                  stage: {formatStatus(u.maturityStage)}
                                </span>
                              )}
                            </div>
                            <small>
                              {unitRels.length} relationships ·{" "}
                              {u.candidateCapabilityDivisions.length} capability
                              domains
                            </small>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === "catalog" && (
          <section className="catalog" aria-label="Agency Agents Explorer">
            <div className="catalog-toolbar">
              <div>
                <h2>Agency Agents</h2>
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
                              jumpToUnit(uId);
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
                  SELECTED CAPABILITY DOMAIN ·{" "}
                  {focusedDivision.id.toUpperCase()}
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
                <span className="eyebrow">VERIFIED UPSTREAM PROVENANCE</span>
                <p>
                  Inventory recorded {source.snapshotDate} · Verified upstream
                  commit <code>{source.commit}</code> ({source.license} · tree{" "}
                  <code>{source.tree}</code> · committed {source.commitDate}).
                </p>
                <p className="disclaimer-note">{source.disclaimer}</p>
                <a
                  href={`${source.repository}/tree/${source.commit}/${focusedDivision.id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Inspect {focusedDivision.label} in Agency Agents repository ↗
                </a>{" "}
                ·{" "}
                <a href={source.repository} target="_blank" rel="noreferrer">
                  Agency Agents source repository ↗
                </a>
              </div>
            </div>
          </section>
        )}

        {tab === "missions" && (
          <section className="simulator-section" aria-label="Mission Simulator">
            <div className="truth-banner">
              <span className="badge badge-warn">{activeMission.badge}</span>
              <span>
                Deterministic capability mobilization model — no live agent
                execution or autonomous external commitments.
              </span>
            </div>

            <div className="mission-layout">
              <div className="mission-sidebar">
                <span className="eyebrow">SELECT ILLUSTRATIVE SCENARIO</span>
                <div
                  className="scenario-list"
                  role="group"
                  aria-label="Mission scenarios"
                >
                  {missions.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="scenario-btn"
                      aria-pressed={activeMission.id === m.id}
                      onClick={() => {
                        setActiveMissionId(m.id);
                        setActiveStepIndex(0);
                      }}
                    >
                      <small>{m.code} / SCENARIO</small>
                      <strong>{m.shortLabel}</strong>
                      <span>{m.title}</span>
                    </button>
                  ))}
                </div>

                <div className="mission-meta-block">
                  <div className="rule">Mission objective</div>
                  <p>{activeMission.objective}</p>

                  <div className="rule">Participating units</div>
                  <div className="unit-chips">
                    {activeMission.participatingUnits.map((uId) => {
                      const entry = getUnitById(uId);
                      return (
                        <button
                          key={uId}
                          type="button"
                          className="chip"
                          onClick={() => jumpToUnit(uId)}
                        >
                          {entry?.unit.label ?? uId} ↗
                        </button>
                      );
                    })}
                  </div>

                  <div className="rule">Transversal shared services</div>
                  <div className="unit-chips">
                    {activeMission.sharedServices.map((sId) => {
                      const entry = getUnitById(sId);
                      return (
                        <button
                          key={sId}
                          type="button"
                          className="chip"
                          onClick={() => jumpToUnit(sId)}
                        >
                          {entry?.unit.label ?? sId} ↗
                        </button>
                      );
                    })}
                  </div>

                  <div className="rule">Candidate capability divisions</div>
                  <div className="unit-chips">
                    {activeMission.candidateCapabilityDivisions.map((dId) => (
                      <button
                        key={dId}
                        type="button"
                        className="chip"
                        onClick={() => jumpToDivision(dId)}
                      >
                        {dId} ↗
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pill-action full-width-btn"
                    onClick={() => {
                      selectPreset(activeMission.financialPresetId);
                      setTab("finance");
                    }}
                  >
                    Open unit economics in Business Simulator ↗
                  </button>
                </div>
              </div>

              <div className="mission-main">
                <span className="eyebrow">
                  EXECUTION STAGES &amp; HUMAN APPROVAL GATES
                </span>
                <h2>{activeMission.title}</h2>

                <div
                  className="steps-grid"
                  role="group"
                  aria-label="Mission execution steps"
                >
                  {activeMission.steps.map((step, idx) => (
                    <button
                      key={step.id}
                      type="button"
                      className="step-card"
                      aria-pressed={activeStepIndex === idx}
                      onClick={() => setActiveStepIndex(idx)}
                    >
                      <div className="step-head">
                        <span className="eyebrow">
                          0{step.order} / {step.stage}
                        </span>
                        <span className="badge badge-stage">
                          Gate: {step.humanGate.category}
                        </span>
                      </div>
                      <strong>{step.title}</strong>
                      <small>
                        Owner:{" "}
                        {getUnitById(step.ownerUnit)?.unit.label ??
                          step.ownerUnit}
                      </small>
                    </button>
                  ))}
                </div>

                <div
                  className="step-inspector"
                  aria-label="Selected stage and human approval gate"
                >
                  <div className="inspector-col">
                    <span className="eyebrow">
                      STAGE 0{activeStep.order} ({activeStep.stage}) · MOBILIZED
                      UNITS &amp; CAPABILITIES
                    </span>
                    <h3>{activeStep.title}</h3>
                    <p>
                      <strong>Accountable Owner Unit:</strong>{" "}
                      {getUnitById(activeStep.ownerUnit)?.unit.label ??
                        activeStep.ownerUnit}
                    </p>
                    <p>
                      <strong>Supporting Units &amp; Shared Services:</strong>{" "}
                      {activeStep.supportUnits
                        .map((uId) => getUnitById(uId)?.unit.label ?? uId)
                        .join(" · ")}
                    </p>
                    <p>
                      <strong>Candidate Capability Domains:</strong>{" "}
                      {activeStep.candidateDivisions.join(" · ")}
                    </p>
                  </div>

                  <div className="gate-box">
                    <span className="eyebrow">
                      MANDATORY HUMAN APPROVAL GATE ·{" "}
                      {activeStep.humanGate.category.toUpperCase()}
                    </span>
                    <h4>{activeStep.humanGate.requiredRole}</h4>
                    <p>{activeStep.humanGate.description}</p>
                    <small>
                      No irreversible legal, financial, client or security
                      action proceeds without explicit human authorization.
                    </small>
                  </div>
                </div>

                <div className="assumptions-grid">
                  <div>
                    <div className="rule">Scenario assumptions</div>
                    <ul>
                      {activeMission.assumptions.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="rule">Explicit exclusions</div>
                    <ul>
                      {activeMission.exclusions.map((ex) => (
                        <li key={ex}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "finance" && (
          <section
            className="simulator-section"
            aria-label="Business Architecture Simulator"
          >
            <div className="truth-banner">
              <span className="badge badge-warn">{financialModel.badge}</span>
              <span>{financialModel.disclaimer}</span>
            </div>

            <div className="centres-strip">
              {financialModel.centreDefinitions.map((c) => (
                <div key={c.id} className="centre-card">
                  <span className="eyebrow">{formatStatus(c.status)}</span>
                  <strong>{c.label}</strong>
                  <p>{c.description}</p>
                </div>
              ))}
            </div>

            <div className="finance-layout">
              <div className="finance-controls">
                <span className="eyebrow">SELECT ILLUSTRATIVE PRESET</span>
                <div
                  className="preset-buttons"
                  role="group"
                  aria-label="Financial presets"
                >
                  {financialPresets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={activePreset.id === p.id}
                      onClick={() => selectPreset(p.id)}
                    >
                      <small>{formatStatus(p.centreType)}</small>
                      <strong>{p.title}</strong>
                    </button>
                  ))}
                </div>

                <p className="preset-desc">{activePreset.description}</p>

                <div className="input-group">
                  <label htmlFor="fin-customers">
                    <span>Customers / Participants</span>
                    <b>{scenarioInputs.customers.toLocaleString(numberLocale)}</b>
                  </label>
                  <input
                    id="fin-customers"
                    type="range"
                    min={financialModel.bounds.customers.min}
                    max={500}
                    step={financialModel.bounds.customers.step}
                    value={Math.min(500, scenarioInputs.customers)}
                    onChange={(e) =>
                      updateInputField("customers", Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    aria-label="Customers numeric input"
                    min={financialModel.bounds.customers.min}
                    max={financialModel.bounds.customers.max}
                    value={scenarioInputs.customers}
                    onChange={(e) =>
                      updateInputField("customers", Number(e.target.value))
                    }
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="fin-arpu">
                    <span>Average Revenue per Customer (USD)</span>
                    <b>{formatMoney(scenarioInputs.averageRevenuePerCustomer)}</b>
                  </label>
                  <input
                    id="fin-arpu"
                    type="range"
                    min={financialModel.bounds.averageRevenuePerCustomer.min}
                    max={20000}
                    step={financialModel.bounds.averageRevenuePerCustomer.step}
                    value={Math.min(
                      20000,
                      scenarioInputs.averageRevenuePerCustomer,
                    )}
                    onChange={(e) =>
                      updateInputField(
                        "averageRevenuePerCustomer",
                        Number(e.target.value),
                      )
                    }
                  />
                  <input
                    type="number"
                    aria-label="Average revenue numeric input"
                    min={financialModel.bounds.averageRevenuePerCustomer.min}
                    max={financialModel.bounds.averageRevenuePerCustomer.max}
                    value={scenarioInputs.averageRevenuePerCustomer}
                    onChange={(e) =>
                      updateInputField(
                        "averageRevenuePerCustomer",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="fin-direct">
                    <span>Direct Delivery Cost per Unit (USD)</span>
                    <b>{formatMoney(scenarioInputs.directCostPerUnit)}</b>
                  </label>
                  <input
                    id="fin-direct"
                    type="range"
                    min={financialModel.bounds.directCostPerUnit.min}
                    max={10000}
                    step={financialModel.bounds.directCostPerUnit.step}
                    value={Math.min(10000, scenarioInputs.directCostPerUnit)}
                    onChange={(e) =>
                      updateInputField(
                        "directCostPerUnit",
                        Number(e.target.value),
                      )
                    }
                  />
                  <input
                    type="number"
                    aria-label="Direct cost numeric input"
                    min={financialModel.bounds.directCostPerUnit.min}
                    max={financialModel.bounds.directCostPerUnit.max}
                    value={scenarioInputs.directCostPerUnit}
                    onChange={(e) =>
                      updateInputField(
                        "directCostPerUnit",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="fin-shared">
                    <span>Allocated Shared-Service Costs (USD)</span>
                    <b>
                      {formatMoney(scenarioInputs.allocatedSharedServiceCosts)}
                    </b>
                  </label>
                  <input
                    id="fin-shared"
                    type="range"
                    min={financialModel.bounds.allocatedSharedServiceCosts.min}
                    max={250000}
                    step={
                      financialModel.bounds.allocatedSharedServiceCosts.step
                    }
                    value={Math.min(
                      250000,
                      scenarioInputs.allocatedSharedServiceCosts,
                    )}
                    onChange={(e) =>
                      updateInputField(
                        "allocatedSharedServiceCosts",
                        Number(e.target.value),
                      )
                    }
                  />
                  <input
                    type="number"
                    aria-label="Allocated shared service costs numeric input"
                    min={financialModel.bounds.allocatedSharedServiceCosts.min}
                    max={financialModel.bounds.allocatedSharedServiceCosts.max}
                    value={scenarioInputs.allocatedSharedServiceCosts}
                    onChange={(e) =>
                      updateInputField(
                        "allocatedSharedServiceCosts",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="fin-exp">
                    <span>Experimentation / Lab Budget (USD)</span>
                    <b>{formatMoney(scenarioInputs.experimentationBudget)}</b>
                  </label>
                  <input
                    id="fin-exp"
                    type="range"
                    min={financialModel.bounds.experimentationBudget.min}
                    max={150000}
                    step={financialModel.bounds.experimentationBudget.step}
                    value={Math.min(
                      150000,
                      scenarioInputs.experimentationBudget,
                    )}
                    onChange={(e) =>
                      updateInputField(
                        "experimentationBudget",
                        Number(e.target.value),
                      )
                    }
                  />
                  <input
                    type="number"
                    aria-label="Experimentation budget numeric input"
                    min={financialModel.bounds.experimentationBudget.min}
                    max={financialModel.bounds.experimentationBudget.max}
                    value={scenarioInputs.experimentationBudget}
                    onChange={(e) =>
                      updateInputField(
                        "experimentationBudget",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>

                <button
                  type="button"
                  className="pill-subtle"
                  onClick={() => selectPreset(activePreset.id)}
                >
                  ↺ Reset preset inputs
                </button>
              </div>

              <div className="finance-results" aria-live="polite">
                <span className="eyebrow">
                  DETERMINISTIC SCENARIO OUTPUT ·{" "}
                  {activePreset.period.toUpperCase()}
                </span>
                <h2>
                  {getUnitById(activePreset.unitId)?.unit.label ??
                    activePreset.unitId}{" "}
                  (Illustrative)
                </h2>

                <div className="kpi-grid">
                  <div className="kpi-card">
                    <span className="eyebrow">
                      GROSS REVENUE (ILLUSTRATIVE)
                    </span>
                    <strong data-testid="kpi-gross-revenue">
                      {formatMoney(economics.grossRevenue)}
                    </strong>
                    <small>
                      <code>{financialModel.formulas.grossRevenue}</code>
                    </small>
                  </div>

                  <div className="kpi-card">
                    <span className="eyebrow">DIRECT DELIVERY COSTS</span>
                    <strong data-testid="kpi-direct-costs">
                      {formatMoney(economics.directDeliveryCosts)}
                    </strong>
                    <small>
                      <code>{financialModel.formulas.directDeliveryCosts}</code>
                    </small>
                  </div>

                  <div className="kpi-card">
                    <span className="eyebrow">CONTRIBUTION MARGIN</span>
                    <strong data-testid="kpi-contribution">
                      {formatMoney(economics.contribution)}
                    </strong>
                    <small>
                      {(economics.contributionMarginRatio * 100).toFixed(1)}% ·{" "}
                      <code>{financialModel.formulas.contribution}</code>
                    </small>
                  </div>

                  <div className="kpi-card">
                    <span className="eyebrow">
                      ILLUSTRATIVE MARGIN (AFTER SHARED SERVICES)
                    </span>
                    <strong data-testid="kpi-illustrative-margin">
                      {formatMoney(economics.illustrativeMargin)}
                    </strong>
                    <small>
                      <code>{financialModel.formulas.illustrativeMargin}</code>
                    </small>
                  </div>

                  <div className="kpi-card kpi-wide">
                    <span className="eyebrow">
                      NET POSITION AFTER EXPERIMENTATION BUDGET
                    </span>
                    <strong data-testid="kpi-net-position">
                      {formatMoney(economics.netPositionAfterExperiments)}
                    </strong>
                    <small>
                      <code>
                        {financialModel.formulas.netPositionAfterExperiments}
                      </code>
                    </small>
                  </div>
                </div>

                <div className="assumptions-grid">
                  <div>
                    <div className="rule">
                      Allocated Layer 3 Shared Services
                    </div>
                    <div className="unit-chips">
                      {activePreset.allocatedSharedServices.map((sId) => {
                        const entry = getUnitById(sId);
                        return (
                          <button
                            key={sId}
                            type="button"
                            className="chip"
                            onClick={() => jumpToUnit(sId)}
                          >
                            {entry?.unit.label ?? sId} ↗
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="rule">Scenario exclusions</div>
                    <ul>
                      {activePreset.exclusions.map((ex) => (
                        <li key={ex}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {tab === "ventures" && (
          <section
            className="simulator-section"
            aria-label="Ventures and Innovation"
          >
            <div className="truth-banner">
              <span className="badge badge-warn">
                Proposed Innovation &amp; Venture Portfolio
              </span>
              <span>
                All 5 Labs and GWD Ventures &amp; Venture Studio are proposed
                structures. No spin-offs or operating portfolio companies are
                claimed as launched.
              </span>
            </div>

            <div className="pipeline-stages" aria-label="Maturity stage gates">
              {VENTURE_STAGES.map((stage) => {
                const count = ventureUnits.filter(
                  (u) => u.maturityStage === stage.id,
                ).length;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    className="stage-gate-card"
                    aria-pressed={ventureStageFilter === stage.id}
                    onClick={() =>
                      setVentureStageFilter(
                        ventureStageFilter === stage.id ? "all" : stage.id,
                      )
                    }
                  >
                    <span className="eyebrow">{stage.label}</span>
                    <strong>{count} proposed units</strong>
                    <small>{stage.summary}</small>
                  </button>
                );
              })}
            </div>

            <div className="filter-pills">
              <button
                type="button"
                aria-pressed={ventureStageFilter === "all"}
                onClick={() => setVentureStageFilter("all")}
              >
                Show all Labs &amp; Venture Studio ({ventureUnits.length})
              </button>
            </div>

            <div className="ventures-layout">
              <div className="ventures-grid">
                {filteredVentureUnits.map((u) => {
                  const isFocused = focusedVentureEntry.unit.id === u.id;
                  return (
                    <article
                      key={u.id}
                      className={
                        "venture-card" + (isFocused ? " focused" : "")
                      }
                      onClick={() => setFocusedVentureUnitId(u.id)}
                    >
                      <div className="badge-row">
                        <span className="badge">
                          status: {formatStatus(u.status ?? "proposed")}
                        </span>
                        {u.maturityStage && (
                          <span className="badge badge-stage">
                            stage: {formatStatus(u.maturityStage)}
                          </span>
                        )}
                      </div>
                      <h3>{u.label}</h3>
                      <small className="econ-line">
                        {formatStatus(
                          u.economicType ?? "innovation-cost-centre-candidate",
                        )}
                      </small>
                      <p>{u.mandate}</p>
                    </article>
                  );
                })}
              </div>

              <aside
                className="venture-dossier"
                aria-label="Selected Lab or Venture details"
              >
                <span className="eyebrow">
                  INNOVATION DOSSIER ·{" "}
                  {formatStatus(
                    focusedVentureEntry.unit.maturityStage ?? "proposed",
                  ).toUpperCase()}
                </span>
                <h2>{focusedVentureEntry.unit.label}</h2>
                <p>{focusedVentureEntry.unit.mandate}</p>
                {focusedVentureEntry.unit.note && (
                  <p className="disclaimer-note">
                    {focusedVentureEntry.unit.note}
                  </p>
                )}

                <div className="rule">Governance &amp; reporting lines</div>
                {focusedVentureRelationships.map((rel) => {
                  const otherId =
                    rel.from === focusedVentureEntry.unit.id
                      ? rel.to
                      : rel.from;
                  const other = getUnitById(otherId);
                  return (
                    <div key={rel.id} className="rel-item">
                      <strong>
                        {formatStatus(rel.type)} →{" "}
                        {other?.unit.label ?? otherId}
                      </strong>
                      <small>{rel.rationale}</small>
                    </div>
                  );
                })}

                <div className="rule">Candidate capability divisions</div>
                <div className="unit-chips">
                  {focusedVentureEntry.unit.candidateCapabilityDivisions.map(
                    (dId) => (
                      <button
                        key={dId}
                        type="button"
                        className="chip"
                        onClick={() => jumpToDivision(dId)}
                      >
                        {dId} ↗
                      </button>
                    ),
                  )}
                </div>

                <div className="rule">Architecture governance record</div>
                {discrepancyNotes.map((note) => (
                  <div key={note.id} className="governance-note">
                    <strong>{note.topic}</strong>
                    <small>{note.resolution}</small>
                  </div>
                ))}
              </aside>
            </div>
          </section>
        )}

        <footer>
          <span>GoWorld Digital / Organization Explorer</span>
          <button aria-pressed={quiet} onClick={() => setQuiet(!quiet)}>
            Reduced motion · {quiet ? "On" : "Off"}
          </button>
        </footer>
      </main>
    </MotionConfig></Localized>
  );
}
