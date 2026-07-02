"use client";

import { useState } from "react";
import { TYPES } from "@/lib/data";
import { TypeChips } from "./TypeChips";

const RANDOM_NAMES = ["ライバル", "謎の刺客", "隣の席の人", "元同期", "フォロワー"];

export interface SetupState {
  nameA: string;
  textA: string;
  forcedTypeA: string | null;
  xHandleA: string;
  nameB: string;
  textB: string;
  forcedTypeB: string | null;
  xHandleB: string;
}

function XHandleField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [avatarOk, setAvatarOk] = useState(false);
  const handle = value.trim().replace(/^@/, "");
  const avatarUrl = handle ? `https://unavatar.io/x/${encodeURIComponent(handle)}?fallback=false` : "";

  return (
    <>
      <label>X（Twitter）ID（@なし・任意/実験的機能）</label>
      <input type="text" placeholder="例：example_id" value={value} onChange={(e) => onChange(e.target.value)} />
      <div className="avatar-row">
        {avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="avatar-preview"
            alt=""
            src={avatarUrl}
            style={{ display: avatarOk ? "inline-block" : "none" }}
            onLoad={() => setAvatarOk(true)}
            onError={() => setAvatarOk(false)}
          />
        )}
        <span className="avatar-hint">※非公式取得のため表示できないことがあります</span>
      </div>
    </>
  );
}

export function SetupScreen({
  state,
  onChange,
  onScanB,
  onAchievements,
  onDex,
  onStart,
}: {
  state: SetupState;
  onChange: (patch: Partial<SetupState>) => void;
  onScanB: () => void;
  onAchievements: () => void;
  onDex: () => void;
  onStart: () => void;
}) {
  function handleRandomB() {
    const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
    const typeKey = TYPES[Math.floor(Math.random() * TYPES.length)].key;
    onChange({ nameB: name, textB: "", forcedTypeB: typeKey });
  }

  return (
    <>
      <div className="panel with-fight-bar">
        <div className="fighters">
          <div className="fcard">
            <div className="fcard-head">
              <h3>YOU</h3>
              <div className="fcard-head-btns">
                <button className="small" type="button" onClick={onAchievements}>
                  実績を見る
                </button>
                <button className="small" type="button" onClick={onDex}>
                  図鑑
                </button>
              </div>
            </div>
            <label>ニックネーム</label>
            <input
              type="text"
              maxLength={12}
              placeholder="例：佳"
              value={state.nameA}
              onChange={(e) => onChange({ nameA: e.target.value })}
            />
            <label>直近の投稿を3〜5個コピペ（任意）</label>
            <textarea
              placeholder={"例：今日も定時で帰れなかった…\n推しの新曲が尊すぎて仕事にならない\n有給とったのに結局PC開いてる"}
              value={state.textA}
              onChange={(e) => onChange({ textA: e.target.value })}
            />
            <label>または属性を直接選ぶ</label>
            <TypeChips selected={state.forcedTypeA} onSelect={(key) => onChange({ forcedTypeA: key })} />
            <XHandleField value={state.xHandleA} onChange={(v) => onChange({ xHandleA: v })} />
          </div>
          <div className="fcard">
            <div className="fcard-head">
              <h3>相手</h3>
              <div className="fcard-head-btns">
                <button className="small" type="button" onClick={handleRandomB}>
                  ランダム相手で埋める
                </button>
                <button className="small" type="button" onClick={onScanB}>
                  QR/バーコードで召喚
                </button>
              </div>
            </div>
            <label>ニックネーム</label>
            <input
              type="text"
              maxLength={12}
              placeholder="例：友人A"
              value={state.nameB}
              onChange={(e) => onChange({ nameB: e.target.value })}
            />
            <label>相手の投稿を3〜5個コピペ（任意）</label>
            <textarea
              placeholder="友人のポストや特徴を入れてもOK"
              value={state.textB}
              onChange={(e) => onChange({ textB: e.target.value })}
            />
            <label>または属性を直接選ぶ</label>
            <TypeChips selected={state.forcedTypeB} onSelect={(key) => onChange({ forcedTypeB: key })} />
            <XHandleField value={state.xHandleB} onChange={(v) => onChange({ xHandleB: v })} />
          </div>
        </div>
      </div>
      <div className="fight-bar">
        <div className="fight-bar-inner">
          <button className="big" type="button" onClick={onStart}>
            バトル開始！
          </button>
        </div>
      </div>
    </>
  );
}
