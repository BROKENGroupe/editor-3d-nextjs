import { Badge } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Slider } from "../../components/ui/slider";
import { Button } from "../../components/ui/button";




export function AcousticPanel() {
  return (
    <Card className="fixed right-0 top-0 h-screen w-80 p-6 space-y-6 bg-background/90 backdrop-blur">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Control Acústico</h2>
        <Badge>Medición en Tiempo Real</Badge>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Nivel de Sonido (dB)</label>
          <div className="text-3xl font-bold">85 dB</div>
          <Slider
            defaultValue={[85]}
            max={120}
            min={30}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Frecuencias Críticas</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Button variant="outline" size="sm">Bajos</Button>
            <Button variant="outline" size="sm">Medios</Button>
            <Button variant="outline" size="sm">Altos</Button>
          </div>
        </div>
      </div>
    </Card>
  )
}