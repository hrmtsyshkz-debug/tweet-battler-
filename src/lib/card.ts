import { drawSpriteToCanvas } from "./sprite";
import { Fighter } from "./types";

const FONT = "'Hiragino Maru Gothic ProN', 'BIZ UDPGothic', 'Yu Gothic UI', sans-serif";

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawResultCard(
  canvas: HTMLCanvasElement,
  winner: Fighter,
  loser: Fighter,
  finishingMove: string | null,
  winnerBadgeTier: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.fillStyle = "#eef3fb";
  ctx.fillRect(0, 0, w, h);

  roundedRectPath(ctx, 20, 20, w - 40, h - 40, 28);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#dde8f2";
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "#3a9ee0";
  ctx.font = `700 20px ${FONT}`;
  ctx.fillText("つぶやきバトラー - BATTLE RESULT", w / 2, 74);

  ctx.fillStyle = "#d4537e";
  ctx.font = `700 42px ${FONT}`;
  ctx.fillText(winner.name + " の勝利！", w / 2, 132);

  ctx.font = `700 22px ${FONT}`;
  ctx.fillStyle = winner.type.color;
  ctx.fillText("[" + winner.type.label + "]", w * 0.27, 182);
  ctx.fillStyle = loser.type.color;
  ctx.fillText("[" + loser.type.label + "]", w * 0.73, 182);

  ctx.font = `700 28px ${FONT}`;
  ctx.fillStyle = "#22303c";
  ctx.fillText(winner.name, w * 0.27, 220);
  ctx.fillStyle = "#6b7a86";
  ctx.fillText(loser.name, w * 0.73, 220);

  const plateY = 246;
  const plateSize = 150;
  [w * 0.27, w * 0.73].forEach((cx) => {
    roundedRectPath(ctx, cx - plateSize / 2, plateY, plateSize, plateSize, 26);
    ctx.fillStyle = "#eef3fb";
    ctx.fill();
  });

  ctx.beginPath();
  ctx.arc(w / 2, plateY + plateSize / 2, 30, 0, Math.PI * 2);
  ctx.fillStyle = "#3a9ee0";
  ctx.fill();
  ctx.font = `700 22px ${FONT}`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("VS", w / 2, plateY + plateSize / 2 + 8);

  const offA = document.createElement("canvas");
  offA.width = 140;
  offA.height = 140;
  drawSpriteToCanvas(offA, winner, false, winnerBadgeTier);
  const offB = document.createElement("canvas");
  offB.width = 140;
  offB.height = 140;
  drawSpriteToCanvas(offB, loser, true, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offA, w * 0.27 - 70, plateY + 5, 140, 140);
  ctx.drawImage(offB, w * 0.73 - 70, plateY + 5, 140, 140);

  ctx.font = `500 18px ${FONT}`;
  ctx.fillStyle = "#6b7a86";
  ctx.fillText("決まり技：「" + (finishingMove || "不明の一撃") + "」", w / 2, plateY + plateSize + 36);

  ctx.font = `400 14px ${FONT}`;
  ctx.fillStyle = "#9fb0bd";
  ctx.fillText("あなたのSNSも自動でキャラ化されます", w / 2, plateY + plateSize + 66);

  ctx.font = `700 16px ${FONT}`;
  ctx.fillStyle = "#3a9ee0";
  ctx.fillText("#つぶやきバトラー", w / 2, plateY + plateSize + 92);
}
