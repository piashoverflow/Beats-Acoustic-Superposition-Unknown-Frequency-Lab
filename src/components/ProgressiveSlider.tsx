import React from 'react';

interface ProgressiveSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  precision?: number;
  onChange: (value: number) => void;
  hint?: string;
  accentColor?: 'emerald' | 'sky';
}

export const ProgressiveSlider: React.FC<ProgressiveSliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  precision = 0,
  onChange,
  hint,
}) => {
  const safeSpan = Math.max(1e-6, max - min);
  const percent = Math.min(100, Math.max(0, ((value - min) / safeSpan) * 100));

  const trackBackground = `linear-gradient(to right, #059669 0%, #059669 ${percent}%, #d1fae5 ${percent}%, #d1fae5 100%)`;

  const formattedValue = precision > 0 ? value.toFixed(precision) : String(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-slate-800 leading-snug">
          {label}
        </label>
        <span className="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg whitespace-nowrap shrink-0">
          {formattedValue}
          {unit ? <span className="text-[11px] font-medium text-emerald-600 ml-1">{unit}</span> : null}
        </span>
      </div>

      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ background: trackBackground }}
        className="emerald-slider"
      />

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>
          {precision > 0 ? min.toFixed(precision) : min}
          {unit ? ` ${unit}` : ''}
        </span>
        {hint ? <span className="font-sans text-[11px] text-slate-500 truncate px-2">{hint}</span> : null}
        <span>
          {precision > 0 ? max.toFixed(precision) : max}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
    </div>
  );
};
