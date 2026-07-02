"use client";

import { useEffect, useRef } from "react";
import { drawResultCard } from "@/lib/card";
import { encodeOgData } from "@/lib/ogPayload";
import { playVictory } from "@/lib/sound";
import { BattleResult, Fighter } from "@/lib/types";
import { generateVerdict } from "@/lib/verdict";

export function ResultScreen({
  fighterA,
  battleResult,
  badgeTierA,
  newTitles,
  trainingGains,
  onReset,
}: {
  fighterA: Fighter;
  battleResult: BattleResult;
  badgeTierA: number;
  newTitles: string[];
  trainingGains?: string | null;
  onReset: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const victoryPlayedRef = useRef(false);
  const { winner, loser, finishingMove } = battleResult;
  const winnerIsPlayer = winner === fighterA;
  const verdict = generateVerdict(fighterA);

  useEffect(() => {
    if (canvasRef.current) {
      drawResultCard(canvasRef.current, winner, loser, finishingMove, winnerIsPlayer ? badgeTierA : 0, verdict);
    }
  }, [winner, loser, finishingMove, winnerIsPlayer, badgeTierA, verdict]);

  useEffect(() => {
    if (victoryPlayedRef.current) return;
    victoryPlayedRef.current = true;
    playVictory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "tsubuyaki-battle-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function buildShareUrl() {
    const encoded = encodeOgData(winner, loser, finishingMove, winnerIsPlayer ? badgeTierA : 0, verdict);
    return `${window.location.origin}/r/${encoded}`;
  }

  function handleShare() {
    const text = `${winner.name}が${loser.name}を「${finishingMove || "謎の一撃"}」で撃破。診断→「${verdict}」 #つぶやきバトラー`;
    const shareUrl = buildShareUrl();
    const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(shareUrl);
    window.open(url, "_blank");
  }

  function handlePreviewOg() {
    window.open(buildShareUrl(), "_blank");
  }

  return (
    <div className="panel">
      <div className="result">
        {newTitles.length > 0 && <div className="newtitle-banner">称号解除！「{newTitles.join("」「")}」</div>}
        {trainingGains && <div className="newtitle-banner">{trainingGains}</div>}
        <canvas id="card" width={900} height={560} ref={canvasRef} />
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>決まり技：「{finishingMove || "不明の一撃"}」</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--accent-2)", marginTop: 4 }}>診断：{verdict}</div>
        </div>
        <div>
          <button className="small" type="button" onClick={handleDownload}>
            画像をダウンロード
          </button>
          <button className="small" type="button" onClick={handleShare}>
            Xでシェア
          </button>
          <button className="small" type="button" onClick={handlePreviewOg}>
            OGP画像ページを開く
          </button>
          <button className="small" type="button" onClick={onReset}>
            もう一度あそぶ
          </button>
        </div>
      </div>
    </div>
  );
}
