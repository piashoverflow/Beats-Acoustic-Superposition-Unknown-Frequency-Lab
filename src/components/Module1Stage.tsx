import React, { useEffect, useRef } from 'react';
import type { Translations } from '../i18n';

interface Module1StageProps {
  t: Translations;
  f1: number;
  f2: number;
  a1: number;
  a2: number;
  timeScale: number;
  isPlayingVisual: boolean;
}

export const Module1Stage: React.FC<Module1StageProps> = ({
  t,
  f1,
  f2,
  a1,
  a2,
  timeScale,
  isPlayingVisual,
}) => {
  const forksCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scopeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const simTimeRef = useRef<number>(0);

  // Keep latest props in a ref so animation loop runs smoothly at 60 FPS without teardown
  const paramsRef = useRef({ f1, f2, a1, a2, timeScale, isPlayingVisual, t });
  paramsRef.current = { f1, f2, a1, a2, timeScale, isPlayingVisual, t };

  useEffect(() => {
    let rafId = 0;
    let lastTs = performance.now();

    const drawTuningFork = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      deflection: number,
      accent: string,
      label: string,
      freqText: string
    ) => {
      ctx.save();
      ctx.translate(cx, cy);

      // Metallic handle & base
      const stemGrad = ctx.createLinearGradient(-7, 0, 7, 0);
      stemGrad.addColorStop(0, '#64748b');
      stemGrad.addColorStop(0.45, '#e2e8f0');
      stemGrad.addColorStop(1, '#475569');

      // Base foot
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(-16, 48, 32, 8, 4);
      ctx.fill();

      // Stem
      ctx.fillStyle = stemGrad;
      ctx.beginPath();
      ctx.roundRect(-4.5, 16, 9, 34, 3);
      ctx.fill();

      // U-shoulder
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 6, 15, 0, Math.PI, false);
      ctx.stroke();

      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 6, 15, 0, Math.PI, false);
      ctx.stroke();

      // Left & Right Prongs vibrating symmetrically outward/inward
      const drawProng = (side: -1 | 1) => {
        const baseX = side * 15;
        const tipX = side * (15 + deflection);
        const baseY = 6;
        const tipY = -44;

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 8.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(baseX, -18, tipX, tipY);
        ctx.stroke();

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(baseX, -18, tipX, tipY);
        ctx.stroke();

        // Subtle highlight dot at prong tip
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      };

      drawProng(-1);
      drawProng(1);

      // Fork Label below base
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 12px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, 0, 73);

      ctx.fillStyle = accent;
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillText(freqText, 0, 89);

      ctx.restore();
    };

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTs) / 1000));
      lastTs = now;

      const {
        f1: cf1,
        f2: cf2,
        a1: ca1,
        a2: ca2,
        timeScale: cts,
        isPlayingVisual: playing,
        t: ct,
      } = paramsRef.current;

      if (playing) {
        simTimeRef.current += dt * cts;
      }

      const simT = simTimeRef.current;
      const diff = Math.abs(cf1 - cf2);

      // Compute normalized instantaneous acoustic beat envelope [0..1]
      const maxSum = Math.max(0.01, ca1 + ca2);
      const envAtCenter = Math.sqrt(
        ca1 * ca1 + ca2 * ca2 + 2 * ca1 * ca2 * Math.cos(2 * Math.PI * (cf1 - cf2) * simT)
      );
      const normIntensity = Math.min(1, Math.max(0, envAtCenter / maxSum));

      // --- 1. RENDER TOP STRIP: TUNING FORKS & OVERLAPPING SOUND RINGS ---
      const fCanvas = forksCanvasRef.current;
      if (fCanvas) {
        const rect = fCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetW = Math.max(1, Math.round(rect.width * dpr));
        const targetH = Math.max(1, Math.round(rect.height * dpr));
        if (fCanvas.width !== targetW || fCanvas.height !== targetH) {
          fCanvas.width = targetW;
          fCanvas.height = targetH;
        }
        const ctx = fCanvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);
          const W = rect.width;
          const H = rect.height;

          ctx.clearRect(0, 0, W, H);

          // Soft lab air column grid
          ctx.strokeStyle = 'rgba(14, 165, 233, 0.1)';
          ctx.lineWidth = 1;
          for (let x = 0; x < W; x += 28) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
          }
          for (let y = 0; y < H; y += 28) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
          }

          const forkAX = Math.max(85, W * 0.16);
          const forkBX = Math.min(W - 85, W * 0.84);
          const forkY = H * 0.48;
          const centerX = W * 0.5;
          const centerY = forkY - 12;

          // Radiating pressure wavefront arcs from Fork A (Sky Blue) & Fork B (Emerald)
          const waveSpeed = 140; // visual px/sec
          const numRings = 6;
          const maxRadius = Math.max(180, (forkBX - forkAX) * 0.72);

          // Visual ring emission frequency scaled smoothly so 200-512 Hz shows distinct ripple spacing
          const ringPeriod1 = 1 / (cf1 / 120);
          const ringPeriod2 = 1 / (cf2 / 120);
          const phaseOffset1 = (simT * (cf1 / 55)) % 1;
          const phaseOffset2 = (simT * (cf2 / 55)) % 1;

          for (let i = 0; i < numRings; i++) {
            const p1 = (i + phaseOffset1) / numRings;
            const r1 = 22 + p1 * maxRadius;
            const alpha1 = (1 - p1) * 0.45 * ca1;
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha1.toFixed(3)})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(forkAX + 12, forkY - 16, r1, -Math.PI * 0.38, Math.PI * 0.38);
            ctx.stroke();

            const p2 = (i + phaseOffset2) / numRings;
            const r2 = 22 + p2 * maxRadius;
            const alpha2 = (1 - p2) * 0.45 * ca2;
            ctx.strokeStyle = `rgba(5, 150, 105, ${alpha2.toFixed(3)})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(forkBX - 12, forkY - 16, r2, Math.PI - Math.PI * 0.38, Math.PI + Math.PI * 0.38);
            ctx.stroke();
          }

          // Silence unused local vars guard
          void waveSpeed;
          void ringPeriod1;
          void ringPeriod2;

          // Central Acoustic Intensity Pulse Indicator
          const pulseRadius = 24 + normIntensity * 14;
          const glowGrad = ctx.createRadialGradient(
            centerX,
            centerY,
            4,
            centerX,
            centerY,
            pulseRadius + 18
          );
          if (diff === 0) {
            glowGrad.addColorStop(0, 'rgba(14, 165, 233, 0.55)');
            glowGrad.addColorStop(1, 'rgba(14, 165, 233, 0)');
          } else {
            glowGrad.addColorStop(0, `rgba(16, 185, 129, ${(0.25 + normIntensity * 0.65).toFixed(3)})`);
            glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
          }

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(centerX, centerY, pulseRadius + 18, 0, Math.PI * 2);
          ctx.fill();

          // Core indicator circle
          ctx.fillStyle =
            diff === 0
              ? '#0284c7'
              : normIntensity > 0.62
                ? '#059669'
                : normIntensity < 0.32
                  ? '#cbd5e1'
                  : '#34d399';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 17 + normIntensity * 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Percentage / Intensity label inside core
          ctx.fillStyle = normIntensity > 0.45 || diff === 0 ? '#ffffff' : '#0f172a';
          ctx.font = '700 11px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${Math.round(normIntensity * 100)}%`, centerX, centerY);

          // Explicit text label under pulse indicator (never hue-only!)
          ctx.textBaseline = 'alphabetic';
          const statusLabel =
            diff === 0
              ? ct.stage.steadyLabel
              : normIntensity >= 0.55
                ? ct.stage.waxingLabel
                : ct.stage.waningLabel;

          ctx.fillStyle =
            diff === 0
              ? '#0369a1'
              : normIntensity >= 0.55
                ? '#047857'
                : '#475569';
          ctx.font = '700 12px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
          ctx.fillText(statusLabel, centerX, centerY + 42);

          ctx.fillStyle = '#64748b';
          ctx.font = '600 10.5px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
          ctx.fillText(ct.stage.pulseIndicator, centerX, centerY - 32);

          // Tuning Forks A and B physical vibration
          // Use scaled phase so oscillation is clearly legible without strobing
          const defl1 = ca1 * 5.2 * Math.sin(2 * Math.PI * (cf1 / 20) * simT);
          const defl2 = ca2 * 5.2 * Math.sin(2 * Math.PI * (cf2 / 20) * simT);

          drawTuningFork(ctx, forkAX, forkY, defl1, '#0284c7', ct.stage.forkA, `${cf1} Hz`);
          drawTuningFork(ctx, forkBX, forkY, defl2, '#059669', ct.stage.forkB, `${cf2} Hz`);

          ctx.restore();
        }
      }

      // --- 2. RENDER STACKED 3-CHANNEL OSCILLOSCOPE ---
      const sCanvas = scopeCanvasRef.current;
      if (sCanvas) {
        const rect = sCanvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetW = Math.max(1, Math.round(rect.width * dpr));
        const targetH = Math.max(1, Math.round(rect.height * dpr));
        if (sCanvas.width !== targetW || sCanvas.height !== targetH) {
          sCanvas.width = targetW;
          sCanvas.height = targetH;
        }
        const ctx = sCanvas.getContext('2d');
        if (ctx) {
          ctx.save();
          ctx.scale(dpr, dpr);
          const W = rect.width;
          const H = rect.height;

          ctx.clearRect(0, 0, W, H);

          const padL = 16;
          const padR = 16;
          const plotW = Math.max(100, W - padL - padR);
          const rowH = H / 3;

          // Calibrated oscilloscope time window:
          // Choose 0.25s when diff >= 4 Hz, or 0.45s when diff is small so at least 1-2 beats are visible,
          // while carrier cycles remain visibly sinusoidal at 200-512 Hz.
          const windowSec = diff > 0 && diff <= 3 ? 0.5 : 0.3;

          // Background grid & row separators
          for (let ch = 0; ch < 3; ch++) {
            const topY = ch * rowH;
            const midY = topY + rowH * 0.55;

            // Subtle channel strip background
            ctx.fillStyle = ch === 2 ? 'rgba(240, 249, 255, 0.7)' : 'rgba(255, 255, 255, 0.85)';
            ctx.fillRect(0, topY, W, rowH);

            // Channel divider
            if (ch > 0) {
              ctx.strokeStyle = '#bae6fd';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(0, topY);
              ctx.lineTo(W, topY);
              ctx.stroke();
            }

            // Vertical time gridlines
            ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
            ctx.lineWidth = 1;
            const numGridCols = 10;
            for (let g = 0; g <= numGridCols; g++) {
              const gx = padL + (g / numGridCols) * plotW;
              ctx.beginPath();
              ctx.moveTo(gx, topY + 22);
              ctx.lineTo(gx, topY + rowH - 8);
              ctx.stroke();
            }

            // Zero axis line
            ctx.strokeStyle = '#cbd5e1';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(padL, midY);
            ctx.lineTo(padL + plotW, midY);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Sample points across width (sub-pixel resolution: 2 samples per CSS px)
          const samples = Math.min(1800, Math.max(400, Math.round(plotW * 2)));

          // Highlight constructive (waxing) & destructive (waning) zones on Channel 3
          if (diff > 0) {
            const ch3Top = 2 * rowH + 22;
            const ch3Bot = 3 * rowH - 8;
            for (let i = 0; i <= samples; i += 2) {
              const frac = i / samples;
              const tVal = simT + frac * windowSec;
              const cosPhase = Math.cos(2 * Math.PI * (cf1 - cf2) * tVal);
              const px = padL + frac * plotW;
              if (cosPhase > 0.85) {
                ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
                ctx.fillRect(px, ch3Top, (2 / samples) * plotW + 1, ch3Bot - ch3Top);
              } else if (cosPhase < -0.85) {
                ctx.fillStyle = 'rgba(14, 165, 233, 0.08)';
                ctx.fillRect(px, ch3Top, (2 / samples) * plotW + 1, ch3Bot - ch3Top);
              }
            }
          }

          // Draw Wave 1 (Sky Blue)
          const mid1 = rowH * 0.56;
          const ampPx1 = rowH * 0.3;
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          for (let i = 0; i <= samples; i++) {
            const frac = i / samples;
            const tVal = simT + frac * windowSec;
            const yVal = ca1 * Math.sin(2 * Math.PI * cf1 * tVal);
            const px = padL + frac * plotW;
            const py = mid1 - yVal * ampPx1;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Draw Wave 2 (Emerald Green)
          const mid2 = rowH + rowH * 0.56;
          const ampPx2 = rowH * 0.3;
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          for (let i = 0; i <= samples; i++) {
            const frac = i / samples;
            const tVal = simT + frac * windowSec;
            const yVal = ca2 * Math.sin(2 * Math.PI * cf2 * tVal);
            const px = padL + frac * plotW;
            const py = mid2 - yVal * ampPx2;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Draw Channel 3 Envelope (dashed emerald) & Resultant Beat Wave (Deep Navy)
          const mid3 = 2 * rowH + rowH * 0.56;
          const ampPx3 = (rowH * 0.34) / 2; // normalized so |y1 + y2| <= 2 fits cleanly

          // Upper & lower modulation envelope guides
          ctx.strokeStyle = 'rgba(5, 150, 105, 0.55)';
          ctx.lineWidth = 1.4;
          ctx.setLineDash([5, 4]);
          for (const sign of [1, -1]) {
            ctx.beginPath();
            for (let i = 0; i <= samples; i += 2) {
              const frac = i / samples;
              const tVal = simT + frac * windowSec;
              const env = Math.sqrt(
                ca1 * ca1 + ca2 * ca2 + 2 * ca1 * ca2 * Math.cos(2 * Math.PI * (cf1 - cf2) * tVal)
              );
              const px = padL + frac * plotW;
              const py = mid3 - sign * env * ampPx3;
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.stroke();
          }
          ctx.setLineDash([]);

          // Resultant wave y = y1 + y2
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i <= samples; i++) {
            const frac = i / samples;
            const tVal = simT + frac * windowSec;
            const y1 = ca1 * Math.sin(2 * Math.PI * cf1 * tVal);
            const y2 = ca2 * Math.sin(2 * Math.PI * cf2 * tVal);
            const px = padL + frac * plotW;
            const py = mid3 - (y1 + y2) * ampPx3;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Channel Titles & Legend Readouts
          const drawChannelHeader = (
            rowIdx: number,
            title: string,
            color: string,
            badgeText: string
          ) => {
            const y = rowIdx * rowH + 16;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(padL + 5, y - 4, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#0f172a';
            ctx.font = '700 12px "Plus Jakarta Sans", "Noto Sans Bengali", sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText(title, padL + 15, y);

            ctx.fillStyle = '#475569';
            ctx.font = '600 11px "JetBrains Mono", monospace';
            ctx.textAlign = 'right';
            ctx.fillText(badgeText, padL + plotW, y);
          };

          drawChannelHeader(0, ct.stage.wave1Title, '#0284c7', `f₁ = ${cf1} Hz · A₁ = ${ca1.toFixed(1)}`);
          drawChannelHeader(1, ct.stage.wave2Title, '#059669', `f₂ = ${cf2} Hz · A₂ = ${ca2.toFixed(1)}`);
          drawChannelHeader(
            2,
            ct.stage.resultantTitle,
            '#0f172a',
            `N = ${diff} Hz · Δt = ${windowSec.toFixed(2)} s`
          );

          ctx.restore();
        }
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Top Strip: Animated Tuning Forks & Acoustic Intensity Pulse */}
      <div className="bg-white/95 border border-sky-200 rounded-2xl shadow-sm p-3">
        <div className="h-[185px] w-full relative">
          <canvas ref={forksCanvasRef} className="w-full h-full block rounded-xl" />
        </div>
      </div>

      {/* Stacked 3-Channel Oscilloscope */}
      <div className="bg-white/95 border border-sky-200 rounded-2xl shadow-sm p-3 flex-1 flex flex-col min-h-[370px]">
        <div className="flex-1 w-full relative min-h-[330px]">
          <canvas ref={scopeCanvasRef} className="w-full h-full block rounded-xl" />
        </div>
        <div className="mt-2 pt-2 border-t border-sky-100 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-600 px-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/30 border border-emerald-500 inline-block" />
            {t.stage.constructiveHint}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500/20 border border-sky-500 inline-block" />
            {t.stage.destructiveHint}
          </span>
        </div>
      </div>
    </div>
  );
};
