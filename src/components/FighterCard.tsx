import { isShinyFighter } from "@/lib/sprite";
import { Fighter } from "@/lib/types";
import { SpriteCanvas } from "./SpriteCanvas";
import { TrainerBadge } from "./TrainerBadge";

function StatBar({ val }: { val: number }) {
  const pct = Math.min(100, Math.round((val / 140) * 100));
  return (
    <div className="track">
      <div className="fill" style={{ width: pct + "%" }} />
    </div>
  );
}

export function FighterCard({
  fighter,
  mirror,
  badgeTier,
  xHandle,
}: {
  fighter: Fighter;
  mirror: boolean;
  badgeTier: number;
  xHandle?: string;
}) {
  const shiny = isShinyFighter(fighter);
  return (
    <div className="statcard">
      <SpriteCanvas fighter={fighter} mirror={mirror} badgeTier={badgeTier} size={90} className="sprite-canvas-stat" />
      <div className="name">
        {fighter.name}
        <TrainerBadge handle={xHandle} />
      </div>
      <div
        className="typebadge"
        style={{ background: fighter.type.color + "26", color: fighter.type.color }}
      >
        {fighter.type.label}
      </div>
      {shiny && (
        <div className="shinybadge">
          ✦ 色違い
        </div>
      )}
      <div className="statline hp">
        <span className="label">HP</span>
        <StatBar val={fighter.hp} />
        <span className="val">{fighter.hp}</span>
      </div>
      <div className="statline atk">
        <span className="label">攻撃</span>
        <StatBar val={fighter.atk} />
        <span className="val">{fighter.atk}</span>
      </div>
      <div className="statline def">
        <span className="label">防御</span>
        <StatBar val={fighter.def} />
        <span className="val">{fighter.def}</span>
      </div>
      <div className="statline spd">
        <span className="label">素早</span>
        <StatBar val={fighter.spd} />
        <span className="val">{fighter.spd}</span>
      </div>
      <div className="moves">
        {fighter.moves.map((m, i) => (
          <div className="move" key={i}>
            {m.name}　威力{m.power}
          </div>
        ))}
      </div>
    </div>
  );
}
