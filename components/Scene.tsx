"use client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { InstancedMesh, Object3D, Vector3 } from "three";
import { gsap } from "gsap";
import {
  divisions,
  layers,
  relationships,
  capabilityMappings,
  yFor,
} from "../lib/model";

type Props = {
  selected: number | null;
  select: (index: number) => void;
  selectedUnitId?: string | null;
  selectUnit?: (unitId: string | null) => void;
  selectedDivisionId?: string | null;
  selectDivision?: (divisionId: string | null) => void;
  showConnections?: boolean;
  reset: number;
  quiet: boolean;
  fail: () => void;
};

const radii = [1.18, 1.48, 1.92, 2.22, 2.48];
const layerPalette = [
  { base: "#24485c", plate: "#3d7a8a", active: "#58b7c4", ring: "#67e8d2" },
  { base: "#233f63", plate: "#3b6598", active: "#5c8ef2", ring: "#6d9dff" },
  { base: "#26445b", plate: "#426f8f", active: "#5ca4c9", ring: "#7fd8f5" },
  { base: "#31365e", plate: "#545b94", active: "#7e84d4", ring: "#b59aff" },
  { base: "#3d392e", plate: "#6b6147", active: "#b3965b", ring: "#e6b978" },
];

function Repeated({
  points,
  width,
  height,
  depth,
  color,
}: {
  points: number[][];
  width: number;
  height: number;
  depth: number;
  color: string;
}) {
  const mesh = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const item = new Object3D();
    points.forEach(([x, y, z, angle], i) => {
      item.position.set(x, y, z);
      item.rotation.y = angle;
      item.updateMatrix();
      mesh.current!.setMatrixAt(i, item.matrix);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
    mesh.current!.computeBoundingSphere();
  }, [points]);
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, points.length]}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.33} metalness={0.35} />
    </instancedMesh>
  );
}

function radial(count: number, r: number, y: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i * 2 * Math.PI) / count;
    return [Math.sin(a) * r, y, Math.cos(a) * r, a];
  });
}

function unitWorldPosition(layerIdx: number, unitIdx: number, unitCount: number): [number, number, number] {
  const r = radii[layerIdx] * 0.56;
  const angle = (unitIdx * 2 * Math.PI) / Math.max(1, unitCount);
  return [Math.sin(angle) * r, yFor(layerIdx) + 0.22, Math.cos(angle) * r];
}

function divisionWorldPosition(divIdx: number): [number, number, number] {
  const angle = (divIdx * 2 * Math.PI) / divisions.length;
  const r = 3.25;
  return [Math.sin(angle) * r, -2.72, Math.cos(angle) * r];
}

