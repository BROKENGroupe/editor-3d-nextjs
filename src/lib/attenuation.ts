/**
 * Atenuación por distancia en campo libre (bares/discotecas suelen ser recintos grandes).
 * @param db Nivel inicial (dB)
 * @param distance Distancia en metros
 */
export function attenuationFreeField(db: number, distance: number): number {
  return db - 20 * Math.log10(distance);
}

/**
 * Atenuación por absorción de material.
 * @param db Nivel inicial (dB)
 * @param absorptivity Coeficiente de absorción [0-1]
 */
export function absorbByMaterial(db: number, absorptivity: number): number {
  return db * (1 - absorptivity);
}

