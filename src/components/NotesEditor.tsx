import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Play, Save, FileText, Check, AlertCircle, RefreshCw, Wand2 } from 'lucide-react';
import { Script, AppSettings } from '../types';
import { OpenRouterClient } from '../utils/aiClient';
import { DEFAULT_PRESET_SCRIPTS } from '../utils/presets';
import { createWorker } from 'tesseract.js';

interface NotesEditorProps {
  currentScript: Script;
  onUpdateContent: (content: string, title?: string) => void;
  onStartFlow: () => void;
  settings: AppSettings;
  scripts: Script[];
  onSelectScript: (script: Script) => void;
  onNewScript: () => void;
  onDeleteScript: (id: string) => void;
}

export const NotesEditor: React.FC<NotesEditorProps> = ({
  currentScript,
  onUpdateContent,
  onStartFlow,
  settings,
  scripts,
  onSelectScript,
  onNewScript,
  onDeleteScript,
}) => {
  const [content, setContent] = useState(currentScript.content);
  const [title, setTitle] = useState(currentScript.title);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<string>('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal state if currentScript changes
  React.useEffect(() => {
    setContent(currentScript.content);
    setTitle(currentScript.title);
  }, [currentScript]);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onUpdateContent(e.target.value, title);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    onUpdateContent(content, e.target.value);
  };

  // Local OCR processing via Tesseract.js (100% offline & private)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrProcessing(true);
    setOcrProgress('Initializing OCR engine...');

    try {
      const worker = await createWorker('eng');
      setOcrProgress('Recognizing text in document...');
      const ret = await worker.recognize(file);
      await worker.terminate();

      let extractedText = ret.data.text.trim();

      // If user has optional AI enabled, offer/run refinement
      if (settings.aiConfig.enabled && settings.aiConfig.apiKey) {
        setOcrProgress('Refining formulas and tables with AI...');
        try {
          const aiClient = new OpenRouterClient(settings.aiConfig);
          extractedText = await aiClient.refineOcrText(extractedText);
        } catch (aiErr) {
          console.warn('AI OCR refinement skipped:', aiErr);
        }
      }

      setContent(extractedText);
      onUpdateContent(extractedText, title);
      showStatus('Document transcribed successfully from image!');
    } catch (err) {
      console.error('OCR failed:', err);
      showStatus('OCR extraction failed. Check image clarity.', 'error');
    } finally {
      setIsOcrProcessing(false);
      setOcrProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Optional AI enhancement & cleanup of pasted notes
  const handleAiEnhance = async () => {
    if (!settings.aiConfig.enabled || !settings.aiConfig.apiKey.trim()) {
      showStatus('Please configure your AI API key in Settings first.', 'error');
      return;
    }

    setIsAiProcessing(true);
    try {
      const aiClient = new OpenRouterClient(settings.aiConfig);
      const enhanced = await aiClient.enhanceNotes(content);
      setContent(enhanced);
      onUpdateContent(enhanced, title);
      showStatus('Notes enhanced: formulas and tables formatted!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI Enhancement failed';
      showStatus(msg, 'error');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content.split(/\r?\n/).length;

  return (
    <div className="flex-1 flex flex-col h-full bg-theme-surface overflow-hidden">
      
      {/* Script Title & Action Bar */}
      <div className="p-4 border-b border-theme-border bg-theme-surfaceHover/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Document / Lecture Title"
            className="flex-1 bg-transparent text-lg font-serif font-bold text-theme-text border-b border-transparent hover:border-theme-border focus:border-theme-accent outline-none px-1 py-0.5 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset Selector */}
          <select
            onChange={(e) => {
              const selected = DEFAULT_PRESET_SCRIPTS.find(p => p.id === e.target.value);
              if (selected) {
                onSelectScript(selected);
              }
            }}
            defaultValue=""
            className="px-2.5 py-1.5 rounded-xl border border-theme-border bg-theme-surface text-theme-text text-xs focus:ring-1 focus:ring-theme-accent outline-none"
          >
            <option value="" disabled>Load Example Notes</option>
            {DEFAULT_PRESET_SCRIPTS.map(preset => (
              <option key={preset.id} value={preset.id}>
                {preset.category}: {preset.title}
              </option>
            ))}
          </select>

          {/* Upload Image OCR Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isOcrProcessing}
            title="Extract notes from textbook or handwritten photo (100% offline OCR)"
            className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-surface hover:bg-theme-surfaceHover text-theme-text text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5 text-theme-accent" />
            <span>{isOcrProcessing ? 'Scanning...' : 'OCR Image'}</span>
          </button>

          {/* AI Enhance Button */}
          {settings.aiConfig.enabled && (
            <button
              onClick={handleAiEnhance}
              disabled={isAiProcessing || !content.trim()}
              title="Enhance formatting, typos, LaTeX math, and tables using BYOK AI"
              className="px-3 py-1.5 rounded-xl border border-theme-border bg-theme-accentBg text-theme-accent hover:opacity-90 text-xs font-medium transition-opacity flex items-center gap-1.5 disabled:opacity-50"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>{isAiProcessing ? 'Enhancing...' : 'Fix with AI'}</span>
            </button>
          )}

          {/* Launch Flow Button */}
          <button
            onClick={onStartFlow}
            disabled={!content.trim()}
            className="px-4 py-1.5 rounded-xl bg-theme-primary hover:bg-theme-primaryHover text-theme-primaryText font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Flow</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className={`px-4 py-2 text-xs font-medium flex items-center gap-2 border-b animate-fade-in ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
            : 'bg-red-500/10 text-red-600 border-red-500/20'
        }`}>
          {statusMessage.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* OCR Progress Banner */}
      {isOcrProcessing && (
        <div className="px-4 py-2 bg-amber-500/10 text-amber-700 border-b border-amber-500/20 text-xs flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>{ocrProgress}</span>
        </div>
      )}

      {/* Main Content Textarea */}
      <div className="flex-1 p-4 flex flex-col min-h-0">
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="Paste or type your notes here... Supports Markdown headers, bullet points, LaTeX formulas ($E=mc^2$ or $$block$$), and Markdown tables (| Col 1 | Col 2 |)."
          className="flex-1 w-full p-4 rounded-2xl bg-theme-bg border border-theme-border text-theme-text font-serif text-base leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-theme-accent transition-all shadow-inner"
        />
      </div>

      {/* Editor Footer Metrics */}
      <div className="px-4 py-2.5 border-t border-theme-border bg-theme-surfaceHover/30 flex items-center justify-between text-xs text-theme-textMuted font-mono">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>{lineCount} lines</span>
        </div>
        <div className="text-[11px] text-theme-textSubtle">
          Formatting: Markdown • KaTeX LaTeX • Tables
        </div>
      </div>

    </div>
  );
};
