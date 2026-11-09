"use client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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
import { divisions, layers, yFor } from "../lib/model";
type Props = {
  selected: number | null;
  select: (index: number) => void;
  reset: number;
  quiet: boolean;
  fail: () => void;
};
const radii = [1.18, 1.48, 1.92, 2.22, 2.48];
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
function Plate({
  i,
  active,
  select,
}: {
  i: number;
  active: boolean;
  select: () => void;
}) {
  const r = radii[i],
    accent = active ? "#9bf9df" : "#4489ab";
  const fins = useMemo(() => radial(32, r * 0.73, 0.21), [r]);
  const cores = useMemo(() => radial(i === 3 ? 4 : 8, r * 0.45, 0.22), [i, r]);
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
          color={active ? "#347582" : "#294759"}
          metalness={0.52}
          roughness={0.32}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[r, r, 0.085, 8]} />
        <meshStandardMaterial
          color={active ? "#579b9f" : "#46667e"}
          roughness={0.45}
          metalness={0.4}
        />
      </mesh>
      <mesh position-y={0.051}>
        <cylinderGeometry args={[r * 0.97, r * 0.97, 0.018, 8]} />
        <meshStandardMaterial color="#172e43" />
      </mesh>
      <mesh position-y={0.07} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[r * 0.825, r * 0.84, 64]} />
        <meshBasicMaterial color={accent} />
      </mesh>
      <Repeated
        points={fins}
        width={0.042}
        depth={0.07}
        height={0.29}
        color="#8ca6b4"
      />
      <Repeated
        points={cores}
        width={i === 3 ? r * 0.48 : r * 0.3}
        depth={i === 3 ? r * 0.5 : r * 0.26}
        height={i === 3 ? 0.53 : 0.34}
        color={active ? "#78b1b8" : "#577a92"}
      />
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
function World({ selected, select, reset, quiet, fail }: Props) {
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
      selected === null ? -0.28 : yFor(selected) * 0.72,
      0,
    );
    const direction =
      selected === null
        ? new Vector3(6, 3.8, 8).normalize()
        : from.clone().sub(origin).normalize();
    const distance = selected === null ? 12.3 : 9.2;
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
  const anchors = useMemo(() => radial(divisions.length, 3.1, -2.74), []);
  return (
    <>
      <color attach="background" args={["#0a1523"]} />
      <fog attach="fog" args={["#0a1523", 11, 24]} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[4, 8, 5]} intensity={2.2} color="#d2e9f4" />
      <directionalLight position={[-4, 2, -4]} intensity={4} color="#648cff" />
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
            select={() => select(i)}
          />
        ))}
      </group>
      <Repeated
        points={anchors}
        width={0.09}
        height={0.14}
        depth={0.18}
        color="#71d0c6"
      />
      <mesh position-y={-2.8} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[3.08, 3.09, 144]} />
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
