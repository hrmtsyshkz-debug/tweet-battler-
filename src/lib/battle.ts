import { HAPPENINGS } from "./data";
import { typeEffectiveness } from "./fighter";
import { BattleResult, Fighter, LogEntry, Side } from "./types";

export function simulateBattle(a: Fighter, b: Fighter): BattleResult {
  const log: LogEntry[] = [];
  let buffA = 1;
  let buffB = 1;
  let finishingMove: string | null = null;
  let turn = 0;
  const maxTurns = 30;

  function snap() {
    return { hpA: a.currentHp, hpB: b.currentHp };
  }

  function attack(att: Fighter, def: Fighter, buffRef: { v: number }, actorSide: Side, targetSide: Side): boolean {
    const move = att.moves[Math.floor(Math.random() * att.moves.length)];
    const eff = typeEffectiveness(att.typeKey, def.typeKey);
    const variance = 0.85 + Math.random() * 0.3;
    const buffMult = buffRef.v;
    buffRef.v = 1;
    const s0 = snap();
    log.push({ text: att.name + "の" + move.name + "！", cls: "", kind: "move", actor: actorSide, target: targetSide, hpA: s0.hpA, hpB: s0.hpB });
    if (eff.label) log.push({ text: eff.label, cls: "event", kind: "event", actor: actorSide, target: targetSide, hpA: s0.hpA, hpB: s0.hpB });
    const dmg = Math.max(1, Math.round((move.power / 3) * (att.atk / Math.max(20, def.def)) * eff.mult * variance * buffMult));
    def.currentHp = Math.max(0, def.currentHp - dmg);
    const s1 = snap();
    if (buffMult > 1) {
      log.push({ text: "会心の一撃！ " + dmg + "ダメージ！", cls: "crit", kind: "hit", actor: actorSide, target: targetSide, dmg, crit: true, hpA: s1.hpA, hpB: s1.hpB });
    } else {
      log.push({ text: def.name + "に" + dmg + "ダメージ！", cls: "", kind: "hit", actor: actorSide, target: targetSide, dmg, crit: false, hpA: s1.hpA, hpB: s1.hpB });
    }
    finishingMove = move.name;
    return def.currentHp <= 0;
  }

  while (a.currentHp > 0 && b.currentHp > 0 && turn < maxTurns) {
    turn++;
    const seq: Side[] = (a.spd + Math.random() * 20) >= (b.spd + Math.random() * 20) ? ["A", "B"] : ["B", "A"];
    for (let s = 0; s < seq.length; s++) {
      const actorKey = seq[s];
      const targetKey: Side = actorKey === "A" ? "B" : "A";
      const att = actorKey === "A" ? a : b;
      const def = actorKey === "A" ? b : a;
      if (att.currentHp <= 0 || def.currentHp <= 0) continue;

      if (Math.random() < 0.16) {
        const h = HAPPENINGS[Math.floor(Math.random() * HAPPENINGS.length)];
        const msg = h.text.replace("{n}", att.name);
        const se = snap();
        log.push({ text: msg, cls: "event", kind: "event", actor: actorKey, target: targetKey, hpA: se.hpA, hpB: se.hpB });
        if (h.effect === "skip") {
          continue;
        } else if (h.effect === "buff") {
          if (actorKey === "A") buffA = 1.7;
          else buffB = 1.7;
          continue;
        } else if (h.effect === "crit") {
          if (actorKey === "A") buffA = 2.0;
          else buffB = 2.0;
        }
      }

      const bref = { v: actorKey === "A" ? buffA : buffB };
      const fainted = attack(att, def, bref, actorKey, targetKey);
      if (actorKey === "A") buffA = bref.v;
      else buffB = bref.v;
      if (fainted) break;
    }
  }

  let winner: Fighter;
  let loser: Fighter;
  let loserSide: Side;
  if (a.currentHp <= 0 && b.currentHp > 0) {
    winner = b; loser = a; loserSide = "A";
  } else if (b.currentHp <= 0 && a.currentHp > 0) {
    winner = a; loser = b; loserSide = "B";
  } else if (a.currentHp >= b.currentHp) {
    winner = a; loser = b; loserSide = "B";
  } else {
    winner = b; loser = a; loserSide = "A";
  }

  const sf = snap();
  log.push({ text: loser.name + "は倒れた！ " + winner.name + "の勝利！", cls: "crit", kind: "faint", actor: loserSide, hpA: sf.hpA, hpB: sf.hpB });

  return { log, winner, loser, finishingMove };
}

const MAX_ACTIONS = 60;

export interface BattleState {
  a: Fighter;
  b: Fighter;
  buffA: number;
  buffB: number;
  finishingMove: string | null;
  queue: Side[];
  actionsTaken: number;
  over: boolean;
  concludedLogged: boolean;
}

export function createBattleState(a: Fighter, b: Fighter): BattleState {
  return { a, b, buffA: 1, buffB: 1, finishingMove: null, queue: [], actionsTaken: 0, over: false, concludedLogged: false };
}

