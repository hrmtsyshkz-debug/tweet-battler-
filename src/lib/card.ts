import { drawSpriteToCanvas } from "./sprite";
import { Fighter } from "./types";

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
  ctx.fillStyle = "#0b0e1a";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#ffe66d";
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, w - 32, h - 32);
  ctx.strokeStyle = "#4a5a8a";
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, w - 60, h - 60);

  for (let x = 30; x < w - 30; x += 14) {
    ctx.fillStyle = Math.floor(x / 14) % 2 === 0 ? "#ff4d6d" : "#00c2ff";
    ctx.fillRect(x, 30, 7, 4);
    ctx.fillRect(x, h - 34, 7, 4);
  }

  ctx.fillStyle = "#7fe7ff";
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "center";
  ctx.fillText("つぶやきバトラー - BATTLE RESULT", w / 2, 68);

  ctx.fillStyle = "#ffe66d";
  ctx.font = "bold 44px monospace";
  ctx.fillText(winner.name + " の勝利！", w / 2, 130);

  ctx.font = "bold 24px monospace";
  ctx.fillStyle = winner.type.color;
  ctx.fillText("[" + winner.type.label + "]", w * 0.27, 180);
  ctx.fillStyle = "#e24b4a";
  ctx.fillText("[" + loser.type.label + "]", w * 0.73, 180);

  ctx.font = "bold 30px monospace";
  ctx.fillStyle = "#eaf0ff";
  ctx.fillText(winner.name, w * 0.27, 220);
  ctx.fillStyle = "#9db4d8";
  ctx.fillText(loser.name, w * 0.73, 220);

  ctx.font = "bold 40px monospace";
  ctx.fillStyle = "#ff4d6d";
  ctx.fillText("VS", w / 2, 215);

  const offA = document.createElement("canvas");
  offA.width = 140;
  offA.height = 140;
  drawSpriteToCanvas(offA, winner, false, winnerBadgeTier);
  const offB = document.createElement("canvas");
  offB.width = 140;
  offB.height = 140;
  drawSpriteToCanvas(offB, loser, true, 0);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(offA, w * 0.27 - 70, 240, 140, 140);
  ctx.drawImage(offB, w * 0.73 - 70, 240, 140, 140);

  ctx.font = "18px monospace";
  ctx.fillStyle = "#cdd9f5";
  ctx.fillText("決まり技：「" + (finishingMove || "不明の一撃") + "」", w / 2, 410);

  ctx.font = "14px monospace";
  ctx.fillStyle = "#6a7aa8";
  ctx.fillText("あなたのSNSも自動でキャラ化されます", w / 2, 450);

  ctx.font = "bold 16px monospace";
  ctx.fillStyle = "#00c2ff";
  ctx.fillText("#つぶやきバトラー", w / 2, 480);
}
