"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LanguageSelector, Localized, useLanguage } from './Language';
import { normalizeSearch } from '../lib/translations';
import { sceneById, scenes, layerScenes, parseScene, type SceneId, type SceneAction, type PanelId, type Hotspot } from '../lib/experience';
import { layers, divisions, source, missions, relationships, formatStatus, getDivisionsForUnit, getUnitById } from '../lib/model';

type OpenPanel = { id: PanelId; topic?: string } | null;
type Props = { initialScene?: SceneId };
const ImmersiveRoom = dynamic(() => import('./ImmersiveRoom'), { ssr: false });

function Arrow() { return <span aria-hidden="true">↗</span>; }

function Modal({ title, children, close, sceneId, wide = false }: { title: string; children: ReactNode; close: () => void; sceneId: SceneId; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [comfort, setComfort] = useState(false);
  const { t } = useLanguage();
  useEffect(() => {
    const el = ref.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; el?.showModal();
    return () => { el?.close(); document.body.style.overflow = previous; };
  }, []);
  return <Localized><dialog ref={ref} className={'cinema-dialog dossier-dialog' + (wide ? ' spatial-dialog' : '') + (comfort ? ' comfort-reading' : '')} aria-label={t(title)} onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <header className="dossier-cover" style={{ '--dossier-art': 'url(/scenes/' + sceneId + '.webp)' } as CSSProperties}>
      <div className="dossier-tools"><span className="cinema-eyebrow">GWD / GENESIS</span><div><button className="reading-toggle" aria-label="Comfort reading" aria-pressed={comfort} onClick={() => setComfort(value => !value)}>Aa</button><button className="dialog-close" aria-label="Close panel" onClick={close}>×</button></div></div>
      <span className="cinema-eyebrow">{sceneById[sceneId].chapter}</span><h2>{title}</h2>
    </header>
    <div className="dialog-inner">{children}</div>
  </dialog></Localized>;
}

function LayerDossier({ index, topic }: { index: number; topic?: string }) {
  const layer = layers[index];
  const [active, setActive] = useState(topic);
  const [section, setSection] = useState('Overview');
  const selected = layer.units.find(u => u.id === active);
  const units = selected ? [selected, ...layer.units.filter(u => u.id !== active)] : layer.units;
  const capabilityCount = new Set(layer.units.flatMap(unit => unit.candidateCapabilityDivisions)).size;
  const connectionCount = relationships.filter(r => layer.units.some(u => u.id === r.from || u.id === r.to)).length;
  return <Localized>
    <p className="panel-intro">{layer.purpose}</p>
    <span className="truth-tag">Proposed organizational model</span>
    <div className="dossier-metrics"><div><strong>{layer.units.length}</strong><span>units</span></div><div><strong>{capabilityCount}</strong><span>capability domains</span></div><div><strong>{connectionCount}</strong><span>connections</span></div></div>
    <div className="dossier-layout"><nav className="dossier-index" aria-label="Unit index">{layer.units.map(unit => <button key={unit.id} aria-pressed={active === unit.id} onClick={() => setActive(unit.id)}>{unit.label}<Arrow /></button>)}</nav><div className="dossier-reading">
    <div className="dossier-sections" role="group" aria-label="Reading settings">{['Overview', 'Capabilities', 'Relationships'].map(value => <button key={value} aria-pressed={section === value} onClick={() => setSection(value)}>{value}</button>)}</div>
    {topic === 'missions' ? <div className="reading-links">{missions.map(m => <a key={m.id} href={'/architecture#missions'}>{m.title} <Arrow /></a>)}</div> : null}
    <h3>Units &amp; mandates</h3>
    <div className="unit-list">{units.map(u => <details key={u.id} open={selected?.id === u.id || units.length === 1}>
      <summary>{u.label}<small>{formatStatus(u.status ?? layer.status)}</small></summary>
      <p>{u.mandate}</p>
      {u.note ? <p className="quiet-copy">{u.note}</p> : null}
      {u.economicType ? <p className="quiet-copy">Economic role: {formatStatus(u.economicType)}</p> : null}
      {section !== 'Relationships' ? <><h4>Connected capabilities</h4>
      <div className="tag-list">{getDivisionsForUnit(u.id).map(d => <span key={d.id}>{d.label}</span>)}</div>
      </> : null}
      {section !== 'Capabilities' ? <><h4>Organizational relationships</h4>
      <ul className="relationship-list">{relationships.filter(r => r.from === u.id || r.to === u.id).map(r => <li key={r.id}>
        <strong>{getUnitById(r.from)?.unit.label}</strong> <span>{formatStatus(r.type.replaceAll('_', '-'))}</span> <strong>{getUnitById(r.to)?.unit.label}</strong>
        <p>{r.rationale}</p>
      </li>)}</ul></> : null}
    </details>)}</div>
    <a className="text-link" href="/architecture">Open the organizational model <Arrow /></a>
    </div></div>
  </Localized>;
}

function Knowledge({ topic, go }: { topic?: string; go: (id: SceneId) => void }) {
  return <Localized>
    <p className="panel-intro">Follow the connections between the proposed organization, its research and the decisions that shape it.</p>
    <span className="truth-tag">Curated public knowledge</span>
    {topic === 'decisions' ? <><h3>Architecture decisions</h3><p>The published decision record covers the independent GWD experience, the static data model, source provenance and the separation between this Explorer and operational systems.</p><a className="text-link" href="https://github.com/GoWorld-Digital/gwd-organization-explorer/blob/main/docs/DECISIONS.md" target="_blank" rel="noreferrer">Read the decision record <Arrow /></a></> : null}
    <div className="knowledge-list">
      <button onClick={() => go('governance')}><small>GOVERNANCE</small><strong>Purpose, principles &amp; accountability</strong><span>Explore the Council Chamber <Arrow /></span></button>
      <button onClick={() => go('labs')}><small>RESEARCH</small><strong>From hypothesis to validation</strong><span>Explore the Innovation Station <Arrow /></span></button>
      <a href="/architecture#missions"><small>MISSIONS</small><strong>How capabilities work together</strong><span>Explore illustrative mission pathways <Arrow /></span></a>
      <a href="/architecture#catalog"><small>SOURCE CATALOGUE</small><strong>18 capability domains</strong><span>283 upstream source profiles, with attribution <Arrow /></span></a>
    </div>
    <h3>Public project library</h3>
    <div className="reading-links">{[['Product brief', 'PRODUCT_BRIEF'], ['Organizational model', 'ORGANIZATION_MODEL'], ['Architecture decisions', 'DECISIONS'], ['Source provenance', 'AGENCY_AGENTS_SOURCE']].map(([label, file]) => <a key={file} href={'https://github.com/GoWorld-Digital/gwd-organization-explorer/blob/main/docs/' + file + '.md'} target="_blank" rel="noreferrer">{label}<Arrow /></a>)}</div>
  </Localized>;
}

function Search({ go, openLayer }: { go: (id: SceneId) => void; openLayer: (index: number, topic?: string) => void }) {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();
  const q = normalizeSearch(query.trim());
  const matches = (...values: string[]) => !q || normalizeSearch(values.flatMap(value => [value, t(value)]).join(' ')).includes(q);
  const foundScenes = scenes.filter(s => matches(s.title, s.subtitle));
  const foundUnits = layers.flatMap((l, i) => l.units.filter(u => matches(u.label, u.mandate)).map(u => ({ l, i, u })));
  const foundDivisions = divisions.filter(d => matches(d.label, d.summary));
  return <Localized>
    <label className="search-label">Find an environment, unit or capability<input autoFocus type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try governance, research, finance." /></label>
    <div className="search-results">
      {foundScenes.map(s => <button key={s.id} onClick={() => go(s.id)}><small>ENVIRONMENT</small><strong>{s.title}</strong><Arrow /></button>)}
      {q ? foundUnits.map(({ l, i, u }) => <button key={u.id} onClick={() => openLayer(i, u.id)}><small>{t(l.label).toUpperCase()} / {t('PROPOSED')}</small><strong>{u.label}</strong><Arrow /></button>) : null}
      {q ? foundDivisions.map(d => <a key={d.id} href="/architecture#catalog"><small>SOURCE CAPABILITY</small><strong>{t(d.label)} · {d.profileCount} {t('source profiles')}</strong><Arrow /></a>) : null}
    </div>
    {q && !foundScenes.length && !foundUnits.length && !foundDivisions.length ? <p role="status">No matches. Try a broader term.</p> : null}
  </Localized>;
}

const TOUR: SceneId[] = ['arrival', 'genesis', 'universe', 'governance', 'executive', 'shared-services', 'business-units', 'labs', 'knowledge'];
const TOUR_COPY: Record<SceneId, string> = {
  arrival: 'Begin with two connected worlds: human vision and AI-native foundations.',
  genesis: 'Meet Diana, your guide to the vision and architecture of GoWorld.Digital.',
  universe: 'The organization is presented through five connected layers. Choose a territory to enter it.',
  governance: 'Governance defines direction, principles, oversight and accountability. Explore the proposed council and its mandates.',
  executive: 'Executive leadership coordinates priorities, missions and relationships across the organization.',
  'shared-services': 'Shared services provide capabilities used across the business units. Each module opens its proposed mandates.',
  'business-units': 'Business units connect the organization to customer outcomes, products and services.',
  labs: 'The labs explore uncertainty through research, prototypes and bounded validation.',
  knowledge: 'The Knowledge Galaxy connects the model to its published sources, research and architecture decisions.',
};

export default function CinematicExplorer({ initialScene = 'arrival' }: Props) {
  const router = useRouter();
  const { t, href, locale } = useLanguage();
  const [sceneId, setSceneId] = useState<SceneId>(initialScene);
  const [panel, setPanel] = useState<OpenPanel>(null);
  const [quiet, setQuiet] = useState(true);
  const [tour, setTour] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [spatial, setSpatial] = useState(false);
  const [menu, setMenu] = useState(false);
  const [imageStates, setImageStates] = useState<Partial<Record<SceneId, 'loaded' | 'error'>>>({});
  const [fullScreenError, setFullScreenError] = useState('');
  const frame = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const scene = sceneById[sceneId];
  const loaded = !!imageStates[sceneId];
  const imageError = imageStates[sceneId] === 'error';
  const imageRef = useCallback((element: HTMLImageElement | null) => {
    if (!element?.complete) return;
    const status = element.naturalWidth > 0 ? 'loaded' : 'error';
    setImageStates(previous => previous[sceneId] === status ? previous : { ...previous, [sceneId]: status });
  }, [sceneId]);
  const current = TOUR.indexOf(sceneId);

  useEffect(() => {
    const pref = matchMedia('(prefers-reduced-motion: reduce)');
    const syncPref = () => setQuiet(pref.matches);
    const syncHash = () => { setSceneId(parseScene(location.hash)); setPanel(null); setSpatial(false); setMenu(false); setZoom(1); };
    syncPref();
    if (location.hash) syncHash();
    pref.addEventListener('change', syncPref);
    window.addEventListener('hashchange', syncHash);
    return () => { pref.removeEventListener('change', syncPref); window.removeEventListener('hashchange', syncHash); };
  }, []);

  function go(id: SceneId) {
    if (id === sceneId) { setPanel(null); return; }
    lastTrigger.current = null;
    setSceneId(id); setPanel(null); setSpatial(false); setMenu(false); setZoom(1);
    history.pushState(history.state, '', '#' + id);
    requestAnimationFrame(() => frame.current?.focus({ preventScroll: true }));
  }
  function open(id: PanelId, topic?: string) { lastTrigger.current = document.activeElement as HTMLElement; setPanel({ id, topic }); }
  function close() { setPanel(null); requestAnimationFrame(() => lastTrigger.current?.focus({ preventScroll: true })); }
  function act(action: SceneAction) {
    if ('scene' in action) go(action.scene);
    else if ('panel' in action) open(action.panel, action.topic);
    else if (action.command === 'tour') { setTour(true); go('arrival'); }
    else if (action.command === 'zoom-in') setZoom(v => Math.min(1.35, v + 0.1));
    else if (action.command === 'zoom-out') setZoom(v => Math.max(1, v - 0.1));
    else if (action.command === 'reset') setZoom(1);
    else if (scene.layerIndex !== undefined) { lastTrigger.current = document.activeElement as HTMLElement; setSpatial(true); }
    else router.push(href('/architecture'));
  }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { setFullScreenError('Full screen is unavailable in this browser.'); }
  }
  function hotspot(h: Hotspot, key: string) {
    return <button key={key} className={'art-hotspot ' + (h.kind ?? 'link')} style={{ left: h.rect[0] + '%', top: h.rect[1] + '%', width: h.rect[2] + '%', height: h.rect[3] + '%' }} onClick={() => act(h.action)} aria-label={h.label} title={h.label}><span className="sr-only">{h.label}</span></button>;
  }

  const layerButtons = layerScenes.map(s => ({ label: layers[s.layerIndex!].label, action: { scene: s.id } as SceneAction }));
  const mainNav: Hotspot[] = [
    { label: 'GoWorld.Digital home', rect: [2, 1.5, 22, 7], action: { scene: 'arrival' } },
    { label: 'Explore the universe', rect: [29, 1.5, 8, 7], action: { scene: 'universe' } },
    { label: 'Discover Genesis', rect: [39, 1.5, 7.5, 7], action: { scene: 'genesis' } },
    { label: 'Explore the knowledge ecosystem', rect: [47, 1.5, 9.5, 7], action: { scene: 'knowledge' } },
    { label: 'Explore GWD impact', rect: [57, 1.5, 8.5, 7], action: { panel: 'about', topic: 'impact' } },
    { label: 'Join the GWD journey', rect: [66.5, 1.5, 8, 7], action: { panel: 'about', topic: 'join' } },
    { label: 'Search the experience', rect: [81.5, 1.3, 4, 7], action: { panel: 'search' } },
    { label: 'Enter GWD', rect: [86.5, 1.5, 11, 7], action: { scene: 'universe' } },
  ];
  const room = scene.layerIndex !== undefined;
  const title = panel?.id === 'layer' ? layers[scene.layerIndex ?? 0].label : panel?.id === 'search' ? 'Explore the connections' : panel?.id === 'knowledge' ? 'The Knowledge Galaxy' : panel?.id === 'catalog' ? 'Agency Agents source catalogue' : panel?.id === 'charter' ? 'Purpose & principles' : panel?.id === 'story' ? 'The Genesis story' : 'About GoWorld.Digital';

  return <Localized><MotionConfig reducedMotion={quiet ? 'always' : 'user'}>
    <main className="cinema">
      <a className="skip-link" href="#experience-content">Skip to experience content</a>
      <div className="mobile-header"><button onClick={() => go('arrival')} aria-label="GoWorld.Digital home"><strong>GWD</strong><span>GoWorld.Digital</span></button><div className="mobile-header-tools"><LanguageSelector /><button onClick={() => open('search')} aria-label="Search the experience">⌕</button><button aria-label={t('All environments')} aria-expanded={menu} onClick={() => setMenu(value => !value)}>☰</button></div></div>
      {menu ? <nav className="environment-menu" aria-label="Environment index">{scenes.map(item => <button key={item.id} aria-current={sceneId === item.id ? 'page' : undefined} onClick={() => go(item.id)}><small>{item.chapter}</small>{item.title}<Arrow /></button>)}</nav> : null}
      <div className="cinema-view">
        <div className={'art-frame' + (imageError ? ' image-unavailable' : '')} ref={frame} tabIndex={-1} aria-label={t(scene.title)}>
          <AnimatePresence initial={false} mode="wait">
            <motion.div className="art-composition" key={sceneId} initial={{ opacity: quiet ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: quiet ? 1 : 0 }} transition={{ duration: quiet ? 0 : 0.32 }} style={{ '--scene-zoom': zoom } as CSSProperties}>
              {/* Deliberately unaltered art: image and semantic hit targets share one coordinate system. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imageRef} className="scene-art" src={'/scenes/' + sceneId + '.webp'} width={1672} height={941} alt={scene.description} fetchPriority="high" draggable={false} onLoad={() => setImageStates(previous => ({ ...previous, [sceneId]: 'loaded' }))} onError={() => setImageStates(previous => ({ ...previous, [sceneId]: 'error' }))} />
              <nav className="art-navigation" aria-label="Main navigation">{mainNav.map((h, i) => hotspot(h, 'nav-' + i))}</nav>
              <div className="art-body" id="experience-content">
                <div className="scene-readable"><span className="cinema-eyebrow">{scene.chapter}</span><h1>{scene.title}</h1><p>{scene.subtitle}</p></div>
                <nav aria-label="Environment interactions">{scene.hotspots.map((h, i) => hotspot(h, 'scene-' + i))}</nav>
                {room ? <>
                  <nav aria-label="Organizational layers">{layerButtons.map((item, i) => hotspot({ label: item.label, rect: [[35, 45, 55, 67, 78][i], 9.5, [9, 9, 12, 11, 8][i], 5], action: item.action }, 'layer-' + i))}</nav>
                  {hotspot({ label: 'Back to universe', rect: [3, 90, 15, 7], action: { scene: 'universe' } }, 'back')}
                  {hotspot({ label: 'Open spatial organization', rect: [88, 89, 3.5, 7], action: { command: 'spatial' } }, 'spatial')}
                  {hotspot({ label: 'Zoom into environment', rect: [91.5, 89, 3.5, 7], action: { command: 'zoom-in' } }, 'zoom')}
                  {hotspot({ label: 'Reset environment view', rect: [95, 89, 3.5, 7], action: { command: 'reset' } }, 'reset')}
                </> : null}
                {sceneId === 'universe' ? <nav aria-label="Organizational layers">{layerButtons.map((item, i) => hotspot({ label: item.label, rect: [3, 56 + i * 5.3, 19, 5], action: item.action }, 'index-' + i))}</nav> : null}
                {sceneId === 'knowledge' ? <nav aria-label="Knowledge areas">{['Knowledge Galaxy', 'Agents', 'Memory', 'Projects', 'Decisions'].map((label, i) => hotspot({ label, rect: [[58, 74, 80, 86, 92][i], 9, i === 0 ? 14 : 6, 5], action: { panel: i === 1 ? 'catalog' : 'knowledge', topic: label.toLowerCase() } }, 'knowledge-' + i))}</nav> : null}
              </div>
            </motion.div>
          </AnimatePresence>
          {!loaded ? <span className="scene-loading" role="status">{t(scene.title)}…</span> : null}
          {imageError ? <p className="art-error" role="status">The scene image could not load. All navigation and content remain available below.</p> : null}
        </div>
      </div>
      <section className="mobile-content" aria-label="Explore this environment">
        <div className="scene-progress" aria-label="Environment index">{scenes.map(item => <button key={item.id} aria-label={t(item.title)} aria-current={sceneId === item.id ? 'step' : undefined} onClick={() => go(item.id)} />)}</div>
        <span className="cinema-eyebrow">{scene.chapter}</span><h2>{scene.title}</h2><p>{scene.subtitle}</p>
        <div className="mobile-actions">{scene.hotspots.map((h, i) => <button key={i} className={h.kind === 'primary' ? 'gold-button' : 'mobile-link'} onClick={() => act(h.action)}>{h.label}<Arrow /></button>)}</div>
        {room ? <button className="gold-button mobile-spatial" onClick={() => { lastTrigger.current = document.activeElement as HTMLElement; setSpatial(true); }}>Explore in 3D <Arrow /></button> : null}
        <nav aria-label="Explore organization environments">{layerButtons.map(item => <button key={item.label} onClick={() => act(item.action)}>{item.label}<Arrow /></button>)}</nav>
      </section>
      {tour ? <section className="guided-tour" aria-label="Guided tour"><div><span className="cinema-eyebrow">DIANA / {current + 1} / {TOUR.length}</span><p>{TOUR_COPY[sceneId]}</p></div><div className="tour-actions"><button onClick={() => go(TOUR[Math.max(0, current - 1)])} disabled={current === 0}>Previous</button><button className="gold-button" onClick={() => current === TOUR.length - 1 ? setTour(false) : go(TOUR[current + 1])}>{t(current === TOUR.length - 1 ? 'Finish tour' : 'Continue')} →</button><button onClick={() => setTour(false)}>Leave tour</button></div></section> : null}
      <footer className="experience-bar">
        <span className="model-status"><i />Proposed organization</span>
        <nav aria-label="Experience controls">
          <div className="desktop-language"><LanguageSelector /></div>
          {room ? <button className="spatial-launch" onClick={() => { lastTrigger.current = document.activeElement as HTMLElement; setSpatial(true); }}>Explore in 3D <Arrow /></button> : null}
          <button onClick={() => go('universe')}>Universe</button>
          <button onClick={() => go('knowledge')}>Knowledge</button>
          <button aria-pressed={tour} onClick={() => { setTour(v => !v); }}>Guided tour</button>
          <a href="/architecture">3D &amp; model</a>
          <button aria-pressed={quiet} onClick={() => setQuiet(v => !v)}>{t(quiet ? 'Motion off' : 'Motion on')}</button>
          <button onClick={fullscreen}>Full screen</button>
        </nav>
      </footer>
      {locale !== 'en' ? <p className="art-language-note">Illustrated labels retain the original artwork language. <span>Use the translated navigation and dossiers to explore.</span></p> : null}
      {fullScreenError ? <p className="control-notice" role="status">{fullScreenError}</p> : null}
      <div className="scene-announcement sr-only" role="status" aria-live="polite">{scene.title}</div>
      {spatial && scene.layerIndex !== undefined ? <Modal title={t('Spatial experience') + ' · ' + t(scene.title)} sceneId={sceneId} wide close={() => { setSpatial(false); requestAnimationFrame(() => lastTrigger.current?.focus()); }}><p className="panel-intro">Interactive architectural interpretation of this environment.</p><ImmersiveRoom key={sceneId} layerIndex={scene.layerIndex} quiet={quiet} openUnit={id => { setSpatial(false); setPanel({ id: 'layer', topic: id }); }} /></Modal> : null}
      {panel ? <Modal title={title} sceneId={sceneId} close={close}>
        {panel.id === 'layer' ? <LayerDossier index={scene.layerIndex ?? 0} topic={panel.topic} /> : null}
        {panel.id === 'search' ? <Search go={go} openLayer={(index, topic) => { go(layerScenes[index].id); setPanel({ id: 'layer', topic }); }} /> : null}
        {panel.id === 'knowledge' ? <Knowledge topic={panel.topic} go={go} /> : null}
        {panel.id === 'charter' ? <><p className="panel-intro">Human direction, clear mandates and accountable decisions shape the proposed GWD organization.</p><span className="truth-tag">Proposed governance principles</span><h3>Direction &amp; oversight</h3><p>The Board of Administration provides strategic oversight. The Advisory / Strategic Council contributes independent advice within its mandate.</p><h3>Human approval</h3><p>Legal, financial, security, client and launch decisions remain subject to the appropriate human approval gates.</p><a className="text-link" href="/architecture#missions">Explore mission approval gates <Arrow /></a></> : null}
        {panel.id === 'story' ? <><p className="panel-intro">Two worlds. Different foundations. Connected futures.</p><p>Genesis explores how human vision, intelligent capabilities and clear organizational responsibility can come together in an AI-native enterprise.</p><h3>Meet Diana</h3><p>Diana is the visual guide to the GWD universe. Follow her guided journey or choose your own path through the five organizational layers.</p><button className="gold-button" onClick={() => { close(); setTour(true); go('genesis'); }}>Start the guided journey →</button><button className="text-link" onClick={() => go('universe')}>Explore freely <Arrow /></button></> : null}
        {panel.id === 'catalog' ? <><p className="panel-intro">{source.profileCount} {t('source profiles')} · {divisions.length} {t('capability domains')}. {t('Source templates do not represent deployed GWD agents.')}</p><div className="division-grid">{divisions.map(d => <a key={d.id} href="/architecture#catalog"><strong>{d.label}</strong><span>{d.profileCount} {t('source profiles')}</span></a>)}</div><a className="text-link" href={source.repository} target="_blank" rel="noreferrer">Agency Agents source repository <Arrow /></a><p className="quiet-copy">Recorded {source.snapshotDate} · MIT · {source.commit}</p></> : null}
        {panel.id === 'about' ? <><p className="panel-intro">GoWorld.Digital — human vision, AI-native foundations.</p><p>This public experience presents the proposed organization through governance, executive leadership, shared services, business units and research.</p><span className="truth-tag">Proposed organizational model</span><h3>{panel.topic === 'join' ? 'Follow the project' : 'Explore its architecture'}</h3><p>Discover the public source, organizational model and illustrative missions behind the GWD Genesis experience.</p><div className="reading-links"><a href="https://github.com/GoWorld-Digital/gwd-organization-explorer" target="_blank" rel="noreferrer">Public project repository <Arrow /></a><a href="/architecture#missions">Illustrative missions <Arrow /></a><a href="/architecture#finance">Business architecture simulator <Arrow /></a><button onClick={() => go('universe')}>Explore the organization <Arrow /></button></div></> : null}
      </Modal> : null}
    </main>
  </MotionConfig></Localized>;
}
