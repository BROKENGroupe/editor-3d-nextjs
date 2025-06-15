import * as THREE from "three";
import { interpolateIDW } from "./interpolateIDW";
import { AcousticPoint } from "./acustic-engine";
import { valueToColor, valueToColorChroma } from "@/app/utils/heatmapColors";

export function generateIDWTexture(
  points: AcousticPoint[],
  width = 256,
  height = 256
): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, width, height);

  const grid = interpolateIDW(points, 400); // 👈 reduce resolución

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (const p of grid) {
    const x = Math.floor(((p.x + 5) / 10) * width);
    const y = Math.floor(((p.y + 5) / 10) * height);
    const idx = (y * width + x) * 4;
    const color = valueToColorChroma(p.value);

    data[idx] = color.r;
    data[idx + 1] = color.g;
    data[idx + 2] = color.b;
    data[idx + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

