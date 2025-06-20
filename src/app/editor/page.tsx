"use client";

import { useState } from "react";
import { LayerPanel, LayerVisibility } from "./layer-panel";
import { DraggablePanel } from "./daggable-panel";
import { CollapsibleAside } from "./asside-lateral";
import { MainNav } from "@/components/main-nav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import AcousticEditor from "./AcousticEditor";
import Scene3D from "./scene3D";
import initialpoints from "../../data/points-dummy.json";
import { getRecommendations } from "@/lib/acustic-engine";

const defaultVisibility: LayerVisibility = {
  sources: true,
  microphones: true,
  heatmap: true,
  cube: true,
};

const initialCubeConfig = {
  width: 6,
  height: 3,
  depth: 6,
  wallConfig: {
    north: {
      material: "concrete",
      absorption: 0.2,
      thickness: 0.2,
      color: "#cccccc",
    },
    south: {
      material: "concrete",
      absorption: 0.2,
      thickness: 0.2,
      color: "#cccccc",
    },
    east: {
      material: "brick",
      absorption: 0.15,
      thickness: 0.15,
      color: "#b87333",
    },
    west: {
      material: "brick",
      absorption: 0.15,
      thickness: 0.15,
      color: "#b87333",
    },
    floor: {
      material: "wood",
      absorption: 0.1,
      thickness: 0.1,
      color: "#deb887",
    },
    ceiling: {
      material: "acoustic_panel",
      absorption: 0.5,
      thickness: 0.05,
      color: "#e0e0e0",
    },
  },
  preset: "",
  temperature: 22,
  humidity: 45,
  listenerHeight: 1.2,
  showAxes: true,
  background: "#222831",
};

export default function AcousticStudy() {
  const [points, setPoints] = useState(initialpoints);
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibility>(
    defaultVisibility
  );
  const [selectedLayer, setSelectedLayer] = useState<string | undefined>(
    undefined
  );
  const [cubeConfig, setCubeConfig] = useState(initialCubeConfig);

  const recommendations = getRecommendations(points, { mode: "day" });

  return (
    <>
      <div className="bg-background">
        <header className="fixed top-0 z-50 w-full border-b bg-background backdrop-blur">
          <div className="container flex h-14 items-center">
            <MainNav />
          </div>
        </header>
      </div>

      <main className="container-fluid pt-14 h-86">
        <div className="flex flex-col md:flex-row items-start">
          {/* Aside izquierdo */}
          <CollapsibleAside side="left">
            <Card>
              <CardHeader>
                <CardTitle>Control de Puntos</CardTitle>
              </CardHeader>
              <CardContent>
                <AcousticEditor points={points} onChange={setPoints} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className={`text-sm ${
                        rec.includes("⚠️")
                          ? "text-yellow-500"
                          : rec.includes("🚨")
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </CollapsibleAside>

          {/* Área de trabajo 3D en el centro */}
          <section className="w-full flex flex-col items-center justify-center">
            <div
              className="h-[85vh] w-full rounded-lg border bg-card flex items-center justify-center"
              id="work-area"
            >
              <Scene3D width={6} height={3} depth={6} />
            </div>
          </section>

          {/* Aside derecho */}
          <CollapsibleAside side="right">
            <LayerPanel
              visibility={layerVisibility}
              onChange={setLayerVisibility}
              selected={selectedLayer}
              onSelect={setSelectedLayer}
            />
          </CollapsibleAside>
        </div>
      </main>

      <DraggablePanel
        initialPosition={{ x: 20, y: 20 }}
        cubeConfig={cubeConfig}
        onConfigChange={(config) => setCubeConfig(config)}
      />
    </>
  );
}
