"use client";

import { useEffect, useRef, useState } from "react";
import { BattleResult, Fighter, LogEntry, Side } from "@/lib/types";
import { BattleStage, HitFx } from "./BattleStage";
import { SoundToggle } from "./SoundToggle";
import { playEvent, playFaint, playHit, playMove } from "@/lib/sound";

export function AutoBattleScreen({
  fighterA,
  fighterB,
  battleResult,
  badgeTierA,
  xHandleA,
  xHandleB,
  customSrcA,
  onDone,
}: {
  fighterA: Fighter;
  fighterB: Fighter;
  battleResult: BattleResult;
  badgeTierA: number;
  xHandleA?: string;
  xHandleB?: string;
  customSrcA?: string | null;
  onDone: () => void;
}) {
  const [lines, setLines] = useState<LogEntry[]>([]);
  const [hpA, setHpA] = useState(fighterA.hp);
  const [hpB, setHpB] = useState(fighterB.hp);
  const [animA, setAnimA] = useState("");
  const [animB, setAnimB] = useState("");
  const [fxA, setFxA] = useState<HitFx | null>(null);
  const [fxB, setFxB] = useState<HitFx | null>(null);
  const loglinesRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const fxIdRef = useRef(0);

  useEffect(() => {
    setLines([]);
    setHpA(fighterA.hp);
    setHpB(fighterB.hp);
    setAnimA("");
    setAnimB("");
    setFxA(null);
    setFxB(null);

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

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

    function triggerFx(side: Side, color: string, crit: boolean) {
      const setFx = side === "A" ? setFxA : setFxB;
      fxIdRef.current += 1;
      setFx({ id: fxIdRef.current, color, crit });
      timeouts.push(setTimeout(() => !cancelled && setFx(null), 400));
    }

    let i = 0;
    function step() {
      if (cancelled) return;
      if (i >= battleResult.log.length) {
        timeouts.push(setTimeout(() => !cancelled && onDoneRef.current(), 500));
        return;
      }
      const entry = battleResult.log[i];
      setLines((prev) => [...prev, entry]);
      if (typeof entry.hpA === "number") setHpA(entry.hpA);
      if (typeof entry.hpB === "number") setHpB(entry.hpB);
      if (entry.kind === "move" && entry.actor) {
        triggerAnim(entry.actor, "attack-anim", false);
        playMove();
      } else if (entry.kind === "hit" && entry.target) {
        triggerAnim(entry.target, "hit-anim", false);
        const attacker = entry.actor === "A" ? fighterA : entry.actor === "B" ? fighterB : null;
        if (attacker) triggerFx(entry.target, attacker.type.color, !!entry.crit);
        playHit(!!entry.crit);
      } else if (entry.kind === "faint" && entry.actor) {
        triggerAnim(entry.actor, "faint-anim", true);
        playFaint();
      } else if (entry.kind === "event") {
        playEvent();
      }
      i++;
      timeouts.push(setTimeout(step, 550));
    }
    step();

    return () => {
      cancelled = true;
      timeouts.forEach((t) => clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battleResult, fighterA, fighterB]);

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
        customSrcA={customSrcA}
        fxA={fxA}
        fxB={fxB}
      />
      <div className="battlebox">
        <div className="loglines" ref={loglinesRef}>
          {lines.map((entry, i) => (
            <div className={"line" + (entry.cls ? " " + entry.cls : "")} key={i}>
              {entry.text}
            </div>
          ))}
        </div>
      </div>
      <SoundToggle />
    </div>
  );
}
