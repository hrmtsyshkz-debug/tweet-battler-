import { ACCESSORY } from "./data";
import { hashString, mulberry32 } from "./rng";
import { SPRITE_TEMPLATES, TEMPLATE_EYE_COL_L, TEMPLATE_EYE_COL_R, TEMPLATE_EYE_ROW } from "./spriteTemplates";
import { Fighter } from "./types";

export const SPRITE_W = 14;
export const SPRITE_H = 14;

export function shadeColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function spriteSeedBase(fighter: Fighter): string {
  return fighter.name + "|" + fighter.typeKey + "|sprite|" + fighter.hp + "-" + fighter.atk + "-" + fighter.def + "-" + fighter.spd;
}

export function isShinyFighter(f: Fighter): boolean {
  return hashString(spriteSeedBase(f) + "|shiny") % 32 === 0;
}

export const SHINY_BODY_COLOR = "#f0c33c";

export function spriteBodyColor(fighter: Fighter): string {
  return isShinyFighter(fighter) ? SHINY_BODY_COLOR : fighter.type.color;
}

/**
 * Classifies a filled sprite cell as "highlight" | "base" | "shadow" based on
 * its neighbors, to give the pixel-art a simple top-left lit look.
 * Top edge (no filled neighbor above) wins over the shadow rules.
 */
export function spriteCellTone(grid: number[][], x: number, y: number): "highlight" | "base" | "shadow" {
  const h = grid.length;
  const w = grid[0]?.length ?? 0;
  const hasUp = y > 0 && !!grid[y - 1][x];
  const hasDown = y < h - 1 && !!grid[y + 1][x];
  const hasRight = x < w - 1 && !!grid[y][x + 1];

  if (!hasUp) return "highlight";
  if (!hasDown) return "shadow";
  if (!hasRight && y >= h / 2) return "shadow";
  return "base";
}

/**
 * Resolves the fill color for a given sprite cell, applying spriteCellTone
 * shading on top of the fighter's base body color (normal or shiny).
 */
export function spriteCellColor(fighter: Fighter, grid: number[][], x: number, y: number): string {
  const tone = spriteCellTone(grid, x, y);
  const shiny = isShinyFighter(fighter);
  const base = shiny ? SHINY_BODY_COLOR : fighter.type.color;
  if (tone === "highlight") return shiny ? "#fbe89a" : shadeColor(base, 18);
  if (tone === "shadow") return shadeColor(base, shiny ? -45 : -30);
  return base;
}

export function generateSpriteGrid(fighter: Fighter): number[][] {
  const seedStr = spriteSeedBase(fighter);
  const rng = mulberry32(hashString(seedStr));
  if (SPRITE_TEMPLATES.length > 0) {
    const template = SPRITE_TEMPLATES[Math.floor(rng() * SPRITE_TEMPLATES.length)];
    return template.map((row) => row.slice());
  }
  const W = SPRITE_W;
  const H = SPRITE_H;
  const grid: number[][] = [];
  for (let y = 0; y < H; y++) grid.push(new Array(W).fill(0));
  const half = Math.ceil(W / 2);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < half; x++) {
      const dx = x - (half - 1);
      const dy = y - (H / 2 - 0.5);
      const dist = Math.sqrt(dx * dx * 1.3 + dy * dy);
      const maxDist = Math.sqrt((half - 1) * (half - 1) * 1.3 + (H / 2) * (H / 2));
      const prob = 0.92 - (dist / maxDist) * 0.75;
      const filled = rng() < prob ? 1 : 0;
      grid[y][x] = filled;
      grid[y][W - 1 - x] = filled;
    }
  }
  let count = 0;
  grid.forEach((row) => row.forEach((c) => { if (c) count++; }));
  if (count < W * H * 0.25) {
    for (let y = 2; y <= 5; y++) {
      for (let x = 3; x <= 5; x++) grid[y][x] = 1;
    }
  }
  return grid;
}

