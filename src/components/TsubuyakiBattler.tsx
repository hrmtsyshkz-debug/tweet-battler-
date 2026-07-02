"use client";

import { useEffect, useState } from "react";
import { AutoBattleScreen } from "@/components/AutoBattleScreen";
import { ManualBattleScreen } from "@/components/ManualBattleScreen";
import { ChallengeOverlay } from "@/components/ChallengeOverlay";
import { DexOverlay } from "@/components/DexOverlay";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProfileOverlay } from "@/components/ProfileOverlay";
import { QrOverlay } from "@/components/QrOverlay";
import { ResultScreen } from "@/components/ResultScreen";
import { ScanOverlay } from "@/components/ScanOverlay";
import { SetupScreen, SetupState } from "@/components/SetupScreen";
import { StatsScreen } from "@/components/StatsScreen";
import { simulateBattle } from "@/lib/battle";
import { clearCustomIcon, loadCustomIcon, saveCustomIcon } from "@/lib/customIcon";
import { registerToDex } from "@/lib/dex";
import { generateFighter } from "@/lib/fighter";
import { applyBattleResultToProfile, computeBadgeTier } from "@/lib/profile";
import { fighterFromCode, payloadToFighter } from "@/lib/qr";
import { applyResult, getRecord, opponentKeyFor } from "@/lib/records";
import { BattleResult, Fighter } from "@/lib/types";
import { applyTrainingResult, loadTrained, registerTrained, trainedToFighter } from "@/lib/training";

type Screen = "setup" | "loading" | "stats" | "battle" | "result";

const INITIAL_SETUP: SetupState = {
  nameA: "",
  textA: "",
  forcedTypeA: null,
  xHandleA: "",
  nameB: "",
  textB: "",
  forcedTypeB: null,
  xHandleB: "",
};

