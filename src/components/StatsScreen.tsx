import { Fighter } from "@/lib/types";
import { FighterCard } from "./FighterCard";

export function StatsScreen({
  fighterA,
  fighterB,
  badgeTierA,
  xHandleA,
  xHandleB,
  customSrcA,
  opponentRecord,
  onIssueQr,
  onIssueChallenge,
  onFight,
  onRegisterTrained,
}: {
  fighterA: Fighter;
  fighterB: Fighter;
  badgeTierA: number;
  xHandleA?: string;
  xHandleB?: string;
  customSrcA?: string | null;
  opponentRecord?: { wins: number; losses: number } | null;
  onIssueQr: () => void;
  onIssueChallenge: () => void;
  onFight: (mode: "auto" | "manual") => void;
  onRegisterTrained?: () => void;
}) {
  const hasRecord = !!opponentRecord && opponentRecord.wins + opponentRecord.losses >= 1;
  return (
    <>
      <div className="panel with-fight-bar">
        <div className="stats-grid">
          <div>
            <FighterCard fighter={fighterA} mirror={false} badgeTier={badgeTierA} xHandle={xHandleA} customSrc={customSrcA} />
            {onRegisterTrained && (
              <div style={{ textAlign: "center", marginTop: 6 }}>
                <button className="small" type="button" onClick={onRegisterTrained}>
                  このキャラを育成登録
                </button>
              </div>
            )}
          </div>
          <div>
            <FighterCard fighter={fighterB} mirror={true} badgeTier={0} xHandle={xHandleB} />
            {hasRecord && opponentRecord && (
              <div style={{ fontSize: 12, color: "var(--ink-soft)", textAlign: "center", marginTop: 6 }}>
                この相手との戦績：{opponentRecord.wins + opponentRecord.losses}戦{opponentRecord.wins}勝{opponentRecord.losses}敗
              </div>
            )}
          </div>
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
