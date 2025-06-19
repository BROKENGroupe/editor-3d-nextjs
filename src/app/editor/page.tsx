"use client";

import { AcousticPanel } from "@/app/editor/acoustic-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecommendations } from "@/lib/acustic-engine";
import { useState } from "react";
import initialpoints from "../../data/points-dummy.json";
import AcousticEditor from "./AcousticEditor";
import { MainNav } from "@/components/main-nav";
import Scene3D from "./scene3D";
import { CollapsibleAside } from "./asside-lateral";
import { DraggablePanel } from "./daggable-panel";
import { LayerViewer, LayerVisibility } from "./layer-viewer";
import { LayerPanel } from "./layer-panel";

const defaultVisibility: LayerVisibility = {
  sources: true,
  microphones: true,
  heatmap: true,
  cube: true,
};

export default function AcousticStudy() {
  const [points, setPoints] = useState(initialpoints);
  const [layerVisibility, setLayerVisibility] =
    useState<LayerVisibility>(defaultVisibility);
  const [selectedLayer, setSelectedLayer] = useState<string | undefined>(
    undefined
  );

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
            {/* Puedes agregar más paneles aquí si lo deseas */}
          </CollapsibleAside>
        </div>
      </main>

      <DraggablePanel>
        {/* Aquí tu contenido, por ejemplo: */}
        <p>¡Puedes moverme por toda la interfaz!</p>
      </DraggablePanel>
    </>
  );
}
