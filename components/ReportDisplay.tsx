import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Share2, Check } from 'lucide-react';

interface ReportDisplayProps {
  markdown: string;
  url: string;
  scannedAt: string;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({ markdown, url, scannedAt }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Analysis Report</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="font-mono">{new URL(url).hostname}</span>
            <span>•</span>
            <span>{new Date(scannedAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors opacity-50 cursor-not-allowed">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="p-8 prose prose-slate prose-headings:font-bold prose-headings:text-slate-800 prose-a:text-brand-600 prose-strong:text-slate-900 max-w-none">
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl border-b pb-4 mb-6 border-slate-200" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl mt-8 mb-4 bg-slate-50 p-2 rounded-md border-l-4 border-brand-500" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl mt-6 mb-3 text-brand-700" {...props} />,
            ul: ({node, ...props}) => <ul className="bg-slate-50 p-6 rounded-lg list-disc ml-4 space-y-2 border border-slate-100" {...props} />,
            li: ({node, ...props}) => <li className="pl-1 marker:text-brand-500" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
};
