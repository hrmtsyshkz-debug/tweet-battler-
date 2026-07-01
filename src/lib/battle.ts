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
