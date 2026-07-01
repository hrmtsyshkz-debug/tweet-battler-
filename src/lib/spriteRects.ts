import { ACCESSORY } from "./data";
import { generateSpriteGrid, shadeColor, SPRITE_H, SPRITE_W } from "./sprite";
import { TEMPLATE_EYE_COL_L, TEMPLATE_EYE_COL_R, TEMPLATE_EYE_ROW } from "./spriteTemplates";
import { Fighter } from "./types";

export interface SpriteRect {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

/**
 * Same geometry as drawSpriteToCanvas, but returns a flat list of rectangles
 * instead of drawing to a 2D canvas context, so it can be rendered as JSX
 * <div> elements inside a satori-based ImageResponse (next/og) which has no
 * canvas access.
 */
export function computeSpriteRects(
  fighter: Fighter,
  mirror: boolean,
  badgeTier: number,
  canvasSize: number
): SpriteRect[] {
  const grid = generateSpriteGrid(fighter);
  const W = SPRITE_W;
  const H = SPRITE_H;
  const cell = Math.floor(canvasSize / W);
  const offsetX = Math.floor((canvasSize - cell * W) / 2);
  const offsetY = canvasSize - cell * H - Math.floor(cell * 0.4);
  const bodyColor = fighter.type.color;
  const outline = shadeColor(bodyColor, -70);
  const thin = Math.max(1, Math.floor(cell * 0.15));
  const rects: SpriteRect[] = [];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!grid[y][x]) continue;
      const dx = mirror ? W - 1 - x : x;
      const hasUp = y > 0 && grid[y - 1][x];
      const hasDown = y < H - 1 && grid[y + 1][x];
      const hasLeft = x > 0 && grid[y][x - 1];
      const hasRight = x < W - 1 && grid[y][x + 1];
      rects.push({ x: offsetX + dx * cell, y: offsetY + y * cell, w: cell, h: cell, color: bodyColor });
      if (!hasUp) rects.push({ x: offsetX + dx * cell, y: offsetY + y * cell, w: cell, h: thin, color: outline });
      if (!hasDown) rects.push({ x: offsetX + dx * cell, y: offsetY + (y + 1) * cell - thin, w: cell, h: thin, color: outline });
      if (!hasLeft) rects.push({ x: offsetX + dx * cell, y: offsetY + y * cell, w: thin, h: cell, color: outline });
      if (!hasRight) rects.push({ x: offsetX + (dx + 1) * cell - thin, y: offsetY + y * cell, w: thin, h: cell, color: outline });
    }
  }

  const eyeRow = TEMPLATE_EYE_ROW;
  const eyeColL = TEMPLATE_EYE_COL_L;
  const eyeColR = TEMPLATE_EYE_COL_R;
  [eyeColL, eyeColR].forEach((col) => {
    const c = mirror ? W - 1 - col : col;
    rects.push({ x: offsetX + c * cell, y: offsetY + eyeRow * cell, w: cell, h: cell, color: "#ffffff" });
    rects.push({
      x: offsetX + c * cell + Math.floor(cell * 0.3),
      y: offsetY + eyeRow * cell + Math.floor(cell * 0.3),
      w: Math.ceil(cell * 0.4),
      h: Math.ceil(cell * 0.4),
      color: "#111111",
    });
  });

  const acc = ACCESSORY[fighter.typeKey] || [];
  acc.forEach((p) => {
    const ax = mirror ? W - 1 - p[0] : p[0];
    rects.push({ x: offsetX + ax * cell, y: offsetY + p[1] * cell, w: cell, h: cell, color: p[2] });
  });

  const tier = badgeTier || 0;
  if (tier > 0) {
    const badgeSize = Math.max(2, Math.min(Math.floor(cell * 0.55), offsetY));
    const badgeY = Math.max(0, offsetY - badgeSize - 1);
    for (let bi = 0; bi < Math.min(tier, 3); bi++) {
      const bx = mirror ? W - 2 - bi : 1 + bi;
      rects.push({ x: offsetX + bx * cell + Math.floor((cell - badgeSize) / 2), y: badgeY, w: badgeSize, h: badgeSize, color: "#ffe66d" });
    }
  }

  return rects;
}
