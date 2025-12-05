export interface AnalysisResult {
  markdown: string;
  scannedAt: string;
  url: string;
}

export interface AnalysisState {
  status: 'idle' | 'scanning' | 'analyzing' | 'complete' | 'error';
  progress: number;
  error?: string;
  currentStep?: string;
}
