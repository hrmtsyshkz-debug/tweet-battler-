import { typeByKey } from "./data";
import { spriteSeedOf } from "./sprite";
import { Fighter, SavedFighter } from "./types";

export const TRAINED_KEY = "tsubuyakiBattlerTrained_v1";
const MAX_TOTAL_GAINED = 60;

export interface TrainedData {
  fighter: SavedFighter;
  spriteSeed: string;
  totalGained: number;
  battles: number;
}

export function loadTrained(): TrainedData | null {
  try {
    const raw = localStorage.getItem(TRAINED_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj && obj.fighter) return obj;
    }
  } catch {
    // ignore
  }
  return null;
}

function saveTrained(t: TrainedData) {
  try {
    localStorage.setItem(TRAINED_KEY, JSON.stringify(t));
  } catch {
    // ignore
  }
}

export function clearTrained(): void {
  try {
    localStorage.removeItem(TRAINED_KEY);
  } catch {
    // ignore
  }
}

export function registerTrained(f: Fighter): TrainedData {
  const saved: SavedFighter = {
    name: f.name,
    typeKey: f.typeKey,
    hp: f.hp,
    atk: f.atk,
    def: f.def,
    spd: f.spd,
    moves: f.moves,
  };
  const data: TrainedData = {
    fighter: saved,
    spriteSeed: spriteSeedOf(f),
    totalGained: 0,
    battles: 0,
  };
  saveTrained(data);
  return data;
}

export function trainedToFighter(t: TrainedData): Fighter {
  const sf = t.fighter;
  return {
    name: sf.name,
    typeKey: sf.typeKey,
    type: typeByKey(sf.typeKey),
    hp: sf.hp,
    maxHp: sf.hp,
    atk: sf.atk,
    def: sf.def,
    spd: sf.spd,
    moves: sf.moves,
    currentHp: sf.hp,
    spriteSeed: t.spriteSeed,
  };
}

const STAT_KEYS: Array<"hp" | "atk" | "def" | "spd"> = ["hp", "atk", "def", "spd"];

export function applyTrainingResult(didWin: boolean): { gains: Partial<{ hp: number; atk: number; def: number; spd: number }>; capped: boolean } | null {
  const t = loadTrained();
  if (!t) return null;

  if (t.totalGained >= MAX_TOTAL_GAINED) {
    return { gains: {}, capped: true };
  }

  const points = didWin ? 3 : 1;
  const gains: Partial<{ hp: number; atk: number; def: number; spd: number }> = {};
  let pointsUsed = 0;

  for (let i = 0; i < points; i++) {
    if (t.totalGained + pointsUsed >= MAX_TOTAL_GAINED) break;
    const stat = STAT_KEYS[Math.floor(Math.random() * STAT_KEYS.length)];
    const amount = stat === "hp" ? 2 : 1;
    gains[stat] = (gains[stat] || 0) + amount;
    t.fighter[stat] += amount;
    pointsUsed += 1;
  }

  t.totalGained += pointsUsed;
  t.battles += 1;
  saveTrained(t);

  return { gains, capped: false };
}
