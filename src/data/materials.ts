export type AcousticMaterial = {
  name: string;
  absorption: number; // coeficiente entre 0 y 1
};

export const acousticMaterials: AcousticMaterial[] = [
  { name: "Vidrio", absorption: 0.05 },
  { name: "Concreto", absorption: 0.1 },
  { name: "Madera", absorption: 0.3 },
  { name: "Espuma acústica", absorption: 0.9 },
  { name: "Cortina gruesa", absorption: 0.6 },
];
 