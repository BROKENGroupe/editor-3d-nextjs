"use client";

import { AcousticPanel } from "@/app/editor/acoustic-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecommendations } from "@/lib/acustic-engine";
import { ReactNode, useState } from "react";
import initialpoints from "../../data/points-dummy.json";
import AcousticEditor from "./AcousticEditor";
import { MainNav } from "@/components/main-nav";
import Scene3D from "./scene3D";
import { CollapsibleAside } from "./asside-lateral";

export default function AcousticStudy() {
  const [points, setPoints] = useState(initialpoints);

  const recommendations = getRecommendations(points, { mode: "day" });

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
        </div>
      </header> */}

      <main className="container py-6">
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
          <section className="w-full  flex flex-col items-center justify-center">
            <div className="h-[80vh] w-full rounded-lg border bg-card flex items-center justify-center">
              <Scene3D width={6} height={3} depth={6} />
            </div>
          </section>

          {/* Aside derecho */}
          <CollapsibleAside side="right">
            <AcousticPanel />
            {/* Puedes agregar más paneles aquí si lo deseas */}
          </CollapsibleAside>
        </div>
      </main>
    </div>
  );
}

