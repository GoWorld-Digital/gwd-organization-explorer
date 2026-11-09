"use client";
import { useEffect, useState } from "react";
import {
  genesisFilm,
  pulseModel,
  territories,
  territoriesModel,
  type Territory,
  type TerritoryId,
} from "../lib/model";

type Props = {
  selectedTerritoryId: TerritoryId;
  onSelectTerritory: (id: TerritoryId) => void;
  onEnterUniverse: (territoryId?: TerritoryId) => void;
  onOpenGalaxy: () => void;
  activePulseStateIndex: number;
  onTriggerPulse: (eventId?: string) => void;
  quiet: boolean;
};

function TerritoryMiniatureSvg({ id }: { id: TerritoryId }) {
  switch (id) {
    case "genesis-core":
      return (
        <svg viewBox="0 0 180 96" aria-hidden="true" className="territory-art">
          <defs>
            <radialGradient id="gc-glow" cx="50%" cy="62%" r="52%">
              <stop offset="0%" stopColor="#ffd98e" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#d9a64a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#050811" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="90" cy="74" rx="68" ry="16" fill="url(#gc-glow)" />
          <ellipse
            cx="90"
            cy="74"
            rx="56"
            ry="11"
            fill="none"
            stroke="#d9a64a"
            strokeOpacity="0.55"
          />
          <polygon
            points="90,14 104,70 76,70"
            fill="#d9a64a"
            fillOpacity="0.82"
            stroke="#ffe5ad"
            strokeWidth="1"
          />
          <polygon
            points="68,32 78,72 58,72"
            fill="#b6822e"
            fillOpacity="0.72"
            stroke="#f4cf8e"
            strokeWidth="0.8"
          />
          <polygon
            points="112,28 122,72 102,72"
            fill="#b6822e"
            fillOpacity="0.72"
            stroke="#f4cf8e"
            strokeWidth="0.8"
          />
          <circle cx="90" cy="18" r="5" fill="#fff4d2" />
        </svg>
      );
    case "intelligence":
      return (
        <svg viewBox="0 0 180 96" aria-hidden="true" className="territory-art">
          <defs>
            <radialGradient id="int-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#55d9e8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#168dff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#050811" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="90" cy="48" r="42" fill="url(#int-glow)" />
          <path
            d="M56,52 C52,32 72,20 90,26 C108,20 128,32 124,52 C122,66 106,72 90,70 C74,72 58,66 56,52 Z"
            fill="none"
            stroke="#55d9e8"
            strokeWidth="1.5"
          />
          <line x1="68" y1="40" x2="90" y2="32" stroke="#55d9e8" strokeOpacity="0.7" />
          <line x1="90" y1="32" x2="112" y2="42" stroke="#55d9e8" strokeOpacity="0.7" />
          <line x1="68" y1="40" x2="82" y2="56" stroke="#168dff" strokeOpacity="0.8" />
          <line x1="112" y1="42" x2="98" y2="56" stroke="#168dff" strokeOpacity="0.8" />
          <line x1="82" y1="56" x2="98" y2="56" stroke="#ffd98e" strokeOpacity="0.85" />
          {[
            [68, 40],
            [90, 32],
            [112, 42],
            [82, 56],
            [98, 56],
            [90, 74],
          ].map(([cx, cy], idx) => (
            <circle key={idx} cx={cx} cy={cy} r="3.2" fill="#bdf8ff" />
          ))}
        </svg>
      );
    case "infrastructure":
      return (
        <svg viewBox="0 0 180 96" aria-hidden="true" className="territory-art">
          <ellipse
            cx="90"
            cy="76"
            rx="60"
            ry="12"
            fill="none"
            stroke="#168dff"
            strokeOpacity="0.5"
          />
          <rect
            x="74"
            y="24"
            width="32"
            height="48"
            rx="2"
            fill="#10294d"
            stroke="#55d9e8"
            strokeWidth="1.2"
          />
          <rect
            x="50"
            y="38"
            width="22"
            height="34"
            rx="2"
            fill="#0d213d"
            stroke="#168dff"
            strokeWidth="1"
          />
          <rect
            x="108"
            y="34"
            width="22"
            height="38"
            rx="2"
            fill="#0d213d"
            stroke="#168dff"
            strokeWidth="1"
          />
          <line x1="40" y1="74" x2="140" y2="74" stroke="#55d9e8" strokeWidth="1.5" />
          <circle cx="90" cy="36" r="3" fill="#55d9e8" />
          <circle cx="90" cy="48" r="3" fill="#55d9e8" />
          <circle cx="90" cy="60" r="3" fill="#d9a64a" />
        </svg>
      );
    case "economy":
      return (
        <svg viewBox="0 0 180 96" aria-hidden="true" className="territory-art">
          <ellipse
            cx="90"
            cy="76"
            rx="58"
            ry="12"
            fill="none"
            stroke="#d9a64a"
            strokeOpacity="0.55"
          />
          <rect
            x="54"
            y="46"
            width="14"
            height="28"
            fill="#8b6526"
            stroke="#f4cf8e"
            strokeWidth="0.9"
          />
          <rect
            x="74"
            y="30"
            width="16"
            height="44"
            fill="#b88632"
            stroke="#ffe2a8"
            strokeWidth="1"
          />
          <rect
            x="96"
            y="20"
            width="16"
            height="54"
            fill="#d9a64a"
            stroke="#fff0cc"
            strokeWidth="1.1"
          />
          <rect
            x="116"
            y="38"
            width="14"
            height="36"
            fill="#27568c"
            stroke="#55d9e8"
            strokeWidth="0.9"
          />
          <path
            d="M46,68 Q90,42 136,54"
            fill="none"
            stroke="#ffd98e"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "frontier":
      return (
        <svg viewBox="0 0 180 96" aria-hidden="true" className="territory-art">
          <ellipse
            cx="90"
            cy="44"
            rx="46"
            ry="14"
            fill="#1a2442"
            stroke="#8c7ae6"
            strokeWidth="1.3"
          />
          <ellipse
            cx="90"
            cy="44"
            rx="26"
            ry="7"
            fill="none"
            stroke="#55d9e8"
            strokeWidth="1.1"
          />
          <path
            d="M78,56 L84,76 L96,76 L102,56 Z"
            fill="#28355c"
            stroke="#55d9e8"
            strokeWidth="1"
          />
          <circle cx="90" cy="30" r="7" fill="#55d9e8" fillOpacity="0.7" />
        </svg>
      );
    case "convergence":
      return (
        <svg viewBox="0 0 180 96" aria-hidden="true" className="territory-art">
          <circle cx="72" cy="30" r="8" fill="#d9a64a" fillOpacity="0.9" />
          <path
            d="M60,72 L64,42 L80,42 L84,72 Z"
            fill="#d9a64a"
            fillOpacity="0.65"
            stroke="#ffe4ad"
            strokeWidth="1"
          />
          <circle cx="108" cy="30" r="8" fill="#55d9e8" fillOpacity="0.9" />
          <path
            d="M96,72 L100,42 L116,42 L120,72 Z"
            fill="#168dff"
            fillOpacity="0.65"
            stroke="#8ef4ff"
            strokeWidth="1"
          />
          <path
            d="M74,48 Q90,34 106,48"
            fill="none"
            stroke="#ffd98e"
            strokeWidth="2"
          />
          <circle cx="90" cy="42" r="4" fill="#ffffff" />
        </svg>
      );
  }
}

export default function GenesisOpening({
  selectedTerritoryId,
  onSelectTerritory,
  onEnterUniverse,
  onOpenGalaxy,
  activePulseStateIndex,
  onTriggerPulse,
  quiet,
}: Props) {
  const [filmOpen, setFilmOpen] = useState(false);
  const [filmPlaying, setFilmPlaying] = useState(false);
  const [currentActIndex, setCurrentActIndex] = useState(0);
  const [muted, setMuted] = useState(true);

  const acts = genesisFilm.acts;
  const activeAct = acts[currentActIndex] ?? acts[0];
  const activePulseState =
    pulseModel.states[activePulseStateIndex] ?? pulseModel.states[0];

  useEffect(() => {
    if (!filmOpen || !filmPlaying || quiet) return;
    const timer = window.setInterval(() => {
      setCurrentActIndex((prev) => {
        if (prev >= acts.length - 1) {
          setFilmPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 3400);
    return () => window.clearInterval(timer);
  }, [filmOpen, filmPlaying, quiet, acts.length]);

  return (
    <section
      className="genesis-hero"
      aria-label="GWD Genesis — The Birth of an AI-Native World"
    >
      {/* Monumental Dual-World Backdrop: Natural Universe (Left) + Digital Universe (Right) + THE PULSE Bridge */}
      <div className="genesis-cosmos" aria-hidden="true">
        <div className="cosmos-starfield" />

        {/* Left: Natural World (Earth, Atmosphere, Organic Clouds, Golden Human Cities) */}
        <div className="world-sphere world-natural">
          <div className="natural-atmosphere" />
          <div className="natural-city-lights" />
          <div className="natural-clouds" />
          <span className="world-tag world-tag-left">
            NATURAL UNIVERSE · MATTER · LIFE · HUMAN PURPOSE
          </span>
        </div>

        {/* Right: Digital World (Code, AI Agents, Neural Grids, Luminous Infrastructure) */}
        <div className="world-sphere world-digital">
          <div className="digital-grid-rings" />
          <div className="digital-nodes-overlay" />
          <span className="world-tag world-tag-right">
            DIGITAL UNIVERSE · CODE · AGENTS · KNOWLEDGE
          </span>
        </div>

        {/* Central Connection: THE PULSE Golden/Cyan Energy Wave */}
        <svg
          className="pulse-bridge-svg"
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="pulseGoldGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#d9a64a" stopOpacity="0.1" />
              <stop offset="28%" stopColor="#d9a64a" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#fff3d1" stopOpacity="1" />
              <stop offset="72%" stopColor="#55d9e8" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#168dff" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="pulseCyanGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#55d9e8" stopOpacity="0.05" />
              <stop offset="45%" stopColor="#d9a64a" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#55d9e8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#168dff" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="coreBurst" cx="50%" cy="54%" r="28%">
              <stop offset="0%" stopColor="#fff6dc" stopOpacity="0.95" />
              <stop offset="30%" stopColor="#d9a64a" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#168dff" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#050811" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="720" cy="230" rx="390" ry="145" fill="url(#coreBurst)" />

          <path
            className="pulse-wave-main"
            d="M 40,260 C 260,120 490,310 720,225 C 950,140 1180,320 1400,175"
            fill="none"
            stroke="url(#pulseGoldGrad)"
            strokeWidth="3.2"
          />
          <path
            className="pulse-wave-secondary"
            d="M 60,195 C 310,325 510,135 720,225 C 930,315 1140,120 1380,255"
            fill="none"
            stroke="url(#pulseCyanGrad)"
            strokeWidth="2.1"
          />
          <path
            className="pulse-wave-tertiary"
            d="M 140,235 Q 430,165 720,225 T 1300,215"
            fill="none"
            stroke="url(#pulseGoldGrad)"
            strokeWidth="1.4"
            strokeDasharray="8 6"
          />
          <circle cx="720" cy="225" r="8" fill="#fff7df" />
          <circle
            cx="720"
            cy="225"
            r="22"
            fill="none"
            stroke="#d9a64a"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      {/* Scroll cue on the left */}
      <div className="scroll-cue" aria-hidden="true">
        <span className="scroll-dot" />
        <span className="scroll-line" />
        <small>SCROLL TO EXPLORE</small>
      </div>

      {/* Central Hero Content (Direction B) */}
      <div className="genesis-centerpiece">
        <div className="genesis-eyebrow-row">
          <span className="gold-hairline" aria-hidden="true" />
          <span className="genesis-eyebrow">G W D &nbsp; G E N E S I S</span>
          <span className="gold-hairline" aria-hidden="true" />
        </div>

        <h1 className="genesis-headline">
          THE BIRTH OF AN <span className="gold-accent">AI-NATIVE</span> WORLD
        </h1>

        <p className="genesis-subheadline">{territoriesModel.subheadline}</p>

        <div className="genesis-cta-cluster">
          <button
            type="button"
            className="btn-genesis-primary"
            onClick={() => {
              setFilmOpen(true);
              setFilmPlaying(!quiet);
            }}
          >
            <span className="play-icon" aria-hidden="true">
              ▶
            </span>{" "}
            ENTER THE GENESIS
          </button>

          <button
            type="button"
            className="btn-genesis-secondary"
            onClick={() => onEnterUniverse()}
          >
            EXPLORE THE UNIVERSE ↗
          </button>

          <button
            type="button"
            className="btn-genesis-ghost"
            onClick={() => onTriggerPulse()}
            title="Trigger an illustrative signal across THE PULSE"
          >
            ✦ Trigger THE PULSE ({activePulseState.label})
          </button>
        </div>

        <div className="genesis-pillars-line" aria-hidden="true">
          <span>HUMANITY</span>
          <b>·</b>
          <span>INTELLIGENCE</span>
          <b>·</b>
          <span>INFINITE POSSIBILITIES</span>
        </div>
      </div>

      {/* Optional 6-Act Genesis Film Sequence Modal / Stage (Skippable, No Forced Audio) */}
      {filmOpen && (
        <div
          className="genesis-film-stage"
          role="region"
          aria-label="Genesis 6-Act Cinematic Sequence"
        >
          <div className="film-stage-top">
            <div>
              <span className="eyebrow">
                GENESIS FILM SEQUENCE · ACT 0{activeAct.order} OF 06 ·{" "}
                {activeAct.motionId} ({activeAct.timeRange})
              </span>
              <h2>
                Act 0{activeAct.order} — {activeAct.title}
              </h2>
            </div>
            <div className="film-controls">
              <button
                type="button"
                className="pill-action"
                onClick={() => setFilmPlaying((p) => !p)}
              >
                {filmPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
              <button
                type="button"
                className="pill-subtle"
                aria-pressed={!muted}
                onClick={() => setMuted((m) => !m)}
              >
                {muted ? "🔇 Audio Muted (Safe Default)" : "🔊 Ambient Cue On"}
              </button>
              <button
                type="button"
                className="pill-subtle"
                onClick={() => {
                  setFilmPlaying(false);
                  setFilmOpen(false);
                  onEnterUniverse();
                }}
              >
                Skip to Explorer ↗
              </button>
              <button
                type="button"
                className="pill-subtle"
                onClick={() => {
                  setFilmPlaying(false);
                  setFilmOpen(false);
                }}
              >
                Close ×
              </button>
            </div>
          </div>

          <div
            className={`film-visual-viewport act-theme-${activeAct.order}`}
            data-testid="genesis-film-viewport"
          >
            <div className="film-procedural-canvas" aria-hidden="true">
              <div className="film-orb-natural" />
              <div className="film-orb-digital" />
              <div className="film-pulse-beam" />
            </div>
            <div className="film-caption-box">
              <p className="film-narrative-quote">
                &ldquo;{activeAct.narrativeCaption}&rdquo;
              </p>
              <small className="film-visual-note">
                <strong>Visual Direction ({activeAct.motionId}):</strong>{" "}
                {activeAct.visualSummary}
              </small>
              <small className="film-draft-badge">
                Working storyboard &amp; draft manifesto copy (
                <em>&ldquo;{territoriesModel.workingManifesto.pt}&rdquo;</em>) —
                hybrid slot ready for authored Higgsfield / Remotion video
                streams.
              </small>
            </div>
          </div>

          <div
            className="film-acts-timeline"
            role="group"
            aria-label="Select Genesis Film Act"
          >
            {acts.map((act, idx) => (
              <button
                key={act.id}
                type="button"
                className={
                  "film-act-btn" + (currentActIndex === idx ? " active" : "")
                }
                aria-pressed={currentActIndex === idx}
                onClick={() => {
                  setCurrentActIndex(idx);
                  setFilmPlaying(false);
                }}
              >
                <small>
                  0{act.order} · {act.timeRange}
                </small>
                <strong>{act.title}</strong>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Six Narrative Territory Cards Dock (Matching Direction B Reference Screen) */}
      <div
        className="territories-dock"
        role="region"
        aria-label="Six GWD Genesis Territories"
      >
        {territories.map((t: Territory) => {
          const isSelected = selectedTerritoryId === t.id;
          return (
            <article
              key={t.id}
              className={
                "territory-dock-card" + (isSelected ? " selected" : "")
              }
              data-territory={t.id}
              onClick={() => onSelectTerritory(t.id)}
            >
              <TerritoryMiniatureSvg id={t.id} />
              <div className="territory-card-body">
                <span className="territory-code">{t.code}</span>
                <h3>{t.name}</h3>
                <p>{t.shortSubtitle}</p>
              </div>
              <button
                type="button"
                className="territory-card-arrow"
                aria-label={`Explore ${t.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTerritory(t.id);
                  onEnterUniverse(t.id);
                }}
              >
                →
              </button>
            </article>
          );
        })}
      </div>

      {/* Bottom Canonical Telemetry & Signature Bar */}
      <div className="genesis-bottom-bar">
        <div className="genesis-signature-block">
          <strong className="sig-logo">GWD</strong>
          <div>
            <span className="sig-domain">GoWorld.Digital</span>
            <small className="sig-hello">{territoriesModel.signature}</small>
          </div>
        </div>

        <div
          className="genesis-stats-dock"
          aria-label="Verified model metrics"
        >
          <button
            type="button"
            className="stat-pill"
            onClick={() => onEnterUniverse()}
          >
            <span className="stat-icon">✦</span>
            <div>
              <strong>6 Territories</strong>
              <small>Explore the ecosystem</small>
            </div>
          </button>

          <button
            type="button"
            className="stat-pill"
            onClick={() => onEnterUniverse("genesis-core")}
          >
            <span className="stat-icon">◈</span>
            <div>
              <strong>21 Units</strong>
              <small>5 proposed layers</small>
            </div>
          </button>

          <button
            type="button"
            className="stat-pill"
            onClick={() => onOpenGalaxy()}
          >
            <span className="stat-icon">◎</span>
            <div>
              <strong>283 Profiles</strong>
              <small>18 Agency Agents divisions</small>
            </div>
          </button>

          <button
            type="button"
            className="stat-pill"
            onClick={() => onEnterUniverse("frontier")}
          >
            <span className="stat-icon">⬡</span>
            <div>
              <strong>5 Labs</strong>
              <small>Research &amp; Innovation</small>
            </div>
          </button>
        </div>

        <div className="genesis-galaxy-cta">
          <button
            type="button"
            className="btn-open-galaxy"
            onClick={onOpenGalaxy}
          >
            🪐 Open Galaxy
          </button>
        </div>
      </div>
    </section>
  );
}
