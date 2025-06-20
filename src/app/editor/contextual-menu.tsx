import { Popover, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const MATERIALS = [
	{ label: "Hormigón", value: "concrete" },
	{ label: "Ladrillo", value: "brick" },
	{ label: "Madera", value: "wood" },
	{ label: "Vidrio", value: "glass" },
	{ label: "Panel acústico", value: "acoustic_panel" },
];

type WallProps = Record<string, { material: string; absorption: number; color: string }>;

export function ContextualMenu({
	open,
	contextMenu,
	wallProps,
	setOpen,
	onAssignMaterial,
	onAbsorption,
	onColor,
	onSave, // <-- Nuevo callback opcional
}: {
	open: boolean;
	contextMenu: { x: number; y: number; wall: string } | null;
	wallProps: WallProps;
	setOpen: (open: boolean) => void;
	onAssignMaterial: (material: string) => void;
	onAbsorption: (absorption: number) => void;
	onColor: (color: string) => void;
	onSave?: (wall: string) => void; // <-- Nuevo prop opcional
}) {
	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverContent
				side="right"
				align="start"
				style={
					contextMenu
						? {
								position: "fixed",
								left: contextMenu.x,
								top: contextMenu.y,
								zIndex: 1000,
								minWidth: 220,
						  }
						: { display: "none" }
				}
				className="p-4"
			>
				{contextMenu && (
					<>
						<div className="font-bold mb-2">Propiedades de {contextMenu.wall}</div>
						<Label className="block mb-1">Material</Label>
						<div className="flex flex-col gap-1 mb-2">
							{MATERIALS.map((mat) => (
								<Button
									key={mat.value}
									variant={
										wallProps[contextMenu.wall]?.material === mat.value
											? "default"
											: "outline"
									}
									size="sm"
									className="w-full justify-start"
									onClick={() => onAssignMaterial(mat.value)}
								>
									{mat.label}
								</Button>
							))}
						</div>
						<Label className="block mb-1 mt-2">Absorción</Label>
						<div className="flex items-center gap-2 mb-2">
							<Slider
								min={0}
								max={1}
								step={0.01}
								value={[
									wallProps[contextMenu.wall]?.absorption ?? 0.2,
								]}
								onValueChange={([v]) => onAbsorption(v)}
								className="flex-1"
							/>
							<span className="text-xs w-10 text-right">
								{((wallProps[contextMenu.wall]?.absorption ?? 0.2) * 100).toFixed(0)}%
							</span>
						</div>
						<Label className="block mb-1 mt-2">Color</Label>
						<Input
							type="color"
							value={wallProps[contextMenu.wall]?.color ?? "#cccccc"}
							onChange={e => onColor(e.target.value)}
							className="w-10 h-10 p-0 border-none bg-transparent"
							style={{ minWidth: 40 }}
						/>
						<div className="mt-4 flex justify-end">
							<Button
								variant="default"
								onClick={() => {
									if (onSave && contextMenu) onSave(contextMenu.wall);
									setOpen(false);
								}}
							>
								Guardar
							</Button>
						</div>
					</>
				)}
			</PopoverContent>
		</Popover>
	);
}
