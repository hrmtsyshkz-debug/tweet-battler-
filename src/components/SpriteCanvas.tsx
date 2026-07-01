"use client";

import { useEffect, useRef } from "react";
import { drawSpriteToCanvas } from "@/lib/sprite";
import { Fighter } from "@/lib/types";

export function SpriteCanvas({
  fighter,
  mirror,
  badgeTier,
  size,
  className,
}: {
  fighter: Fighter;
  mirror: boolean;
  badgeTier: number;
  size: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    drawSpriteToCanvas(ref.current, fighter, mirror, badgeTier);
  }, [fighter, mirror, badgeTier]);

  return <canvas ref={ref} width={size} height={size} className={className} />;
}
