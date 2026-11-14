import { useCallback, useEffect, useState } from 'react';
import { acousticEngine } from './audio/AcousticEngine';
import { Module1Stage } from './components/Module1Stage';
import { Module2Stage } from './components/Module2Stage';
import { Module3Stage } from './components/Module3Stage';
import { SidebarControls } from './components/SidebarControls';
import { TelemetryPanel } from './components/TelemetryPanel';
import { TopNav } from './components/TopNav';
import { DICTIONARY } from './i18n';
import type { Language, ModuleId, MysteryGuess, MysteryState } from './types';

function createRandomMystery(knownF1 = 256): MysteryState {
  const possibleBeats = [3, 4, 5, 6, 7, 8];
  const initialBeats = possibleBeats[Math.floor(Math.random() * possibleBeats.length)];
  const sign = Math.random() < 0.5 ? 1 : -1;
  return {
    knownF1,
    baseF2: knownF1 + sign * initialBeats,
    initialBeats,
    waxMassGrams: 0,
    filingAmount: 0,
    activeTool: 'none',
    challengeMode: true,
    userGuess: null,
    revealed: false,
  };
}

export default function App() {
  const [lang, setLang] = useState<Language>('bn');
  const [activeModule, setActiveModule] = useState<ModuleId>('module1');

  // Module 1 & 2 shared acoustic parameters
  const [f1, setF1] = useState<number>(256);
  const [f2, setF2] = useState<number>(260);
  const [a1, setA1] = useState<number>(1.0);
  const [a2, setA2] = useState<number>(1.0);
  const [timeScale, setTimeScale] = useState<number>(0.08);
  const [sweepSpeed, setSweepSpeed] = useState<number>(0.5);
  const [showCarrier, setShowCarrier] = useState<boolean>(true);
  const [isPlayingVisual, setIsPlayingVisual] = useState<boolean>(true);

  // Audio synthesizer state
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);

  // Module 3 Mystery Fork state
  const [mystery, setMystery] = useState<MysteryState>(() => ({
    knownF1: 256,
    baseF2: 260,
    initialBeats: 4,
    waxMassGrams: 0,
    filingAmount: 0,
    activeTool: 'none',
    challengeMode: true,
    userGuess: null,
    revealed: false,
  }));

  const t = DICTIONARY[lang];

  // Computed live frequencies for Module 3
  const liveMysteryF2 = Math.max(
    100,
    mystery.baseF2 - mystery.waxMassGrams + mystery.filingAmount
  );
  const liveMysteryBeats = Math.abs(mystery.knownF1 - liveMysteryF2);

  // Sync HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Keep Web Audio oscillators synced to active module parameters
  useEffect(() => {
    if (!isAudioPlaying) return;
    if (activeModule === 'module3') {
      acousticEngine.update(mystery.knownF1, liveMysteryF2, 0.85, 0.85, volume);
    } else {
      acousticEngine.update(f1, f2, a1, a2, volume);
    }
  }, [isAudioPlaying, activeModule, f1, f2, a1, a2, volume, mystery.knownF1, liveMysteryF2]);

  // Stop audio cleanly on unmount
  useEffect(() => {
    return () => {
      acousticEngine.stop();
    };
  }, []);

  const handleToggleAudio = useCallback(() => {
    if (isAudioPlaying) {
      acousticEngine.stop();
      setIsAudioPlaying(false);
    } else {
      if (activeModule === 'module3') {
        acousticEngine.start(mystery.knownF1, liveMysteryF2, 0.85, 0.85, volume);
      } else {
        acousticEngine.start(f1, f2, a1, a2, volume);
      }
      setIsAudioPlaying(true);
    }
  }, [isAudioPlaying, activeModule, f1, f2, a1, a2, volume, mystery.knownF1, liveMysteryF2]);

  const handleReset = useCallback(() => {
    if (activeModule === 'module3') {
      setMystery((prev) => ({
        ...prev,
        waxMassGrams: 0,
        filingAmount: 0,
        activeTool: 'none',
        userGuess: null,
        revealed: false,
      }));
    } else {
      setF1(256);
      setF2(260);
      setA1(1.0);
      setA2(1.0);
      setTimeScale(0.08);
      setSweepSpeed(0.5);
      setShowCarrier(true);
      setIsPlayingVisual(true);
    }
  }, [activeModule]);

  const handleApplyPresetDiff = useCallback(
    (diff: number) => {
      const nextF2 = f1 + diff <= 512 ? f1 + diff : f1 - diff;
      setF2(nextF2);
    },
    [f1]
  );

  // Module 3 handlers
  const handleChangeKnownF1 = useCallback((nextF1: number) => {
    setMystery((prev) => {
      const sign = prev.baseF2 >= prev.knownF1 ? 1 : -1;
      return {
        ...prev,
        knownF1: nextF1,
        baseF2: nextF1 + sign * prev.initialBeats,
      };
    });
  }, []);

  const handleChangeWaxMass = useCallback((grams: number) => {
    setMystery((prev) => ({
      ...prev,
      waxMassGrams: grams,
      activeTool: grams > 0 ? 'wax' : prev.filingAmount > 0 ? 'file' : 'none',
    }));
  }, []);

  const handleChangeFilingAmount = useCallback((lvl: number) => {
    setMystery((prev) => ({
      ...prev,
      filingAmount: lvl,
      activeTool: lvl > 0 ? 'file' : prev.waxMassGrams > 0 ? 'wax' : 'none',
    }));
  }, []);

  const handleQuickApplyWax = useCallback(() => {
    setMystery((prev) => {
      const nextWax = prev.waxMassGrams >= 5 ? 1 : Math.min(5, prev.waxMassGrams + 1);
      return {
        ...prev,
        waxMassGrams: nextWax,
        filingAmount: 0,
        activeTool: 'wax',
      };
    });
  }, []);

  const handleQuickFileProngs = useCallback(() => {
    setMystery((prev) => {
      const nextFile = prev.filingAmount >= 5 ? 1 : Math.min(5, prev.filingAmount + 1);
      return {
        ...prev,
        filingAmount: nextFile,
        waxMassGrams: 0,
        activeTool: 'file',
      };
    });
  }, []);

  const handleRestoreFork = useCallback(() => {
    setMystery((prev) => ({
      ...prev,
      waxMassGrams: 0,
      filingAmount: 0,
      activeTool: 'none',
    }));
  }, []);

  const handleGenerateMystery = useCallback(() => {
    setMystery((prev) => createRandomMystery(prev.knownF1));
  }, []);

  const handleToggleChallengeMode = useCallback((challenge: boolean) => {
    setMystery((prev) => ({
      ...prev,
      challengeMode: challenge,
    }));
  }, []);

  const handleSelectGuess = useCallback((guess: MysteryGuess) => {
    setMystery((prev) => ({
      ...prev,
      userGuess: guess,
    }));
  }, []);

  const handleRevealAnswer = useCallback(() => {
    setMystery((prev) => ({
      ...prev,
      revealed: true,
    }));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 via-slate-50 to-sky-100/60 text-slate-950">
      <TopNav
        t={t}
        lang={lang}
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onToggleLanguage={() => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-[1680px] w-full mx-auto p-3 sm:p-4 lg:p-5 flex flex-col lg:flex-row items-stretch gap-4">
        {/* Left Vertical Control Dock (Fixed 340px on lg+) */}
        <SidebarControls
          t={t}
          activeModule={activeModule}
          f1={f1}
          f2={f2}
          a1={a1}
          a2={a2}
          timeScale={timeScale}
          sweepSpeed={sweepSpeed}
          showCarrier={showCarrier}
          isPlayingVisual={isPlayingVisual}
          isAudioPlaying={isAudioPlaying}
          volume={volume}
          mystery={mystery}
          onChangeF1={setF1}
          onChangeF2={setF2}
          onChangeA1={setA1}
          onChangeA2={setA2}
          onChangeTimeScale={setTimeScale}
          onChangeSweepSpeed={setSweepSpeed}
          onToggleCarrier={() => setShowCarrier((prev) => !prev)}
          onToggleVisualPlay={() => setIsPlayingVisual((prev) => !prev)}
          onToggleAudio={handleToggleAudio}
          onChangeVolume={setVolume}
          onApplyPresetDiff={handleApplyPresetDiff}
          onChangeKnownF1={handleChangeKnownF1}
          onChangeWaxMass={handleChangeWaxMass}
          onChangeFilingAmount={handleChangeFilingAmount}
          onRestoreFork={handleRestoreFork}
          onGenerateMystery={handleGenerateMystery}
          onToggleChallengeMode={handleToggleChallengeMode}
        />

        {/* Center Canvas Stage (Flexible width) + Right Telemetry Panel */}
        <div className="flex-1 min-w-0 flex flex-col xl:flex-row items-stretch gap-4">
          <section className="flex-1 min-w-0 flex flex-col">
            {activeModule === 'module1' && (
              <Module1Stage
                t={t}
                f1={f1}
                f2={f2}
                a1={a1}
                a2={a2}
                timeScale={timeScale}
                isPlayingVisual={isPlayingVisual}
              />
            )}

            {activeModule === 'module2' && (
              <Module2Stage
                t={t}
                f1={f1}
                f2={f2}
                a1={a1}
                a2={a2}
                showCarrier={showCarrier}
                sweepSpeed={sweepSpeed}
                isPlayingVisual={isPlayingVisual}
              />
            )}

            {activeModule === 'module3' && (
              <Module3Stage
                t={t}
                mystery={mystery}
                liveF2={liveMysteryF2}
                liveBeats={liveMysteryBeats}
                isPlayingVisual={isPlayingVisual}
                onQuickApplyWax={handleQuickApplyWax}
                onQuickFileProngs={handleQuickFileProngs}
                onRestoreFork={handleRestoreFork}
              />
            )}
          </section>

          {/* Right Telemetry Panel (Fixed 330px on xl+) */}
          <TelemetryPanel
            t={t}
            activeModule={activeModule}
            f1={f1}
            f2={f2}
            a1={a1}
            a2={a2}
            mystery={mystery}
            liveF2={liveMysteryF2}
            liveBeats={liveMysteryBeats}
            onSelectGuess={handleSelectGuess}
            onRevealAnswer={handleRevealAnswer}
          />
        </div>
      </main>
    </div>
  );
}
