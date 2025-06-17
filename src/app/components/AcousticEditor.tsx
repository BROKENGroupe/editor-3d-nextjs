'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Badge } from '@/components/ui/badge';

type AcousticPoint = {
  id: string;
  x: number;
  y: number;
  z: number;
  db: number;
};

type Props = {
  points: AcousticPoint[];
  onChange: (points: AcousticPoint[]) => void;
};

function getDbLevel(db: number) {
  if (db >= 80) return { color: "destructive", text: "Peligroso" };
  if (db >= 70) return { color: "warning", text: "Alto" };
  if (db >= 60) return { color: "default", text: "Medio" };
  return { color: "secondary", text: "Bajo" };
}

export default function AcousticEditor({ points, onChange }: Props) {
  const [localPoints, setLocalPoints] = useState(points);

  const handleChange = (index: number, field: keyof AcousticPoint, value: string) => {
    const updated = [...localPoints];
    const updatedPoint = { ...updated[index], [field]: field === 'id' ? value : parseFloat(value) };
    updated[index] = updatedPoint;
    setLocalPoints(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    const newPoint: AcousticPoint = {
      id: crypto.randomUUID(),
      x: 0,
      y: 0,
      z: 0,
      db: 50
    };
    const updated = [...localPoints, newPoint];
    setLocalPoints(updated);
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    const updated = [...localPoints];
    updated.splice(index, 1);
    setLocalPoints(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {localPoints.map((point, index) => (
        <div key={point.id} className="grid grid-cols-[repeat(4,1fr)_auto_auto] gap-2 items-center">
          <Input
            type="number"
            value={point.x}
            onChange={(e) => handleChange(index, 'x', e.target.value)}
            className="w-full"
            placeholder="X"
          />
          <Input
            type="number"
            value={point.y}
            onChange={(e) => handleChange(index, 'y', e.target.value)}
            className="w-full"
            placeholder="Y"
          />
          <Input
            type="number"
            value={point.z}
            onChange={(e) => handleChange(index, 'z', e.target.value)}
            className="w-full"
            placeholder="Z"
          />
          <Input
            type="number"
            value={point.db}
            onChange={(e) => handleChange(index, 'db', e.target.value)}
            className="w-full"
            placeholder="dB"
          />
          <Badge variant={getDbLevel(point.db).color as any}>
            {getDbLevel(point.db).text}
          </Badge>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDelete(index)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleAdd}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Añadir Punto
      </Button>
    </div>
  );
}
