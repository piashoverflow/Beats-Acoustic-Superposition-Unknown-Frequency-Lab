import React from 'react';
import { Languages, RotateCcw } from 'lucide-react';
import type { Language, ModuleId } from '../types';
import type { Translations } from '../i18n';

interface TopNavProps {
  t: Translations;
  lang: Language;
  activeModule: ModuleId;
  onSelectModule: (mod: ModuleId) => void;
  onToggleLanguage: () => void;
  onReset: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  t,
  lang,
  activeModule,
  onSelectModule,
  onToggleLanguage,
  onReset,
}) => {
  const modules: { id: ModuleId; label: string }[] = [
    { id: 'module1', label: t.tabs.module1.short },
    { id: 'module2', label: t.tabs.module2.short },
    { id: 'module3', label: t.tabs.module3.short },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-sky-200 px-4 lg:px-6 py-2.5">
      <div className="max-w-[1680px] mx-auto flex flex-wrap xl:flex-nowrap items-center justify-between gap-3 xl:gap-6">
        {/* Left: Studio Title */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M2 12h2l2-5 3 10 3-14 3 14 2-5h5" />
            </svg>
          </div>
          <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-950 whitespace-nowrap truncate max-w-[260px] sm:max-w-none">
            {t.studioTitle}
          </h1>
        </div>

        {/* Center: 3 Interactive Lab Mode Tabs */}
        <nav
          aria-label="Lab Modules"
          className="order-3 xl:order-2 w-full xl:w-auto flex items-center gap-1 p-1 bg-sky-100/80 border border-sky-200 rounded-xl overflow-x-auto"
        >
          {modules.map((mod) => {
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-sky-900 shadow-sm border border-sky-200/80'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-white/50'
                }`}
              >
                {mod.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Language Switcher, Reset, Institution Badge */}
        <div className="order-2 xl:order-3 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title={lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}
          >
            <Languages className="w-3.5 h-3.5 text-sky-700" aria-hidden="true" />
            <span>{t.langToggleLabel}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-sky-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
            <span>{t.reset}</span>
          </button>

          <span className="bg-rose-50 border border-rose-300 text-rose-600 font-extrabold px-3 py-1 rounded-full text-sm whitespace-nowrap shrink-0">
            {t.institutionBadge}
          </span>
        </div>
      </div>
    </header>
  );
};
