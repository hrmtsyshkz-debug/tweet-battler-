"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { fighterToPayload } from "@/lib/qr";
import { Fighter } from "@/lib/types";

export function QrOverlay({ fighter, onClose }: { fighter: Fighter | null; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fighter || !canvasRef.current) return;
    setError(null);
    QRCode.toCanvas(canvasRef.current, fighterToPayload(fighter), { width: 220, margin: 2 }).catch(() => {
      setError("QR生成に失敗しました。");
    });
  }, [fighter]);

  if (!fighter) return null;

  return (
    <div className="overlay">
      <div className="overlay-box">
        <h3>{fighter.name} のQRバトルカード</h3>
        <div className="qr-target">
          {error ? <span style={{ color: "#e24b4a", fontSize: 12 }}>{error}</span> : <canvas ref={canvasRef} />}
        </div>
        <div className="scan-status">このQRを相手に見せて「QR/バーコードで召喚」から読み取ってもらおう</div>
        <div className="overlay-close">
          <button className="small" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
