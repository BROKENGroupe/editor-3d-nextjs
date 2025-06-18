/**
 * Calcula la frecuencia de un modo axial en una sala rectangular.
 * @param c Velocidad del sonido (m/s)
 * @param dim Dimensión de la sala (m)
 * @param n Número de modo (1, 2, 3...)
 */
export function axialModeFrequency(c: number, dim: number, n: number): number {
  return (c / 2) * (n / dim);
}