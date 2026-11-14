import React from 'react';
import {
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Sliders,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { ModuleId, MysteryState } from '../types';
import type { Translations } from '../i18n';
import { ProgressiveSlider } from './ProgressiveSlider';

interface SidebarControlsProps {
  t: Translations;
  activeModule: ModuleId;
  f1: number;
  f2: number;
  a1: number;
  a2: number;
  timeScale: number;
  sweepSpeed: number;
  showCarrier: boolean;
  isPlayingVisual: boolean;
  isAudioPlaying: boolean;
  volume: number;
  mystery: MysteryState;
  onChangeF1: (v: number) => void;
  onChangeF2: (v: number) => void;
  onChangeA1: (v: number) => void;
  onChangeA2: (v: number) => void;
  onChangeTimeScale: (v: number) => void;
  onChangeSweepSpeed: (v: number) => void;
  onToggleCarrier: () => void;
  onToggleVisualPlay: () => void;
  onToggleAudio: () => void;
  onChangeVolume: (v: number) => void;
  onApplyPresetDiff: (diff: number) => void;
  onChangeKnownF1: (v: number) => void;
  onChangeWaxMass: (v: number) => void;
  onChangeFilingAmount: (v: number) => void;
  onRestoreFork: () => void;
  onGenerateMystery: () => void;
  onToggleChallengeMode: (challenge: boolean) => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  t,
  activeModule,
  f1,
  f2,
  a1,
  a2,
  timeScale,
  sweepSpeed,
  showCarrier,
  isPlayingVisual,
  isAudioPlaying,
  volume,
  mystery,
  onChangeF1,
  onChangeF2,
  onChangeA1,
  onChangeA2,
  onChangeTimeScale,
  onChangeSweepSpeed,
  onToggleCarrier,
  onToggleVisualPlay,
  onToggleAudio,
  onChangeVolume,
  onApplyPresetDiff,
  onChangeKnownF1,
  onChangeWaxMass,
  onChangeFilingAmount,
  onRestoreFork,
  onGenerateMystery,
  onToggleChallengeMode,
}) => {
  return (
    <aside className="w-full lg:w-[340px] lg:shrink-0 bg-white/95 border border-sky-200 rounded-2xl shadow-sm p-4 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-700" aria-hidden="true" />
          <h2 className="text-sm font-extrabold text-slate-950">{t.controls.heading}</h2>
        </div>

        {activeModule !== 'module3' && (
          <button
            type="button"
            onClick={onToggleVisualPlay}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              isPlayingVisual
                ? 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
            }`}
          >
            {isPlayingVisual ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.controls.pauseVisual}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.controls.playVisual}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* MODULE 1 & 2 FREQUENCY CONTROLS */}
      {activeModule !== 'module3' && (
        <div className="space-y-4">
          <ProgressiveSlider
            id="slider-f1"
            label={t.controls.fork1Freq}
            value={f1}
            min={200}
            max={512}
            step={1}
            unit="Hz"
            onChange={onChangeF1}
          />

          <ProgressiveSlider
            id="slider-f2"
            label={t.controls.fork2Freq}
            value={f2}
            min={200}
            max={512}
            step={1}
            unit="Hz"
            onChange={onChangeF2}
          />

          {activeModule === 'module1' && (
            <>
              <div className="pt-2 border-t border-sky-100 space-y-4">
                <ProgressiveSlider
                  id="slider-a1"
                  label={t.controls.amp1}
                  value={a1}
                  min={0.2}
                  max={1.0}
                  step={0.1}
                  precision={1}
                  onChange={onChangeA1}
                />

                <ProgressiveSlider
                  id="slider-a2"
                  label={t.controls.amp2}
                  value={a2}
                  min={0.2}
                  max={1.0}
                  step={0.1}
                  precision={1}
                  onChange={onChangeA2}
                />
              </div>

              <div className="pt-2 border-t border-sky-100 space-y-1.5">
                <ProgressiveSlider
                  id="slider-timescale"
                  label={t.controls.timeScale}
                  value={timeScale}
                  min={0.01}
                  max={1.0}
                  step={0.01}
                  precision={2}
                  unit="×"
                  onChange={onChangeTimeScale}
                />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {t.controls.slowMotionHint}
                </p>
              </div>
            </>
          )}

          {activeModule === 'module2' && (
            <div className="pt-2 border-t border-sky-100 space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-800 mb-2">{t.controls.presetsLabel}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { diff: 2, label: t.controls.presetClear },
                    { diff: 5, label: t.controls.presetDistinct },
                    { diff: 10, label: t.controls.presetLimit },
                    { diff: 18, label: t.controls.presetAbove },
                  ].map((preset) => {
                    const isCurrent = Math.abs(f1 - f2) === preset.diff;
                    return (
                      <button
                        key={preset.diff}
                        type="button"
                        onClick={() => onApplyPresetDiff(preset.diff)}
                        className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors text-left cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                            : 'bg-sky-50/70 border-sky-200 text-slate-700 hover:bg-sky-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <ProgressiveSlider
                id="slider-sweep"
                label={t.controls.sweepSpeed}
                value={sweepSpeed}
                min={0.1}
                max={1.0}
                step={0.05}
                precision={2}
                unit="×"
                onChange={onChangeSweepSpeed}
              />

              <label className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-sky-50/80 border border-sky-200 cursor-pointer">
                <span className="text-xs font-bold text-slate-800">{t.controls.showCarrier}</span>
                <input
                  type="checkbox"
                  checked={showCarrier}
                  onChange={onToggleCarrier}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </label>
            </div>
          )}
        </div>
      )}

      {/* MODULE 3 CONTROLS: UNKNOWN FREQUENCY LAB */}
      {activeModule === 'module3' && (
        <div className="space-y-4">
          {/* Mode Switcher */}
          <div>
            <p className="text-xs font-bold text-slate-800 mb-1.5">{t.controls.modeLabel}</p>
            <div className="grid grid-cols-2 gap-1 p-1 bg-sky-100/80 border border-sky-200 rounded-xl">
              <button
                type="button"
                onClick={() => onToggleChallengeMode(true)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  mystery.challengeMode
                    ? 'bg-white text-sky-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.controls.modeChallenge}
              </button>
              <button
                type="button"
                onClick={() => onToggleChallengeMode(false)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  !mystery.challengeMode
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.controls.modePractice}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onGenerateMystery}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.controls.newMystery}</span>
          </button>

          <ProgressiveSlider
            id="slider-known-f1"
            label={t.controls.knownFork1}
            value={mystery.knownF1}
            min={220}
            max={480}
            step={4}
            unit="Hz"
            onChange={onChangeKnownF1}
          />

          <div className="pt-2 border-t border-sky-100 space-y-4">
            <ProgressiveSlider
              id="slider-wax"
              label={t.controls.waxMass}
              value={mystery.waxMassGrams}
              min={0}
              max={5}
              step={0.5}
              precision={1}
              unit="g"
              onChange={onChangeWaxMass}
            />

            <ProgressiveSlider
              id="slider-file"
              label={t.controls.filingLevel}
              value={mystery.filingAmount}
              min={0}
              max={5}
              step={0.5}
              precision={1}
              unit="lvl"
              onChange={onChangeFilingAmount}
            />

            <button
              type="button"
              onClick={onRestoreFork}
              disabled={mystery.waxMassGrams === 0 && mystery.filingAmount === 0}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-800 text-xs font-bold disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.controls.restoreFork}</span>
            </button>
          </div>
        </div>
      )}

      {/* WEB AUDIO SYNTHESIZER SECTION (Consistent across all 3 modules) */}
      <div className="mt-auto pt-3 border-t border-sky-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-900">{t.controls.audioSection}</span>
          <span className="font-mono text-[11px] font-semibold text-slate-500">Web Audio API</span>
        </div>

        <button
          type="button"
          onClick={onToggleAudio}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer ${
            isAudioPlaying
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isAudioPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{t.controls.muteAudio}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{t.controls.playAudio}</span>
            </>
          )}
        </button>

        <ProgressiveSlider
          id="slider-volume"
          label={t.controls.masterVolume}
          value={Math.round(volume * 100)}
          min={5}
          max={100}
          step={1}
          unit="%"
          onChange={(pct) => onChangeVolume(pct / 100)}
        />
      </div>
    </aside>
  );
};
