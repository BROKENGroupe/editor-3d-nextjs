/**
 * Fórmula de Sabine para RT60 (tiempo de reverberación)
 * @param volume Volumen del recinto (m³)
 * @param area Área total de superficies (m²)
 * @param avgAbsorption Absorción media (coeficiente entre 0 y 1)
 */
export function sabineRT60(volume: number, area: number, avgAbsorption: number): number {
  if (avgAbsorption === 0) return Infinity;
  return 0.161 * volume / (area * avgAbsorption);
}