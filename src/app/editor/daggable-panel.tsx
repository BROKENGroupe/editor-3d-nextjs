import React, { useRef, useState } from "react";

type DraggablePanelProps = {
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  className?: string;
};

export function DraggablePanel({
  children,
  initialPosition = { x: 100, y: 100 },
  className,
}: DraggablePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    document.body.style.userSelect = "none";
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const onMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  // Attach/detach listeners
  React.useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    // eslint-disable-next-line
  }, [dragging, offset]);

  return (
    <div
      ref={panelRef}
      className={`
        fixed z-50 bg-background/90 shadow-lg rounded-lg border
        ${className ?? ""}
        ${dragging ? "cursor-grabbing" : "cursor-grab"}
      `}
      style={{
        left: position.x,
        top: position.y,
        minWidth: 240,
        minHeight: 80,
        transition: dragging ? "none" : "box-shadow 0.2s",
      }}
    >
      {/* Barra de arrastre */}
      <div
        className="w-full px-4 py-2 border-b bg-muted rounded-t-lg cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onMouseDown}
      >
        <span className="font-semibold text-sm">Panel flotante</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}