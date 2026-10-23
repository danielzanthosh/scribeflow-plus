import { GazeDetectionMetrics, GazeState } from '../types';

export class VisionTracker {
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D | null = null;
  private animFrameId: number | null = null;

  private isRunning: boolean = false;
  private stream: MediaStream | null = null;

  // Calibration points
  public lookUpPitch: number = 0; // Baseline when looking at screen
  public lookDownPitch: number = 22; // Baseline when looking at desk
  public isCalibrated: boolean = false;

  // Smoothing & hysteresis
  private smoothedPitch: number = 0;
  private alphaSmoothing: number = 0.25;
  private currentState: GazeState = 'unknown';
  private dwellStartTime: number = 0;
  private dwellCandidateState: GazeState = 'unknown';
  private lastStateTransitionTime: number = Date.now();

  // Metrics listener callback
  public onMetricsUpdate?: (metrics: GazeDetectionMetrics) => void;
  public onStateTrigger?: (triggeredState: 'look-up' | 'look-down') => void;

  // User configurable dwell time (ms)
  public dwellDurationMs: number = 550;
  public sensitivity: number = 5;

  constructor() {
    this.canvasElement = document.createElement('canvas');
    this.canvasElement.width = 160;
    this.canvasElement.height = 120;
    this.canvasCtx = this.canvasElement.getContext('2d', { willReadFrequently: true });
    
    // Load persisted calibration if present
    const saved = localStorage.getItem('scribeflow_gaze_calib');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.lookUpPitch = parsed.lookUpPitch ?? 0;
        this.lookDownPitch = parsed.lookDownPitch ?? 22;
        this.isCalibrated = true;
      } catch (e) {
        // use defaults
      }
    }
  }

  public async start(videoEl: HTMLVideoElement): Promise<boolean> {
    this.videoElement = videoEl;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 320 },
          height: { ideal: 240 },
          facingMode: 'user',
        },
        audio: false,
      });

      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();
      this.isRunning = true;
      this.processLoop();
      return true;
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      this.isRunning = false;
      return false;
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  /**
   * Calibrates current angle as "Looking at Screen" (Reading)
   */
  public calibrateLookUp(): number {
    this.lookUpPitch = this.smoothedPitch;
    this.isCalibrated = true;
    this.saveCalibration();
    return this.lookUpPitch;
  }

  /**
   * Calibrates current angle as "Looking Down at Notebook" (Writing)
   */
  public calibrateLookDown(): number {
    this.lookDownPitch = this.smoothedPitch;
    this.isCalibrated = true;
    this.saveCalibration();
    return this.lookDownPitch;
  }

  private saveCalibration() {
    localStorage.setItem(
      'scribeflow_gaze_calib',
      JSON.stringify({
        lookUpPitch: this.lookUpPitch,
        lookDownPitch: this.lookDownPitch,
      })
    );
  }

  /**
   * High-efficiency Computer Vision processing loop
   * Estimates head pitch and vertical face displacement using luminance & skin centroid gradient
   */
  private processLoop = () => {
    if (!this.isRunning || !this.videoElement || !this.canvasCtx) return;

    if (this.videoElement.readyState >= 2) {
      const width = this.canvasElement.width;
      const height = this.canvasElement.height;

      this.canvasCtx.drawImage(this.videoElement, 0, 0, width, height);
      const frameData = this.canvasCtx.getImageData(0, 0, width, height);
      const pixels = frameData.data;

      // Extract skin/face centroid and vertical gradient distribution
      let faceWeightY = 0;
      let totalFacePixels = 0;
      let upperLuminance = 0;
      let lowerLuminance = 0;

      const midY = height / 2;

      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          const idx = (y * width + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];

          // Face color heuristic (YCbCr / normalized RGB skin region)
          const isSkinCandidate =
            r > 60 && g > 40 && b > 20 &&
            r > g && r > b &&
            (r - g) >= 12 &&
            Math.abs(r - g) > 10;

          if (isSkinCandidate) {
            faceWeightY += y;
            totalFacePixels++;
          }

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (y < midY) {
            upperLuminance += lum;
          } else {
            lowerLuminance += lum;
          }
        }
      }

      const hasFace = totalFacePixels > (width * height * 0.04);
      let calculatedPitch = 0;
      let confidence = 0.5;

      if (hasFace) {
        const centroidY = faceWeightY / totalFacePixels;
        // Normalize centroid (0 = top, 1 = bottom)
        const normCentroidY = centroidY / height;

        // Head pitch angle approximation (in degrees, -30 to +45)
        // When head tilts down towards paper, the face centroid moves lower in frame
        // and upper luminance ratio shifts as forehead perspective tilts
        const lumRatio = (upperLuminance + 1) / (lowerLuminance + 1);
        calculatedPitch = (normCentroidY - 0.48) * 90 + (1 - lumRatio) * 15;
        confidence = Math.min(1.0, totalFacePixels / (width * height * 0.15));
      }

      // Smooth pitch using exponential moving average
      this.smoothedPitch =
        this.smoothedPitch * (1 - this.alphaSmoothing) + calculatedPitch * this.alphaSmoothing;

      // Determine state based on calibration thresholds
      let detectedState: GazeState = 'unknown';
      if (!hasFace) {
        detectedState = 'no-face';
      } else {
        const midThreshold = (this.lookUpPitch + this.lookDownPitch) / 2;
        const deadzone = Math.max(3, Math.abs(this.lookDownPitch - this.lookUpPitch) * 0.18);

        if (this.smoothedPitch < (midThreshold - deadzone)) {
          detectedState = 'looking-screen';
        } else if (this.smoothedPitch > (midThreshold + deadzone)) {
          detectedState = 'looking-down';
        } else {
          detectedState = this.currentState; // Maintain current state in deadzone
        }
      }

      // Dwell time filter (avoids flickering)
      const now = Date.now();
      if (detectedState !== this.currentState && detectedState !== 'unknown') {
        if (this.dwellCandidateState !== detectedState) {
          this.dwellCandidateState = detectedState;
          this.dwellStartTime = now;
        } else if (now - this.dwellStartTime >= this.dwellDurationMs) {
          const prevState = this.currentState;
          this.currentState = detectedState;
          this.lastStateTransitionTime = now;

          // Trigger state transition event
          if (prevState === 'looking-down' && this.currentState === 'looking-screen') {
            this.onStateTrigger?.('look-up');
          } else if (prevState === 'looking-screen' && this.currentState === 'looking-down') {
            this.onStateTrigger?.('look-down');
          }
        }
      } else {
        this.dwellCandidateState = detectedState;
        this.dwellStartTime = now;
      }

      // Dispatch metrics update
      this.onMetricsUpdate?.({
        pitchAngle: Math.round(this.smoothedPitch * 10) / 10,
        pitchDelta: Math.round((this.smoothedPitch - this.lookUpPitch) * 10) / 10,
        rawPitch: Math.round(calculatedPitch * 10) / 10,
        isCalibrated: this.isCalibrated,
        lookUpAngle: Math.round(this.lookUpPitch * 10) / 10,
        lookDownAngle: Math.round(this.lookDownPitch * 10) / 10,
        currentState: this.currentState,
        confidence: Math.round(confidence * 100) / 100,
        lastStateChange: this.lastStateTransitionTime,
      });
    }

    this.animFrameId = requestAnimationFrame(this.processLoop);
  };
}
