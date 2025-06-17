import { HeatmapShaderMaterial } from '../src/app/shaders/HeatmapShaderMaterial '; // ajusta el path

declare global {
  namespace JSX {
    interface IntrinsicElements {
      heatmapShaderMaterial: ReactThreeFiber.Object3DNode<
        typeof HeatmapShaderMaterial & {
          prototype: InstanceType<typeof HeatmapShaderMaterial>;
        },
        typeof HeatmapShaderMaterial
      >;
    }
  }
}
