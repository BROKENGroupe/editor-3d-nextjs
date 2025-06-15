declare module "simpleheat" {
  interface Point {
    x: number;
    y: number;
    value?: number;
  }

  export default class SimpleHeat {
    constructor(canvas: HTMLCanvasElement | OffscreenCanvas);

    data(points: [number, number, number?][]): SimpleHeat;
    max(value: number): SimpleHeat;
    radius(r: number, blur?: number): SimpleHeat;
    draw(minOpacity?: number): SimpleHeat;
    clear(): void;
  }
}
