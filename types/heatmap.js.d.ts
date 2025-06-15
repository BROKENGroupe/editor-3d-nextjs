declare module 'heatmap.js' {
  export interface HeatmapConfiguration {
    container: HTMLElement;
    radius?: number;
    maxOpacity?: number;
    minOpacity?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }

  export interface HeatmapDataPoint {
    x: number;
    y: number;
    value: number;
  }

  export interface HeatmapData {
    max: number;
    min?: number;
    data: HeatmapDataPoint[];
  }

  export interface Heatmap {
    setData(data: HeatmapData): void;
    addData(point: HeatmapDataPoint): void;
    repaint(): void;
    getData(): HeatmapData;
    getValueAt(x: number, y: number): number;
  }

  export function create(config: HeatmapConfiguration): Heatmap;

  export default {
    create: create,
  };
}
