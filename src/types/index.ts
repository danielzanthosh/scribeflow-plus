export type ThemeId =
  | 'warm-paper'
  | 'midnight'
  | 'cyberpunk'
  | 'nordic'
  | 'solarized-dusk'
  | 'botanical-sage';

export type ChunkType =
  | 'text'
  | 'heading'
  | 'math-inline'
  | 'math-block'
  | 'table-cell'
  | 'table-row'
  | 'list-item'
  | 'code';

export interface Chunk {
  id: string;
  index: number;
  type: ChunkType;
  text: string;
  rawText: string;
  sourceLine: number;
  wordCount: number;
  mathExpression?: string;
  tableInfo?: {
    row: number;
    col: number;
    header: string;
    totalRows: number;
    totalCols: number;
  };
}

export interface Script {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  lastChunkIndex: number;
  category?: string;
}

export type AutoAdvanceMode = 'manual' | 'gaze-lookup' | 'gaze-lookdown' | 'timed';

export interface AIConfig {
  enabled: boolean;
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface AppSettings {
  theme: ThemeId;
  chunkMode: 'short' | 'balanced' | 'long' | 'sentence';
  wordsPerChunkTarget: number; // e.g. 4 for short, 5 for balanced, 8 for long
  autoAdvanceMode: AutoAdvanceMode;
  timedPaceSeconds: number; // for timed mode
  writingPaceWpm: number; // handwriting speed e.g. 15-25 wpm
  gazeDwellMs: number; // dwell time to trigger advance
  gazeSensitivity: number; // 1 to 10
  soundFeedback: boolean;
  soundVolume: number; // 0 to 1
  fontSize: 'small' | 'medium' | 'large' | 'huge';
  fontFamily: 'serif' | 'sans' | 'mono';
  showContextWindow: boolean;
  showDocumentSidebar: boolean;
  showCameraHud: boolean;
  termsAccepted: boolean;
  termsAcceptedDate: string | null;
  aiConfig: AIConfig;
}

export type GazeState = 'unknown' | 'looking-screen' | 'looking-down' | 'no-face';

export interface GazeDetectionMetrics {
  pitchAngle: number; // in degrees, positive = looking down, negative = looking up
  pitchDelta: number; // relative to calibrated center
  rawPitch: number;
  isCalibrated: boolean;
  lookUpAngle: number;
  lookDownAngle: number;
  currentState: GazeState;
  confidence: number;
  lastStateChange: number;
}
