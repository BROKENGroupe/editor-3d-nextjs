import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { calculateSPL } from "@/lib/spl";

// --- SHADERS DIRECTAMENTE EN ESTE ARCHIVO ---
const heatmapVertex = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const heatmapFragment = `
uniform sampler2D uData;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;
varying vec2 vUv;
void main() {
    float spl = texture2D(uData, vUv).r;
    vec3 color =
        spl < 0.25 ? mix(uColor1, uColor2, spl / 0.25) :
        spl < 0.5  ? mix(uColor2, uColor3, (spl - 0.25) / 0.25) :
        spl < 0.75 ? mix(uColor3, uColor4, (spl - 0.5) / 0.25) :
                     mix(uColor4, uColor5, (spl - 0.75) / 0.25);
    gl_FragColor = vec4(color, 0.8);
}
`;

type Props = {
  width: number;
  height: number;
  depth: number;
  points?: any[];
  onSelectWall?: (wallId: string, opts?: { contextMenu?: boolean; x?: number; y?: number }) => void;
  wallProps?: Record<string, { material: string; absorption: number; color: string }>;
};

export function HeatmapSurfaces({
  width,
  height,
  depth,
  points = [],
  onSelectWall,
  wallProps = {},
}: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // ✅ Paredes centradas
  const WALLS = [
    { key: "floor", position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0], size: [width, depth] },
    { key: "ceiling", position: [0, height, 0], rotation: [Math.PI / 2, 0, 0], size: [width, depth] },
    { key: "north", position: [0, height / 2, -depth / 2], rotation: [0, 0, 0], size: [width, height] },
    { key: "south", position: [0, height / 2, depth / 2], rotation: [0, Math.PI, 0], size: [width, height] },
    { key: "west", position: [-width / 2, height / 2, 0], rotation: [0, Math.PI / 2, 0], size: [depth, height] },
    { key: "east", position: [width / 2, height / 2, 0], rotation: [0, -Math.PI / 2, 0], size: [depth, height] },
  ] as const;

  const heatmapSegments = 512; // o más
  const extWidth = width * 3;
  const extDepth = depth * 3;

  // Estado para el mapa SPL de la "API"
  const [apiMap, setApiMap] = useState<{ x: number; y: number; spl: number }[]>([]);

  const [fugaX, setFugaX] = useState(width / 8); // posición X de la fuga
  const [fugaY0, setFugaY0] = useState(-depth / 4); // inicio Y de la puerta
  const [fugaY1, setFugaY1] = useState(depth / 4);  // fin Y de la puerta

  // Para actualizar la fuga al hacer submit
  const [fugaParams, setFugaParams] = useState({ fugaX, fugaY0, fugaY1 });

  function handleFugaSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFugaParams({ fugaX, fugaY0, fugaY1 });
  }

  useEffect(() => {
    fetchEscapeSPLMap({
      width: extWidth,
      depth: extDepth,
      segments: heatmapSegments,
      wallProps,
      fugaX: fugaParams.fugaX,
      fugaY0: fugaParams.fugaY0,
      fugaY1: fugaParams.fugaY1,
    }).then(setApiMap);
  }, [width, depth, wallProps, fugaParams]);

  // Convierte el mapa de la API a textura para el shader
  const dataTexture = useMemo(() => {
    if (!apiMap.length) return null;
    const splVals = apiMap.map((p) => p.spl);

    let minSPL = Infinity;
    let maxSPL = -Infinity;
    for (let i = 0; i < splVals.length; i++) {
      if (splVals[i] < minSPL) minSPL = splVals[i];
      if (splVals[i] > maxSPL) maxSPL = splVals[i];
    }
    const normalized = splVals.map((v) => (v - minSPL) / (maxSPL - minSPL));
    const data = new Float32Array(normalized);
    const tex = new THREE.DataTexture(
      data,
      heatmapSegments,
      heatmapSegments,
      THREE.RedFormat,
      THREE.FloatType
    );
    tex.needsUpdate = true;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, [apiMap, heatmapSegments]);

  // Simula una API que devuelve SPL de escape según materiales y absorción
  function fetchEscapeSPLMap({
    width,
    depth,
    segments,
    wallProps,
    fugaX,
    fugaY0,
    fugaY1,
  }: {
    width: number;
    depth: number;
    segments: number;
    wallProps: Record<string, { absorption: number }>;
    fugaX: number;
    fugaY0: number;
    fugaY1: number;
  }): Promise<{ x: number; y: number; spl: number }[]> {
    return new Promise((resolve) => {
      const arr: { x: number; y: number; spl: number }[] = [];
      // Esquina de fuga: superior derecha (+X, +Y)
      const fugaRadio = Math.min(width, depth) * 0.35;
      const baseSPL = 105;
      const minSPL = 40;
      const abs = wallProps?.east?.absorption ?? 0.2;

      for (let ix = 0; ix < segments; ix++) {
        for (let iy = 0; iy < segments; iy++) {
          // x e y en coords del plano exterior
          const x = (ix / (segments - 1)) * width * 3 - width * 3 / 2;
          const y = (iy / (segments - 1)) * depth * 3 - depth * 3 / 2;

          // Distancia a la franja de fuga (puerta)
          // Si y está dentro de la puerta, distancia solo en X; si no, distancia al borde de la puerta
          let distFuga;
          if (y >= fugaY0 && y <= fugaY1) {
            distFuga = Math.abs(x - fugaX);
          } else {
            const dy = y < fugaY0 ? fugaY0 - y : y - fugaY1;
            distFuga = Math.sqrt((x - fugaX) ** 2 + dy ** 2);
          }

          let spl =
            baseSPL -
            (distFuga / fugaRadio) * 60 -
            abs * 40 +
            Math.random() * 2;
          if (spl < minSPL) spl = minSPL;
          arr.push({ x, y, spl });
        }
      }
      setTimeout(() => resolve(arr), 400); // Simula retardo de red
    });
  }

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uColor1: { value: new THREE.Color("#002266") },
        uColor2: { value: new THREE.Color("#00ff00") },
        uColor3: { value: new THREE.Color("#ffff00") },
        uColor4: { value: new THREE.Color("#ff9900") },
        uColor5: { value: new THREE.Color("#ff0000") },
        uData: { value: dataTexture },
      },
      vertexShader: heatmapVertex,
      fragmentShader: heatmapFragment,
      transparent: true,
    }),
    [dataTexture]
  );

  useEffect(() => {
    if (materialRef.current && dataTexture) {
      materialRef.current.uniforms.uData.value = dataTexture;
    }
  }, [dataTexture]);

  return (
    <>
      {/* Cubo centrado */}
      {WALLS.map((wall) => (
        <mesh
          key={wall.key}
          position={wall.position}
          rotation={wall.rotation}
          onClick={(e) => {
            e.stopPropagation();
            onSelectWall?.(wall.key);
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            e.nativeEvent.preventDefault();
            onSelectWall?.(wall.key, {
              contextMenu: true,
              x: e.clientX,
              y: e.clientY,
            });
          }}
        >
          <planeGeometry args={wall.size} />
          <meshStandardMaterial
            color={wallProps?.[wall.key]?.color ?? "#a78bfa"}
            transparent
            opacity={0.4}
            side={2}
          />
        </mesh>
      ))}

      {/* Heatmap centrado bajo el cubo */}
      {dataTexture && (
        <mesh
          position={[0, -0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry
            args={[extWidth, extDepth, heatmapSegments - 1, heatmapSegments - 1]}
          />
          <shaderMaterial
            ref={materialRef}
            attach="material"
            {...shaderArgs}
            uniforms-uData-value={dataTexture}
          />
          {/* Formulario overlay en la escena */}
          <Html position={[0, 0.1, 0]} zIndexRange={[10, 0]}>
            <form
              onSubmit={handleFugaSubmit}
              style={{
                background: "#fff",
                padding: 16,
                borderRadius: 8,
                boxShadow: "0 2px 12px #0002",
                minWidth: 220,
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Configurar Fuga</div>
              <label>
                X (posición puerta):
                <input
                  type="number"
                  step="0.1"
                  value={fugaX}
                  min={-width / 2}
                  max={width / 2}
                  onChange={e => setFugaX(Number(e.target.value))}
                  style={{ width: "100%", marginBottom: 8 }}
                />
              </label>
              <label>
                Y inicio:
                <input
                  type="number"
                  step="0.1"
                  value={fugaY0}
                  min={-depth / 2}
                  max={depth / 2}
                  onChange={e => setFugaY0(Number(e.target.value))}
                  style={{ width: "100%", marginBottom: 8 }}
                />
              </label>
              <label>
                Y fin:
                <input
                  type="number"
                  step="0.1"
                  value={fugaY1}
                  min={-depth / 2}
                  max={depth / 2}
                  onChange={e => setFugaY1(Number(e.target.value))}
                  style={{ width: "100%", marginBottom: 8 }}
                />
              </label>
              <button
                type="submit"
                style={{
                  marginTop: 8,
                  width: "100%",
                  background: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  padding: "8px 0",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Aplicar
              </button>
            </form>
          </Html>
        </mesh>
      )}
    </>
  );
}