export function TsubuyakiBattler({ initialOpponent }: { initialOpponent?: Fighter | null }) {
  const [screen, setScreen] = useState<Screen>("setup");
  const [setup, setSetup] = useState<SetupState>(() =>
    initialOpponent
      ? { ...INITIAL_SETUP, nameB: initialOpponent.name, forcedTypeB: initialOpponent.typeKey }
      : INITIAL_SETUP
  );
  const [scannedFighterB, setScannedFighterB] = useState<Fighter | null>(initialOpponent ?? null);
  const [fighterA, setFighterA] = useState<Fighter | null>(null);
  const [fighterB, setFighterB] = useState<Fighter | null>(null);
  const [battleMode, setBattleMode] = useState<"auto" | "manual">("auto");
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [newTitles, setNewTitles] = useState<string[]>([]);
  const [badgeTierA, setBadgeTierA] = useState(0);
  const [opponentRecord, setOpponentRecord] = useState<{ wins: number; losses: number } | null>(null);
  const [trainedName, setTrainedName] = useState<string | null>(null);
  const [usedTrained, setUsedTrained] = useState(false);
  const [trainingGains, setTrainingGains] = useState<string | null>(null);
  const [customIcon, setCustomIcon] = useState<string | null>(null);

  const [scanOpen, setScanOpen] = useState(false);
  const [qrFighter, setQrFighter] = useState<Fighter | null>(null);
  const [challengeFighter, setChallengeFighter] = useState<Fighter | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dexOpen, setDexOpen] = useState(false);

  useEffect(() => {
    const t = loadTrained();
    setTrainedName(t ? t.fighter.name : null);
    setCustomIcon(loadCustomIcon());
  }, []);

  function handleCustomIconChange(dataUrl: string | null) {
    if (dataUrl) {
      saveCustomIcon(dataUrl);
    } else {
      clearCustomIcon();
    }
    setCustomIcon(dataUrl);
  }

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
    setUsedTrained(false);
    setBadgeTierA(computeBadgeTier());
    const record = getRecord(opponentKeyFor(setup.xHandleB, b));
    setOpponentRecord(record ? { wins: record.wins, losses: record.losses } : null);
    setScreen("loading");
  }

  function handleStartTrained() {
    const trained = loadTrained();
    if (!trained) return;
    const a = trainedToFighter(trained);
    const b = scannedFighterB || generateFighter(setup.nameB, setup.textB, setup.forcedTypeB);
    setFighterA(a);
    setFighterB(b);
    setUsedTrained(true);
    setBadgeTierA(computeBadgeTier());
    const record = getRecord(opponentKeyFor(setup.xHandleB, b));
    setOpponentRecord(record ? { wins: record.wins, losses: record.losses } : null);
    setScreen("loading");
  }

  function handleRegisterTrained() {
    if (!fighterA) return;
    const existing = loadTrained();
    if (existing) {
      if (!window.confirm("今の育成キャラを上書きしますか？")) return;
    }
    registerTrained(fighterA);
    setTrainedName(fighterA.name);
    window.alert(`${fighterA.name}を育成登録しました！`);
  }

  function handleLoadingDone() {
    setScreen("stats");
  }

  function handleFight(mode: "auto" | "manual") {
    if (!fighterA || !fighterB) return;
    setBattleMode(mode);
    fighterA.currentHp = fighterA.hp;
    fighterB.currentHp = fighterB.hp;
    if (mode === "auto") {
      const result = simulateBattle(fighterA, fighterB);
      setBattleResult(result);
    } else {
      setBattleResult(null);
    }
    setScreen("battle");
  }

  function handleBattleDone(result?: BattleResult) {
    const finalResult = result || battleResult;
    if (!finalResult || !fighterA) return;
    if (result) setBattleResult(result);
    const didWin = finalResult.winner === fighterA;
    if (fighterB) {
      registerToDex(fighterB);
      const key = opponentKeyFor(setup.xHandleB, fighterB);
      applyResult(key, fighterB.name, didWin);
    }
    if (!usedTrained) {
      registerToDex(fighterA);
    }
    const progress = applyBattleResultToProfile(didWin, fighterA);
    setNewTitles(progress.newTitles);
    setBadgeTierA(computeBadgeTier());
    if (usedTrained) {
      const trainingResult = applyTrainingResult(didWin);
      if (trainingResult) {
        if (trainingResult.capped) {
          setTrainingGains("これ以上そだたないようだ（カンスト）");
        } else {
          const parts: string[] = [];
          if (trainingResult.gains.hp) parts.push(`HP+${trainingResult.gains.hp}`);
          if (trainingResult.gains.atk) parts.push(`攻撃+${trainingResult.gains.atk}`);
          if (trainingResult.gains.def) parts.push(`防御+${trainingResult.gains.def}`);
          if (trainingResult.gains.spd) parts.push(`素早+${trainingResult.gains.spd}`);
          setTrainingGains(parts.length > 0 ? `そだった！ ${parts.join(" ")}` : null);
        }
      } else {
        setTrainingGains(null);
      }
    } else {
      setTrainingGains(null);
    }
    setScreen("result");
  }

  function handleReset() {
    setBattleResult(null);
    setNewTitles([]);
    setTrainingGains(null);
    setUsedTrained(false);
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

      {screen === "setup" && initialOpponent && (
        <div className="newtitle-banner">{initialOpponent.name} さんからの挑戦状が届いています！あなたの情報を入力してバトルしよう</div>
      )}

      {screen === "setup" && (
        <SetupScreen
          state={setup}
          onChange={handleSetupChange}
          onScanB={() => setScanOpen(true)}
          onAchievements={() => setProfileOpen(true)}
          onDex={() => setDexOpen(true)}
          onStart={handleStart}
          trainedName={trainedName}
          onStartTrained={handleStartTrained}
          customIcon={customIcon}
          onCustomIconChange={handleCustomIconChange}
        />
      )}

      {screen === "loading" && <LoadingScreen onDone={handleLoadingDone} />}

      {screen === "stats" && fighterA && fighterB && (
        <StatsScreen
          fighterA={fighterA}
          fighterB={fighterB}
          badgeTierA={badgeTierA}
          xHandleA={setup.xHandleA}
          xHandleB={setup.xHandleB}
          customSrcA={customIcon}
          opponentRecord={opponentRecord}
          onIssueQr={() => setQrFighter(fighterA)}
          onIssueChallenge={() => setChallengeFighter(fighterA)}
          onFight={handleFight}
          onRegisterTrained={handleRegisterTrained}
        />
      )}

      {screen === "battle" && fighterA && fighterB && battleMode === "auto" && battleResult && (
        <AutoBattleScreen
          fighterA={fighterA}
          fighterB={fighterB}
          battleResult={battleResult}
          badgeTierA={badgeTierA}
          xHandleA={setup.xHandleA}
          xHandleB={setup.xHandleB}
          customSrcA={customIcon}
          onDone={() => handleBattleDone()}
        />
      )}

      {screen === "battle" && fighterA && fighterB && battleMode === "manual" && (
        <ManualBattleScreen
          fighterA={fighterA}
          fighterB={fighterB}
          badgeTierA={badgeTierA}
          xHandleA={setup.xHandleA}
          xHandleB={setup.xHandleB}
          customSrcA={customIcon}
          onDone={(result) => handleBattleDone(result)}
        />
      )}

      {screen === "result" && fighterA && battleResult && (
        <ResultScreen
          fighterA={fighterA}
          battleResult={battleResult}
          badgeTierA={badgeTierA}
          newTitles={newTitles}
          trainingGains={trainingGains}
          onReset={handleReset}
        />
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
      <ChallengeOverlay fighter={challengeFighter} onClose={() => setChallengeFighter(null)} />
      <ProfileOverlay open={profileOpen} onClose={() => setProfileOpen(false)} />
      <DexOverlay open={dexOpen} onClose={() => setDexOpen(false)} />
    </div>
  );
}
