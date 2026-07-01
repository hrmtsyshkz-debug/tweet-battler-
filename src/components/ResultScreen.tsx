"use client";

import { useEffect, useRef } from "react";
import { drawResultCard } from "@/lib/card";
import { encodeOgData } from "@/lib/ogPayload";
import { BattleResult, Fighter } from "@/lib/types";

export function ResultScreen({
  fighterA,
  battleResult,
  badgeTierA,
  newTitles,
  onReset,
}: {
  fighterA: Fighter;
  battleResult: BattleResult;
  badgeTierA: number;
  newTitles: string[];
  onReset: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { winner, loser, finishingMove } = battleResult;
  const winnerIsPlayer = winner === fighterA;

  useEffect(() => {
    if (canvasRef.current) {
      drawResultCard(canvasRef.current, winner, loser, finishingMove, winnerIsPlayer ? badgeTierA : 0);
    }
  }, [winner, loser, finishingMove, winnerIsPlayer, badgeTierA]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "tsubuyaki-battle-result.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function buildShareUrl() {
    const encoded = encodeOgData(winner, loser, finishingMove, winnerIsPlayer ? badgeTierA : 0);
    return `${window.location.origin}/r/${encoded}`;
  }

  function handleShare() {
    const text = `${winner.name}が${loser.name}に「${finishingMove || "謎の一撃"}」で勝利した。 #つぶやきバトラー`;
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
        <canvas id="card" width={900} height={520} ref={canvasRef} />
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
