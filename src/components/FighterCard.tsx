import { Fighter } from "@/lib/types";
import { SpriteCanvas } from "./SpriteCanvas";

function StatBar({ val }: { val: number }) {
  const pct = Math.min(100, Math.round((val / 140) * 100));
  return (
    <div className="track">
      <div className="fill" style={{ width: pct + "%" }} />
    </div>
  );
}

export function FighterCard({ fighter, mirror, badgeTier }: { fighter: Fighter; mirror: boolean; badgeTier: number }) {
  return (
    <div className="statcard">
      <SpriteCanvas fighter={fighter} mirror={mirror} badgeTier={badgeTier} size={90} className="sprite-canvas-stat" />
      <div className="name">{fighter.name}</div>
      <div
        className="typebadge"
        style={{ background: fighter.type.color + "22", color: fighter.type.color, border: "1px solid " + fighter.type.color }}
      >
        {fighter.type.label}
      </div>
      <div className="statline">
        <span className="label">HP</span>
        <StatBar val={fighter.hp} />
        <span className="val">{fighter.hp}</span>
      </div>
      <div className="statline">
        <span className="label">攻撃</span>
        <StatBar val={fighter.atk} />
        <span className="val">{fighter.atk}</span>
      </div>
      <div className="statline">
        <span className="label">防御</span>
        <StatBar val={fighter.def} />
        <span className="val">{fighter.def}</span>
      </div>
      <div className="statline">
        <span className="label">素早</span>
        <StatBar val={fighter.spd} />
        <span className="val">{fighter.spd}</span>
      </div>
      <div className="moves">
        {fighter.moves.map((m, i) => (
          <div className="move" key={i}>
            <b>{m.name}</b>　威力{m.power}
          </div>
        ))}
      </div>
    </div>
  );
}
