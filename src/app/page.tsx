"use client";

import { generateExteriorPoints, getRecommendations } from "@/lib/acustic-engine";
import { useState } from "react";
import AcousticEditor from "./components/AcousticEditor";
import Scene3D from "./components/scene3D";
import initialpoints from "../data/points-dummy.json";

export default function VisualizeRoom() {
  const [points, setPoints] = useState(initialpoints);
  const [mode, setMode] = useState<"day" | "night">("day");

  const exteriorPoints = generateExteriorPoints(points);
  const recommendations = getRecommendations(points, { mode });

  return (
    <div className={`min-h-screen ${mode === "night" ? "bg-[#0e0e0e] text-white" : "bg-gray-100 text-gray-800"} transition-colors duration-300`}>
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Acoustic Study</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm">🌞 Day</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={mode === "night"}
              onChange={() => setMode(mode === "day" ? "night" : "day")}
            />
            <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
          </label>
          <span className="text-sm">🌙 Night</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Editor & recommendations */}
        <div className="lg:w-1/3 space-y-6">
          <div className={`p-4 rounded-lg shadow ${mode === "night" ? "bg-[#1a1a1a]" : "bg-white"}`}>
            <h2 className="text-lg font-semibold mb-4">Acoustic Points</h2>
            <AcousticEditor points={points} onChange={setPoints} />
          </div>

          <div className={`p-4 rounded-lg shadow ${mode === "night" ? "bg-[#1a1a1a]" : "bg-white"}`}>
            <h2 className="text-lg font-semibold mb-2">Recommendations</h2>
            {recommendations.length > 0 ? (
              <ul className="list-disc ml-6 space-y-1 text-sm">
                {recommendations.map((rec, i) => (
                  <li key={i}>
                    {rec.includes("⚠️") && <span className="text-yellow-400">{rec}</span>}
                    {rec.includes("🔴") && <span className="text-red-400">{rec}</span>}
                    {!rec.includes("⚠️") && !rec.includes("🔴") && rec}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No recommendations yet.</p>
            )}
          </div>
        </div>

        {/* 3D Scene */}
        <div className="lg:w-2/3">
          <div className={`rounded-lg overflow-hidden shadow ${mode === "night" ? "bg-[#1a1a1a]" : "bg-white"}`}>
            <Scene3D
              width={6}
              height={3}
              depth={6}
              points={points}
              exteriorPoints={exteriorPoints} // <-- Aquí pasas los puntos externos
            />
          </div>
        </div>
      </main>
    </div>
  );
}
