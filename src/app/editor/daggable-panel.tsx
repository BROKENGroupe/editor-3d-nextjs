"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const MATERIALS = [
  { label: "Hormigón", value: "concrete" },
  { label: "Ladrillo", value: "brick" },
  { label: "Madera", value: "wood" },
  { label: "Vidrio", value: "glass" },
  { label: "Panel acústico", value: "acoustic_panel" },
];

const PRESETS = [
  { label: "Sala de conciertos", value: "concert" },
  { label: "Aula", value: "classroom" },
  { label: "Bar", value: "bar" },
  { label: "Discoteca", value: "club" },
];

const WALLS = [
  { key: "north", label: "Norte" },
  { key: "south", label: "Sur" },
  { key: "east", label: "Este" },
  { key: "west", label: "Oeste" },
  { key: "floor", label: "Piso" },
  { key: "ceiling", label: "Techo" },
];

type WallKey = "north" | "south" | "east" | "west" | "floor" | "ceiling";

type WallConfig = {
  material: string;
  absorption: number;
  thickness: number;
  color: string;
};

type CubeConfig = {
  width: number;
  height: number;
  depth: number;
  wallConfig: Record<WallKey, WallConfig>;
  preset: string;
  temperature: number;
  humidity: number;
  listenerHeight: number;
  showAxes: boolean;
  background: string;
};

type DraggablePanelProps = {
  initialPosition?: { x: number; y: number };
  className?: string;
  cubeConfig?: CubeConfig;
  onConfigChange?: (config: CubeConfig) => void;
};

