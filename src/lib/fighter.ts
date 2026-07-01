import { TYPES, MOVE_TEMPLATES, MOVE_NOUNS, typeByKey } from "./data";
import { hashString, mulberry32 } from "./rng";
import { Fighter, Move } from "./types";

export function detectType(text: string): string | null {
  if (!text) return null;
  const scores: Record<string, number> = {};
  TYPES.forEach((t) => {
    scores[t.key] = 0;
  });
  TYPES.forEach((t) => {
    t.keywords.forEach((kw) => {
      if (text.indexOf(kw) !== -1) scores[t.key] += 1;
    });
  });
  let best: string | null = null;
  let bestScore = 0;
  TYPES.forEach((t) => {
    if (scores[t.key] > bestScore) {
      bestScore = scores[t.key];
      best = t.key;
    }
  });
  return best;
}

function pickUnique<T>(rng: () => number, arr: T[], n: number): T[] {
  const pool = arr.slice();
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const idx = Math.floor(rng() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

function generateMoves(rng: () => number, typeKey: string): Move[] {
  const templates = pickUnique(rng, MOVE_TEMPLATES, 4);
  const nouns = MOVE_NOUNS[typeKey];
  const moves: Move[] = [];
  for (let i = 0; i < 4; i++) {
    const noun = nouns[Math.floor(rng() * nouns.length)];
    const name = templates[i].replace("○○", noun);
    const power = 35 + Math.floor(rng() * 56);
    moves.push({ name, power });
  }
  return moves;
}

export function generateFighter(name: string, text: string, forcedTypeKey?: string | null): Fighter {
  const cleanName = name && name.trim() ? name.trim() : "名無しさん";
  let typeKey = forcedTypeKey || detectType(text || "");
  const seedBase = cleanName + "|" + (text || "") + "|" + (typeKey || "");
  let seed = hashString(seedBase || Math.random() + "");
  if (!typeKey) {
    const rngType = mulberry32(seed);
    typeKey = TYPES[Math.floor(rngType() * TYPES.length)].key;
    seed = hashString(seedBase + typeKey);
  }
  const rng = mulberry32(seed);
  const type = typeByKey(typeKey);
  const hp = 70 + Math.floor(rng() * 61);
  const atk = 40 + Math.floor(rng() * 81);
  const def = 40 + Math.floor(rng() * 81);
  const spd = 40 + Math.floor(rng() * 81);
  const moves = generateMoves(rng, typeKey);
  return {
    name: cleanName,
    typeKey,
    type,
    hp,
    maxHp: hp,
    atk,
    def,
    spd,
    moves,
    currentHp: hp,
  };
}

export function typeEffectiveness(attackerKey: string, defenderKey: string): { mult: number; label: string | null } {
  let ai = -1;
  let di = -1;
  for (let i = 0; i < TYPES.length; i++) {
    if (TYPES[i].key === attackerKey) ai = i;
    if (TYPES[i].key === defenderKey) di = i;
  }
  const diff = ((di - ai) % TYPES.length + TYPES.length) % TYPES.length;
  if (diff === 1 || diff === 2) return { mult: 1.6, label: "抜群だ！" };
  if (diff === 6 || diff === 7) return { mult: 0.6, label: "いまひとつのようだ…" };
  return { mult: 1.0, label: null };
}

export function calcLevel(f: Fighter): number {
  return Math.max(5, Math.min(99, Math.round((f.hp + f.atk + f.def + f.spd) / 8)));
}
