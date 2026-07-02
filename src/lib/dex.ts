import { Fighter, SavedFighter } from "./types";

export const DEX_KEY = "tsubuyakiBattlerDex_v1";
const MAX_ENTRIES = 500;

export interface DexEntry {
  key: string;
  fighter: SavedFighter;
  count: number;
  firstSeen: string;
}

function dexEntryKey(f: Pick<Fighter, "name" | "typeKey" | "hp" | "atk" | "def" | "spd">): string {
  return f.name + "|" + f.typeKey + "|" + f.hp + "-" + f.atk + "-" + f.def + "-" + f.spd;
}

export function loadDex(): DexEntry[] {
  try {
    const raw = localStorage.getItem(DEX_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return arr;
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveDex(entries: DexEntry[]) {
  try {
    localStorage.setItem(DEX_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function registerToDex(f: Fighter): { isNew: boolean } {
  const entries = loadDex();
  const key = dexEntryKey(f);
  const existing = entries.find((e) => e.key === key);
  if (existing) {
    existing.count += 1;
    saveDex(entries);
    return { isNew: false };
  }
  if (entries.length >= MAX_ENTRIES) {
    return { isNew: false };
  }
  const saved: SavedFighter = {
    name: f.name,
    typeKey: f.typeKey,
    hp: f.hp,
    atk: f.atk,
    def: f.def,
    spd: f.spd,
    moves: f.moves,
  };
  entries.push({ key, fighter: saved, count: 1, firstSeen: new Date().toISOString() });
  saveDex(entries);
  return { isNew: true };
}

export function dexCount(): number {
  return loadDex().length;
}

export function clearDex(): void {
  try {
    localStorage.removeItem(DEX_KEY);
  } catch {
    // ignore
  }
}
