import React, { useEffect, useState } from 'react';
import { Scan, Database, Globe, Search, Loader2 } from 'lucide-react';

interface ScanningVisualizerProps {
  currentStep: string;
}

const steps = [
  { id: 'connect', label: 'Resolving Host...', icon: Globe },
  { id: 'crawl', label: 'Crawling Site Structure...', icon: Scan },
  { id: 'extract', label: 'Extracting Metadata...', icon: Database },
  { id: 'analyze', label: 'Synthesizing Report...', icon: Search },
];

export const ScanningVisualizer: React.FC<ScanningVisualizerProps> = ({ currentStep }) => {
  // Simple rotation of active steps for visual flair
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400 animate-gradient-x"></div>
      
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
          <div className="w-24 h-24 bg-white rounded-full border-4 border-brand-100 flex items-center justify-center relative z-10 shadow-inner">
            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
          </div>
        </div>

        <div className="space-y-2 text-center">
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
            AI Analysis In Progress
          </h3>
          <p className="text-slate-500 font-mono text-sm">
            {currentStep || "Initializing..."}
          </p>
        </div>

        <div className="w-full grid grid-cols-4 gap-4 mt-8">
          {steps.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            const Icon = step.icon;
            return (
              <div 
                key={step.id}
                className={`flex flex-col items-center space-y-2 transition-all duration-500 ${isActive ? 'opacity-100 scale-105' : 'opacity-40 grayscale'}`}
              >
                <div className={`p-3 rounded-lg ${isActive ? 'bg-brand-50 text-brand-600' : 'bg-slate-50 text-slate-400'}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-medium text-center hidden sm:block">{step.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};
