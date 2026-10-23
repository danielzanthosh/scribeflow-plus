import React from 'react';
import { PenTool, Play, BookOpen, Settings, HelpCircle, Palette, Sparkles } from 'lucide-react';
import { ThemeId } from '../types';

interface HeaderProps {
  activeView: 'editor' | 'flow' | 'document';
  onSelectView: (view: 'editor' | 'flow' | 'document') => void;
  currentTheme: ThemeId;
  onCycleTheme: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  hasChunks: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  currentTheme,
  onCycleTheme,
  onOpenSettings,
  onOpenAbout,
  hasChunks,
}) => {
  return (
    <header className="h-14 border-b border-theme-border bg-theme-surface/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between select-none z-20">
      
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectView('flow')}>
          <div className="w-8 h-8 rounded-xl bg-theme-accentBg border border-theme-border flex items-center justify-center text-theme-accent shadow-sm">
            <PenTool className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-lg text-theme-text tracking-tight flex items-center gap-1">
            ScribeFlow<span className="text-theme-accent font-sans font-black text-sm">+</span>
          </span>
        </div>

        <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-xs font-mono bg-theme-surfaceHover text-theme-textMuted border border-theme-border">
          Cognitive Scribe Flow
        </span>
      </div>

      {/* Main Mode Segmented Control */}
      <nav aria-label="Main View Navigation" className="flex items-center p-1 rounded-xl bg-theme-surfaceHover/80 border border-theme-border text-xs font-medium">
        <button
          onClick={() => onSelectView('editor')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeView === 'editor'
              ? 'bg-theme-surface text-theme-text shadow-sm font-semibold'
              : 'text-theme-textMuted hover:text-theme-text'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => onSelectView('flow')}
          disabled={!hasChunks}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
            activeView === 'flow'
              ? 'bg-theme-surface text-theme-text shadow-sm font-semibold'
              : 'text-theme-textMuted hover:text-theme-text disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Flow Stage</span>
        </button>

        <button
          onClick={() => onSelectView('document')}
          disabled={!hasChunks}
          className={`hidden sm:flex px-3 py-1.5 rounded-lg transition-all items-center gap-1.5 ${
            activeView === 'document'
              ? 'bg-theme-surface text-theme-text shadow-sm font-semibold'
              : 'text-theme-textMuted hover:text-theme-text disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Full Transcript</span>
        </button>
      </nav>

      {/* Right Tools */}
      <div className="flex items-center gap-1.5">
        {/* Theme Cycle Button */}
        <button
          onClick={onCycleTheme}
          title={`Current Theme: ${currentTheme}. Click to cycle themes.`}
          aria-label={`Cycle theme. Current theme is ${currentTheme.replace('-', ' ')}`}
          className="p-2 min-h-[38px] rounded-xl border border-theme-border hover:bg-theme-surfaceHover text-theme-text transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          <Palette className="w-4 h-4 text-theme-accent" />
          <span className="hidden lg:inline capitalize">{currentTheme.replace('-', ' ')}</span>
        </button>

        {/* About & Guide */}
        <button
          onClick={onOpenAbout}
          title="About & How to Use"
          aria-label="About and How to Use"
          className="p-2 min-h-[38px] min-w-[38px] rounded-xl border border-theme-border hover:bg-theme-surfaceHover text-theme-text transition-colors flex items-center justify-center"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Preferences & AI Configuration"
          aria-label="Preferences and Settings"
          className="p-2 min-h-[38px] min-w-[38px] rounded-xl border border-theme-border hover:bg-theme-surfaceHover text-theme-text transition-colors flex items-center justify-center"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

    </header>
  );
};
