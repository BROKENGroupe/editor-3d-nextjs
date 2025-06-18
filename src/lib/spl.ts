/**
 * Cálculo de SPL en un punto dado una fuente puntual.
 * Lp = Lw + 10*log10(Q/(4πr²)) - αr
 */
export function calculateSPL(
  Lw: number,      // Potencia sonora de la fuente (dB)
  Q: number,       // Directividad (1 = omnidireccional)
  r: number,       // Distancia (m)
  alpha: number    // Coeficiente de absorción lineal
): number {
  if (r < 0.1) r = 0.1; // Evitar infinito
  const Lp = Lw + 10 * Math.log10(Q / (4 * Math.PI * r * r)) - alpha * r;
  return Lp;
}