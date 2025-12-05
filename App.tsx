import React, { useState } from 'react';
import { analyzeWebsite } from './services/geminiService';
import { AnalysisState, AnalysisResult } from './types';
import { ScanningVisualizer } from './components/ScanningVisualizer';
import { ReportDisplay } from './components/ReportDisplay';
import { Search, Globe, Sparkles, AlertCircle } from 'lucide-react';

const DEFAULT_URL = 'https://www.raysrestaurants.com/';

export default function App() {
  const [url, setUrl] = useState(DEFAULT_URL);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    progress: 0,
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setAnalysisState({ status: 'scanning', progress: 10, currentStep: 'Initializing connection...' });
    setResult(null);

    // Simulate progress steps visually while waiting for API
    const progressTimer = setInterval(() => {
      setAnalysisState((prev) => {
        if (prev.status !== 'scanning') return prev;
        const newProgress = Math.min(prev.progress + 5, 90);
        let step = prev.currentStep;
        if (newProgress > 20) step = 'Crawling site structure...';
        if (newProgress > 50) step = 'Extracting metadata & assets...';
        if (newProgress > 75) step = 'Synthesizing final report...';
        
        return { ...prev, progress: newProgress, currentStep: step };
      });
    }, 800);

    try {
      const markdown = await analyzeWebsite(url);
      clearInterval(progressTimer);
      
      setResult({
        markdown,
        url,
        scannedAt: new Date().toISOString()
      });
      setAnalysisState({ status: 'complete', progress: 100 });
    } catch (error: any) {
      clearInterval(progressTimer);
      setAnalysisState({ 
        status: 'error', 
        progress: 0, 
        error: error.message || "An unexpected error occurred" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900">
              SiteScanner<span className="text-brand-600">AI</span>
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-brand-600 transition-colors">Documentation</a>
            <a href="#" className="hover:text-brand-600 transition-colors">API</a>
            <a href="#" className="hover:text-brand-600 transition-colors">History</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Hero / Input Section */}
        <section className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Deep website analysis <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
                powered by Gemini 2.5
              </span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Extract business details, menus, design systems, and technical specs in seconds. Just paste a URL.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-indigo-400 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-white p-2 rounded-full shadow-lg border border-slate-200 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 transition-all">
              <div className="pl-4 text-slate-400">
                <Globe size={20} />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 placeholder-slate-400 text-lg py-2 px-4"
                required
              />
              <button
                type="submit"
                disabled={analysisState.status === 'scanning'}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                {analysisState.status === 'scanning' ? 'Scanning...' : 'Analyze'}
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500">
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full">Menu Extraction</span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full">Contact Info</span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full">Tech Stack</span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-full">Brand Voice</span>
          </div>
        </section>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {analysisState.status === 'idle' && (
             <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                 <Search size={32} />
               </div>
               <h3 className="text-lg font-medium text-slate-900">Ready to analyze</h3>
               <p className="text-slate-500">Enter a URL above to generate a comprehensive report.</p>
             </div>
          )}

          {analysisState.status === 'scanning' && (
            <ScanningVisualizer currentStep={analysisState.currentStep || ""} />
          )}

          {analysisState.status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-800 flex flex-col items-center gap-4">
              <AlertCircle size={48} className="text-red-500" />
              <div>
                <h3 className="text-lg font-bold">Analysis Failed</h3>
                <p className="text-red-600">{analysisState.error}</p>
              </div>
              <button 
                onClick={() => setAnalysisState({ status: 'idle', progress: 0 })}
                className="px-4 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50"
              >
                Try Again
              </button>
            </div>
          )}

          {analysisState.status === 'complete' && result && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
               <ReportDisplay 
                 markdown={result.markdown} 
                 url={result.url} 
                 scannedAt={result.scannedAt} 
               />
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
