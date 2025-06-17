import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SpeakerLoudIcon } from "@radix-ui/react-icons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function SourceControl({ onAddSource, onAddMicrophone }: {
  onAddSource: () => void;
  onAddMicrophone: () => void;
}) {
  return (
    <Card className="fixed left-4 top-4 w-64 bg-background/95 backdrop-blur">
      <CardHeader>
        <CardTitle>Fuentes y Micrófonos</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sources">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sources">Fuentes</TabsTrigger>
            <TabsTrigger value="mics">Micrófonos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources" className="space-y-4">
            <div className="mt-4">
              <Button 
                onClick={onAddSource}
                className="w-full"
                variant="outline"
              >
                <SpeakerLoudIcon className="mr-2 h-4 w-4" />
                Añadir Fuente
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="mics" className="space-y-4">
            <div className="mt-4">
              <Button 
                onClick={onAddMicrophone}
                className="w-full" 
                variant="outline"
              >
                
                Añadir Micrófono
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}