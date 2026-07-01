"use client";

import { useState } from "react";
import { BattleScreen } from "@/components/BattleScreen";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProfileOverlay } from "@/components/ProfileOverlay";
import { QrOverlay } from "@/components/QrOverlay";
import { ResultScreen } from "@/components/ResultScreen";
import { ScanOverlay } from "@/components/ScanOverlay";
import { SetupScreen, SetupState } from "@/components/SetupScreen";
import { StatsScreen } from "@/components/StatsScreen";
import { simulateBattle } from "@/lib/battle";
import { generateFighter } from "@/lib/fighter";
import { applyBattleResultToProfile, computeBadgeTier } from "@/lib/profile";
import { fighterFromCode, payloadToFighter } from "@/lib/qr";
import { BattleResult, Fighter } from "@/lib/types";

type Screen = "setup" | "loading" | "stats" | "battle" | "result";

const INITIAL_SETUP: SetupState = {
  nameA: "",
  textA: "",
  forcedTypeA: null,
  nameB: "",
  textB: "",
  forcedTypeB: null,
  xHandleB: "",
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>("setup");
  const [setup, setSetup] = useState<SetupState>(INITIAL_SETUP);
  const [scannedFighterB, setScannedFighterB] = useState<Fighter | null>(null);
  const [fighterA, setFighterA] = useState<Fighter | null>(null);
  const [fighterB, setFighterB] = useState<Fighter | null>(null);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [newTitles, setNewTitles] = useState<string[]>([]);
  const [badgeTierA, setBadgeTierA] = useState(0);

  const [scanOpen, setScanOpen] = useState(false);
  const [qrFighter, setQrFighter] = useState<Fighter | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  function handleSetupChange(patch: Partial<SetupState>) {
    setSetup((prev) => ({ ...prev, ...patch }));
    if (patch.nameB !== undefined || patch.textB !== undefined) {
      setScannedFighterB(null);
    }
  }

  function handleStart() {
    const a = generateFighter(setup.nameA, setup.textA, setup.forcedTypeA);
    const b = scannedFighterB || generateFighter(setup.nameB, setup.textB, setup.forcedTypeB);
    setFighterA(a);
    setFighterB(b);
    setBadgeTierA(computeBadgeTier());
    setScreen("loading");
  }

  function handleLoadingDone() {
    setScreen("stats");
  }

  function handleFight() {
    if (!fighterA || !fighterB) return;
    fighterA.currentHp = fighterA.hp;
    fighterB.currentHp = fighterB.hp;
    const result = simulateBattle(fighterA, fighterB);
    setBattleResult(result);
    setScreen("battle");
  }

  function handleBattleDone() {
    if (!battleResult || !fighterA) return;
    const didWin = battleResult.winner === fighterA;
    const progress = applyBattleResultToProfile(didWin);
    setNewTitles(progress.newTitles);
    setBadgeTierA(computeBadgeTier());
    setScreen("result");
  }

  function handleReset() {
    setBattleResult(null);
    setNewTitles([]);
    setScreen("setup");
  }

  function applyScannedValue(value: string) {
    const fighter = payloadToFighter(value) || fighterFromCode(value);
    if (!fighter) return;
    setSetup((prev) => ({ ...prev, nameB: fighter.name, textB: "", forcedTypeB: fighter.typeKey }));
    setScannedFighterB(fighter);
  }

  return (
    <div className="wrap">
      <h1 className="sr-only">つぶやきバトラー：あなたと相手のSNS投稿から自動で対戦キャラを生成し戦わせるバトルゲームのプロトタイプ</h1>
      <h1 className="title" aria-hidden="true">
        つぶやき バトラー
      </h1>
      <p className="sub">あなたの投稿をコピペするだけで、勝手にキャラ化して戦う</p>

      {screen === "setup" && (
        <SetupScreen
          state={setup}
          onChange={handleSetupChange}
          onScanB={() => setScanOpen(true)}
          onAchievements={() => setProfileOpen(true)}
          onStart={handleStart}
        />
      )}

      {screen === "loading" && <LoadingScreen onDone={handleLoadingDone} />}

      {screen === "stats" && fighterA && fighterB && (
        <StatsScreen
          fighterA={fighterA}
          fighterB={fighterB}
          badgeTierA={badgeTierA}
          onIssueQr={() => setQrFighter(fighterA)}
          onFight={handleFight}
        />
      )}

      {screen === "battle" && fighterA && fighterB && battleResult && (
        <BattleScreen
          fighterA={fighterA}
          fighterB={fighterB}
          battleResult={battleResult}
          badgeTierA={badgeTierA}
          onDone={handleBattleDone}
        />
      )}

      {screen === "result" && fighterA && battleResult && (
        <ResultScreen fighterA={fighterA} battleResult={battleResult} badgeTierA={badgeTierA} newTitles={newTitles} onReset={handleReset} />
      )}

      <ScanOverlay
        open={scanOpen}
        onClose={() => setScanOpen(false)}
        onResult={(value) => {
          setScanOpen(false);
          applyScannedValue(value);
        }}
      />
      <QrOverlay fighter={qrFighter} onClose={() => setQrFighter(null)} />
      <ProfileOverlay open={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
