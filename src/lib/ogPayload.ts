import { typeByKey } from "./data";
import { Fighter } from "./types";

export interface OgData {
  wn: string;
  wt: string;
  wh: number;
  wa: number;
  wd: number;
  ws: number;
  ln: string;
  lt: string;
  lh: number;
  la: number;
  ld: number;
  ls: number;
  fm: string;
  bt: number;
  vd: string;
}

function toMiniFighter(name: string, typeKey: string, hp: number, atk: number, def: number, spd: number): Fighter {
  return {
    name,
    typeKey,
    type: typeByKey(typeKey),
    hp,
    maxHp: hp,
    atk,
    def,
    spd,
    moves: [],
    currentHp: hp,
  };
}

export function encodeOgData(
  winner: Fighter,
  loser: Fighter,
  finishingMove: string | null,
  winnerBadgeTier: number,
  verdict?: string
): string {
  const data: OgData = {
    wn: winner.name,
    wt: winner.typeKey,
    wh: winner.hp,
    wa: winner.atk,
    wd: winner.def,
    ws: winner.spd,
    ln: loser.name,
    lt: loser.typeKey,
    lh: loser.hp,
    la: loser.atk,
    ld: loser.def,
    ls: loser.spd,
    fm: finishingMove || "",
    bt: winnerBadgeTier,
    vd: verdict || "",
  };
  const json = JSON.stringify(data);
  const b64 = typeof window === "undefined" ? Buffer.from(json, "utf-8").toString("base64") : btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeOgData(
  encoded: string
): { winner: Fighter; loser: Fighter; finishingMove: string | null; winnerBadgeTier: number; verdict: string } | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(b64, "base64").toString("utf-8");
    const data: OgData = JSON.parse(json);
    const winner = toMiniFighter(data.wn, data.wt, data.wh, data.wa, data.wd, data.ws);
    const loser = toMiniFighter(data.ln, data.lt, data.lh, data.la, data.ld, data.ls);
    return { winner, loser, finishingMove: data.fm || null, winnerBadgeTier: data.bt || 0, verdict: data.vd || "" };
  } catch {
    return null;
  }
}
