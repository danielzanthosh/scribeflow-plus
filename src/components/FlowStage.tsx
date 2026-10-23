import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, FastForward, Maximize2, Minimize2, Sparkles, BookOpen, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chunk, AppSettings } from '../types';
import { parseInlineMarkdown, safeRenderKatex } from '../utils/markdownRenderer';

interface FlowStageProps {
  chunks: Chunk[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  settings: AppSettings;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const FlowStage: React.FC<FlowStageProps> = ({
  chunks,
  currentIndex,
  onNavigate,
  settings,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const currentChunk = chunks[currentIndex];
  const prevChunk = currentIndex > 0 ? chunks[currentIndex - 1] : null;
  const nextChunk = currentIndex < chunks.length - 1 ? chunks[currentIndex + 1] : null;

  const totalChunks = chunks.length;
  const progressPercent = totalChunks > 0 ? Math.round(((currentIndex + 1) / totalChunks) * 100) : 0;

  // Estimate remaining handwriting time:
  // Average handwriting speed is ~15-20 words per minute.
  const remainingWords = chunks
    .slice(currentIndex)
    .reduce((acc, c) => acc + (c.wordCount || 1), 0);
  const estimatedMinutesRemaining = Math.max(1, Math.ceil(remainingWords / (settings.writingPaceWpm || 18)));

  // Trigger celebration on completing all chunks
  const hasTriggeredConfetti = useRef(false);
  useEffect(() => {
    if (totalChunks > 0 && currentIndex === totalChunks - 1 && !hasTriggeredConfetti.current) {
      hasTriggeredConfetti.current = true;
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore
      }
    } else if (currentIndex < totalChunks - 1) {
      hasTriggeredConfetti.current = false;
    }
  }, [currentIndex, totalChunks]);

  if (!currentChunk || totalChunks === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-theme-textMuted">
        <div className="w-16 h-16 rounded-2xl bg-theme-surfaceHover flex items-center justify-center border border-theme-border mb-4">
          <BookOpen className="w-8 h-8 text-theme-accent opacity-80" />
        </div>
        <h3 className="text-xl font-bold font-serif text-theme-text mb-2">Ready to Transcribe</h3>
        <p className="max-w-md text-sm leading-relaxed text-theme-textMuted">
          Select a sample note from the sidebar or paste your lecture notes, equations, or tables to begin the transcription flow.
        </p>
      </div>
    );
  }

  // Determine font size classes
  const fontClass =
    settings.fontSize === 'huge' ? 'text-3xl sm:text-4xl md:text-5xl leading-tight' :
    settings.fontSize === 'large' ? 'text-2xl sm:text-3xl md:text-4xl leading-snug' :
    settings.fontSize === 'small' ? 'text-lg sm:text-xl leading-normal' :
    'text-xl sm:text-2xl md:text-3xl leading-snug';

  const familyClass =
    settings.fontFamily === 'sans' ? 'font-sans' :
    settings.fontFamily === 'mono' ? 'font-mono' :
    'font-serif';

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 max-w-4xl mx-auto w-full select-none">
      
      {/* Top Flow Header & Statistics */}
      <div className="flex items-center justify-between pb-4 border-b border-theme-border text-xs text-theme-textMuted">
        <div className="flex items-center gap-3">
          <span className="font-mono font-semibold px-2.5 py-1 rounded-lg bg-theme-accentBg text-theme-accent border border-theme-border">
            Chunk {currentIndex + 1} of {totalChunks}
          </span>
          <span className="hidden sm:inline-block">
            {progressPercent}% Complete
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-1.5 font-mono">
            <span>⏱️ ~{estimatedMinutesRemaining} min left</span>
            <span className="text-theme-textSubtle">({remainingWords} words)</span>
          </span>

          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Distraction-Free Fullscreen'}
            className="p-1.5 rounded-lg border border-theme-border hover:bg-theme-surfaceHover text-theme-text transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1 bg-theme-border rounded-full overflow-hidden mt-1">
        <div
          className="h-full bg-theme-accent transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Central Reading Stage */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 my-auto">
        
        {/* Previous Context (Dimmed) */}
        {settings.showContextWindow && prevChunk && (
          <div className="mb-4 sm:mb-6 opacity-35 hover:opacity-60 transition-opacity text-sm sm:text-base text-theme-text font-serif italic truncate max-w-2xl mx-auto text-center">
            <span className="text-theme-accent mr-2">Previous:</span>
            <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(prevChunk.text) }} />
          </div>
        )}

        {/* Hero Active Phrase Card */}
        <div
          key={currentChunk.id}
          className={`relative p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-theme-surface border border-theme-border shadow-lg transition-all duration-200 animate-chunk-pop text-center max-w-3xl mx-auto w-full min-h-[160px] sm:min-h-[220px] flex flex-col items-center justify-center`}
        >
          {/* Chunk Type Badge */}
          {currentChunk.type !== 'text' && (
            <span className="absolute top-3 left-4 px-2 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-theme-accentBg text-theme-accent border border-theme-border">
              {currentChunk.type}
            </span>
          )}

          {/* Word Count Indicator */}
          <span className="absolute top-3 right-4 text-xs font-mono text-theme-textSubtle">
            {currentChunk.wordCount} words
          </span>

          {/* Render Math Block or Text Phrase */}
          {currentChunk.type === 'math-block' ? (
            <div
              className="py-4 overflow-x-auto w-full text-center"
              dangerouslySetInnerHTML={{
                __html: safeRenderKatex(currentChunk.mathExpression || currentChunk.text, true),
              }}
            />
          ) : (
            <div
              className={`font-medium text-theme-text tracking-tight transition-colors ${fontClass} ${familyClass}`}
              dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(currentChunk.text) }}
            />
          )}

          {/* Table Cell Meta Helper */}
          {currentChunk.tableInfo && (
            <div className="mt-4 pt-3 border-t border-theme-border text-xs text-theme-textMuted font-mono">
              Table Row {currentChunk.tableInfo.row}
            </div>
          )}
        </div>

        {/* Next Context Preview (Subtle) */}
        {settings.showContextWindow && nextChunk && (
          <div className="mt-4 sm:mt-6 opacity-40 hover:opacity-70 transition-opacity text-sm sm:text-base text-theme-text font-serif truncate max-w-2xl mx-auto text-center">
            <span className="text-theme-accent mr-2">Next:</span>
            <span dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(nextChunk.text) }} />
          </div>
        )}
      </div>

      {/* Control Bar Actions */}
      <div className="pt-4 border-t border-theme-border flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side Quick Jumps */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate(0)}
            disabled={currentIndex === 0}
            title="Reset to Start (Home)"
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-theme-border hover:bg-theme-surfaceHover text-theme-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          
          <button
            onClick={() => onNavigate(Math.max(0, currentIndex - 5))}
            disabled={currentIndex === 0}
            title="Rewind 5 Chunks"
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-theme-border hover:bg-theme-surfaceHover text-theme-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-medium"
          >
            -5
          </button>
        </div>

        {/* Center Navigation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-theme-border bg-theme-surface hover:bg-theme-surfaceHover text-theme-text font-medium text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => onNavigate(Math.min(totalChunks - 1, currentIndex + 1))}
            disabled={currentIndex >= totalChunks - 1}
            className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-theme-primary hover:bg-theme-primaryHover text-theme-primaryText font-semibold text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side Skip */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onNavigate(Math.min(totalChunks - 1, currentIndex + 5))}
            disabled={currentIndex >= totalChunks - 1}
            title="Fast Forward 5 Chunks"
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-theme-border hover:bg-theme-surfaceHover text-theme-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-medium"
          >
            +5
          </button>
        </div>

      </div>

    </div>
  );
};
