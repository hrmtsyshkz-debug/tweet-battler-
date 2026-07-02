export interface Move {
  name: string;
  power: number;
}

export interface TypeInfo {
  key: string;
  label: string;
  color: string;
  keywords: string[];
}

export interface Fighter {
  name: string;
  typeKey: string;
  type: TypeInfo;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  spd: number;
  moves: Move[];
  currentHp: number;
}

export type Side = "A" | "B";

export interface LogEntry {
  text: string;
  cls: "" | "event" | "crit";
  kind: "move" | "event" | "hit" | "faint";
  actor?: Side;
  target?: Side;
  dmg?: number;
  crit?: boolean;
  hpA: number;
  hpB: number;
}

export interface BattleResult {
  log: LogEntry[];
  winner: Fighter;
  loser: Fighter;
  finishingMove: string | null;
}

export interface SavedFighter {
  name: string;
  typeKey: string;
  hp: number;
  atk: number;
  def: number;
  spd: number;
  moves: Move[];
}

export interface Profile {
  battles: number;
  wins: number;
  streak: number;
  bestStreak: number;
  xp: number;
  titles: string[];
  lastFighter?: SavedFighter | null;
  dexCount?: number;
}
