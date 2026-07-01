"use client";

import { useEffect, useState } from "react";
import { encodeChallenge } from "@/lib/challenge";
import { Fighter } from "@/lib/types";

export function ChallengeOverlay({ fighter, onClose }: { fighter: Fighter | null; onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (fighter && typeof window !== "undefined") {
      setUrl(`${window.location.origin}/challenge/${encodeChallenge(fighter)}`);
      setCopied(false);
    }
  }, [fighter]);

  if (!fighter) return null;

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => setCopied(true));
  }

  function handleShare() {
    const text = `${fighter!.name}からの挑戦状！受けて立つ？ #つぶやきバトラー`;
    const shareUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url);
    window.open(shareUrl, "_blank");
  }

  return (
    <div className="overlay">
      <div className="overlay-box">
        <h3>{fighter.name} の挑戦状</h3>
        <div className="scan-status">このURLを送ると、開いた相手がすぐあなたに挑戦できます</div>
        <input type="text" readOnly value={url} onFocus={(e) => e.target.select()} />
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button className="small" type="button" onClick={handleCopy}>
            {copied ? "コピーしました" : "URLをコピー"}
          </button>
          <button className="small" type="button" onClick={handleShare}>
            Xでシェア
          </button>
        </div>
        <div className="overlay-close">
          <button className="small" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
