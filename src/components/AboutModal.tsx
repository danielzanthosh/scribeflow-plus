import React from 'react';
import { X, BookOpen, Eye, Keyboard, Shield, Sparkles, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTerms: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  isOpen,
  onClose,
  onOpenTerms,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-theme-surface border border-theme-border shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-theme-border bg-theme-surfaceHover/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-theme-accentBg text-theme-accent border border-theme-border">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-theme-text">About & How to Use ScribeFlow+</h2>
              <p className="text-xs text-theme-textMuted">The Cognitive Note Transcription Flow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-theme-textMuted hover:text-theme-text hover:bg-theme-surfaceHover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-theme-text leading-relaxed">
          
          {/* Mission */}
          <div className="space-y-2">
            <h3 className="text-base font-semibold font-serif text-theme-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-theme-accent" />
              What is ScribeFlow+?
            </h3>
            <p className="text-xs sm:text-sm text-theme-textMuted leading-relaxed">
              ScribeFlow+ is a distraction-free assistant engineered specifically for students, researchers, and writers who copy digital notes, mathematical formulas, and tables into a physical paper notebook.
            </p>
            <p className="text-xs sm:text-sm text-theme-textMuted leading-relaxed">
              Instead of losing your place on dense PDF pages or constantly scrubbing video lectures, ScribeFlow+ chunks notes into natural cognitive working memory units (3–6 words) and tracks your gaze so you can write without breaking focus.
            </p>
          </div>

          {/* Workflow Guide */}
          <div className="space-y-3 pt-3 border-t border-theme-border">
            <h3 className="text-base font-semibold font-serif text-theme-text flex items-center gap-2">
              <Eye className="w-4 h-4 text-theme-accent" />
              The 4-Step Transcription Workflow
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-theme-border bg-theme-surfaceHover/40">
                <span className="font-mono font-bold text-theme-accent text-sm block mb-1">01. Paste or OCR</span>
                <p className="text-theme-textMuted">
                  Paste your lecture notes, equations, or tables. Or upload textbook photos to run instant 100% offline OCR.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-theme-border bg-theme-surfaceHover/40">
                <span className="font-mono font-bold text-theme-accent text-sm block mb-1">02. Linguistic Chunking</span>
                <p className="text-theme-textMuted">
                  Advanced non-AI segmentation breaks text by syntactic boundaries, preserving LaTeX formulas and markdown tables intact.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-theme-border bg-theme-surfaceHover/40">
                <span className="font-mono font-bold text-theme-accent text-sm block mb-1">03. 1-Click Calibration</span>
                <p className="text-theme-textMuted">
                  Click &apos;Look at Screen&apos; then &apos;Look at Notebook&apos; in the HUD to calibrate your desk height and gaze pitch.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-theme-border bg-theme-surfaceHover/40">
                <span className="font-mono font-bold text-theme-accent text-sm block mb-1">04. Flow & Write</span>
                <p className="text-theme-textMuted">
                  Read the phrase, look down at your notebook to write. When you look back up, the next phrase flows into view automatically!
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard Cheatsheet */}
          <div className="space-y-3 pt-3 border-t border-theme-border">
            <h3 className="text-base font-semibold font-serif text-theme-text flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-theme-accent" />
              Keyboard Shortcuts Cheatsheet
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded-lg bg-theme-surfaceHover/50 border border-theme-border">
                <span className="text-theme-textMuted">Next Phrase</span>
                <span className="font-bold text-theme-accent">Space / → / J</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-theme-surfaceHover/50 border border-theme-border">
                <span className="text-theme-textMuted">Previous Phrase</span>
                <span className="font-bold text-theme-accent">← / K</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-theme-surfaceHover/50 border border-theme-border">
                <span className="text-theme-textMuted">Reset to Start</span>
                <span className="font-bold text-theme-accent">R / Home</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-theme-surfaceHover/50 border border-theme-border">
                <span className="text-theme-textMuted">Fullscreen Mode</span>
                <span className="font-bold text-theme-accent">F</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-theme-surfaceHover/50 border border-theme-border">
                <span className="text-theme-textMuted">Audio Feedback</span>
                <span className="font-bold text-theme-accent">M</span>
              </div>
              <div className="flex justify-between p-2 rounded-lg bg-theme-surfaceHover/50 border border-theme-border">
                <span className="text-theme-textMuted">Close Modals</span>
                <span className="font-bold text-theme-accent">Esc</span>
              </div>
            </div>
          </div>

          {/* Desk Ergonomics Tips */}
          <div className="p-4 rounded-xl bg-theme-accentBg/30 border border-theme-border text-xs space-y-1.5">
            <h4 className="font-semibold text-theme-text font-serif text-sm">💡 Ergonomic Tip for Physical Note Scribing</h4>
            <p className="text-theme-textMuted leading-relaxed">
              Position your paper notebook directly below your laptop or monitor. Keep your wrists neutral and maintain your screen at an arm’s length. This creates a clean 20° vertical head pitch delta that ScribeFlow+ detects with 99% accuracy.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-theme-border bg-theme-surfaceHover/30 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenTerms();
            }}
            className="text-xs text-theme-textMuted hover:text-theme-accent flex items-center gap-1.5 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            Terms, Privacy & Credits
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-theme-primary hover:bg-theme-primaryHover text-theme-primaryText text-xs font-semibold transition-all shadow-sm active:scale-95"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
