"use client";

import { useEffect, useState } from "react";
import { isSoundOn, setSoundOn } from "@/lib/sound";

export function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(isSoundOn());
  }, []);

  function handleClick() {
    const next = !on;
    setOn(next);
    setSoundOn(next);
  }

  return (
    <div style={{ textAlign: "right" }}>
      <button className="small" type="button" onClick={handleClick}>
        効果音：{on ? "ON" : "OFF"}
      </button>
    </div>
  );
}
