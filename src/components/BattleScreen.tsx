"use client";

import { useEffect, useRef, useState } from "react";
import { calcLevel } from "@/lib/fighter";
import { BattleResult, Fighter, LogEntry, Side } from "@/lib/types";
import { SpriteCanvas } from "./SpriteCanvas";

function HpBox({ side, name, level, hp, maxHp }: { side: "a" | "b"; name: string; level: number; hp: number; maxHp: number }) {
  const pct = Math.max(0, Math.round((hp / maxHp) * 100));
  const color = pct > 50 ? "#4ade80" : pct > 20 ? "#facc15" : "#ef4444";
  return (
    <div className={"hpbox " + (side === "a" ? "player" : "opp")}>
      <div className="row1">
        <span>{name}</span>
        <span>Lv.{level}</span>
      </div>
      <div className="hpline">
        <span>HP</span>
        <div className="track">
          <div className="fill" style={{ width: pct + "%", background: color }} />
        </div>
      </div>
      <div className="hptext">
        {hp}/{maxHp}
      </div>
    </div>
  );
}

export function BattleScreen({
  fighterA,
  fighterB,
  battleResult,
  badgeTierA,
  onDone,
}: {
  fighterA: Fighter;
  fighterB: Fighter;
  battleResult: BattleResult;
  badgeTierA: number;
  onDone: () => void;
}) {
  const [lines, setLines] = useState<LogEntry[]>([]);
  const [hpA, setHpA] = useState(fighterA.hp);
  const [hpB, setHpB] = useState(fighterB.hp);
  const [animA, setAnimA] = useState("");
  const [animB, setAnimB] = useState("");
  const loglinesRef = useRef<HTMLDivElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setLines([]);
    setHpA(fighterA.hp);
    setHpB(fighterB.hp);
    setAnimA("");
    setAnimB("");

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
      if (entry.kind === "move" && entry.actor) triggerAnim(entry.actor, "attack-anim", false);
      else if (entry.kind === "hit" && entry.target) triggerAnim(entry.target, "hit-anim", false);
      else if (entry.kind === "faint" && entry.actor) triggerAnim(entry.actor, "faint-anim", true);
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
      <div className="battle-scene">
        <div className="platform opp" />
        <div className="platform player" />
        <HpBox side="b" name={fighterB.name} level={calcLevel(fighterB)} hp={hpB} maxHp={fighterB.hp} />
        <HpBox side="a" name={fighterA.name} level={calcLevel(fighterA)} hp={hpA} maxHp={fighterA.hp} />
        <div className={"sprite-wrap opp" + (animB ? " " + animB : "")}>
          <SpriteCanvas fighter={fighterB} mirror={true} badgeTier={0} size={120} />
        </div>
        <div className={"sprite-wrap player" + (animA ? " " + animA : "")}>
          <SpriteCanvas fighter={fighterA} mirror={false} badgeTier={badgeTierA} size={160} />
        </div>
      </div>
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
