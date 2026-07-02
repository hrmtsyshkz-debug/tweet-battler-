import { Fighter } from "./types";

export const RECORDS_KEY = "tsubuyakiBattlerRecords_v1";

export interface RecordEntry {
  wins: number;
  losses: number;
  name: string;
  last: string;
}

export function opponentKeyFor(xHandleB: string | undefined, fighter: Fighter): string {
  const handle = (xHandleB || "").trim().toLowerCase().replace(/^@/, "");
  if (handle) return "x:" + handle;
  return "f:" + fighter.name + "|" + fighter.typeKey + "|" + fighter.hp + "-" + fighter.atk + "-" + fighter.def + "-" + fighter.spd;
}

export function loadRecords(): Record<string, RecordEntry> {
  try {
    const raw = localStorage.getItem(RECORDS_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      if (obj && typeof obj === "object") return obj;
    }
  } catch {
    // ignore
  }
  return {};
}

export function saveRecords(records: Record<string, RecordEntry>) {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  } catch {
    // ignore
  }
}

export function getRecord(key: string): RecordEntry | null {
  const records = loadRecords();
  return records[key] || null;
}

export function applyResult(key: string, name: string, didWin: boolean): RecordEntry {
  const records = loadRecords();
  const existing = records[key] || { wins: 0, losses: 0, name, last: "" };
  if (didWin) existing.wins += 1;
  else existing.losses += 1;
  existing.name = name;
  existing.last = new Date().toISOString();
  records[key] = existing;
  saveRecords(records);
  return existing;
}
