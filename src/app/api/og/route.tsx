import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { decodeOgData } from "@/lib/ogPayload";
import { computeSpriteRects } from "@/lib/spriteRects";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const d = searchParams.get("d");
  const decoded = d ? decodeOgData(d) : null;

  if (!decoded) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "#0b0e1a",
            color: "#ffe66d",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          つぶやきバトラー
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const { winner, loser, finishingMove, winnerBadgeTier } = decoded;
  const spriteSize = 220;
  const winnerRects = computeSpriteRects(winner, false, winnerBadgeTier, spriteSize);
  const loserRects = computeSpriteRects(loser, true, 0, spriteSize);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#0b0e1a",
          position: "relative",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 16, left: 16, right: 16, bottom: 16, border: "8px solid #ffe66d" }} />
        <div style={{ display: "flex", position: "absolute", top: 30, left: 30, right: 30, bottom: 30, border: "3px solid #4a5a8a" }} />

        <div style={{ display: "flex", width: "100%", justifyContent: "center", color: "#7fe7ff", fontSize: 26, marginTop: 50 }}>
          つぶやきバトラー - BATTLE RESULT
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: "center", color: "#ffe66d", fontSize: 54, fontWeight: 700, marginTop: 18 }}>
          {winner.name} の勝利！
        </div>

        <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "flex-start", marginTop: 30, flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 420 }}>
            <div style={{ display: "flex", color: winner.type.color, fontSize: 26, fontWeight: 700 }}>[{winner.type.label}]</div>
            <div style={{ display: "flex", color: "#eaf0ff", fontSize: 30, fontWeight: 700, marginTop: 6 }}>{winner.name}</div>
            <div style={{ display: "flex", position: "relative", width: spriteSize, height: spriteSize, marginTop: 16 }}>
              {winnerRects.map((r, i) => (
                <div key={i} style={{ display: "flex", position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, background: r.color }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", color: "#ff4d6d", fontSize: 46, fontWeight: 700, marginTop: 60 }}>VS</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 420 }}>
            <div style={{ display: "flex", color: "#e24b4a", fontSize: 26, fontWeight: 700 }}>[{loser.type.label}]</div>
            <div style={{ display: "flex", color: "#9db4d8", fontSize: 30, fontWeight: 700, marginTop: 6 }}>{loser.name}</div>
            <div style={{ display: "flex", position: "relative", width: spriteSize, height: spriteSize, marginTop: 16 }}>
              {loserRects.map((r, i) => (
                <div key={i} style={{ display: "flex", position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, background: r.color }} />
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", width: "100%", justifyContent: "center", color: "#cdd9f5", fontSize: 20, marginBottom: 18 }}>
          決まり技：「{finishingMove || "不明の一撃"}」
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: "center", color: "#00c2ff", fontSize: 22, fontWeight: 700, marginBottom: 44 }}>
          #つぶやきバトラー
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
