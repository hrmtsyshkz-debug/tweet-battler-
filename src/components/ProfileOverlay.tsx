"use client";

import { useEffect, useState } from "react";
import { loadProfile, saveProfile, titleLabel, xpToLevel } from "@/lib/profile";
import { Profile } from "@/lib/types";

export function ProfileOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (open) setProfile(loadProfile());
  }, [open]);

  if (!open || !profile) return null;

  const lv = xpToLevel(profile.xp);
  const xpInLevel = profile.xp % 100;

  function handleReset() {
    if (window.confirm("記録をリセットしますか？")) {
      const fresh: Profile = { battles: 0, wins: 0, streak: 0, bestStreak: 0, xp: 0, titles: [] };
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
