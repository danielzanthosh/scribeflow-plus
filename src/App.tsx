import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AppSettings, Chunk, Script, ThemeId, AutoAdvanceMode } from './types';
import { DEFAULT_PRESET_SCRIPTS } from './utils/presets';
import { chunkDocument } from './utils/chunker';
import { VisionTracker } from './utils/visionTracker';
import { soundManager } from './utils/sound';
import { Header } from './components/Header';
import { FlowStage } from './components/FlowStage';
import { NotesEditor } from './components/NotesEditor';
import { DocumentView } from './components/DocumentView';
import { CameraGazeHUD } from './components/CameraGazeHUD';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { TermsModal } from './components/TermsModal';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'warm-paper',
  chunkMode: 'balanced',
  wordsPerChunkTarget: 5,
  autoAdvanceMode: 'gaze-lookup',
  timedPaceSeconds: 4,
  writingPaceWpm: 18,
  gazeDwellMs: 500,
  gazeSensitivity: 5,
  soundFeedback: true,
  soundVolume: 0.3,
  fontSize: 'large',
  fontFamily: 'serif',
  showContextWindow: true,
  showDocumentSidebar: true,
  showCameraHud: true,
  termsAccepted: false,
  termsAcceptedDate: null,
  aiConfig: {
    enabled: false,
    apiKey: '',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'google/gemini-2.0-flash-001',
  },
};

