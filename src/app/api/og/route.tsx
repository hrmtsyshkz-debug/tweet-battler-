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
            background: "#eef3fb",
            color: "#3a9ee0",
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

  const { winner, loser, finishingMove, winnerBadgeTier, verdict } = decoded;
  const spriteSize = 160;
  const plateSize = spriteSize + 40;
  const winnerRects = computeSpriteRects(winner, false, winnerBadgeTier, spriteSize);
  const loserRects = computeSpriteRects(loser, true, 0, spriteSize);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "#eef3fb",
          padding: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            background: "#ffffff",
            borderRadius: 32,
            border: "3px solid #dde8f2",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", width: "100%", justifyContent: "center", color: "#3a9ee0", fontSize: 24, fontWeight: 700, marginTop: 24 }}>
            つぶやきバトラー - BATTLE RESULT
          </div>
          <div style={{ display: "flex", width: "100%", justifyContent: "center", color: "#d4537e", fontSize: 46, fontWeight: 700, marginTop: 10 }}>
            {winner.name} の勝利！
          </div>

          <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "flex-start", marginTop: 12, flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 420 }}>
              <div style={{ display: "flex", color: winner.type.color, fontSize: 24, fontWeight: 700 }}>[{winner.type.label}]</div>
              <div style={{ display: "flex", color: "#22303c", fontSize: 28, fontWeight: 700, marginTop: 6 }}>{winner.name}</div>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  width: plateSize,
                  height: plateSize,
                  marginTop: 14,
                  background: "#eef3fb",
                  borderRadius: 26,
                }}
              >
                {winnerRects.map((r, i) => (
                  <div key={i} style={{ display: "flex", position: "absolute", left: r.x + 20, top: r.y + 20, width: r.w, height: r.h, background: r.color }} />
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                width: 60,
                height: 60,
                borderRadius: 30,
                background: "#3a9ee0",
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 700,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 78,
              }}
            >
              VS
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 420 }}>
              <div style={{ display: "flex", color: loser.type.color, fontSize: 24, fontWeight: 700 }}>[{loser.type.label}]</div>
              <div style={{ display: "flex", color: "#6b7a86", fontSize: 28, fontWeight: 700, marginTop: 6 }}>{loser.name}</div>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  width: plateSize,
                  height: plateSize,
                  marginTop: 14,
                  background: "#eef3fb",
                  borderRadius: 26,
                }}
              >
                {loserRects.map((r, i) => (
                  <div key={i} style={{ display: "flex", position: "absolute", left: r.x + 20, top: r.y + 20, width: r.w, height: r.h, background: r.color }} />
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", width: "100%", justifyContent: "center", color: "#6b7a86", fontSize: 19, marginBottom: 10 }}>
            決まり技：「{finishingMove || "不明の一撃"}」
          </div>
          {verdict ? (
            <div style={{ display: "flex", width: "100%", justifyContent: "center", color: "#d4537e", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
              診断：{verdict}
            </div>
          ) : null}
          <div style={{ display: "flex", width: "100%", justifyContent: "center", color: "#3a9ee0", fontSize: 21, fontWeight: 700, marginBottom: 22 }}>
            #つぶやきバトラー
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
