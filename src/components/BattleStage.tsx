"use client";

import { calcLevel } from "@/lib/fighter";
import { Fighter } from "@/lib/types";
import { SpriteCanvas } from "./SpriteCanvas";
import { TrainerBadge } from "./TrainerBadge";

function HpBox({
  side,
  name,
  level,
  hp,
  maxHp,
  xHandle,
}: {
  side: "a" | "b";
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  xHandle?: string;
}) {
  const pct = Math.max(0, Math.round((hp / maxHp) * 100));
  const color = pct > 50 ? "#4ade80" : pct > 20 ? "#facc15" : "#f97362";
  return (
    <div className={"hpbox " + (side === "a" ? "player" : "opp")}>
      <div className="row1">
        <span>
          {name}
          <TrainerBadge handle={xHandle} size={18} />
        </span>
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

export interface HitFx {
  id: number;
  color: string;
  crit: boolean;
}

export function BattleStage({
  fighterA,
  fighterB,
  hpA,
  hpB,
  animA,
  animB,
  badgeTierA,
  xHandleA,
  xHandleB,
  fxA,
  fxB,
}: {
  fighterA: Fighter;
  fighterB: Fighter;
  hpA: number;
  hpB: number;
  animA: string;
  animB: string;
  badgeTierA: number;
  xHandleA?: string;
  xHandleB?: string;
  fxA?: HitFx | null;
  fxB?: HitFx | null;
}) {
  return (
    <div className="battle-scene">
      <div className="platform opp" />
      <div className="platform player" />
      <HpBox side="b" name={fighterB.name} level={calcLevel(fighterB)} hp={hpB} maxHp={fighterB.hp} xHandle={xHandleB} />
      <HpBox side="a" name={fighterA.name} level={calcLevel(fighterA)} hp={hpA} maxHp={fighterA.hp} xHandle={xHandleA} />
      <div className={"sprite-wrap opp" + (animB ? " " + animB : "")}>
        <SpriteCanvas fighter={fighterB} mirror={true} badgeTier={0} size={120} />
        {fxB && (
          <div
            key={fxB.id}
            className={"fx-burst" + (fxB.crit ? " crit" : "")}
            style={{ background: fxB.color }}
          />
        )}
      </div>
      <div className={"sprite-wrap player" + (animA ? " " + animA : "")}>
        <SpriteCanvas fighter={fighterA} mirror={false} badgeTier={badgeTierA} size={160} />
        {fxA && (
          <div
            key={fxA.id}
            className={"fx-burst" + (fxA.crit ? " crit" : "")}
            style={{ background: fxA.color }}
          />
        )}
      </div>
    </div>
  );
}
