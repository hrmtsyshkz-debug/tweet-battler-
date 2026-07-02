import { typeByKey } from "./data";
import { dexCount } from "./dex";
import { Fighter, Profile, SavedFighter } from "./types";

export const PROFILE_KEY = "tsubuyakiBattlerProfile_v1";

const EMPTY_PROFILE: Profile = { battles: 0, wins: 0, streak: 0, bestStreak: 0, xp: 0, titles: [] };

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p.xp === "number") return p;
    }
  } catch {
    // ignore
  }
  return { ...EMPTY_PROFILE, titles: [] };
}

export function saveProfile(p: Profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export function xpToLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function computeBadgeTier(): number {
  return Math.min(3, Math.floor(xpToLevel(loadProfile().xp) / 5));
}

export interface TitleMilestone {
  id: string;
  label: string;
  cond: (p: Profile) => boolean;
}

export const TITLE_MILESTONES: TitleMilestone[] = [
  { id: "first_win", label: "はじめての勝利", cond: (p) => p.wins >= 1 },
  { id: "win5", label: "駆け出しバトラー", cond: (p) => p.wins >= 5 },
  { id: "win20", label: "猛者", cond: (p) => p.wins >= 20 },
  { id: "streak3", label: "3連勝ブレイカー", cond: (p) => p.bestStreak >= 3 },
  { id: "streak5", label: "連勝街道まっしぐら", cond: (p) => p.bestStreak >= 5 },
  { id: "battles10", label: "戦い慣れしてきた", cond: (p) => p.battles >= 10 },
  { id: "lv10", label: "自己満Lv10到達", cond: (p) => xpToLevel(p.xp) >= 10 },
  { id: "dex10", label: "図鑑コレクター", cond: (p) => (p.dexCount ?? 0) >= 10 },
  { id: "dex30", label: "図鑑マニア", cond: (p) => (p.dexCount ?? 0) >= 30 },
];

export function titleLabel(id: string): string {
  return TITLE_MILESTONES.find((t) => t.id === id)?.label ?? id;
}

export function toFighterFromSaved(sf: SavedFighter): Fighter {
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
  };
}

export function applyBattleResultToProfile(didWin: boolean, ownFighter?: Fighter): { profile: Profile; newTitles: string[] } {
  const p = loadProfile();
  if (ownFighter) {
    p.lastFighter = {
      name: ownFighter.name,
      typeKey: ownFighter.typeKey,
      hp: ownFighter.hp,
      atk: ownFighter.atk,
      def: ownFighter.def,
      spd: ownFighter.spd,
      moves: ownFighter.moves,
    };
  }
  p.battles += 1;
  p.dexCount = dexCount();
  if (didWin) {
    p.wins += 1;
    p.streak += 1;
    p.xp += 30;
    if (p.streak > p.bestStreak) p.bestStreak = p.streak;
  } else {
    p.streak = 0;
    p.xp += 8;
  }
  const newTitles: string[] = [];
  TITLE_MILESTONES.forEach((t) => {
    if (t.cond(p) && p.titles.indexOf(t.id) === -1) {
      p.titles.push(t.id);
      newTitles.push(t.label);
    }
  });
  saveProfile(p);
  return { profile: p, newTitles };
}