function fillQueueIfNeeded(state: BattleState) {
  if (state.over || state.queue.length > 0) return;
  if (state.a.currentHp <= 0 || state.b.currentHp <= 0 || state.actionsTaken >= MAX_ACTIONS) {
    state.over = true;
    return;
  }
  const order: Side[] = (state.a.spd + Math.random() * 20) >= (state.b.spd + Math.random() * 20) ? ["A", "B"] : ["B", "A"];
  state.queue = order;
}

export function peekNextActor(state: BattleState): Side | null {
  fillQueueIfNeeded(state);
  if (state.over) return null;
  return state.queue[0] ?? null;
}

export function runNextAction(state: BattleState, chosenMoveIndex?: number): LogEntry[] {
  fillQueueIfNeeded(state);
  if (state.over || state.queue.length === 0) return [];
  const actorSide = state.queue.shift()!;
  const targetSide: Side = actorSide === "A" ? "B" : "A";
  const { a, b } = state;
  const att = actorSide === "A" ? a : b;
  const def = actorSide === "A" ? b : a;
  const log: LogEntry[] = [];

  if (att.currentHp <= 0 || def.currentHp <= 0) {
    state.over = true;
    return log;
  }

  function snap() {
    return { hpA: a.currentHp, hpB: b.currentHp };
  }

  state.actionsTaken++;

  if (Math.random() < 0.16) {
    const h = HAPPENINGS[Math.floor(Math.random() * HAPPENINGS.length)];
    const msg = h.text.replace("{n}", att.name);
    const se = snap();
    log.push({ text: msg, cls: "event", kind: "event", actor: actorSide, target: targetSide, hpA: se.hpA, hpB: se.hpB });
    if (h.effect === "skip") {
      return log;
    } else if (h.effect === "buff") {
      if (actorSide === "A") state.buffA = 1.7;
      else state.buffB = 1.7;
      return log;
    } else if (h.effect === "crit") {
      if (actorSide === "A") state.buffA = 2.0;
      else state.buffB = 2.0;
    }
  }

  const moves = att.moves;
  const idx =
    typeof chosenMoveIndex === "number" ? Math.max(0, Math.min(moves.length - 1, chosenMoveIndex)) : Math.floor(Math.random() * moves.length);
  const move = moves[idx];
  const eff = typeEffectiveness(att.typeKey, def.typeKey);
  const variance = 0.85 + Math.random() * 0.3;
  const buffMult = actorSide === "A" ? state.buffA : state.buffB;
  if (actorSide === "A") state.buffA = 1;
  else state.buffB = 1;

  const s0 = snap();
  log.push({ text: att.name + "の" + move.name + "！", cls: "", kind: "move", actor: actorSide, target: targetSide, hpA: s0.hpA, hpB: s0.hpB });
  if (eff.label) log.push({ text: eff.label, cls: "event", kind: "event", actor: actorSide, target: targetSide, hpA: s0.hpA, hpB: s0.hpB });

  const dmg = Math.max(1, Math.round((move.power / 3) * (att.atk / Math.max(20, def.def)) * eff.mult * variance * buffMult));
  def.currentHp = Math.max(0, def.currentHp - dmg);
  const s1 = snap();
  if (buffMult > 1) {
    log.push({ text: "会心の一撃！ " + dmg + "ダメージ！", cls: "crit", kind: "hit", actor: actorSide, target: targetSide, dmg, crit: true, hpA: s1.hpA, hpB: s1.hpB });
  } else {
    log.push({ text: def.name + "に" + dmg + "ダメージ！", cls: "", kind: "hit", actor: actorSide, target: targetSide, dmg, crit: false, hpA: s1.hpA, hpB: s1.hpB });
  }
  state.finishingMove = move.name;

  if (def.currentHp <= 0) {
    state.over = true;
    state.concludedLogged = true;
    const sf = snap();
    log.push({ text: def.name + "は倒れた！ " + att.name + "の勝利！", cls: "crit", kind: "faint", actor: targetSide, hpA: sf.hpA, hpB: sf.hpB });
  }

  return log;
}

export function concludeBattle(state: BattleState): { log: LogEntry[]; winner: Fighter; loser: Fighter } | null {
  fillQueueIfNeeded(state);
  if (!state.over) return null;
  const { a, b } = state;
  let winner: Fighter;
  let loser: Fighter;
  let loserSide: Side;
  if (a.currentHp <= 0 && b.currentHp > 0) {
    winner = b; loser = a; loserSide = "A";
  } else if (b.currentHp <= 0 && a.currentHp > 0) {
    winner = a; loser = b; loserSide = "B";
  } else if (a.currentHp >= b.currentHp) {
    winner = a; loser = b; loserSide = "B";
  } else {
    winner = b; loser = a; loserSide = "A";
  }
  if (state.concludedLogged) return { log: [], winner, loser };
  state.concludedLogged = true;
  const log: LogEntry[] = [
    { text: loser.name + "は倒れた！ " + winner.name + "の勝利！", cls: "crit", kind: "faint", actor: loserSide, hpA: a.currentHp, hpB: b.currentHp },
  ];
  return { log, winner, loser };
}
