// heatmapColors.ts
import chroma from "chroma-js";

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
  const min = 30;
  const max = 100;
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));

  // Escala basada en dB típica:
  // azul → verde → amarillo → rojo
  let r = 0, g = 0, b = 0;

  if (t < 0.25) {
    // Azul a verde
    r = 0;
    g = Math.floor(255 * (t / 0.25));
    b = 255;
  } else if (t < 0.5) {
    // Verde a amarillo
    r = Math.floor(255 * ((t - 0.25) / 0.25));
    g = 255;
    b = 255 - r;
  } else if (t < 0.75) {
    // Amarillo a naranja
    r = 255;
    g = Math.floor(255 * (0.75 - t) / 0.25);
    b = 0;
  } else {
    // Naranja a rojo intenso
    r = 255;
    g = 0;
    b = 0;
  }

  return { r, g, b };
}



const scale = chroma
  .scale(["blue", "green", "yellow", "red"])
  .domain([30, 100]); // dB mínimo y máximo

export function valueToColorChroma(value: number): { r: number; g: number; b: number } {
  const color = scale(value).rgb(); // [r, g, b]
  return { r: Math.round(color[0]), g: Math.round(color[1]), b: Math.round(color[2]) };
}

