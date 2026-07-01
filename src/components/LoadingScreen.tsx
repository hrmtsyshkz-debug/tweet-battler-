"use client";

import { useEffect, useRef, useState } from "react";

const TIPS = ["投稿データを解析中...", "属性を判定中...", "ステータスを算出中...", "固有技を生成中...", "対戦カードを準備中..."];

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [tipIdx, setTipIdx] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    let current = 0;
    const iv = setInterval(() => {
      current += 8 + Math.random() * 10;
      if (current > 100) current = 100;
      setPct(current);
      setTipIdx(Math.min(TIPS.length - 1, Math.floor((current / 100) * TIPS.length)));
      if (current >= 100) {
        clearInterval(iv);
        setTimeout(() => doneRef.current(), 250);
      }
    }, 140);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="panel">
      <div className="loading">
        <div className="msg">NOW GENERATING...</div>
        <div className="bar-outer">
          <div className="bar-inner" style={{ width: pct + "%" }} />
        </div>
        <div className="tip">{TIPS[tipIdx]}</div>
      </div>
    </div>
  );
}