function Plate({
  i,
  active,
  selectedUnitId,
  select,
  selectUnit,
}: {
  i: number;
  active: boolean;
  selectedUnitId?: string | null;
  select: () => void;
  selectUnit?: (unitId: string) => void;
}) {
  const r = radii[i];
  const palette = layerPalette[i] ?? layerPalette[0];
  const accent = active ? "#9bf9df" : palette.ring;
  const fins = useMemo(() => radial(32, r * 0.73, 0.21), [r]);
  const layerUnits = layers[i].units;
  const unitPositions = useMemo(
    () => radial(layerUnits.length, r * 0.52, 0.22),
    [layerUnits.length, r],
  );

  return (
    <group
      position-y={yFor(i)}
      onClick={(e) => {
        if (e.delta < 5) {
          e.stopPropagation();
          select();
        }
      }}
    >
      <mesh position-y={-0.13}>
        <cylinderGeometry args={[r, r * 0.92, 0.18, 8]} />
        <meshStandardMaterial
          color={active ? palette.active : palette.base}
          metalness={0.52}
          roughness={0.32}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r, r, 0.085, 8]} />
        <meshStandardMaterial
          color={active ? palette.active : palette.plate}
          roughness={0.42}
          metalness={0.4}
        />
      </mesh>
      <mesh position-y={0.051}>
        <cylinderGeometry args={[r * 0.97, r * 0.97, 0.018, 8]} />
        <meshStandardMaterial color="#132638" />
      </mesh>
      <mesh position-y={0.07} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[r * 0.825, r * 0.845, 64]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <Repeated
        points={fins}
        width={0.04}
        depth={0.068}
        height={0.28}
        color="#8ca6b4"
      />
      {layerUnits.map((unit, uIdx) => {
        const [ux, uy, uz, uAngle] = unitPositions[uIdx];
        const isUnitSelected = selectedUnitId === unit.id;
        const w = i === 3 ? r * 0.38 : r * 0.25;
        const d = i === 3 ? r * 0.4 : r * 0.23;
        const h = isUnitSelected ? 0.54 : i === 3 ? 0.46 : 0.34;
        return (
          <mesh
            key={unit.id}
            position={[ux, uy, uz]}
            rotation-y={uAngle}
            onClick={(e) => {
              if (e.delta < 5) {
                e.stopPropagation();
                select();
                selectUnit?.(unit.id);
              }
            }}
          >
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial
              color={
                isUnitSelected
                  ? "#9bf9df"
                  : active
                    ? "#7cc4cf"
                    : palette.plate
              }
              roughness={0.32}
              metalness={0.38}
            />
          </mesh>
        );
      })}
      {i < 3 && (
        <mesh position-y={0.4}>
          <cylinderGeometry args={[r * 0.79, r * 0.77, 0.07, 32]} />
          <meshStandardMaterial
            color={active ? "#8dbabf" : "#537892"}
            metalness={0.3}
            roughness={0.34}
          />
        </mesh>
      )}
      {i < 3 && (
        <mesh position-y={0.45} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[r * 0.61, r * 0.622, 64]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      )}
      <mesh position-y={0.48}>
        <cylinderGeometry args={[r * 0.24, r * 0.34, 0.13, 8]} />
        <meshStandardMaterial
          color="#9db3bd"
          metalness={0.45}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function ConnectionArcs({
  selected,
  selectedUnitId,
  selectedDivisionId,
  showConnections,
}: {
  selected: number | null;
  selectedUnitId?: string | null;
  selectedDivisionId?: string | null;
  showConnections: boolean;
}) {
  const unitLookup = useMemo(() => {
    const map = new Map<
      string,
      { layerIdx: number; pos: [number, number, number] }
    >();
    layers.forEach((layer, lIdx) => {
      layer.units.forEach((u, uIdx) => {
        map.set(u.id, {
          layerIdx: lIdx,
          pos: unitWorldPosition(lIdx, uIdx, layer.units.length),
        });
      });
    });
    return map;
  }, []);

  const divLookup = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    divisions.forEach((d, idx) => {
      map.set(d.id, divisionWorldPosition(idx));
    });
    return map;
  }, []);

  const lines = useMemo(() => {
    if (!showConnections) return [];
    const result: {
      id: string;
      points: [number, number, number][];
      color: string;
      dashed: boolean;
    }[] = [];

    for (const rel of relationships) {
      const from = unitLookup.get(rel.from);
      const to = unitLookup.get(rel.to);
      if (!from || !to) continue;

      const matchesSelection =
        selectedUnitId !== null && selectedUnitId !== undefined
          ? rel.from === selectedUnitId || rel.to === selectedUnitId
          : selected !== null
            ? from.layerIdx === selected || to.layerIdx === selected
            : rel.type === "provides_service_to" || rel.type === "advises";

      if (!matchesSelection) continue;

      const mid: [number, number, number] = [
        (from.pos[0] + to.pos[0]) * 0.62,
        (from.pos[1] + to.pos[1]) * 0.5 + 0.18,
        (from.pos[2] + to.pos[2]) * 0.62,
      ];
      const color =
        rel.type === "advises"
          ? "#e6b978"
          : rel.type === "provides_service_to"
            ? "#67e8d2"
            : "#6d9dff";

      result.push({
        id: rel.id,
        points: [from.pos, mid, to.pos],
        color,
        dashed: rel.type !== "reports_to",
      });
    }

    for (const cap of capabilityMappings) {
      const dPos = divLookup.get(cap.divisionId);
      const uEntry = unitLookup.get(cap.unitId);
      if (!dPos || !uEntry) continue;

      const showCap =
        selectedDivisionId === cap.divisionId ||
        selectedUnitId === cap.unitId ||
        (selected !== null && uEntry.layerIdx === selected);

      if (!showCap) continue;

      const mid: [number, number, number] = [
        (dPos[0] + uEntry.pos[0]) * 0.58,
        (dPos[1] + uEntry.pos[1]) * 0.5 - 0.2,
        (dPos[2] + uEntry.pos[2]) * 0.58,
      ];
      result.push({
        id: cap.id,
        points: [dPos, mid, uEntry.pos],
        color: "#b59aff",
        dashed: true,
      });
    }

    return result;
  }, [
    showConnections,
    selected,
    selectedUnitId,
    selectedDivisionId,
    unitLookup,
    divLookup,
  ]);

  if (!showConnections || lines.length === 0) return null;

  return (
    <group>
      {lines.map((line) => (
        <Line
          key={line.id}
          points={line.points}
          color={line.color}
          lineWidth={1.35}
          dashed={line.dashed}
          dashScale={6}
          dashSize={0.22}
          gapSize={0.14}
        />
      ))}
    </group>
  );
}

