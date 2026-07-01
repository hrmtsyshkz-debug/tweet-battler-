"use client";

import { useEffect, useRef, useState } from "react";
import { concludeBattle, createBattleState, peekNextActor, runNextAction } from "@/lib/battle";
import { BattleResult, Fighter, LogEntry, Side } from "@/lib/types";
import { BattleStage } from "./BattleStage";

export function ManualBattleScreen({
  fighterA,
  fighterB,
  badgeTierA,
  xHandleA,
  xHandleB,
  onDone,
}: {
  fighterA: Fighter;
  fighterB: Fighter;
  badgeTierA: number;
  xHandleA?: string;
  xHandleB?: string;
  onDone: (result: BattleResult) => void;
}) {
  const [lines, setLines] = useState<LogEntry[]>([]);
  const [hpA, setHpA] = useState(fighterA.hp);
  const [hpB, setHpB] = useState(fighterB.hp);
  const [animA, setAnimA] = useState("");
  const [animB, setAnimB] = useState("");
  const [awaitingMove, setAwaitingMove] = useState(false);
  const loglinesRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const pickMoveRef = useRef<(moveIdx: number) => void>(() => {});

  useEffect(() => {
    fighterA.currentHp = fighterA.hp;
    fighterB.currentHp = fighterB.hp;
    const state = createBattleState(fighterA, fighterB);
    const allLog: LogEntry[] = [];
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    setLines([]);
    setHpA(fighterA.hp);
    setHpB(fighterB.hp);
    setAnimA("");
    setAnimB("");
    setAwaitingMove(false);

    function triggerAnim(side: Side, cls: string, permanent: boolean) {
      const setAnim = side === "A" ? setAnimA : setAnimB;
      setAnim("");
      const raf = requestAnimationFrame(() => {
        if (cancelled) return;
        setAnim(cls);
        if (!permanent) {
          timeouts.push(setTimeout(() => !cancelled && setAnim(""), 320));
        }
      });
      timeouts.push(raf as unknown as ReturnType<typeof setTimeout>);
    }

    function revealEntries(entries: LogEntry[], idx: number, after: () => void) {
      if (cancelled) return;
      if (idx >= entries.length) {
        after();
        return;
      }
      const entry = entries[idx];
      setLines((prev) => [...prev, entry]);
      allLog.push(entry);
      if (typeof entry.hpA === "number") setHpA(entry.hpA);
      if (typeof entry.hpB === "number") setHpB(entry.hpB);
      if (entry.kind === "move" && entry.actor) triggerAnim(entry.actor, "attack-anim", false);
      else if (entry.kind === "hit" && entry.target) triggerAnim(entry.target, "hit-anim", false);
      else if (entry.kind === "faint" && entry.actor) triggerAnim(entry.actor, "faint-anim", true);
      timeouts.push(setTimeout(() => revealEntries(entries, idx + 1, after), 550));
    }

    function finish() {
      const concluded = concludeBattle(state);
      if (!concluded) return;
      revealEntries(concluded.log, 0, () => {
        timeouts.push(
          setTimeout(() => {
            if (cancelled) return;
            onDoneRef.current({ log: allLog, winner: concluded.winner, loser: concluded.loser, finishingMove: state.finishingMove });
          }, 500)
        );
      });
    }

    function continueLoop() {
      if (cancelled) return;
      const next = peekNextActor(state);
      if (next === null) {
        finish();
        return;
      }
      if (next === "A") {
        setAwaitingMove(true);
        return;
      }
      timeouts.push(
        setTimeout(() => {
          if (cancelled) return;
          const entries = runNextAction(state);
          revealEntries(entries, 0, continueLoop);
        }, 700)
      );
    }

    function handlePickMove(moveIdx: number) {
      if (cancelled || peekNextActor(state) !== "A") return;
      setAwaitingMove(false);
      const entries = runNextAction(state, moveIdx);
      revealEntries(entries, 0, continueLoop);
    }

    pickMoveRef.current = handlePickMove;
    continueLoop();

    return () => {
      cancelled = true;
      timeouts.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fighterA, fighterB]);

  useEffect(() => {
    if (loglinesRef.current) loglinesRef.current.scrollTop = loglinesRef.current.scrollHeight;
  }, [lines]);

  return (
    <div className="panel">
      <BattleStage
        fighterA={fighterA}
        fighterB={fighterB}
        hpA={hpA}
        hpB={hpB}
        animA={animA}
        animB={animB}
        badgeTierA={badgeTierA}
        xHandleA={xHandleA}
        xHandleB={xHandleB}
      />
      {awaitingMove && (
        <div className="move-picker">
          <div className="prompt">あなたのターン！技を選んでください</div>
          <div className="grid">
            {fighterA.moves.map((m, i) => (
              <button key={i} className="movebtn" type="button" onClick={() => pickMoveRef.current(i)}>
                <div className="mname">{m.name}</div>
                <div className="mpower">威力{m.power}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="battlebox">
        <div className="loglines" ref={loglinesRef}>
          {lines.map((entry, i) => (
            <div className={"line" + (entry.cls ? " " + entry.cls : "")} key={i}>
              {entry.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
