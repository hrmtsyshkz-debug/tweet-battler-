"use client";

import { useEffect, useState } from "react";
import { DexEntry, loadDex } from "@/lib/dex";
import { toFighterFromSaved } from "@/lib/profile";
import { FighterCard } from "./FighterCard";
import { SpriteCanvas } from "./SpriteCanvas";

export function DexOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [entries, setEntries] = useState<DexEntry[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEntries(loadDex());
      setSelectedKey(null);
    }
  }, [open]);

  if (!open) return null;

  const selectedIndex = selectedKey ? entries.findIndex((e) => e.key === selectedKey) : -1;
  const selected = selectedIndex >= 0 ? entries[selectedIndex] : null;

  return (
    <div className="overlay">
      <div className="overlay-box">
        <h3>モンスター図鑑</h3>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, margin: "6px 0 10px", color: "var(--ink-soft)" }}>
          <span>登録数</span>
          <span>{entries.length}体</span>
        </div>
        {entries.length === 0 ? (
          <span className="avatar-hint">まだ登録がありません。バトルをするとモンスターが記録されます。</span>
        ) : (
          <div className="dex-grid">
            {entries.map((entry, i) => {
              const fighter = toFighterFromSaved(entry.fighter);
              const isActive = entry.key === selectedKey;
              return (
                <button
                  type="button"
                  key={entry.key}
                  className={"dex-cell" + (isActive ? " active" : "")}
                  onClick={() => setSelectedKey(isActive ? null : entry.key)}
                >
                  <SpriteCanvas fighter={fighter} mirror={false} badgeTier={0} size={64} />
                  <span className="dex-no">No.{String(i + 1).padStart(3, "0")}</span>
                  <span className="dex-name">{entry.fighter.name}</span>
                  <span className="dex-type" style={{ color: fighter.type.color }}>
                    {fighter.type.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {selected && (
          <div style={{ marginTop: 16 }}>
            <label style={{ margin: "10px 0 6px" }}>
              No.{String(selectedIndex + 1).padStart(3, "0")}
            </label>
            <FighterCard fighter={toFighterFromSaved(selected.fighter)} mirror={false} badgeTier={0} />
            <div className="avatar-hint" style={{ textAlign: "center", marginTop: 6 }}>
              ×{selected.count}回遭遇　初登録：{new Date(selected.firstSeen).toLocaleDateString("ja-JP")}
            </div>
          </div>
        )}
        <div className="overlay-close" style={{ marginTop: 14 }}>
          <button className="small" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
