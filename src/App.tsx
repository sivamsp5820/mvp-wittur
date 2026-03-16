import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Triangle } from 'lucide-react';
import { FileUploadCard } from './components/FileUploadCard';
import { ResultsSection } from './components/ResultsSection';
import { PriceList } from './components/PriceList';
import { cn } from './lib/utils';

type Tab = 'Home' | 'Configurator' | 'Cost Simulator' | 'BOM Comparison' | 'Price List';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('BOM Comparison');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleCompare = () => {
    if (!file1 || !file2) return;
    setIsComparing(true);
    // Simulate comparison delay
    setTimeout(() => {
      setIsComparing(false);
      setShowResults(true);
    }, 1500);
  };

  const isReadyToCompare = file1 !== null && file2 !== null;

  const renderContent = () => {
    switch (activeTab) {
      case 'BOM Comparison':
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <FileUploadCard 
                title="Upload BOM 1 Excel" 
                subtitle="COR CD 02C 700x20 FVP"
                onFileSelect={setFile1}
              />
              <FileUploadCard 
                title="Upload BOM 2 Excel" 
                subtitle="COR CD 02C 700x20 FVP"
                onFileSelect={setFile2}
              />
            </div>

            {/* Compare Button */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={handleCompare}
                disabled={!isReadyToCompare || isComparing}
                className={cn(
                  "px-12 py-4 rounded-full text-lg font-bold transition-all shadow-lg flex items-center gap-3",
                  isReadyToCompare 
                    ? "bg-primary text-white hover:bg-primary-hover hover:scale-105 active:scale-95" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                {isComparing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Comparing...
                  </>
                ) : (
                  'Compare'
                )}
              </button>
            </div>

            {/* Results Section */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <ResultsSection />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      case 'Price List':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PriceList />
          </motion.div>
        );
      default:
        return (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-bold text-slate-300">Section Under Development</h2>
            <p className="text-slate-400 mt-2">The {activeTab} module will be available soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
            <Triangle className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight hidden sm:inline-block">CORE TECH</span>
        </div>

        <div className="flex items-center gap-8 h-full">
          {['Home', 'Configurator', 'Cost Simulator', 'BOM Comparison', 'Price List'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item as Tab)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary h-full px-1 relative",
                activeTab === item ? "text-primary" : "text-slate-500"
              )}
            >
              {item}
              {activeTab === item && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors">
            <User className="w-4 h-4 text-slate-600" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-8 md:p-12">
        {activeTab !== 'Price List' && (
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              BOM Comparison Tool
            </h1>
          </header>
        )}

        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 text-center text-slate-400 text-xs">
        &copy; 2026 CORE TECH Manufacturing Systems. All rights reserved.
      </footer>
    </div>
  );
}
