"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

type CollapsibleAsideProps = {
  side: "left" | "right";
  children: ReactNode;
  className?: string;
};

export function CollapsibleAside({ side, children, className }: CollapsibleAsideProps) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Móvil: Sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`fixed top-20 z-40 ${side === "left" ? "left-2" : "right-2"}`}
            >
              {side === "left" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </Button>
          </SheetTrigger>
          <SheetContent side={side} className="w-72 p-0">
            {children}
          </SheetContent>
        </Sheet>
      </div>
      {/* Escritorio: colapsable */}
      <div
        className={`hidden md:block transition-all duration-300 ${
          open ? "md:basis-1/6" : "md:basis-0"
        } flex-shrink-0 relative ${className ?? ""}`}
        style={{ minWidth: open ? 240 : 0, maxWidth: open ? 350 : 0 }}
      >
        <div className={`absolute top-2 ${side === "left" ? "right-[-18px]" : "left-[-18px]"}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((v) => !v)}
            className="border"
            aria-label={open ? "Ocultar panel" : "Mostrar panel"}
          >
            {side === "left"
              ? open
                ? <ChevronLeftIcon />
                : <ChevronRightIcon />
              : open
                ? <ChevronRightIcon />
                : <ChevronLeftIcon />}
          </Button>
        </div>
        <div className={`transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {open && children}
        </div>
      </div>
    </>
  );
}