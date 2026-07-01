import { typeByKey } from "./data";
import { Fighter } from "./types";

interface ChallengeData {
  n: string;
  tk: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  mv: [string, number][];
}

export function encodeChallenge(f: Fighter): string {
  const data: ChallengeData = {
    n: f.name,
    tk: f.typeKey,
    hp: f.hp,
    atk: f.atk,
    def: f.def,
    spd: f.spd,
    mv: f.moves.map((m) => [m.name, m.power]),
  };
  const json = JSON.stringify(data);
  const b64 = typeof window === "undefined" ? Buffer.from(json, "utf-8").toString("base64") : btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeChallenge(encoded: string): Fighter | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(b64, "base64").toString("utf-8");
    const data: ChallengeData = JSON.parse(json);
    const moves = (data.mv || []).map(([name, power]) => ({ name, power }));
    const hp = Math.max(1, data.hp | 0);
    return {
      name: String(data.n).slice(0, 24),
      typeKey: data.tk,
      type: typeByKey(data.tk),
      hp,
      maxHp: hp,
      atk: data.atk | 0,
      def: data.def | 0,
      spd: data.spd | 0,
      moves: moves.slice(0, 4),
      currentHp: hp,
    };
  } catch {
    return null;
  }
}
