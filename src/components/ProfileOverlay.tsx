"use client";

import { useEffect, useState } from "react";
import { loadProfile, saveProfile, titleLabel, toFighterFromSaved, xpToLevel } from "@/lib/profile";
import { loadTrained, trainedToFighter, TrainedData } from "@/lib/training";
import { Profile } from "@/lib/types";
import { FighterCard } from "./FighterCard";

export function ProfileOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [trained, setTrained] = useState<TrainedData | null>(null);

  useEffect(() => {
    if (open) {
      setProfile(loadProfile());
      setTrained(loadTrained());
    }
  }, [open]);

  if (!open || !profile) return null;

  const lv = xpToLevel(profile.xp);
  const xpInLevel = profile.xp % 100;

  function handleReset() {
    if (window.confirm("記録をリセットしますか？")) {
      const fresh: Profile = { battles: 0, wins: 0, streak: 0, bestStreak: 0, xp: 0, titles: [], lastFighter: null };
      saveProfile(fresh);
      setProfile(fresh);
    }
  }

  return (
    <div className="overlay">
      <div className="overlay-box profile-panel">
        <h3>実績 / 自己満レベル</h3>
        <div className="row">
          <span>自己満Lv</span>
          <span>Lv.{lv}</span>
        </div>
        <div className="xpbar">
          <div className="xpbar-fill" style={{ width: xpInLevel + "%" }} />
        </div>
        <div className="row">
          <span>総対戦数</span>
          <span>{profile.battles}</span>
        </div>
        <div className="row">
          <span>勝利数</span>
          <span>{profile.wins}</span>
        </div>
        <div className="row">
          <span>現在の連勝</span>
          <span>{profile.streak}</span>
        </div>
        <div className="row">
          <span>最高連勝</span>
          <span>{profile.bestStreak}</span>
        </div>
        <div className="titles-list">
          {profile.titles.length === 0 ? (
            <span className="avatar-hint">まだ称号はありません。バトルで勝利を重ねよう。</span>
          ) : (
            profile.titles.map((id) => (
              <span className="title-badge" key={id}>
                {titleLabel(id)}
              </span>
            ))
          )}
        </div>
        {trained && (
          <div style={{ marginTop: 16 }}>
            <label style={{ margin: "10px 0 6px" }}>育成中のキャラ</label>
            <FighterCard fighter={trainedToFighter(trained)} mirror={false} badgeTier={Math.min(3, Math.floor(lv / 5))} />
            <div style={{ fontSize: 12, color: "var(--ink-soft)", textAlign: "center", marginTop: 6 }}>
              {trained.battles}戦育成中・成長 {trained.totalGained}/60
            </div>
          </div>
        )}
        {profile.lastFighter && (
          <div style={{ marginTop: 16 }}>
            <label style={{ margin: "10px 0 6px" }}>直近のあなたのキャラ</label>
            <FighterCard fighter={toFighterFromSaved(profile.lastFighter)} mirror={false} badgeTier={Math.min(3, Math.floor(lv / 5))} />
          </div>
        )}
        <div className="overlay-close" style={{ marginTop: 14 }}>
          <button className="small" type="button" onClick={handleReset}>
            記録をリセット
          </button>
          <button className="small" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
