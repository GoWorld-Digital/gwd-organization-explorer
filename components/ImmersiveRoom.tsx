"use client";

import { Canvas, useThree } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { Vector3 } from 'three';
import { layers } from '../lib/model';
import { Localized, useLanguage } from './Language';

type Shot = 'overview' | 'top' | 'close';
type Props = { layerIndex: number; quiet: boolean; openUnit: (id: string) => void };
const colors = ['#e5bd74', '#71bce7', '#7fe2cf', '#ddb975', '#b9a0ee'];

class RenderBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

function Director({ shot, reset, zoom, quiet, controls, fail }: { shot: Shot; reset: number; zoom: number; quiet: boolean; controls: React.RefObject<React.ComponentRef<typeof OrbitControls> | null>; fail: () => void }) {
  const { camera, invalidate, gl } = useThree();
  const flight = useRef<gsap.core.Tween | null>(null);
  useLayoutEffect(() => {
    const control = controls.current;
    if (!control) return;
    const end = new Vector3(...(shot === 'top' ? [0.1, 12, 0.1] : shot === 'close' ? [4.6, 3.2, 5.6] : [8, 5.7, 9]) as [number, number, number]).multiplyScalar(zoom);
    const from = camera.position.clone();
    const oldTarget = control.target.clone();
    const target = new Vector3(0, 0.5, 0);
    const frame = { t: 0 };
    const update = () => { camera.position.lerpVectors(from, end, frame.t); control.target.lerpVectors(oldTarget, target, frame.t); control.update(); invalidate(); };
    if (quiet) { frame.t = 1; update(); return; }
    invalidate();
    flight.current = gsap.to(frame, { t: 1, duration: 0.8, ease: 'power2.inOut', onUpdate: update });
    return () => { flight.current?.kill(); };
  }, [shot, reset, zoom, quiet, camera, controls, invalidate]);
  useEffect(() => {
    const el = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); fail(); };
    const stop = () => flight.current?.kill();
    const key = (event: KeyboardEvent) => {
      const c = controls.current;
      if (!c || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-'].includes(event.key)) return;
      event.preventDefault(); stop();
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') c.setAzimuthalAngle(c.getAzimuthalAngle() + (event.key === 'ArrowLeft' ? -0.14 : 0.14));
      else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') c.setPolarAngle(c.getPolarAngle() + (event.key === 'ArrowUp' ? -0.12 : 0.12));
      else camera.position.sub(c.target).setLength(Math.max(4, Math.min(19, camera.position.distanceTo(new Vector3()) * (event.key === '-' ? 1.15 : 0.87)))).add(c.target);
      c.update(); invalidate();
    };
    el.setAttribute('tabindex', '0');
    el.addEventListener('pointerdown', stop);
    el.addEventListener('keydown', key);
    el.addEventListener('webglcontextlost', lost);
    return () => { el.removeEventListener('pointerdown', stop); el.removeEventListener('keydown', key); el.removeEventListener('webglcontextlost', lost); };
  }, [gl, camera, controls, invalidate, fail]);
  return null;
}

