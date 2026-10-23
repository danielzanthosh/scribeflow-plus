import React, { useState } from 'react';
import { X, Settings, Palette, Eye, Sliders, Cpu, Volume2, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { AppSettings, ThemeId } from '../types';
import { soundManager } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenTermsModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenTermsModal,
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'chunker' | 'vision' | 'ai' | 'typography'>('themes');
  const [aiTestStatus, setAiTestStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const themes: { id: ThemeId; name: string; desc: string; preview: string }[] = [
    { id: 'warm-paper', name: 'Warm Paper', desc: 'Classic Ivory & Crimson notes for daylight study', preview: 'bg-[#faf7f0] border-[#b45309]' },
    { id: 'midnight', name: 'Midnight Obsidian', desc: 'Deep slate & sky-blue glow for dim environments', preview: 'bg-[#090d16] border-[#38bdf8]' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'High-contrast dark with electric cyan & magenta', preview: 'bg-[#07080f] border-[#00f0ff]' },
    { id: 'nordic', name: 'Nordic Frost', desc: 'Minimalist cool arctic slate and crisp navy', preview: 'bg-[#f4f6f9] border-[#0284c7]' },
    { id: 'solarized-dusk', name: 'Solarized Dusk', desc: 'Warm sepia nocturnal canvas with solar gold', preview: 'bg-[#00212b] border-[#b58900]' },
    { id: 'botanical-sage', name: 'Botanical Sage', desc: 'Calming earthy forest green and serene paper', preview: 'bg-[#f3f6f4] border-[#2d6a4f]' },
  ];

  const handleTestAi = async () => {
    setAiTestStatus('Testing API connection...');
    try {
      let endpoint = settings.aiConfig.baseUrl.trim().replace(/\/+$/, '');
      if (!endpoint.endsWith('/chat/completions')) {
        endpoint = `${endpoint}/chat/completions`;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.aiConfig.apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: settings.aiConfig.model || 'google/gemini-2.0-flash-001',
          messages: [{ role: 'user', content: 'Say "Connection successful!"' }],
          max_tokens: 15,
        }),
      });

      if (res.ok) {
        setAiTestStatus('✅ Connection successful! AI features are active.');
      } else {
        const data = await res.json().catch(() => null);
        setAiTestStatus(`❌ Failed (${res.status}): ${data?.error?.message || res.statusText}`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Network error';
      setAiTestStatus(`❌ Network error: ${msg}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-theme-surface border border-theme-border shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-theme-border bg-theme-surfaceHover/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-theme-accentBg text-theme-accent border border-theme-border">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-theme-text">ScribeFlow+ Settings</h2>
              <p className="text-xs text-theme-textMuted">Preferences, Vision Tracking & Optional AI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceHover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-theme-border bg-theme-surface px-5 gap-4 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('themes')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'themes' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-textMuted hover:text-theme-text'
            }`}
          >
            <Palette className="w-4 h-4" /> Themes
          </button>
          <button
            onClick={() => setActiveTab('chunker')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'chunker' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-textMuted hover:text-theme-text'
            }`}
          >
            <Sliders className="w-4 h-4" /> Chunking
          </button>
          <button
            onClick={() => setActiveTab('vision')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'vision' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-textMuted hover:text-theme-text'
            }`}
          >
            <Eye className="w-4 h-4" /> Vision & Audio
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'typography' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-textMuted hover:text-theme-text'
            }`}
          >
            Aa Typography
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'ai' ? 'border-theme-accent text-theme-accent' : 'border-transparent text-theme-textMuted hover:text-theme-text'
            }`}
          >
            <Cpu className="w-4 h-4" /> Optional AI (BYOK)
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-theme-text">
          
          {/* THEMES TAB */}
          {activeTab === 'themes' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-xs text-theme-textMuted">
                Select your preferred visual atmosphere. All themes are rigorously contrast-checked for distraction-free note copying.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {themes.map((theme) => {
                  const isSelected = settings.theme === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => onUpdateSettings({ theme: theme.id })}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-theme-accent bg-theme-surfaceHover/80 shadow-sm'
                          : 'border-theme-border hover:border-theme-borderFocus bg-theme-surface'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg border-2 ${theme.preview} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-theme-text">{theme.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-theme-accent" />}
                        </div>
                        <p className="text-xs text-theme-textMuted mt-0.5 leading-snug">{theme.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CHUNKING TAB */}
          {activeTab === 'chunker' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-theme-text mb-1">
                  Non-AI Linguistic Chunk Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['short', 'balanced', 'long', 'sentence'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => onUpdateSettings({ chunkMode: m })}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                        settings.chunkMode === m
                          ? 'border-theme-accent bg-theme-accentBg text-theme-accent'
                          : 'border-theme-border bg-theme-surface hover:bg-theme-surfaceHover text-theme-text'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-theme-textMuted mt-1.5">
                  Short: 3–4 words • Balanced: 4–6 words • Long: 6–9 words • Sentence: complete sentences
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span>Target Words per Phrase</span>
                  <span className="font-mono text-theme-accent">{settings.wordsPerChunkTarget} words</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  value={settings.wordsPerChunkTarget}
                  onChange={(e) => onUpdateSettings({ wordsPerChunkTarget: parseInt(e.target.value, 10) })}
                  className="w-full accent-theme-accent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span>Estimated Handwriting Speed</span>
                  <span className="font-mono text-theme-accent">{settings.writingPaceWpm} WPM</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  value={settings.writingPaceWpm}
                  onChange={(e) => onUpdateSettings({ writingPaceWpm: parseInt(e.target.value, 10) })}
                  className="w-full accent-theme-accent"
                />
                <p className="text-xs text-theme-textMuted mt-1">
                  Average student physical handwriting is 15–20 words per minute.
                </p>
              </div>
            </div>
          )}

          {/* VISION & AUDIO TAB */}
          {activeTab === 'vision' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span>Gaze Dwell Debounce Filter</span>
                  <span className="font-mono text-theme-accent">{settings.gazeDwellMs} ms</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="1200"
                  step="50"
                  value={settings.gazeDwellMs}
                  onChange={(e) => onUpdateSettings({ gazeDwellMs: parseInt(e.target.value, 10) })}
                  className="w-full accent-theme-accent"
                />
                <p className="text-xs text-theme-textMuted mt-1">
                  Higher dwell duration prevents accidental phrase triggers when glancing quickly.
                </p>
              </div>

              <div className="pt-3 border-t border-theme-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-theme-text block">Subtle Tactile Audio Feedback</span>
                  <span className="text-xs text-theme-textMuted">Plays gentle mechanical tap when phrases advance</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundFeedback}
                  onChange={(e) => {
                    onUpdateSettings({ soundFeedback: e.target.checked });
                    soundManager.enabled = e.target.checked;
                  }}
                  className="w-4 h-4 rounded border-theme-border text-theme-accent focus:ring-theme-accent"
                />
              </div>

              <div className="pt-3 border-t border-theme-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-theme-text block">Show Context Window</span>
                  <span className="text-xs text-theme-textMuted">Displays previous phrase and upcoming preview</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showContextWindow}
                  onChange={(e) => onUpdateSettings({ showContextWindow: e.target.checked })}
                  className="w-4 h-4 rounded border-theme-border text-theme-accent focus:ring-theme-accent"
                />
              </div>
            </div>
          )}

          {/* TYPOGRAPHY TAB */}
          {activeTab === 'typography' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-theme-text mb-2">Display Font Face</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => onUpdateSettings({ fontFamily: 'serif' })}
                    className={`p-3 rounded-xl border text-center font-serif text-sm transition-all ${
                      settings.fontFamily === 'serif' ? 'border-theme-accent bg-theme-accentBg text-theme-accent' : 'border-theme-border'
                    }`}
                  >
                    Crimson Pro (Serif)
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ fontFamily: 'sans' })}
                    className={`p-3 rounded-xl border text-center font-sans text-sm transition-all ${
                      settings.fontFamily === 'sans' ? 'border-theme-accent bg-theme-accentBg text-theme-accent' : 'border-theme-border'
                    }`}
                  >
                    Inter (Sans-Serif)
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ fontFamily: 'mono' })}
                    className={`p-3 rounded-xl border text-center font-mono text-sm transition-all ${
                      settings.fontFamily === 'mono' ? 'border-theme-accent bg-theme-accentBg text-theme-accent' : 'border-theme-border'
                    }`}
                  >
                    JetBrains Mono
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-theme-text mb-2">Flow Typography Scale</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['small', 'medium', 'large', 'huge'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => onUpdateSettings({ fontSize: s })}
                      className={`py-2 rounded-xl border text-xs capitalize transition-all ${
                        settings.fontSize === s ? 'border-theme-accent bg-theme-accentBg text-theme-accent font-semibold' : 'border-theme-border'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OPTIONAL AI (BYOK) TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-theme-surfaceHover/50 border border-theme-border">
                <div>
                  <span className="font-semibold text-xs text-theme-text block">Enable Optional AI Assistant</span>
                  <span className="text-xs text-theme-textMuted">
                    Uses Bring-Your-Own-Key (BYOK). Fully optional — core app runs 100% without AI.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.aiConfig.enabled}
                  onChange={(e) =>
                    onUpdateSettings({
                      aiConfig: { ...settings.aiConfig, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded border-theme-border text-theme-accent focus:ring-theme-accent"
                />
              </div>

              {settings.aiConfig.enabled && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-theme-text mb-1">
                      API Key (OpenRouter or OpenAI compatible)
                    </label>
                    <input
                      type="password"
                      value={settings.aiConfig.apiKey}
                      onChange={(e) =>
                        onUpdateSettings({
                          aiConfig: { ...settings.aiConfig, apiKey: e.target.value },
                        })
                      }
                      placeholder="sk-or-v1-... or your OpenAI/Groq key"
                      className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-xs focus:ring-1 focus:ring-theme-accent font-mono"
                    />
                    <p className="text-xs text-theme-textSubtle mt-0.5">
                      Stored exclusively in your local browser LocalStorage. Never sent to any ScribeFlow server.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-theme-text mb-1">
                      Base URL (OpenRouter Compatible)
                    </label>
                    <input
                      type="text"
                      value={settings.aiConfig.baseUrl}
                      onChange={(e) =>
                        onUpdateSettings({
                          aiConfig: { ...settings.aiConfig, baseUrl: e.target.value },
                        })
                      }
                      placeholder="https://openrouter.ai/api/v1"
                      className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-xs focus:ring-1 focus:ring-theme-accent font-mono"
                    />
                    <p className="text-xs text-theme-textSubtle mt-0.5">
                      Can also be local Ollama (e.g. http://localhost:11434/v1) or Groq/OpenAI.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-theme-text mb-1">
                      Model Identifier
                    </label>
                    <input
                      type="text"
                      value={settings.aiConfig.model}
                      onChange={(e) =>
                        onUpdateSettings({
                          aiConfig: { ...settings.aiConfig, model: e.target.value },
                        })
                      }
                      placeholder="google/gemini-2.0-flash-001 or openai/gpt-4o-mini"
                      className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-bg text-theme-text text-xs focus:ring-1 focus:ring-theme-accent font-mono"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={handleTestAi}
                      disabled={!settings.aiConfig.apiKey.trim()}
                      className="px-3.5 py-1.5 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-surfaceHover text-theme-text text-xs font-medium transition-colors disabled:opacity-40"
                    >
                      Test Connection
                    </button>
                    {aiTestStatus && (
                      <span className="text-xs font-mono text-theme-textMuted">
                        {aiTestStatus}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-border bg-theme-surfaceHover/30 flex items-center justify-between">
          <button
            onClick={onOpenTermsModal}
            className="text-xs text-theme-textMuted hover:text-theme-accent flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Terms, Privacy & MIT License
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primaryHover text-theme-primaryText text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            Save & Done
          </button>
        </div>

      </div>
    </div>
  );
};
