"use client";

import { useState } from "react";

export function TrainerBadge({ handle, size = 22 }: { handle?: string; size?: number }) {
  const [ok, setOk] = useState(true);
  const clean = (handle || "").trim().replace(/^@/, "");
  if (!clean || !ok) return null;
  const url = `https://unavatar.io/x/${encodeURIComponent(clean)}?fallback=false`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      onError={() => setOk(false)}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #ffffff",
        boxShadow: "var(--shadow-soft)",
        verticalAlign: "middle",
        marginLeft: 6,
      }}
    />
  );
}