function Pavilion({ layerIndex, selected, select }: { layerIndex: number; selected: string | null; select: (id: string) => void }) {
  const layer = layers[layerIndex];
  const accent = colors[layerIndex];
  const modules = useMemo(() => layer.units.map((unit, i) => {
    const angle = (i / layer.units.length) * Math.PI * 2 - Math.PI / 2;
    return { unit, angle, x: Math.cos(angle) * 2.55, z: Math.sin(angle) * 2.55 };
  }), [layer]);
  return <>
    <color attach="background" args={['#050d19']} />
    <fog attach="fog" args={['#050d19', 18, 45]} />
    <ambientLight intensity={0.9} />
    <hemisphereLight args={['#c9e1ff', '#142330', 1.8]} />
    <directionalLight position={[4, 10, 5]} intensity={3} color="#f5e3c0" />
    <directionalLight position={[-6, 4, -7]} intensity={3.5} color="#5285cf" />
    <pointLight position={[0, 3.5, 0]} color={accent} intensity={25} distance={15} />
    {/* Orbital horizon, procedural and local: no fictitious real office assets. */}
    <mesh position={[0, -15, -15]}><sphereGeometry args={[14, 48, 24]} /><meshStandardMaterial color="#173f64" emissive="#0a2746" emissiveIntensity={0.3} roughness={0.6} /></mesh>
    <mesh position-y={-0.26}><cylinderGeometry args={[4.7, 4.45, 0.44, 64]} /><meshStandardMaterial color="#12283e" metalness={0.7} roughness={0.3} /></mesh>
    <mesh position-y={-0.025}><cylinderGeometry args={[4.55, 4.55, 0.04, 64]} /><meshStandardMaterial color="#203a4d" metalness={0.5} roughness={0.3} /></mesh>
    {[4.45, 3.85, 1.1].map(radius => <mesh key={radius} rotation-x={-Math.PI / 2} position-y={0.015}><ringGeometry args={[radius, radius + 0.025, 96]} /><meshBasicMaterial color={accent} /></mesh>)}
    {Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const x = Math.cos(angle) * 4.4, z = Math.sin(angle) * 4.4;
      return <group key={i} position={[x, 1.8, z]} rotation-y={-angle}>
        <mesh><boxGeometry args={[0.11, 3.6, 0.16]} /><meshStandardMaterial color="#c0c8cc" metalness={0.7} roughness={0.24} /></mesh>
        <mesh position-x={0.065}><boxGeometry args={[0.015, 3.3, 0.045]} /><meshBasicMaterial color={accent} /></mesh>
      </group>;
    })}
    <mesh position-y={3.65} rotation-x={-Math.PI / 2}><torusGeometry args={[4.4, 0.07, 8, 96]} /><meshStandardMaterial color="#b7c5ce" metalness={0.75} roughness={0.25} /></mesh>
    <mesh position-y={3.58} rotation-x={-Math.PI / 2}><torusGeometry args={[4.3, 0.018, 6, 96]} /><meshBasicMaterial color={accent} /></mesh>
    {layerIndex === 0 ? <group>
      <mesh position-y={0.9}><cylinderGeometry args={[1.7, 1.65, 0.13, 64]} /><meshPhysicalMaterial color="#b4c8d0" metalness={0.35} roughness={0.16} transparent opacity={0.75} /></mesh>
      <mesh position-y={0.4}><cylinderGeometry args={[0.55, 0.8, 0.8, 32]} /><meshStandardMaterial color="#243c4e" metalness={0.65} roughness={0.2} /></mesh>
      {Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return <mesh key={i} position={[Math.cos(a) * 2, 0.45, Math.sin(a) * 2]} rotation-y={-a}><boxGeometry args={[0.35, 0.8, 0.38]} /><meshStandardMaterial color="#94a8b5" metalness={0.45} roughness={0.3} /></mesh>; })}
    </group> : null}
    {layerIndex === 1 ? <group>{Array.from({ length: 19 }, (_, i) => { const a = i * 2.4, r = 0.25 + (i % 4) * 0.28, h = 0.25 + (i % 5) * 0.19; return <mesh key={i} position={[Math.cos(a) * r, h / 2 + 0.3, Math.sin(a) * r]}><boxGeometry args={[0.16, h, 0.2]} /><meshStandardMaterial color={i % 2 ? '#8bbac9' : '#d1b879'} metalness={0.65} roughness={0.25} /></mesh>; })}</group> : null}
    {layerIndex === 4 ? <mesh position-y={1.5}><icosahedronGeometry args={[0.9, 1]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.22} wireframe /></mesh> : <mesh position-y={layerIndex === 0 ? 1.22 : 0.15}><cylinderGeometry args={[0.28, 0.36, layerIndex === 0 ? 0.35 : 0.26, 32]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} metalness={0.6} roughness={0.25} /></mesh>}
    {modules.map(({ unit, angle, x, z }, i) => <group key={unit.id} position={[x, 0, z]} rotation-y={-angle} onClick={event => { if (event.delta < 6) { event.stopPropagation(); select(unit.id); } }}>
      <mesh position-y={0.11}><boxGeometry args={[1.05, 0.18, 0.85]} /><meshStandardMaterial color="#384c5e" metalness={0.7} roughness={0.26} /></mesh>
      <mesh position-y={0.75}><boxGeometry args={[0.9, layerIndex === 3 ? 1.4 + i * 0.16 : 1.05, 0.7]} /><meshPhysicalMaterial color={selected === unit.id ? accent : '#59879b'} metalness={0.45} roughness={0.18} transparent opacity={0.85} /></mesh>
      <mesh position-y={1.35}><boxGeometry args={[1.04, 0.04, 0.84]} /><meshStandardMaterial color={selected === unit.id ? '#fff0c3' : accent} emissive={accent} emissiveIntensity={0.5} /></mesh>
      <mesh position={[0, 0.76, 0.36]}><planeGeometry args={[0.72, 0.48]} /><meshStandardMaterial color="#0e2437" emissive={accent} emissiveIntensity={selected === unit.id ? 0.65 : 0.16} /></mesh>
    </group>)}
    {modules.map(({ unit, x, z }) => <Line key={unit.id} points={[[0, 0.04, 0], [x * 0.55, 0.04, z * 0.55], [x, 0.04, z]]} color={selected === unit.id ? '#fff1c2' : accent} transparent opacity={selected === unit.id ? 1 : 0.35} lineWidth={1} />)}
  </>;
}

