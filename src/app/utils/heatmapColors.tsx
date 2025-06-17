// heatmapColors.ts
import chroma from "chroma-js";

// Escala viridis manual (hex stops)
const viridisColors = [
  "#440154",
  "#482777",
  "#3e4989",
  "#31688e",
  "#26828e",
  "#1f9e89",
  "#35b779",
  "#6ece58",
  "#b5de2b",
  "#fde725",
];
const viridisScale = chroma.scale(viridisColors).domain([30, 100]);

export interface DecibelColorRange {
  min: number;
  max: number;
  color: string; // HEX o rgba
  label: string;
}

export const HEATMAP_COLOR_RANGES: DecibelColorRange[] = [
  {
    min: 0,
    max: 30,
    color: "#00bcd4", // celeste
    label: "Muy bajo",
  },
  {
    min: 31,
    max: 50,
    color: "#4caf50", // verde
    label: "Bajo",
  },
  {
    min: 51,
    max: 65,
    color: "#ffeb3b", // amarillo
    label: "Moderado",
  },
  {
    min: 66,
    max: 80,
    color: "#ff9800", // naranja
    label: "Alto",
  },
  {
    min: 81,
    max: 100,
    color: "#f44336", // rojo
    label: "Crítico",
  },
];

export function valueToColor(value: number): { r: number; g: number; b: number } {
  // Para compatibilidad, mantenemos la función clásica
  const min = 30;
  const max = 100;
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));

  let r = 0,
    g = 0,
    b = 0;

  if (t < 0.25) {
    r = 0;
    g = Math.floor(255 * (t / 0.25));
    b = 255;
  } else if (t < 0.5) {
    r = Math.floor(255 * ((t - 0.25) / 0.25));
    g = 255;
    b = 255 - r;
  } else if (t < 0.75) {
    r = 255;
    g = Math.floor((255 * (0.75 - t)) / 0.25);
    b = 0;
  } else {
    r = 255;
    g = 0;
    b = 0;
  }

  return { r, g, b };
}

// Escala profesional viridis para heatmap realista
export function valueToColorChroma(value: number): { r: number; g: number; b: number } {
  const color = viridisScale(value).rgb(); // [r, g, b]
  return { r: Math.round(color[0]), g: Math.round(color[1]), b: Math.round(color[2]) };
}

