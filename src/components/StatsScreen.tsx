import { Fighter } from "@/lib/types";
import { FighterCard } from "./FighterCard";

export function StatsScreen({
  fighterA,
  fighterB,
  badgeTierA,
  onIssueQr,
  onFight,
}: {
  fighterA: Fighter;
  fighterB: Fighter;
  badgeTierA: number;
  onIssueQr: () => void;
  onFight: () => void;
}) {
  return (
    <div className="panel">
      <div className="stats-grid">
        <FighterCard fighter={fighterA} mirror={false} badgeTier={badgeTierA} />
        <FighterCard fighter={fighterB} mirror={true} badgeTier={0} />
      </div>
      <div className="cardaction-row">
        <button className="small" type="button" onClick={onIssueQr}>
          あなたのQRバトルカードを発行
        </button>
      </div>
      <div className="btnrow">
        <button className="big" type="button" onClick={onFight}>
          たたかう！
        </button>
      </div>
    </div>
  );
}