function RoomCanvas({ layerIndex, quiet, selected, select, shot, reset, zoom, fail }: Props & { selected: string | null; select: (id: string) => void; shot: Shot; reset: number; zoom: number; fail: () => void }) {
  const { t } = useLanguage();
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  return <Canvas aria-label={t('3D model. Arrow keys orbit. Plus and minus zoom.')} frameloop="demand" dpr={[1, 1.5]} camera={{ position: [8, 5.7, 9], fov: 42 }} gl={{ antialias: true, alpha: false }} onCreated={({ gl }) => { gl.domElement.dataset.ready = 'true'; }}>
    <Pavilion layerIndex={layerIndex} selected={selected} select={select} />
    <OrbitControls ref={controls} makeDefault minDistance={4} maxDistance={19} minPolarAngle={0.04} maxPolarAngle={Math.PI * 0.48} enablePan={false} enableDamping={false} />
    <Director shot={shot} reset={reset} zoom={zoom} quiet={quiet} controls={controls} fail={fail} />
  </Canvas>;
}

export default function ImmersiveRoom(props: Props) {
  const [selected, select] = useState<string | null>(null);
  const [shot, setShot] = useState<Shot>('overview');
  const [reset, setReset] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [supported, setSupported] = useState<boolean | null>(null);
  const { t } = useLanguage();
  const layer = layers[props.layerIndex];
  const unit = layer.units.find(u => u.id === selected);
  useEffect(() => {
    const probe = document.createElement('canvas').getContext('webgl2');
    setSupported(!!probe);
    probe?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);
  const fallback = <p className="spatial-fallback" role="status">{t('Spatial rendering is unavailable. Use the dossier or the organizational outline.')}</p>;
  return <Localized><div className="spatial-study">
    <div className="spatial-toolbar"><span className="truth-tag">Architectural study</span><div className="shot-controls" role="group" aria-label="Experience controls">{(['overview', 'top', 'close'] as Shot[]).map((value, i) => <button key={value} aria-pressed={shot === value} onClick={() => { setShot(value); setZoom(1); }}>{['Overview', 'Top view', 'Close view'][i]}</button>)}<button aria-label="Zoom in" onClick={() => setZoom(v => Math.max(0.65, v - 0.15))}>＋</button><button aria-label="Zoom out" onClick={() => setZoom(v => Math.min(1.4, v + 0.15))}>−</button><button onClick={() => { setShot('overview'); setZoom(1); setReset(v => v + 1); }}>Reset camera</button></div></div>
    <div className="spatial-stage">{supported ? <RenderBoundary fallback={fallback}><RoomCanvas {...props} selected={selected} select={select} shot={shot} reset={reset} zoom={zoom} fail={() => setSupported(false)} /></RenderBoundary> : supported === false ? fallback : <p role="status">Checking spatial rendering.</p>}<span className="spatial-caption">Drag to orbit · Pinch or scroll to zoom</span></div>
    <div className="spatial-details"><nav aria-label="Unit index">{layer.units.map(u => <button key={u.id} aria-pressed={selected === u.id} onClick={() => select(u.id)}>{u.label}</button>)}</nav><section aria-label="Selected unit"><span className="cinema-eyebrow">{unit ? unit.label : 'Choose a unit to inspect its mandate.'}</span><p>{unit?.mandate ?? layer.purpose}</p><button className="gold-button" onClick={() => props.openUnit(unit?.id ?? layer.units[0].id)}>Open dossier <span aria-hidden="true">↗</span></button></section></div>
  </div></Localized>;
}
