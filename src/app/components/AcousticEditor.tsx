'use client';

import { useState } from 'react';

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
    <div className="w-full p-4 bg-white rounded shadow max-h-[50vh] overflow-auto">
      <h2 className="text-xl font-bold mb-2">Acoustic Points</h2>
      {localPoints.map((point, index) => (
        <div key={point.id} className="flex gap-2 mb-2 items-center">
          <input
            type="number"
            className="border p-1 w-14"
            value={point.x}
            onChange={(e) => handleChange(index, 'x', e.target.value)}
            placeholder="X"
          />
          <input
            type="number"
            className="border p-1 w-14"
            value={point.y}
            onChange={(e) => handleChange(index, 'y', e.target.value)}
            placeholder="Y"
          />
          <input
            type="number"
            className="border p-1 w-14"
            value={point.z}
            onChange={(e) => handleChange(index, 'z', e.target.value)}
            placeholder="Z"
          />
          <input
            type="number"
            className="border p-1 w-16"
            value={point.db}
            onChange={(e) => handleChange(index, 'db', e.target.value)}
            placeholder="dB"
          />
          <button
            onClick={() => handleDelete(index)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      ))}
      <button onClick={handleAdd} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
        + Add Point
      </button>
    </div>
  );
}
