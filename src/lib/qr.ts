import { typeByKey } from "./data";
import { generateFighter } from "./fighter";
import { Fighter } from "./types";

export const QR_PREFIX = "TB1:";

export function fighterToPayload(f: Fighter): string {
  const data = {
    n: f.name,
    tk: f.typeKey,
    hp: f.hp,
    atk: f.atk,
    def: f.def,
    spd: f.spd,
    mv: f.moves.map((m) => [m.name, m.power]),
  };
  return QR_PREFIX + JSON.stringify(data);
}

export function payloadToFighter(str: string): Fighter | null {
  if (typeof str !== "string" || str.indexOf(QR_PREFIX) !== 0) return null;
  try {
    const obj = JSON.parse(str.slice(QR_PREFIX.length));
    if (!obj || !obj.n || !obj.tk) return null;
    const moves = ((obj.mv || []) as [string, number][]).map((pair) => ({ name: pair[0], power: pair[1] }));
    while (moves.length < 4) moves.push({ name: "たいあたり", power: 40 });
    const hp = Math.max(1, obj.hp | 0);
    return {
      name: String(obj.n).slice(0, 24),
      typeKey: obj.tk,
      type: typeByKey(obj.tk),
      hp,
      maxHp: hp,
      atk: obj.atk | 0,
      def: obj.def | 0,
      spd: obj.spd | 0,
      moves: moves.slice(0, 4),
      currentHp: hp,
    };
  } catch {
    return null;
  }
}

export function fighterFromCode(code: string): Fighter {
  const label = "コード:" + code;
  return generateFighter(label, String(code), null);
}
