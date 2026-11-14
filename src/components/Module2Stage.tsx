import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import type { Translations } from '../i18n';
import { acousticEngine } from '../audio/AcousticEngine';

interface Module2StageProps {
  t: Translations;
  f1: number;
  f2: number;
  a1: number;
  a2: number;
  showCarrier: boolean;
  sweepSpeed: number;
  isPlayingVisual: boolean;
}

export const Module2Stage: React.FC<Module2StageProps> = ({
  t,
  f1,
  f2,
  a1,
  a2,
  showCarrier,
  sweepSpeed,
  isPlayingVisual,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playheadRef = useRef<number>(0); // 0 to 1.0 second
  const lastPeakIndexRef = useRef<number>(-1);
  const [beatFlash, setBeatFlash] = useState(false);
  const [countedPeaks, setCountedPeaks] = useState(0);
  const [chimeEnabled, setChimeEnabled] = useState(false);

  const paramsRef = useRef({
    f1,
    f2,
    a1,
    a2,
    showCarrier,
    sweepSpeed,
    isPlayingVisual,
    chimeEnabled,
    t,
  });
  paramsRef.current = {
    f1,
    f2,
    a1,
    a2,
    showCarrier,
    sweepSpeed,
    isPlayingVisual,
    chimeEnabled,
    t,
  };

  useEffect(() => {
    lastPeakIndexRef.current = -1;
    setCountedPeaks(0);
  }, [f1, f2]);

  useEffect(() => {
    let rafId = 0;
    let lastTs = performance.now();
    let flashTimeout = 0;

    const render = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTs) / 1000));
      lastTs = now;

      const {
        f1: cf1,
        f2: cf2,
        a1: ca1,
        a2: ca2,
        showCarrier: carrierOn,
        sweepSpeed: speed,
        isPlayingVisual: playing,
        chimeEnabled: chime,
        t: ct,
      } = paramsRef.current;

      const diff = Math.abs(cf1 - cf2);

      if (playing) {
        const nextPos = playheadRef.current + dt * speed;
        if (nextPos >= 1.0) {
          playheadRef.current = nextPos % 1.0;
          lastPeakIndexRef.current = -1;
        } else {
          playheadRef.current = nextPos;
        }
      }

      const cursorT = playheadRef.current;

      // Track beat peaks inside [0, 1.0]s: peaks occur at t = k / diff for k = 0, 1, ..., diff - 1 (or k / diff <= 1)
      if (diff > 0 && playing) {
        const currentPeakIdx = Math.floor(cursorT * diff);
        if (currentPeakIdx !== lastPeakIndexRef.current && currentPeakIdx >= 0) {
          lastPeakIndexRef.current = currentPeakIdx;
          setCountedPeaks(Math.min(diff, currentPeakIdx + 1));
          setBeatFlash(true);
          window.clearTimeout(flashTimeout);
          flashTimeout = window.setTimeout(() => setBeatFlash(false), 120);
          if (chime && diff <= 15) {
            acousticEngine.playChime();
          }
        }
      } else if (diff === 0) {
        setCountedPeaks(0);
      }

      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetW = Math.max(1, Math.round(rect.width * dpr));
        const targetH = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);
          const W = rect.width;
          const H = rect.height;
          ctx.clearRect(0, 0, W, H);

          const padL = 52;
          const padR = 24;
          const padT = 56;
          const padB = 54;
          const plotW = Math.max(120, W - padL - padR);
          const plotH = Math.max(140, H - padT - padB);
          const midY = padT + plotH / 2;
          const maxAmpPx = plotH * 0.42;
          const normDiv = 2.0; // max |y1+y2| when a1=a2=1 is 2.0

          // Plot backdrop
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(padL, padT, plotW, plotH);

          // 0.1s Persistence of Hearing reference zone [0.0s .. 0.1s]
          const persistW = 0.1 * plotW;
          ctx.fillStyle = diff > 10 ? 'rgba(244, 63, 94, 0.08)' : 'rgba(14, 165, 233, 0.08)';
          ctx.fillRect(padL, padT, persistW, plotH);

          // Vertical calibrated gridlines every 0.1s (0.0s to 1.0s)
          for (let i = 0; i <= 10; i++) {
            const frac = i / 10;
            const gx = padL + frac * plotW;
            ctx.strokeStyle = i === 0 || i === 10 ? '#94a3b8' : '#e2e8f0';
            ctx.lineWidth = i === 0 || i === 10 ? 1.3 : 1;
            ctx.beginPath();
            ctx.moveTo(gx, padT);
            ctx.lineTo(gx, padT + plotH);
            ctx.stroke();

            // Time tick label
            ctx.fillStyle = '#334155';
            ctx.font = '600 11px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${(i * 0.1).toFixed(1)}s`, gx, padT + plotH + 18);
          }

          // Horizontal axis baseline & amplitude guides (+2A, +A, 0, -A, -2A)
          const hLevels = [-1, -0.5, 0, 0.5, 1];
          for (const lvl of hLevels) {
            const gy = midY - lvl * maxAmpPx;
            ctx.strokeStyle = lvl === 0 ? '#94a3b8' : '#e2e8f0';
            ctx.lineWidth = lvl === 0 ? 1.3 : 1;
            if (lvl !== 0) ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(padL, gy);
            ctx.lineTo(padL + plotW, gy);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#64748b';
            ctx.font = '600 10px "JetBrains Mono", monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            const labelVal = (lvl * 2).toFixed(1);
            ctx.fillText(lvl === 0 ? '0' : `${lvl > 0 ? '+' : ''}${labelVal}A`, padL - 8, gy);
          }
          ctx.textBaseline = 'alphabetic';

          // Time Axis Title
          ctx.fillStyle = '#0f172a';
          ctx.font = '700 12px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(ct.stage.timeAxisSec, padL + plotW / 2, padT + plotH + 38);

          // Persistence of Hearing 0.1s bracket at top of plot
          const brY = padT - 10;
          ctx.strokeStyle = diff > 10 ? '#e11d48' : '#0284c7';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(padL, brY - 5);
          ctx.lineTo(padL, brY);
          ctx.lineTo(padL + persistW, brY);
          ctx.lineTo(padL + persistW, brY - 5);
          ctx.stroke();

          ctx.fillStyle = diff > 10 ? '#be123c' : '#0369a1';
          ctx.font = '700 11px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(ct.stage.persistenceBracket, padL, brY - 12);

          // Sample across 0..1.0s
          const samples = Math.min(2600, Math.max(900, Math.round(plotW * 3)));

          // 1. Soft shaded fill between upper & lower modulation envelope
          ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
          ctx.beginPath();
          for (let i = 0; i <= samples; i++) {
            const tVal = i / samples;
            const env = Math.sqrt(
              ca1 * ca1 + ca2 * ca2 + 2 * ca1 * ca2 * Math.cos(2 * Math.PI * (cf1 - cf2) * tVal)
            );
            const px = padL + tVal * plotW;
            const py = midY - (env / normDiv) * maxAmpPx;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          for (let i = samples; i >= 0; i--) {
            const tVal = i / samples;
            const env = Math.sqrt(
              ca1 * ca1 + ca2 * ca2 + 2 * ca1 * ca2 * Math.cos(2 * Math.PI * (cf1 - cf2) * tVal)
            );
            const px = padL + tVal * plotW;
            const py = midY + (env / normDiv) * maxAmpPx;
            ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();

          // 2. High-frequency Carrier Wave inside envelope
          if (carrierOn) {
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.72)';
            ctx.lineWidth = 1.15;
            ctx.beginPath();
            for (let i = 0; i <= samples; i++) {
              const tVal = i / samples;
              // Exact superposition wave over 1.0 s
              const y =
                ca1 * Math.sin(2 * Math.PI * cf1 * tVal) +
                ca2 * Math.sin(2 * Math.PI * cf2 * tVal);
              const px = padL + tVal * plotW;
              const py = midY - (y / normDiv) * maxAmpPx;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }

          // 3. Outer Dashed Modulation Envelope (+A_mod and -A_mod)
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 2.4;
          ctx.setLineDash([7, 5]);
          for (const sign of [1, -1]) {
            ctx.beginPath();
            for (let i = 0; i <= samples; i++) {
              const tVal = i / samples;
              const env = Math.sqrt(
                ca1 * ca1 + ca2 * ca2 + 2 * ca1 * ca2 * Math.cos(2 * Math.PI * (cf1 - cf2) * tVal)
              );
              const px = padL + tVal * plotW;
              const py = midY - sign * (env / normDiv) * maxAmpPx;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
          ctx.setLineDash([]);

          // 4. Numbered Waxing Peak markers along [0, 1.0s)
          if (diff > 0) {
            const maxMarkers = Math.min(diff, 24);
            for (let k = 0; k < maxMarkers; k++) {
              const peakT = k / diff;
              const px = padL + peakT * plotW;
              const peakEnv = (ca1 + ca2) / normDiv;
              const py = midY - peakEnv * maxAmpPx;

              const passed = cursorT >= peakT;
              ctx.fillStyle = passed ? '#059669' : '#0284c7';
              ctx.beginPath();
              ctx.arc(px, py, 4.5, 0, Math.PI * 2);
              ctx.fill();

              if (diff <= 18) {
                ctx.fillStyle = passed ? '#047857' : '#0369a1';
                ctx.font = '700 10.5px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`${k + 1}`, px, py - 9);
              }
            }
          }

          // 5. Animated Sweeping Playhead Cursor
          const cursorX = padL + cursorT * plotW;
          ctx.strokeStyle = '#e11d48';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(cursorX, padT);
          ctx.lineTo(cursorX, padT + plotH);
          ctx.stroke();

          // Playhead cap pill
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.roundRect(cursorX - 22, padT + plotH - 20, 44, 18, 5);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = '700 10px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${cursorT.toFixed(2)}s`, cursorX, padT + plotH - 7);

          // Border around plot area
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(padL, padT, plotW, plotH);

          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(flashTimeout);
    };
  }, []);

  const beatCount = Math.abs(f1 - f2);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Top 1-Second Beat Counter & Legend Strip */}
      <div className="bg-white/95 border border-sky-200 rounded-2xl shadow-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-950">{t.stage.envelopeTitle}</h2>
          <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <span className="w-5 border-t-2 border-dashed border-emerald-600 inline-block" />
              {t.stage.envelopeLegend}
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <span className="w-5 border-t-2 border-slate-900 inline-block" />
              {t.stage.carrierLegend}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Chime toggle for beat peaks */}
          <button
            type="button"
            onClick={() => setChimeEnabled((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              chimeEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {chimeEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span>{t.stage.beatCounterLabel}</span>
          </button>

          {/* Visual Beat Counter Badge */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all duration-100 ${
              beatFlash
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm scale-[1.03]'
                : 'bg-sky-50 text-slate-950 border-sky-200'
            }`}
          >
            <span className="font-mono text-lg font-extrabold leading-none">
              {countedPeaks}
              <span className="text-xs font-semibold opacity-75">/{beatCount}</span>
            </span>
            <span className="text-xs font-bold whitespace-nowrap">{t.stage.peaksInOneSec}</span>
          </div>
        </div>
      </div>

      {/* Main Calibrated 1.0s Envelope Canvas */}
      <div className="bg-white/95 border border-sky-200 rounded-2xl shadow-sm p-3 flex-1 flex flex-col min-h-[430px]">
        <div className="flex-1 w-full relative min-h-[390px]">
          <canvas ref={canvasRef} className="w-full h-full block rounded-xl" />
        </div>
      </div>
    </div>
  );
};
