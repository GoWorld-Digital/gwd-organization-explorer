"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { MotionConfig, motion } from "motion/react";
import { layers, source, divisions, formatStatus } from "../lib/model";

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
export default function Explorer() {
  const [selected, select] = useState<number | null>(null);
  const [spatial, setSpatial] = useState(false);
  const [quiet, setQuiet] = useState(true);
  const [error, setError] = useState("");
  const [reset, setReset] = useState(0);
  const [tab, setTab] = useState<"organization" | "catalog">("organization");
  const nav = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const pref = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setQuiet(pref.matches);
    sync();
    setSpatial(matchMedia("(min-width: 900px)").matches);
    pref.addEventListener("change", sync);
    return () => pref.removeEventListener("change", sync);
  }, []);
  function overview() {
    select(null);
    setReset((n) => n + 1);
  }
  function fail() {
    setSpatial(false);
    setError(
      "3D is unavailable. All five layers are available in the outline.",
    );
  }
  const layer = selected === null ? null : layers[selected];
  return (
    <MotionConfig reducedMotion={quiet ? "always" : "user"}>
      <main
        onKeyDown={(e) => {
          if (e.key === "Escape" && selected !== null) {
            nav.current[selected]?.focus();
            overview();
          }
        }}
      >
        <header>
          <div className="brand">
            <span className="mark" aria-hidden="true">
              ◈
            </span>{" "}
            GoWorld <b>Digital</b>
          </div>
          <nav aria-label="Explorer sections">
            {(["organization", "catalog"] as const).map((t) => (
              <button
                key={t}
                aria-current={tab === t ? "page" : undefined}
                onClick={() => setTab(t)}
              >
                {t === "organization" ? "Organization" : "Source catalogue"}
              </button>
            ))}
          </nav>
          <span className="status">
            <i /> Proposed model
          </span>
        </header>
        <div className="heading">
          <div>
            <span className="eyebrow">GWD / ORGANIZATIONAL ARCHITECTURE</span>
            <h1>
              {tab === "organization"
                ? "Organization Explorer"
                : "Capability Catalogue"}
            </h1>
          </div>
          <p>
            {tab === "organization"
              ? "Explore the five layers of a proposed AI-native organization."
              : "Explore capability domains in the Agency Agents source snapshot."}
          </p>
        </div>
        {tab === "organization" ? (
          <>
            <div className="workspace">
              <section className="viewport" aria-label="Organizational model">
                <div className="viewbar">
                  <span className="eyebrow">
                    {spatial ? "Spatial view" : "Layer outline"}
                  </span>
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
                <div className="stage">
                  {spatial ? (
                    <SceneBoundary fail={fail}>
                      <Scene
                        selected={selected}
                        select={select}
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
                          onClick={() => select(i)}
                          key={l.id}
                        >
                          <small>0{l.rank}</small>
                          <strong>{l.label}</strong>
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
                      ? "Drag to orbit · Scroll or pinch to zoom"
                      : "Select a layer to inspect its units"}
                  </span>
                  <button onClick={overview}>↺ Reset view</button>
                </div>
              </section>
              <aside aria-label="Layer details" aria-live="polite">
                <motion.div
                  key={layer?.id ?? "overview"}
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
                        {layer.units.map((u) => (
                          <li key={u.id}>
                            <strong>{u.label}</strong>
                            <small>
                              {formatStatus(u.status ?? layer.status)}
                              {u.economicType
                                ? " · " + formatStatus(u.economicType)
                                : ""}
                            </small>
                            {u.note && <small>{u.note}</small>}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      <div className="rule">Model composition</div>
                      {[
                        [layers.length, "Proposed layers"],
                        [divisions.length, "Catalogue divisions"],
                        [source.profileCount, "Upstream source profiles"],
                      ].map(([n, label]) => (
                        <div key={label} className="metric">
                          <b>{n}</b>
                          <span>{label}</span>
                        </div>
                      ))}
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
                  onClick={() => select(i)}
                >
                  <small>LAYER 0{l.rank}</small>
                  {l.label}
                </button>
              ))}
            </nav>
            <footer>
              <span>GoWorld Digital / Organization Explorer</span>
              <button aria-pressed={quiet} onClick={() => setQuiet(!quiet)}>
                Reduced motion · {quiet ? "On" : "Off"}
              </button>
            </footer>
          </>
        ) : (
          <section className="catalog">
            <h2>Agency Agents</h2>
            <p>
              {source.profileCount} upstream source profiles across{" "}
              {divisions.length} divisions. Deployment and staffing are
              unverified. These domains can support multiple organizational
              layers.
            </p>
            <div>
              {divisions.map((d) => (
                <article key={d.id}>
                  <strong>{d.label}</strong>
                  <span>{d.profileCount} profiles</span>
                </article>
              ))}
            </div>
            <p>
              Inventory recorded {source.snapshotDate}. Upstream revision
              unconfirmed.
            </p>
            <a href={source.repository}>Agency Agents source repository ↗</a>
          </section>
        )}
      </main>
    </MotionConfig>
  );
}