export function DraggablePanel({
  initialPosition = { x: 100, y: 100 },
  className,
  cubeConfig,
  onConfigChange,
}: DraggablePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tab, setTab] = useState("general");
  const [openWalls, setOpenWalls] = useState<string[]>(["north"]);

  const defaultWall: WallConfig = {
    material: "concrete",
    absorption: 0.2,
    thickness: 0.2,
    color: "#cccccc",
  };

  const [localConfig, setLocalConfig] = useState<CubeConfig>(
    cubeConfig || {
      width: 6,
      height: 3,
      depth: 6,
      wallConfig: {
        north: { ...defaultWall },
        south: { ...defaultWall },
        east: { ...defaultWall },
        west: { ...defaultWall },
        floor: { ...defaultWall },
        ceiling: { ...defaultWall },
      },
      preset: "",
      temperature: 20,
      humidity: 50,
      listenerHeight: 1.2,
      showAxes: true,
      background: "#222831",
    }
  );

  React.useEffect(() => {
    if (cubeConfig) setLocalConfig(cubeConfig);
  }, [cubeConfig]);

  // Handler for preset selection
  const handlePreset = (value: string) => {
    handleConfigChange("preset", value);
  };

  const handleConfigChange = (field: keyof CubeConfig, value: any) => {
    const newConfig = { ...localConfig, [field]: value };
    setLocalConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handleWallChange = (wall: WallKey, field: keyof WallConfig, value: any) => {
    const newWallConfig = {
      ...localConfig.wallConfig,
      [wall]: { ...localConfig.wallConfig[wall], [field]: value },
    };
    handleConfigChange("wallConfig", newWallConfig);
  };

  // Drag logic
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    document.body.style.userSelect = "none";
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const onMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line
  }, [dragging, offset]);

  return (
    <div
      ref={panelRef}
      className={`
        fixed z-50 bg-background/95 border rounded-lg shadow-lg
        ${className ?? ""}
        ${dragging ? "cursor-grabbing" : "cursor-grab"}
        w-[340px] min-w-[280px] max-w-[95vw]
      `}
      style={{
        left: position.x,
        top: position.y,
        minHeight: 80,
        transition: dragging ? "none" : "box-shadow 0.2s",
      }}
    >
      {/* Barra de arrastre */}
      <div
        className="w-full px-4 py-2 border-b bg-muted rounded-t-lg cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
      >
        <span className="font-semibold text-sm">Configuración Avanzada</span>
      </div>
      <div className="p-4 pt-2">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="walls">Paredes</TabsTrigger>
            <TabsTrigger value="amb">Ambiente</TabsTrigger>
            <TabsTrigger value="vis">Visual</TabsTrigger>
          </TabsList>
          {/* General */}
          <TabsContent value="general">
            <div className="space-y-4">
              <div>
                <Label className="mb-1 block text-xs font-semibold">Preset de recinto</Label>
                <Select value={localConfig.preset} onValueChange={handlePreset}>
                  <SelectTrigger className="w-full text-xs">
                    <SelectValue placeholder="Selecciona un preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1 block text-xs font-semibold">Dimensiones (m)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    step={0.1}
                    value={localConfig.width}
                    onChange={e => handleConfigChange("width", Number(e.target.value))}
                    className="w-16 text-xs"
                    placeholder="Ancho"
                  />
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    step={0.1}
                    value={localConfig.height}
                    onChange={e => handleConfigChange("height", Number(e.target.value))}
                    className="w-16 text-xs"
                    placeholder="Alto"
                  />
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    step={0.1}
                    value={localConfig.depth}
                    onChange={e => handleConfigChange("depth", Number(e.target.value))}
                    className="w-16 text-xs"
                    placeholder="Profundidad"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          {/* Paredes */}
          <TabsContent value="walls">
            <Accordion
              type="multiple"
              value={openWalls}
              onValueChange={setOpenWalls}
              className="mt-2"
            >
              {WALLS.map(wall => (
                <AccordionItem key={wall.key} value={wall.key} className="border-b-0">
                  <AccordionTrigger className="text-sm font-semibold px-3">
                    {wall.label}
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <div className="space-y-2 px-3 py-2">
                      <div>
                        <Label className="mb-1 block text-xs">Material</Label>
                        <Select
                          value={localConfig.wallConfig[wall.key as WallKey]?.material}
                          onValueChange={value => handleWallChange(wall.key as WallKey, "material", value)}
                        >
                          <SelectTrigger className="w-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MATERIALS.map(mat => (
                              <SelectItem key={mat.value} value={mat.value}>{mat.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="mb-1 block text-xs">Absorción</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            min={0}
                            max={1}
                            step={0.01}
                            value={[localConfig.wallConfig[wall.key as WallKey]?.absorption]}
                            onValueChange={([v]) => handleWallChange(wall.key as WallKey, "absorption", v)}
                            className="flex-1"
                          />
                          <span className="text-xs w-10 text-right">{((localConfig.wallConfig[wall.key as WallKey]?.absorption ?? 0) * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div>
                        <Label className="mb-1 block text-xs">Espesor (m)</Label>
                        <Input
                          type="number"
                          min={0.05}
                          max={1}
                          step={0.01}
                          value={localConfig.wallConfig[wall.key as WallKey]?.thickness}
                          onChange={e => handleWallChange(wall.key as WallKey, "thickness", Number(e.target.value))}
                          className="w-20 text-xs"
                        />
                      </div>
                      <div>
                        <Label className="mb-1 block text-xs">Color</Label>
                        <Input
                          type="color"
                          value={localConfig.wallConfig[wall.key as WallKey]?.color}
                          onChange={e => handleWallChange(wall.key as WallKey, "color", e.target.value)}
                          className="w-10 h-10 p-0 border-none bg-transparent"
                          style={{ minWidth: 40 }}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          {/* Ambiente */}
          <TabsContent value="amb">
            <div className="space-y-4">
              <div>
                <Label className="mb-1 block text-xs font-semibold">Temperatura (°C)</Label>
                <Input
                  type="number"
                  min={-10}
                  max={40}
                  step={0.1}
                  value={localConfig.temperature}
                  onChange={e => handleConfigChange("temperature", Number(e.target.value))}
                  className="w-20 text-xs"
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs font-semibold">Humedad (%)</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={localConfig.humidity}
                  onChange={e => handleConfigChange("humidity", Number(e.target.value))}
                  className="w-20 text-xs"
                />
              </div>
              <div>
                <Label className="mb-1 block text-xs font-semibold">Altura del oyente (m)</Label>
                <Input
                  type="number"
                  min={0.5}
                  max={2.5}
                  step={0.01}
                  value={localConfig.listenerHeight}
                  onChange={e => handleConfigChange("listenerHeight", Number(e.target.value))}
                  className="w-20 text-xs"
                />
              </div>
            </div>
          </TabsContent>
          {/* Visualización */}
          <TabsContent value="vis">
            <div className="space-y-4">
              <div>
                <Label className="mb-1 block text-xs font-semibold">Mostrar ejes XYZ</Label>
                <Button
                  variant={localConfig.showAxes ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleConfigChange("showAxes", !localConfig.showAxes)}
                >
                  {localConfig.showAxes ? "Sí" : "No"}
                </Button>
              </div>
              <div>
                <Label className="mb-1 block text-xs font-semibold">Color de fondo</Label>
                <Input
                  type="color"
                  value={localConfig.background}
                  onChange={e => handleConfigChange("background", e.target.value)}
                  className="w-10 h-10 p-0 border-none bg-transparent"
                  style={{ minWidth: 40 }}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}