type LabelRefs = RefObject<(HTMLSpanElement | null)[]>;
function LabelPositions({ labels }: { labels: LabelRefs }) {
  const projected = useMemo(() => new Vector3(), []);
  useFrame(({ camera, size }) => {
    labels.current.forEach((label, i) => {
      if (!label) return;
      projected.set(0, yFor(i) + 0.13, 0).project(camera);
      const x = ((projected.x + 1) * size.width) / 2,
        y = ((1 - projected.y) * size.height) / 2;
      label.style.transform = "translate(" + x + "px," + y + "px)";
      label.style.visibility =
        projected.z < 1 && projected.z > -1 ? "visible" : "hidden";
    });
  });
  return null;
}

function World({
  selected,
  select,
  selectedUnitId,
  selectUnit,
  selectedDivisionId,
  selectDivision,
  showConnections = true,
  reset,
  quiet,
  fail,
}: Props) {
  const { camera, gl, invalidate } = useThree();
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  const flight = useRef<gsap.core.Tween | null>(null);
  const failRef = useRef(fail);
  useEffect(() => {
    failRef.current = fail;
  }, [fail]);
  useEffect(() => {
    const el = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      failRef.current();
    };
    el.addEventListener("webglcontextlost", lost);
    el.setAttribute("data-ready", "true");
    return () => {
      el.removeAttribute("data-ready");
      el.removeEventListener("webglcontextlost", lost);
    };
  }, [gl]);
  useLayoutEffect(() => {
    const control = controls.current;
    if (!control) return;
    const from = camera.position.clone(),
      origin = control.target.clone();
    const focus = new Vector3(
      0,
      selected === null ? -0.18 : yFor(selected) * 0.62,
      0,
    );
    const direction =
      selected === null
        ? new Vector3(6, 3.8, 8).normalize()
        : from.clone().sub(origin).normalize();
    const distance = selected === null ? 12.4 : 10.1;
    const to = focus.clone().addScaledVector(direction, distance);
    const frame = { t: 0 };
    const update = () => {
      camera.position.lerpVectors(from, to, frame.t);
      control.target.lerpVectors(origin, focus, frame.t);
      control.update();
      invalidate();
    };
    if (quiet) {
      frame.t = 1;
      update();
      return;
    }
    flight.current = gsap.to(frame, {
      t: 1,
      duration: 0.8,
      ease: "power2.inOut",
      onUpdate: update,
    });
    return () => {
      flight.current?.kill();
    };
  }, [selected, reset, quiet, camera, invalidate]);
  useEffect(() => {
    const el = gl.domElement;
    el.setAttribute("tabindex", "0");
    el.setAttribute(
      "aria-label",
      "3D model. Arrow keys orbit. Plus and minus zoom.",
    );
    const key = (event: KeyboardEvent) => {
      const c = controls.current;
      if (!c) return;
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "+",
          "=",
          "-",
        ].includes(event.key)
      )
        return;
      event.preventDefault();
      flight.current?.kill();
      if (event.key === "ArrowLeft" || event.key === "ArrowRight")
        c.setAzimuthalAngle(
          c.getAzimuthalAngle() + (event.key === "ArrowLeft" ? -0.15 : 0.15),
        );
      else if (event.key === "ArrowUp" || event.key === "ArrowDown")
        c.setPolarAngle(
          c.getPolarAngle() + (event.key === "ArrowUp" ? -0.12 : 0.12),
        );
      else {
        const distance = camera.position.distanceTo(c.target);
        const factor = event.key === "-" ? 1.15 : 1 / 1.15;
        camera.position
          .sub(c.target)
          .setLength(
            Math.max(c.minDistance, Math.min(c.maxDistance, distance * factor)),
          )
          .add(c.target);
      }
      c.update();
      invalidate();
    };
    el.addEventListener("keydown", key);
    return () => el.removeEventListener("keydown", key);
  }, [camera, gl, invalidate]);

  return (
    <>
      <color attach="background" args={["#0a1523"]} />
      <fog attach="fog" args={["#0a1523", 12, 26]} />
      <ambientLight intensity={1.4} />
      <directionalLight position={[4, 8, 5]} intensity={2.25} color="#d2e9f4" />
      <directionalLight position={[-4, 2, -4]} intensity={3.8} color="#648cff" />
      <gridHelper position-y={-2.9} args={[36, 60, "#28485b", "#182e40"]} />
      <group>
        <mesh>
          <cylinderGeometry args={[0.07, 0.07, 4.75, 12]} />
          <meshStandardMaterial color="#759cae" />
        </mesh>
        {layers.map((l, i) => (
          <Plate
            key={l.id}
            i={i}
            active={selected === i}
            selectedUnitId={selectedUnitId}
            select={() => select(i)}
            selectUnit={(uId) => selectUnit?.(uId)}
          />
        ))}
      </group>
      <ConnectionArcs
        selected={selected}
        selectedUnitId={selectedUnitId}
        selectedDivisionId={selectedDivisionId}
        showConnections={showConnections}
      />
      <group>
        {divisions.map((div, idx) => {
          const [dx, dy, dz] = divisionWorldPosition(idx);
          const angle = (idx * 2 * Math.PI) / divisions.length;
          const isDivActive = selectedDivisionId === div.id;
          const h = 0.14 + Math.min(0.28, div.profileCount * 0.004);
          return (
            <mesh
              key={div.id}
              position={[dx, dy + h / 2 - 0.07, dz]}
              rotation-y={angle}
              onClick={(e) => {
                if (e.delta < 5) {
                  e.stopPropagation();
                  selectDivision?.(isDivActive ? null : div.id);
                }
              }}
            >
              <boxGeometry args={[0.12, h, 0.22]} />
              <meshStandardMaterial
                color={isDivActive ? "#e6b978" : "#67e8d2"}
                roughness={0.3}
                metalness={0.4}
              />
            </mesh>
          );
        })}
      </group>
      <mesh position-y={-2.8} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[3.22, 3.25, 144]} />
        <meshBasicMaterial color="#416778" />
      </mesh>
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping={false}
        minDistance={5.4}
        maxDistance={17}
        minPolarAngle={0.28}
        maxPolarAngle={Math.PI * 0.67}
        onStart={() => flight.current?.kill()}
      />
    </>
  );
}

export default function Scene(props: Props) {
  const labels = useRef<(HTMLSpanElement | null)[]>([]);
  const [supported, setSupported] = useState(false);
  const fail = useRef(props.fail);
  useEffect(() => {
    const probe = document.createElement("canvas").getContext("webgl2");
    if (!probe) {
      fail.current();
      return;
    }
    probe.getExtension("WEBGL_lose_context")?.loseContext();
    setSupported(true);
  }, []);
  if (!supported)
    return (
      <p role="status" className="notice">
        Checking spatial rendering…
      </p>
    );
  return (
    <>
      <Canvas
        aria-label="Five suspended organizational layers"
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [7.5, 5.4, 9], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
      >
        <World {...props} />
        <LabelPositions labels={labels} />
      </Canvas>
      <div aria-hidden="true" className="scene-labels">
        {layers.map((l, i) => (
          <span
            className={"callout" + (props.selected === i ? " current" : "")}
            key={l.id}
            ref={(el) => {
              labels.current[i] = el;
            }}
          >
            0{l.rank} / {l.label}
          </span>
        ))}
      </div>
    </>
  );
}