export const App: React.FC = () => {
  // Load persisted settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('scribeflow_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Load scripts
  const [scripts, setScripts] = useState<Script[]>(() => {
    const saved = localStorage.getItem('scribeflow_scripts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // use defaults
      }
    }
    return DEFAULT_PRESET_SCRIPTS;
  });

  const [activeScriptId, setActiveScriptId] = useState<string>(() => {
    return scripts[0]?.id || DEFAULT_PRESET_SCRIPTS[0].id;
  });

  const [activeView, setActiveView] = useState<'editor' | 'flow' | 'document'>('flow');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Initialize VisionTracker instance
  const visionTrackerRef = useRef<VisionTracker | null>(null);
  if (!visionTrackerRef.current) {
    visionTrackerRef.current = new VisionTracker();
  }
  const visionTracker = visionTrackerRef.current;

  // Active Script
  const activeScript = useMemo(() => {
    return scripts.find((s) => s.id === activeScriptId) || scripts[0] || DEFAULT_PRESET_SCRIPTS[0];
  }, [scripts, activeScriptId]);

  // Compute Chunks using non-AI linguistic engine
  const chunks = useMemo(() => {
    return chunkDocument(activeScript.content, {
      mode: settings.chunkMode,
      targetWords: settings.wordsPerChunkTarget,
    });
  }, [activeScript.content, settings.chunkMode, settings.wordsPerChunkTarget]);

  // Update HTML data-theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    localStorage.setItem('scribeflow_settings', JSON.stringify(settings));
    soundManager.enabled = settings.soundFeedback;
  }, [settings]);

  // Save scripts to localStorage
  useEffect(() => {
    localStorage.setItem('scribeflow_scripts', JSON.stringify(scripts));
  }, [scripts]);

  // Handle chunk navigation
  const handleNavigate = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(chunks.length - 1, index));
      setCurrentIndex(validIndex);
      soundManager.playAdvance();
    },
    [chunks.length]
  );

  // Auto-advance trigger handler from Vision Tracker
  useEffect(() => {
    visionTracker.dwellDurationMs = settings.gazeDwellMs;
    visionTracker.onStateTrigger = (trigger) => {
      if (activeView !== 'flow' || chunks.length === 0) return;

      if (settings.autoAdvanceMode === 'gaze-lookup' && trigger === 'look-up') {
        soundManager.playLookUpChime();
        setCurrentIndex((prev) => Math.min(chunks.length - 1, prev + 1));
      } else if (settings.autoAdvanceMode === 'gaze-lookdown' && trigger === 'look-down') {
        soundManager.playAdvance();
        setCurrentIndex((prev) => Math.min(chunks.length - 1, prev + 1));
      }
    };
  }, [visionTracker, settings.autoAdvanceMode, settings.gazeDwellMs, activeView, chunks.length]);

  // Timed auto-advance mode
  useEffect(() => {
    if (settings.autoAdvanceMode === 'timed' && activeView === 'flow' && chunks.length > 0) {
      // Calculate interval based on active chunk word count and WPM
      const currentWordCount = chunks[currentIndex]?.wordCount || 4;
      const intervalMs = Math.max(2000, (currentWordCount / (settings.writingPaceWpm || 18)) * 60 * 1000);

      const timer = setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev < chunks.length - 1) {
            soundManager.playAdvance();
            return prev + 1;
          }
          return prev;
        });
      }, intervalMs);

      return () => clearTimeout(timer);
    }
  }, [settings.autoAdvanceMode, activeView, currentIndex, chunks, settings.writingPaceWpm]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in textarea or input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleNavigate(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleNavigate(currentIndex - 1);
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleNavigate(0);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setSettings((prev) => {
          const next = !prev.soundFeedback;
          soundManager.enabled = next;
          return { ...prev, soundFeedback: next };
        });
      } else if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsAboutOpen(false);
        if (!settings.termsAccepted) {
          // Cannot close mandatory terms
        } else {
          setIsTermsOpen(false);
        }
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, handleNavigate, settings.termsAccepted]);

  // Fullscreen document change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Theme cycler
  const themeList: ThemeId[] = [
    'warm-paper',
    'midnight',
    'cyberpunk',
    'nordic',
    'solarized-dusk',
    'botanical-sage',
  ];
  const handleCycleTheme = () => {
    const currIdx = themeList.indexOf(settings.theme);
    const nextIdx = (currIdx + 1) % themeList.length;
    setSettings((prev) => ({ ...prev, theme: themeList[nextIdx] }));
  };

  // Script content update
  const handleUpdateContent = (newContent: string, newTitle?: string) => {
    setScripts((prev) =>
      prev.map((s) => {
        if (s.id === activeScriptId) {
          return {
            ...s,
            content: newContent,
            title: newTitle !== undefined ? newTitle : s.title,
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      })
    );
  };

  const handleNewScript = () => {
    const newScript: Script = {
      id: `script-${Date.now()}`,
      title: 'Untitled Lecture Note',
      content: '# New Lecture Notes\n\nStart writing or paste notes here...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastChunkIndex: 0,
    };
    setScripts((prev) => [newScript, ...prev]);
    setActiveScriptId(newScript.id);
    setActiveView('editor');
  };

  const handleDeleteScript = (id: string) => {
    if (scripts.length <= 1) return;
    setScripts((prev) => prev.filter((s) => s.id !== id));
    if (activeScriptId === id) {
      setActiveScriptId(scripts.find((s) => s.id !== id)?.id || scripts[0].id);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-theme-bg text-theme-text font-sans antialiased">
      
      {/* Mandatory Terms & Conditions Gatekeeper */}
      {!settings.termsAccepted && (
        <TermsModal
          isOpen={true}
          isMandatoryGate={true}
          onAccept={() => {
            setSettings((prev) => ({
              ...prev,
              termsAccepted: true,
              termsAcceptedDate: new Date().toISOString(),
            }));
          }}
        />
      )}

      {/* Informative Terms Modal (opened via settings/footer) */}
      {isTermsOpen && (
        <TermsModal
          isOpen={isTermsOpen}
          isMandatoryGate={false}
          onAccept={() => {}}
          onClose={() => setIsTermsOpen(false)}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
        onOpenTermsModal={() => {
          setIsSettingsOpen(false);
          setIsTermsOpen(true);
        }}
      />

      {/* About & Guide Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onOpenTerms={() => {
          setIsAboutOpen(false);
          setIsTermsOpen(true);
        }}
      />

      {/* Main Top Header */}
      {!isFullscreen && (
        <Header
          activeView={activeView}
          onSelectView={setActiveView}
          currentTheme={settings.theme}
          onCycleTheme={handleCycleTheme}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          hasChunks={chunks.length > 0}
        />
      )}

      {/* Central Viewport Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Editor View */}
        {activeView === 'editor' && (
          <NotesEditor
            currentScript={activeScript}
            onUpdateContent={handleUpdateContent}
            onStartFlow={() => setActiveView('flow')}
            settings={settings}
            scripts={scripts}
            onSelectScript={(s) => {
              setActiveScriptId(s.id);
              setCurrentIndex(0);
            }}
            onNewScript={handleNewScript}
            onDeleteScript={handleDeleteScript}
          />
        )}

        {/* Transcriber Flow Stage View */}
        {activeView === 'flow' && (
          <div className="flex-1 flex w-full h-full overflow-hidden">
            {/* Optional Collapsible Document Transcript Sidebar */}
            {settings.showDocumentSidebar && !isFullscreen && (
              <aside aria-label="Script Transcript Sidebar" className="hidden lg:block w-72 h-full flex-shrink-0">
                <DocumentView
                  chunks={chunks}
                  currentIndex={currentIndex}
                  onSelectChunk={(idx) => handleNavigate(idx)}
                />
              </aside>
            )}

            {/* Central Stage */}
            <FlowStage
              chunks={chunks}
              currentIndex={currentIndex}
              onNavigate={handleNavigate}
              settings={settings}
              isFullscreen={isFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
            />
          </div>
        )}

        {/* Full Document View (Mobile/Tablet or Tab) */}
        {activeView === 'document' && (
          <div className="flex-1 max-w-3xl mx-auto w-full h-full p-4 overflow-hidden">
            <DocumentView
              chunks={chunks}
              currentIndex={currentIndex}
              onSelectChunk={(idx) => {
                handleNavigate(idx);
                setActiveView('flow');
              }}
            />
          </div>
        )}

        {/* Camera Gaze HUD (Picture-in-Picture) */}
        {settings.showCameraHud && (
          <CameraGazeHUD
            visionTracker={visionTracker}
            autoAdvanceMode={settings.autoAdvanceMode}
            onSetAutoAdvanceMode={(mode) => setSettings((prev) => ({ ...prev, autoAdvanceMode: mode }))}
            soundEnabled={settings.soundFeedback}
            onToggleSound={() => {
              const next = !settings.soundFeedback;
              soundManager.enabled = next;
              setSettings((prev) => ({ ...prev, soundFeedback: next }));
            }}
          />
        )}
      </main>

    </div>
  );
};
export default App;
