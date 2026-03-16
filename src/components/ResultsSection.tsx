import React from 'react';
import { ChevronDown, Filter, Download } from 'lucide-react';

export const ResultsSection: React.FC = () => {
  return (
    <div className="mt-12 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">BOM Comparison Results</h2>
          <p className="text-sm text-slate-500 mt-1">
            Comparison results between <span className="font-mono text-slate-700">S00014756CORE_CD</span> and <span className="font-mono text-slate-700">S00014658CORE_CD</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            1 selected
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
            Group Based Cost
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Sum of DERIVED MATERIAL GROSS COST Landed cost [INR]
          </h3>
          <button className="flex items-center gap-2 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Placeholder for the actual comparison data/chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm text-slate-500">BOM 1 Total Cost</span>
              <span className="text-xl font-bold text-slate-900">₹ 14,250,000</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[85%] rounded-full" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm text-slate-500">BOM 2 Total Cost</span>
              <span className="text-xl font-bold text-slate-900">₹ 16,800,000</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-400 w-full rounded-full" />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded font-medium">+17.9%</span>
            <span className="text-slate-500 font-medium">Cost variance detected in raw material group</span>
          </div>
        </div>
      </div>
    </div>
  );
};
