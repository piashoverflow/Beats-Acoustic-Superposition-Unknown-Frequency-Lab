import React, { useEffect, useRef } from 'react';
import { Hammer, RotateCcw, Sparkles } from 'lucide-react';
import type { MysteryModTool, MysteryState } from '../types';
import type { Translations } from '../i18n';

interface Module3StageProps {
  t: Translations;
  mystery: MysteryState;
  liveF2: number;
  liveBeats: number;
  isPlayingVisual: boolean;
  onQuickApplyWax: () => void;
  onQuickFileProngs: () => void;
  onRestoreFork: () => void;
}

export const Module3Stage: React.FC<Module3StageProps> = ({
  t,
  mystery,
  liveF2,
  liveBeats,
  isPlayingVisual,
  onQuickApplyWax,
  onQuickFileProngs,
  onRestoreFork,
}) => {
  const benchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef<number>(0);

  const stateRef = useRef({
    t,
    mystery,
    liveF2,
    liveBeats,
    isPlayingVisual,
  });
  stateRef.current = { t, mystery, liveF2, liveBeats, isPlayingVisual };

  useEffect(() => {
    let rafId = 0;
    let lastTs = performance.now();

    const drawBenchFork = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      deflection: number,
      accent: string,
      label: string,
      freqText: string,
      waxGrams: number,
      filingLevel: number,
      activeTool: MysteryModTool
    ) => {
      ctx.save();
      ctx.translate(cx, cy);

      // Stand base
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(-22, 54, 44, 10, 4);
      ctx.fill();

      // Stem
      const stemGrad = ctx.createLinearGradient(-5, 0, 5, 0);
      stemGrad.addColorStop(0, '#64748b');
      stemGrad.addColorStop(0.5, '#e2e8f0');
      stemGrad.addColorStop(1, '#475569');
      ctx.fillStyle = stemGrad;
      ctx.beginPath();
      ctx.roundRect(-5, 18, 10, 38, 3);
      ctx.fill();

      // U-bend
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 8, 17, 0, Math.PI, false);
      ctx.stroke();

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.arc(0, 8, 17, 0, Math.PI, false);
      ctx.stroke();

      // Prongs (filing visibly slims & bevels the tip!)
      const prongThickness = Math.max(5.5, 9 - filingLevel * 0.55);
      const prongHeight = -50 + filingLevel * 1.4;

      const drawProng = (side: -1 | 1) => {
        const baseX = side * 17;
        const tipX = side * (17 + deflection);
        const baseY = 8;
        const tipY = prongHeight;

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = prongThickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(baseX, -20, tipX, tipY);
        ctx.stroke();

        ctx.strokeStyle = filingLevel > 0 ? '#f8fafc' : '#e2e8f0';
        ctx.lineWidth = Math.max(2.2, prongThickness * 0.42);
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(baseX, -20, tipX, tipY);
        ctx.stroke();

        // Filed bright metallic bevel highlight
        if (filingLevel > 0) {
          ctx.strokeStyle = '#0ea5e9';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tipX - side * 2, tipY + 14);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
        }

        // Yellow wax blobs attached to prong tips
        if (waxGrams > 0) {
          const blobR = 4.2 + waxGrams * 1.15;
          const waxGrad = ctx.createRadialGradient(
            tipX + side * 1.5 - 1.5,
            tipY + 4,
            1,
            tipX + side * 1.5,
            tipY + 5,
            blobR
          );
          waxGrad.addColorStop(0, '#fef08a');
          waxGrad.addColorStop(0.6, '#facc15');
          waxGrad.addColorStop(1, '#ca8a04');

          ctx.fillStyle = waxGrad;
          ctx.strokeStyle = '#a16207';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(tipX + side * 2, tipY + 6, blobR * 0.85, blobR * 1.1, side * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      };

      drawProng(-1);
      drawProng(1);

      // Metal filings dust at base if filed
      if (filingLevel > 0 && activeTool === 'file') {
        ctx.fillStyle = '#64748b';
        for (let i = 0; i < Math.round(filingLevel * 4); i++) {
          const fx = Math.sin(i * 7.3) * 28;
          const fy = 63 + Math.cos(i * 4.1) * 2;
          ctx.fillRect(fx, fy, 2.2, 1.5);
        }
      }

      // Labels below stand
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 12.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, 82);

      ctx.fillStyle = accent;
      ctx.font = '700 13px "JetBrains Mono", monospace';
      ctx.fillText(freqText, 0, 99);

      ctx.restore();
    };

    const render = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTs) / 1000));
      lastTs = now;

      const { t: ct, mystery: m, liveF2: f2, liveBeats: nLive, isPlayingVisual: playing } = stateRef.current;

      if (playing) {
        simTimeRef.current += dt * 0.08;
      }
      const simT = simTimeRef.current;
      const showActualF2 = !m.challengeMode || m.revealed;

      // --- 1. RENDER VIRTUAL LAB BENCH ---
      const bCanvas = benchCanvasRef.current;
      if (bCanvas) {
        const rect = bCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetW = Math.max(1, Math.round(rect.width * dpr));
        const targetH = Math.max(1, Math.round(rect.height * dpr));
        if (bCanvas.width !== targetW || bCanvas.height !== targetH) {
          bCanvas.width = targetW;
          bCanvas.height = targetH;
        }
        const ctx = bCanvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);
          const W = rect.width;
          const H = rect.height;
          ctx.clearRect(0, 0, W, H);

          // Bench tabletop horizon
          const benchY = H * 0.68;
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(0, benchY, W, H - benchY);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, benchY);
          ctx.lineTo(W, benchY);
          ctx.stroke();

          const forkAX = Math.max(92, W * 0.17);
          const forkBX = Math.min(W - 92, W * 0.83);
          const forkY = benchY - 64;

          // Radiating acoustic wave arcs
          const phase1 = (simT * (m.knownF1 / 55)) % 1;
          const phase2 = (simT * (f2 / 55)) % 1;
          for (let i = 0; i < 4; i++) {
            const p1 = (i + phase1) / 4;
            ctx.strokeStyle = `rgba(2, 132, 199, ${(1 - p1) * 0.35})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(forkAX + 15, forkY - 22, 24 + p1 * 110, -Math.PI * 0.3, Math.PI * 0.3);
            ctx.stroke();

            const p2 = (i + phase2) / 4;
            ctx.strokeStyle = `rgba(5, 150, 105, ${(1 - p2) * 0.35})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(forkBX - 15, forkY - 22, 24 + p2 * 110, Math.PI - Math.PI * 0.3, Math.PI + Math.PI * 0.3);
            ctx.stroke();
          }

          // Center Live Beat Waveform Scope Pill inside the air column
          const scopeW = Math.min(240, Math.max(130, W * 0.32));
          const scopeH = 68;
          const scopeX = (W - scopeW) / 2;
          const scopeY = forkY - 52;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
          ctx.strokeStyle = '#bae6fd';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(scopeX, scopeY, scopeW, scopeH, 12);
          ctx.fill();
          ctx.stroke();

          // Draw live beat waveform inside the mini scope
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(scopeX + 4, scopeY + 4, scopeW - 8, scopeH - 8, 8);
          ctx.clip();

          const sMidY = scopeY + scopeH / 2 + 6;
          const sAmp = scopeH * 0.28;
          const winSec = 0.35;
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          for (let i = 0; i <= 180; i++) {
            const frac = i / 180;
            const tv = simT * 4 + frac * winSec;
            const y = 0.5 * (Math.sin(2 * Math.PI * m.knownF1 * tv) + Math.sin(2 * Math.PI * f2 * tv));
            const px = scopeX + 8 + frac * (scopeW - 16);
            const py = sMidY - y * sAmp;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.restore();

          // Live beat frequency readout above mini wave
          ctx.fillStyle = '#059669';
          ctx.font = '700 11.5px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`N = ${nLive.toFixed(1).replace(/\.0$/, '')} beats/s`, W / 2, scopeY + 16);

          // Draw Fork A and Fork B
          const defl1 = 4.6 * Math.sin(2 * Math.PI * (m.knownF1 / 20) * simT);
          const defl2 = 4.6 * Math.sin(2 * Math.PI * (f2 / 20) * simT);

          drawBenchFork(
            ctx,
            forkAX,
            forkY,
            defl1,
            '#0284c7',
            ct.stage.forkA,
            `${m.knownF1} Hz`,
            0,
            0,
            'none'
          );

          const forkBLabel = showActualF2 ? ct.stage.forkB : ct.stage.mysteryForkB;
          const forkBFreqLabel = showActualF2 ? `${f2.toFixed(1).replace(/\.0$/, '')} Hz` : '? Hz';
          drawBenchFork(
            ctx,
            forkBX,
            forkY,
            defl2,
            '#059669',
            forkBLabel,
            forkBFreqLabel,
            m.waxMassGrams,
            m.filingAmount,
            m.activeTool
          );

          ctx.restore();
        }
      }

      // --- 2. RENDER LIVE NUMBER-LINE FREQUENCY VISUALIZER ---
      const lCanvas = lineCanvasRef.current;
      if (lCanvas) {
        const rect = lCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetW = Math.max(1, Math.round(rect.width * dpr));
        const targetH = Math.max(1, Math.round(rect.height * dpr));
        if (lCanvas.width !== targetW || lCanvas.height !== targetH) {
          lCanvas.width = targetW;
          lCanvas.height = targetH;
        }
        const ctx = lCanvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);
          const W = rect.width;
          const H = rect.height;
          ctx.clearRect(0, 0, W, H);

          const spanHalf = Math.max(12, m.initialBeats + 7);
          const minFreq = m.knownF1 - spanHalf;
          const maxFreq = m.knownF1 + spanHalf;

          const padL = 32;
          const padR = 32;
          const lineW = Math.max(140, W - padL - padR);
          const axisY = H * 0.56;

          const freqToX = (freq: number) =>
            padL + ((freq - minFreq) / (maxFreq - minFreq)) * lineW;

          // Horizontal Number Line Spine
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(padL, axisY);
          ctx.lineTo(padL + lineW, axisY);
          ctx.stroke();

          // Integer ticks along number line
          const tickStep = spanHalf > 18 ? 4 : 2;
          for (let f = Math.ceil(minFreq); f <= Math.floor(maxFreq); f++) {
            const x = freqToX(f);
            const isMajor = (f - m.knownF1) % tickStep === 0;
            ctx.strokeStyle = isMajor ? '#64748b' : '#cbd5e1';
            ctx.lineWidth = isMajor ? 1.5 : 1;
            ctx.beginPath();
            ctx.moveTo(x, axisY - (isMajor ? 7 : 4));
            ctx.lineTo(x, axisY + (isMajor ? 7 : 4));
            ctx.stroke();

            if (isMajor) {
              ctx.fillStyle = '#64748b';
              ctx.font = '600 10.5px "JetBrains Mono", monospace';
              ctx.textAlign = 'center';
              ctx.fillText(`${f}`, x, axisY + 21);
            }
          }

          // Known f1 center anchor
          const f1X = freqToX(m.knownF1);
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(f1X, axisY - 38);
          ctx.lineTo(f1X, axisY + 10);
          ctx.stroke();

          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.arc(f1X, axisY, 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#0369a1';
          ctx.font = '700 12px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`f₁ = ${m.knownF1} Hz`, f1X, axisY - 46);

          // Delta shift from wax / filing
          const deltaShift = -m.waxMassGrams + m.filingAmount;
          const lowBase = m.knownF1 - m.initialBeats;
          const highBase = m.knownF1 + m.initialBeats;
          const lowShifted = lowBase + deltaShift;
          const highShifted = highBase + deltaShift;

          const drawCandidate = (
            baseFreq: number,
            shiftedFreq: number,
            label: string,
            isTrueBranch: boolean
          ) => {
            const baseX = freqToX(baseFreq);
            const shiftX = freqToX(shiftedFreq);

            // Ghost marker at original candidate frequency
            ctx.strokeStyle = '#94a3b8';
            ctx.setLineDash([3, 3]);
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(baseX, axisY - 26);
            ctx.lineTo(baseX, axisY);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(baseX, axisY, 4, 0, Math.PI * 2);
            ctx.fill();

            // Shift arrow when wax or filing is applied
            if (Math.abs(deltaShift) > 0.05) {
              ctx.strokeStyle = deltaShift < 0 ? '#d97706' : '#0284c7';
              ctx.lineWidth = 2.2;
              ctx.beginPath();
              ctx.moveTo(baseX, axisY - 18);
              ctx.lineTo(shiftX, axisY - 18);
              ctx.stroke();

              // Arrowhead
              const dir = deltaShift < 0 ? -1 : 1;
              ctx.fillStyle = deltaShift < 0 ? '#d97706' : '#0284c7';
              ctx.beginPath();
              ctx.moveTo(shiftX, axisY - 18);
              ctx.lineTo(shiftX - dir * 6, axisY - 22);
              ctx.lineTo(shiftX - dir * 6, axisY - 14);
              ctx.closePath();
              ctx.fill();
            }

            // Active candidate / revealed marker
            const highlight = showActualF2 && isTrueBranch;
            const color = highlight ? '#059669' : showActualF2 ? '#94a3b8' : '#475569';

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(shiftX, axisY, highlight ? 7 : 5.5, 0, Math.PI * 2);
            ctx.fill();

            if (highlight) {
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 2;
              ctx.stroke();

              // Bracket between f1 and live f2
              const bY = axisY + 36;
              ctx.strokeStyle = '#059669';
              ctx.lineWidth = 1.8;
              ctx.beginPath();
              ctx.moveTo(f1X, bY - 5);
              ctx.lineTo(f1X, bY);
              ctx.lineTo(shiftX, bY);
              ctx.lineTo(shiftX, bY - 5);
              ctx.stroke();

              ctx.fillStyle = '#047857';
              ctx.font = '700 11px "JetBrains Mono", monospace';
              ctx.textAlign = 'center';
              ctx.fillText(
                `|f₁ - f₂'| = ${Math.abs(m.knownF1 - shiftedFreq).toFixed(1).replace(/\.0$/, '')} Hz`,
                (f1X + shiftX) / 2,
                bY + 14
              );
            }

            // Label above shifted marker
            ctx.fillStyle = highlight ? '#047857' : '#334155';
            ctx.font = highlight
              ? '700 12px "JetBrains Mono", monospace'
              : '600 11px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            const displayFreq = `${shiftedFreq.toFixed(1).replace(/\.0$/, '')} Hz`;
            ctx.fillText(highlight ? `${ct.stage.actualF2}: ${displayFreq}` : `${label}`, shiftX, axisY - 30);
            if (!highlight) {
              ctx.fillStyle = '#64748b';
              ctx.font = '600 10.5px "JetBrains Mono", monospace';
              ctx.fillText(displayFreq, shiftX, axisY - 43);
            }
          };

          drawCandidate(
            lowBase,
            lowShifted,
            `f₁ - N₀`,
            m.baseF2 === lowBase
          );
          drawCandidate(
            highBase,
            highShifted,
            `f₁ + N₀`,
            m.baseF2 === highBase
          );

          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Top Interactive Virtual Lab Bench */}
      <div className="bg-white/95 border border-sky-200 rounded-2xl shadow-sm p-3.5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-950">{t.stage.labBenchTitle}</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {mystery.waxMassGrams > 0
                ? t.stage.waxAppliedNote
                : mystery.filingAmount > 0
                  ? t.stage.filedNote
                  : t.stage.unmodifiedNote}
            </p>
          </div>

          {/* Direct Physical Modification Tool Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onQuickApplyWax}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                mystery.waxMassGrams > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-sm'
                  : 'bg-white border-sky-200 text-slate-800 hover:bg-amber-50/60 hover:border-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.controls.applyWax}</span>
            </button>

            <button
              type="button"
              onClick={onQuickFileProngs}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                mystery.filingAmount > 0
                  ? 'bg-sky-50 border-sky-300 text-sky-900 shadow-sm'
                  : 'bg-white border-sky-200 text-slate-800 hover:bg-sky-50 hover:border-sky-300'
              }`}
            >
              <Hammer className="w-3.5 h-3.5 text-sky-700" />
              <span>{t.controls.fileProngs}</span>
            </button>

            <button
              type="button"
              onClick={onRestoreFork}
              disabled={mystery.waxMassGrams === 0 && mystery.filingAmount === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.controls.restoreFork}</span>
            </button>
          </div>
        </div>

        <div className="h-[225px] w-full relative">
          <canvas ref={benchCanvasRef} className="w-full h-full block rounded-xl bg-sky-50/40" />
        </div>
      </div>

      {/* Bottom Live Number-Line Frequency Visualizer */}
      <div className="bg-white/95 border border-sky-200 rounded-2xl shadow-sm p-3.5 flex-1 flex flex-col min-h-[245px]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-slate-950">{t.stage.numberLineTitle}</h3>
          <span className="text-[11px] font-semibold text-slate-600">
            {mystery.waxMassGrams > 0
              ? t.stage.waxShiftRule
              : mystery.filingAmount > 0
                ? t.stage.fileShiftRule
                : `${t.stage.candidateLow} · ${t.stage.candidateHigh}`}
          </span>
        </div>

        <div className="flex-1 w-full relative min-h-[185px]">
          <canvas ref={lineCanvasRef} className="w-full h-full block rounded-xl" />
        </div>
      </div>
    </div>
  );
};
