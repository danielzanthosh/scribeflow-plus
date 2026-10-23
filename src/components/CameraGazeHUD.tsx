import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Eye, ChevronDown, ChevronUp, Sliders, Volume2, VolumeX, Crosshair, Check } from 'lucide-react';
import { VisionTracker } from '../utils/visionTracker';
import { GazeDetectionMetrics, GazeState, AutoAdvanceMode } from '../types';
import { soundManager } from '../utils/sound';

interface CameraGazeHUDProps {
  visionTracker: VisionTracker;
  autoAdvanceMode: AutoAdvanceMode;
  onSetAutoAdvanceMode: (mode: AutoAdvanceMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const CameraGazeHUD: React.FC<CameraGazeHUDProps> = ({
  visionTracker,
  autoAdvanceMode,
  onSetAutoAdvanceMode,
  soundEnabled,
  onToggleSound,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [calibSuccess, setCalibSuccess] = useState<'up' | 'down' | null>(null);

  const [metrics, setMetrics] = useState<GazeDetectionMetrics>({
    pitchAngle: 0,
    pitchDelta: 0,
    rawPitch: 0,
    isCalibrated: visionTracker.isCalibrated,
    lookUpAngle: visionTracker.lookUpPitch,
    lookDownAngle: visionTracker.lookDownPitch,
    currentState: 'unknown',
    confidence: 0,
    lastStateChange: Date.now(),
  });

  useEffect(() => {
    visionTracker.onMetricsUpdate = (m) => {
      setMetrics(m);
    };
  }, [visionTracker]);

  const handleToggleCamera = async () => {
    if (isCameraActive) {
      visionTracker.stop();
      setIsCameraActive(false);
    } else {
      if (videoRef.current) {
        const success = await visionTracker.start(videoRef.current);
        setIsCameraActive(success);
      }
    }
  };

  const handleCalibrateLookUp = () => {
    visionTracker.calibrateLookUp();
    soundManager.playCalibrateTone();
    setCalibSuccess('up');
    setTimeout(() => setCalibSuccess(null), 1800);
  };

  const handleCalibrateLookDown = () => {
    visionTracker.calibrateLookDown();
    soundManager.playCalibrateTone();
    setCalibSuccess('down');
    setTimeout(() => setCalibSuccess(null), 1800);
  };

  return (
    <aside aria-label="Gaze Tracker HUD" className="fixed bottom-4 right-4 z-30 flex flex-col rounded-2xl bg-theme-surface/95 backdrop-blur-md border border-theme-border shadow-xl w-72 overflow-hidden transition-all duration-200">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-theme-surfaceHover/50 border-b border-theme-border cursor-pointer select-none">
        <div className="flex items-center gap-2" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className={`w-2 h-2 rounded-full ${isCameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
          <span className="text-xs font-semibold text-theme-text flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-theme-accent" />
            Gaze & Face Vision
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Audio Feedback' : 'Unmute Audio Feedback'}
            aria-label={soundEnabled ? 'Mute Audio Feedback' : 'Unmute Audio Feedback'}
            className="p-1 min-h-[32px] min-w-[32px] rounded-md text-theme-textMuted hover:text-theme-text hover:bg-theme-surface transition-colors flex items-center justify-center"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-red-500" />}
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand Gaze HUD' : 'Collapse Gaze HUD'}
            aria-label={isCollapsed ? 'Expand Gaze HUD' : 'Collapse Gaze HUD'}
            className="p-1 min-h-[32px] min-w-[32px] rounded-md text-theme-textMuted hover:text-theme-text hover:bg-theme-surface transition-colors flex items-center justify-center"
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Body Content */}
      {!isCollapsed && (
        <div className="p-3.5 space-y-3 text-xs">
          {/* Video Preview Box */}
          <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-video border border-theme-border flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover -scale-x-100 ${!isCameraActive ? 'hidden' : 'block'}`}
            />
            
            {!isCameraActive && (
              <div className="flex flex-col items-center justify-center p-4 text-center text-stone-400 gap-2">
                <CameraOff className="w-6 h-6 text-stone-500" />
                <span className="text-xs leading-tight">Camera is idle. Click below to start hands-free tracking.</span>
              </div>
            )}

            {/* In-Video Pitch HUD Overlay */}
            {isCameraActive && (
              <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs font-mono text-white/90 drop-shadow">
                  <span className={`px-1.5 py-0.5 rounded ${metrics.currentState === 'looking-screen' ? 'bg-emerald-600/90' : metrics.currentState === 'looking-down' ? 'bg-amber-600/90' : 'bg-red-600/90'}`}>
                    {metrics.currentState === 'looking-screen' ? 'READING (SCREEN)' : metrics.currentState === 'looking-down' ? 'WRITING (NOTEBOOK)' : 'NO FACE'}
                  </span>
                  <span>{metrics.pitchAngle}°</span>
                </div>

                {/* Horizon Guideline */}
                <div className="relative w-full h-0.5 bg-white/20 flex items-center justify-center">
                  <div
                    className="w-10 h-0.5 bg-emerald-400 transition-all duration-75"
                    style={{
                      transform: `translateY(${Math.max(-25, Math.min(25, metrics.pitchAngle))}px)`,
                    }}
                  />
                </div>

                <div className="text-xs text-white/70 text-center font-mono">
                  Conf: {Math.round(metrics.confidence * 100)}%
                </div>
              </div>
            )}
          </div>

          {/* Toggle Camera Button */}
          <button
            onClick={handleToggleCamera}
            className={`w-full py-2 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all ${
              isCameraActive
                ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/30'
                : 'bg-theme-primary hover:bg-theme-primaryHover text-theme-primaryText shadow-sm'
            }`}
          >
            {isCameraActive ? (
              <>
                <CameraOff className="w-3.5 h-3.5" /> Stop Camera
              </>
            ) : (
              <>
                <Camera className="w-3.5 h-3.5" /> Start Hands-Free Tracking
              </>
            )}
          </button>

          {/* Calibration Panel */}
          {isCameraActive && (
            <div className="space-y-2 pt-1 border-t border-theme-border">
              <div className="flex items-center justify-between text-xs text-theme-textMuted">
                <span className="font-medium flex items-center gap-1">
                  <Crosshair className="w-3 h-3 text-theme-accent" />
                  Quick Angle Calibration
                </span>
                <span className="text-xs text-emerald-600 font-mono">
                  {metrics.isCalibrated ? 'Calibrated' : 'Needs Set'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={handleCalibrateLookUp}
                  className="px-2 py-1.5 rounded-lg border border-theme-border bg-theme-surface hover:bg-theme-surfaceHover text-theme-text text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  {calibSuccess === 'up' ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                  1. Look at Screen
                </button>
                <button
                  onClick={handleCalibrateLookDown}
                  className="px-2 py-1.5 rounded-lg border border-theme-border bg-theme-surface hover:bg-theme-surfaceHover text-theme-text text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  {calibSuccess === 'down' ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                  2. Look at Notebook
                </button>
              </div>
            </div>
          )}

          {/* Mode Selector */}
          <div className="space-y-1 pt-1 border-t border-theme-border">
            <span className="text-xs font-medium text-theme-textMuted">Auto-Advance Trigger:</span>
            <select
              value={autoAdvanceMode}
              onChange={(e) => onSetAutoAdvanceMode(e.target.value as AutoAdvanceMode)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-theme-border bg-theme-surface text-theme-text text-xs focus:ring-1 focus:ring-theme-accent outline-none"
            >
              <option value="gaze-lookup">Advance when looking UP (Natural Writing Flow)</option>
              <option value="gaze-lookdown">Advance when looking DOWN (Preview Mode)</option>
              <option value="timed">Timed Auto-Flow (WPM pace)</option>
              <option value="manual">Manual Only (Spacebar / Arrows)</option>
            </select>
          </div>
        </div>
      )}
    </aside>
  );
};
