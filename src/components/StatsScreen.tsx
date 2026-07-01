import { Fighter } from "@/lib/types";
import { FighterCard } from "./FighterCard";

export function StatsScreen({
  fighterA,
  fighterB,
  badgeTierA,
  xHandleA,
  xHandleB,
  onIssueQr,
  onIssueChallenge,
  onFight,
}: {
  fighterA: Fighter;
  fighterB: Fighter;
  badgeTierA: number;
  xHandleA?: string;
  xHandleB?: string;
  onIssueQr: () => void;
  onIssueChallenge: () => void;
  onFight: (mode: "auto" | "manual") => void;
}) {
  return (
    <>
      <div className="panel with-fight-bar">
        <div className="stats-grid">
          <FighterCard fighter={fighterA} mirror={false} badgeTier={badgeTierA} xHandle={xHandleA} />
          <FighterCard fighter={fighterB} mirror={true} badgeTier={0} xHandle={xHandleB} />
        </div>
        <div className="cardaction-row">
          <button className="small" type="button" onClick={onIssueQr}>
            あなたのQRバトルカードを発行
          </button>
          <button className="small" type="button" onClick={onIssueChallenge}>
            挑戦状URLを発行
          </button>
        </div>
      </div>
      <div className="fight-bar">
        <div className="fight-bar-inner two">
          <button className="big" type="button" onClick={() => onFight("auto")}>
            オートで観戦
          </button>
          <button className="big" type="button" onClick={() => onFight("manual")}>
            自分で戦う
          </button>
        </div>
      </div>
    </>
  );
}
