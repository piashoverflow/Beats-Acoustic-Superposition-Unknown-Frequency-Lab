import React from 'react';
import { Activity, CheckCircle2, HelpCircle, Info, XCircle } from 'lucide-react';
import type { ModuleId, MysteryGuess, MysteryState } from '../types';
import type { Translations } from '../i18n';

interface TelemetryPanelProps {
  t: Translations;
  activeModule: ModuleId;
  f1: number;
  f2: number;
  a1: number;
  a2: number;
  mystery: MysteryState;
  liveF2: number;
  liveBeats: number;
  onSelectGuess: (guess: MysteryGuess) => void;
  onRevealAnswer: () => void;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  t,
  activeModule,
  f1,
  f2,
  a1,
  a2,
  mystery,
  liveF2,
  liveBeats,
  onSelectGuess,
  onRevealAnswer,
}) => {
  if (activeModule === 'module3') {
    const lowCandidate = mystery.knownF1 - mystery.initialBeats;
    const highCandidate = mystery.knownF1 + mystery.initialBeats;
    const isModified = mystery.waxMassGrams > 0 || mystery.filingAmount > 0;

    let trendText = t.telemetry.trendUnchanged;
    let trendTone = 'bg-slate-50 border-slate-200 text-slate-700';
    if (isModified) {
      if (liveBeats < mystery.initialBeats) {
        trendText = t.telemetry.trendDecreased;
        trendTone = 'bg-emerald-50 border-emerald-300 text-emerald-900';
      } else if (liveBeats > mystery.initialBeats) {
        trendText = t.telemetry.trendIncreased;
        trendTone = 'bg-amber-50 border-amber-300 text-amber-900';
      }
    }

    const trueBranch: MysteryGuess =
      mystery.baseF2 === highCandidate ? 'plus' : 'minus';
    const isCorrect = mystery.userGuess !== null && mystery.userGuess === trueBranch;

    return (
      <aside className="w-full xl:w-[330px] xl:shrink-0 bg-white/95 border border-sky-200 rounded-2xl shadow-sm p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-sky-100 pb-3">
          <HelpCircle className="w-4 h-4 text-sky-700" aria-hidden="true" />
          <h2 className="text-sm font-extrabold text-slate-950">{t.telemetry.deductionTitle}</h2>
        </div>

        {/* Live Beat Counters */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200">
            <p className="text-[11px] font-semibold text-slate-600">{t.telemetry.initialBeatsLabel}</p>
            <p className="font-mono text-2xl font-extrabold text-slate-950 mt-0.5">
              {mystery.initialBeats}
              <span className="text-[11px] font-semibold text-slate-500 ml-1">Hz</span>
            </p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <p className="text-[11px] font-semibold text-emerald-800">{t.telemetry.currentBeatsLabel}</p>
            <p className="font-mono text-2xl font-extrabold text-emerald-700 mt-0.5">
              {liveBeats.toFixed(1).replace(/\.0$/, '')}
              <span className="text-[11px] font-semibold text-emerald-600 ml-1">Hz</span>
            </p>
          </div>
        </div>

        {/* Observed Beat Change Trend */}
        <div className={`p-3 rounded-xl border ${trendTone}`}>
          <p className="text-[11px] font-bold opacity-80">{t.telemetry.beatTrendLabel}</p>
          <p className="text-xs font-bold mt-1 leading-snug">{trendText}</p>
        </div>

        {/* Two Candidate Frequencies */}
        <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200 space-y-2">
          <p className="text-xs font-bold text-slate-800">{t.telemetry.candidatesLabel}</p>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs font-bold">
            <div className="px-2.5 py-2 rounded-lg bg-white border border-sky-200 text-slate-800 text-center">
              f₁ - N₀ = {lowCandidate} Hz
            </div>
            <div className="px-2.5 py-2 rounded-lg bg-white border border-sky-200 text-slate-800 text-center">
              f₁ + N₀ = {highCandidate} Hz
            </div>
          </div>
        </div>

        {/* Interactive Student Deduction Answer Check */}
        <div className="p-3.5 rounded-xl bg-white border border-sky-200 space-y-2.5">
          <p className="text-xs font-extrabold text-slate-900">{t.telemetry.chooseDeduction}</p>

          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => onSelectGuess('plus')}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                mystery.userGuess === 'plus'
                  ? trueBranch === 'plus'
                    ? 'bg-emerald-600 border-emerald-700 text-white'
                    : 'bg-rose-600 border-rose-700 text-white'
                  : 'bg-sky-50/60 border-sky-200 text-slate-900 hover:bg-sky-100'
              }`}
            >
              <span>{t.telemetry.optionPlus}</span>
              <span className="font-mono">{highCandidate} Hz</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectGuess('minus')}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                mystery.userGuess === 'minus'
                  ? trueBranch === 'minus'
                    ? 'bg-emerald-600 border-emerald-700 text-white'
                    : 'bg-rose-600 border-rose-700 text-white'
                  : 'bg-sky-50/60 border-sky-200 text-slate-900 hover:bg-sky-100'
              }`}
            >
              <span>{t.telemetry.optionMinus}</span>
              <span className="font-mono">{lowCandidate} Hz</span>
            </button>
          </div>

          {mystery.userGuess !== null && (
            <div
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <span>{isCorrect ? t.telemetry.correctFeedback : t.telemetry.wrongFeedback}</span>
            </div>
          )}

          {mystery.challengeMode && !mystery.revealed && (
            <button
              type="button"
              onClick={onRevealAnswer}
              className="w-full py-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 underline underline-offset-2 cursor-pointer"
            >
              {t.telemetry.revealAnswer}
            </button>
          )}

          {(!mystery.challengeMode || mystery.revealed) && (
            <div className="pt-1 text-xs font-mono font-bold text-emerald-700 text-center">
              Original f₂ = {mystery.baseF2} Hz · Live f₂&apos; = {liveF2.toFixed(1).replace(/\.0$/, '')} Hz
            </div>
          )}
        </div>

        {/* Core Physics Principle Reference */}
        <div className="mt-auto p-3 rounded-xl bg-sky-50/80 border border-sky-200 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
            <Info className="w-3.5 h-3.5 text-sky-700" />
            <span>{t.telemetry.ruleCardTitle}</span>
          </div>
          <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
            • {t.telemetry.waxRuleShort}
          </p>
          <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
            • {t.telemetry.fileRuleShort}
          </p>
        </div>
      </aside>
    );
  }

  // MODULE 1 & 2 TELEMETRY
  const beatFreq = Math.abs(f1 - f2);
  const avgFreq = (f1 + f2) / 2;
  const beatPeriod = beatFreq > 0 ? 1 / beatFreq : null;
  const halfPeriod = beatPeriod !== null ? beatPeriod / 2 : null;
  const modFreq = Math.abs(f1 - f2) / 2;
  const peakAmp = a1 + a2;

  let perceptionTitle = t.telemetry.perceptionAudible;
  let perceptionDesc = t.telemetry.perceptionDescAudible;
  let perceptionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900';
  let PerceptionIcon = CheckCircle2;

  if (beatFreq === 0) {
    perceptionTitle = t.telemetry.perceptionUnison;
    perceptionDesc = t.telemetry.perceptionDescUnison;
    perceptionStyle = 'bg-sky-50 border-sky-300 text-sky-900';
    PerceptionIcon = Info;
  } else if (beatFreq > 10) {
    perceptionTitle = t.telemetry.perceptionInaudible;
    perceptionDesc = t.telemetry.perceptionDescInaudible;
    perceptionStyle = 'bg-rose-50 border-rose-300 text-rose-900';
    PerceptionIcon = XCircle;
  }

  return (
    <aside className="w-full xl:w-[330px] xl:shrink-0 bg-white/95 border border-sky-200 rounded-2xl shadow-sm p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-sky-100 pb-3">
        <Activity className="w-4 h-4 text-sky-700" aria-hidden="true" />
        <h2 className="text-sm font-extrabold text-slate-950">{t.telemetry.heading}</h2>
      </div>

      {/* Primary Beat Frequency Readout */}
      <div className="p-3.5 rounded-xl bg-sky-50/75 border border-sky-200">
        <p className="text-xs font-bold text-slate-700">{t.telemetry.beatFreqTitle}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="font-mono text-3xl font-extrabold text-slate-950">{beatFreq}</span>
          <span className="font-mono text-xs font-bold text-sky-700">
            Hz ({t.telemetry.beatsPerSecUnit})
          </span>
        </div>
      </div>

      {/* Time Intervals & Carrier Readouts */}
      <div className="space-y-2.5">
        <div className="p-3 rounded-xl bg-white border border-sky-200 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-700 leading-snug">
            {t.telemetry.waxingIntervalTitle}
          </span>
          <span className="font-mono text-sm font-extrabold text-slate-950 whitespace-nowrap shrink-0">
            {beatPeriod !== null ? `${beatPeriod.toFixed(3)} s` : '∞'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-sky-200 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-700 leading-snug">
            {t.telemetry.waxToWaningTitle}
          </span>
          <span className="font-mono text-sm font-extrabold text-slate-950 whitespace-nowrap shrink-0">
            {halfPeriod !== null ? `${halfPeriod.toFixed(3)} s` : '∞'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-sky-200 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-700 leading-snug">
            {t.telemetry.avgCarrierTitle}
          </span>
          <span className="font-mono text-sm font-extrabold text-sky-800 whitespace-nowrap shrink-0">
            {avgFreq.toFixed(1).replace(/\.0$/, '')} Hz
          </span>
        </div>
      </div>

      {/* Auditory Perception Status Card (Dual-coded icon + text) */}
      <div className={`p-3.5 rounded-xl border space-y-1.5 ${perceptionStyle}`}>
        <p className="text-[11px] font-bold uppercase tracking-wide opacity-75">
          {t.telemetry.perceptionTitle}
        </p>
        <div className="flex items-center gap-2">
          <PerceptionIcon className="w-4 h-4 shrink-0" />
          <p className="text-xs font-extrabold">{perceptionTitle}</p>
        </div>
        <p className="text-[11px] leading-relaxed opacity-90">{perceptionDesc}</p>
      </div>

      {/* Trigonometric Modulation Formula Card */}
      <div className="mt-auto p-3.5 rounded-xl bg-slate-900 text-slate-50 space-y-2">
        <p className="text-[11px] font-bold text-sky-300">{t.telemetry.equationTitle}</p>
        <p className="font-mono text-[11px] leading-relaxed text-emerald-300">
          y(t) = [2A cos(2π·{modFreq.toFixed(1).replace(/\.0$/, '')}t)] · sin(2π·
          {avgFreq.toFixed(1).replace(/\.0$/, '')}t)
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-700 text-[11px]">
          <div>
            <span className="text-slate-400 block">{t.telemetry.modulationAmpLabel}</span>
            <span className="font-mono font-bold text-white">{peakAmp.toFixed(1)} A</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t.telemetry.carrierFreqLabel}</span>
            <span className="font-mono font-bold text-white">
              {avgFreq.toFixed(1).replace(/\.0$/, '')} Hz
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