function drawEyePixel(ctx: CanvasRenderingContext2D, col: number, row: number, cell: number, offsetX: number, offsetY: number) {
  if (row < 0) return;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(offsetX + col * cell, offsetY + row * cell, cell, cell);
  ctx.fillStyle = "#111111";
  ctx.fillRect(
    offsetX + col * cell + Math.floor(cell * 0.3),
    offsetY + row * cell + Math.floor(cell * 0.3),
    Math.ceil(cell * 0.4),
    Math.ceil(cell * 0.4)
  );
}

export function drawSpriteToCanvas(canvas: HTMLCanvasElement | null, fighter: Fighter, mirror: boolean, badgeTier: number) {
  if (!canvas) return;
  const grid = generateSpriteGrid(fighter);
  const W = SPRITE_W;
  const H = SPRITE_H;
  const cell = Math.floor(canvas.width / W);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const offsetX = Math.floor((canvas.width - cell * W) / 2);
  const offsetY = canvas.height - cell * H - Math.floor(cell * 0.4);
  const bodyColor = spriteBodyColor(fighter);
  const outline = shadeColor(bodyColor, -70);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!grid[y][x]) continue;
      const dx = mirror ? W - 1 - x : x;
      const hasUp = y > 0 && grid[y - 1][x];
      const hasDown = y < H - 1 && grid[y + 1][x];
      const hasLeft = x > 0 && grid[y][x - 1];
      const hasRight = x < W - 1 && grid[y][x + 1];
      ctx.fillStyle = spriteCellColor(fighter, grid, x, y);
      ctx.fillRect(offsetX + dx * cell, offsetY + y * cell, cell, cell);
      ctx.fillStyle = outline;
      if (!hasUp) ctx.fillRect(offsetX + dx * cell, offsetY + y * cell, cell, Math.max(1, Math.floor(cell * 0.15)));
      if (!hasDown)
        ctx.fillRect(offsetX + dx * cell, offsetY + (y + 1) * cell - Math.max(1, Math.floor(cell * 0.15)), cell, Math.max(1, Math.floor(cell * 0.15)));
      if (!hasLeft) ctx.fillRect(offsetX + dx * cell, offsetY + y * cell, Math.max(1, Math.floor(cell * 0.15)), cell);
      if (!hasRight)
        ctx.fillRect(offsetX + (dx + 1) * cell - Math.max(1, Math.floor(cell * 0.15)), offsetY + y * cell, Math.max(1, Math.floor(cell * 0.15)), cell);
    }
  }
  const eyeRow = TEMPLATE_EYE_ROW;
  const eyeColL = TEMPLATE_EYE_COL_L;
  const eyeColR = TEMPLATE_EYE_COL_R;
  drawEyePixel(ctx, mirror ? W - 1 - eyeColL : eyeColL, eyeRow, cell, offsetX, offsetY);
  drawEyePixel(ctx, mirror ? W - 1 - eyeColR : eyeColR, eyeRow, cell, offsetX, offsetY);
  const acc = ACCESSORY[fighter.typeKey] || [];
  acc.forEach((p) => {
    const ax = mirror ? W - 1 - p[0] : p[0];
    ctx.fillStyle = p[2];
    ctx.fillRect(offsetX + ax * cell, offsetY + p[1] * cell, cell, cell);
  });
  const tier = badgeTier || 0;
  if (tier > 0) {
    const badgeSize = Math.max(2, Math.min(Math.floor(cell * 0.55), offsetY));
    const badgeY = Math.max(0, offsetY - badgeSize - 1);
    for (let bi = 0; bi < Math.min(tier, 3); bi++) {
      const bx = mirror ? W - 2 - bi : 1 + bi;
      ctx.fillStyle = "#ffe66d";
      ctx.fillRect(offsetX + bx * cell + Math.floor((cell - badgeSize) / 2), badgeY, badgeSize, badgeSize);
    }
  }
}
