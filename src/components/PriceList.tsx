import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, Search, Download, Upload, MoreHorizontal, Filter, Info, Loader2, GripVertical, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const CUSTOMERS = ['Independent', 'Otis', 'Kone', 'TKEI', 'Mitsubishi', 'Schindler'];

interface PriceItem {
  id: number;
  code: string;
  product: string;
  type: string;
  opening: string;
  height: string;
  doorType: string;
  fireRating: string;
  panelType: string;
  frameSize: string;
  finish: string;
  grade: string;
}

interface PriceVersion {
  id: string;
  date: Date;
  prices: Record<number, number>; // PriceItem id -> price
}

const COLUMNS = [
  "S.No",
  "Item Code",
  "Product",
  "Type",
  "Clear Opening",
  "Clear Height",
  "Door type",
  "Fire rated code",
  "Panel Type",
  "Frame Size",
  "Finish",
  "Grade",
  "Price"
];

const PINNED_COLUMNS = ["S.No", "Item Code", "Price"];

export const PriceList: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMERS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<PriceItem[]>([]);
  const [versions, setVersions] = useState<PriceVersion[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedYears, setExpandedYears] = useState<number[]>([]);
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(PINNED_COLUMNS);
  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
  const [isPriceHistoryOpen, setIsPriceHistoryOpen] = useState(false);

  /**
   * HOW TO MAP AN API CALL TO THIS TABLE:
   * 
   * 1. Define your data interface (PriceItem) to match your API response.
   * 2. Use the useEffect hook to trigger the fetch whenever the customer changes.
   * 3. Map the API response fields to the PriceItem fields if they differ.
   */
  useEffect(() => {
    const fetchPricing = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // --- REAL API EXAMPLE ---
        // const response = await fetch(`https://your-api.com/prices?customer=${selectedCustomer}`);
        // if (!response.ok) throw new Error('Network response was not ok');
        // const result = await response.json();

        // --- MAPPING LOGIC ---
        // If your API returns: { item_id: 1, sku: "ABC", ... }
        // You would map it like this:
        // const mappedData = result.map((item: any) => ({
        //   id: item.item_id,
        //   code: item.sku,
        //   product: item.name,
        //   ...
        // }));
        // setData(mappedData);

        // --- SIMULATED API CALL ---
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate latency

        const mockData = [
          { id: 1, code: "E.COM.700.2000.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "700mm", height: "2000mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 18500 },
          { id: 2, code: "E.COM.800.2000.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "800mm", height: "2000mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 19200 },
          { id: 3, code: "E.COM.900.2000.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "900mm", height: "2000mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 21000 },
          { id: 4, code: "E.COM.1000.2000.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "1000mm", height: "2000mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "120mm", finish: "Powder Coated", grade: "Grade A", price: 22500 },
          { id: 5, code: "E.COM.700.2000.L2T.E120.PF", product: "Telescopic Door", type: "Premium", opening: "700mm", height: "2000mm", doorType: "L2T", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade B+", price: 24000 },
          { id: 6, code: "E.COM.800.2000.L2T.E120.PF", product: "Telescopic Door", type: "Premium", opening: "800mm", height: "2000mm", doorType: "L2T", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade B+", price: 25500 },
          { id: 7, code: "E.COM.900.2000.L2T.E120.PF", product: "Telescopic Door", type: "Premium", opening: "900mm", height: "2000mm", doorType: "L2T", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade B+", price: 27000 },
          { id: 8, code: "E.COM.1000.2000.L2T.E120.PF", product: "Telescopic Door", type: "Premium", opening: "1000mm", height: "2000mm", doorType: "L2T", fireRating: "E120", panelType: "PF", frameSize: "120mm", finish: "Powder Coated", grade: "Grade B+", price: 29500 },
          { id: 9, code: "E.EA.FRM.700.2000.L2C.90.PF", product: "Fire Rated Frame", type: "Safety", opening: "700mm", height: "2000mm", doorType: "L2C", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 12000 },
          { id: 10, code: "E.EA.FRM.800.2000.L2C.90.PF", product: "Fire Rated Frame", type: "Safety", opening: "800mm", height: "2000mm", doorType: "L2C", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 13500 },
          { id: 11, code: "E.EA.FRM.900.2000.L2C.90.PF", product: "Fire Rated Frame", type: "Safety", opening: "900mm", height: "2000mm", doorType: "L2C", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 14800 },
          { id: 12, code: "E.EA.FRM.1000.2000.L2C.90.PF", product: "Fire Rated Frame", type: "Safety", opening: "1000mm", height: "2000mm", doorType: "L2C", fireRating: "90 Min", panelType: "PF", frameSize: "180mm", finish: "Zinc Primed", grade: "Industrial", price: 16200 },
          { id: 13, code: "E.EA.FRM.700.2000.L2T.90.PF", product: "Telescopic Frame", type: "Safety", opening: "700mm", height: "2000mm", doorType: "L2T", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 18500 },
          { id: 14, code: "E.EA.FRM.800.2000.L2T.90.PF", product: "Telescopic Frame", type: "Safety", opening: "800mm", height: "2000mm", doorType: "L2T", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 19800 },
          { id: 15, code: "E.EA.FRM.900.2000.L2T.90.PF", product: "Telescopic Frame", type: "Safety", opening: "900mm", height: "2000mm", doorType: "L2T", fireRating: "90 Min", panelType: "PF", frameSize: "150mm", finish: "Zinc Primed", grade: "Industrial", price: 21500 },
          { id: 16, code: "E.EA.FRM.1000.2000.L2T.90.PF", product: "Telescopic Frame", type: "Safety", opening: "1000mm", height: "2000mm", doorType: "L2T", fireRating: "90 Min", panelType: "PF", frameSize: "180mm", finish: "Zinc Primed", grade: "Industrial", price: 23000 },
          { id: 17, code: "E.COM.700.2100.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "700mm", height: "2100mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 19500 },
          { id: 18, code: "E.COM.800.2100.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "800mm", height: "2100mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 20200 },
          { id: 19, code: "E.COM.900.2100.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "900mm", height: "2100mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "100mm", finish: "Powder Coated", grade: "Grade A", price: 22000 },
          { id: 20, code: "E.COM.1000.2100.L2C.E120.PF", product: "Commercial Door", type: "Standard", opening: "1000mm", height: "2100mm", doorType: "L2C", fireRating: "E120", panelType: "PF", frameSize: "120mm", finish: "Powder Coated", grade: "Grade A", price: 23500 }
        ];


        const mockItems: PriceItem[] = mockData.map(({ price, ...item }) => item);

        const mockVersions: PriceVersion[] = [
          {
            id: 'v1',
            date: new Date(2026, 0, 10),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.92 }), {})
          },
          {
            id: 'v2',
            date: new Date(2026, 2, 14),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.95 }), {})
          },
          {
            id: 'v3',
            date: new Date(2026, 2, 25),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.98 }), {})
          },
          {
            id: 'v4',
            date: new Date(2026, 3, 1),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price }), {})
          },
          {
            id: 'v5',
            date: new Date(2026, 3, 20),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 1.05 }), {})
          },
          {
            id: 'v2025-1',
            date: new Date(2025, 11, 15),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.88 }), {})
          },
          {
            id: 'v2025-2',
            date: new Date(2025, 10, 22),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.85 }), {})
          },
          {
            id: 'v2025-3',
            date: new Date(2025, 9, 5),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.82 }), {})
          },
          {
            id: 'v2024-1',
            date: new Date(2024, 11, 1),
            prices: mockData.reduce((acc, item) => ({ ...acc, [item.id]: item.price * 0.75 }), {})
          }
        ].sort((a, b) => b.date.getTime() - a.date.getTime());

        setData(mockItems);
        setVersions(mockVersions);
        setSelectedVersionId(mockVersions[0].id);
      } catch (err) {
        setError('Failed to load pricing data. Please check your connection.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPricing();
  }, [selectedCustomer]);

  const filteredData = data.filter(item =>
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedVersion = versions.find(v => v.id === selectedVersionId);

  const groupedVersions = useMemo(() => {
    return versions.reduce((acc, v) => {
      const year = v.date.getFullYear();
      const month = v.date.toLocaleString('default', { month: 'long' });
      if (!acc[year]) acc[year] = {};
      if (!acc[year][month]) acc[year][month] = [];
      acc[year][month].push(v);
      return acc;
    }, {} as Record<number, Record<string, PriceVersion[]>>);
  }, [versions]);

  const toggleYear = (year: number) => {
    setExpandedYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]);
  };

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => prev.includes(monthKey) ? prev.filter(m => m !== monthKey) : [...prev, monthKey]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate file processing
    const newDate = new Date();
    const newPriceVersion: PriceVersion = {
      id: `v-${Date.now()}`,
      date: newDate,
      prices: data.reduce((acc, item) => ({
        ...acc,
        [item.id]: (selectedVersion?.prices[item.id] || 0) * (1 + (Math.random() * 0.1 - 0.05))
      }), {})
    };

    setVersions(prev => [newPriceVersion, ...prev]);
    setSelectedVersionId(newPriceVersion.id);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto-expand latest on load
  useEffect(() => {
    if (versions.length > 0) {
      const latest = versions[0];
      setExpandedYears([latest.date.getFullYear()]);
      setExpandedMonths([`${latest.date.getFullYear()}-${latest.date.toLocaleString('default', { month: 'long' })}`]);
    }
  }, [versions.length]);

  return (
    <div className="max-w-full mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-light text-slate-900 tracking-tight">Price Book</h2>
          <p className="text-sm text-slate-500 font-medium">Manage and view pricing for all major partners.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Partner</span>
            <div className="relative">
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer min-w-[180px]"
              >
                {CUSTOMERS.map(customer => (
                  <option key={customer} value={customer}>{customer}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 md:flex-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search</span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Item code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-4 focus:ring-slate-100 w-full md:w-64 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Items', value: isLoading ? '...' : filteredData.length, color: 'text-slate-900' },
          { label: 'Avg. Price', value: isLoading ? '...' : '₹ 21,450', color: 'text-slate-900' },
          { label: 'Last Sync', value: '14 Mar 2026', color: 'text-emerald-600' },
          { label: 'Status', value: isLoading ? 'Syncing' : 'Live', color: isLoading ? 'text-slate-400' : 'text-blue-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className={cn("text-xl font-light tracking-tight", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[400px] relative">
        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-slate-800">{selectedCustomer} Catalog</h3>
            {!isLoading && (
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500">
                {filteredData.length} Results
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedCustomer === 'Independent' && (
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload Price List
                </button>
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => setIsColumnPickerOpen(!isColumnPickerOpen)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-xs font-bold transition-all active:scale-95",
                  isColumnPickerOpen ? "border-slate-900 text-slate-900 shadow-sm" : "border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300"
                )}
              >
                <MoreHorizontal className="w-4 h-4" />
                Columns
              </button>

              <AnimatePresence>
                {isColumnPickerOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsColumnPickerOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 p-2 overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-slate-50 mb-1 flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Toggle Columns</p>
                        <div className="flex gap-2">
                          {(() => {
                            const optionalCols = COLUMNS.filter(col => !PINNED_COLUMNS.includes(col));
                            const allSelected = optionalCols.every(col => visibleColumns.includes(col));
                            return (
                              <button
                                onClick={() => setVisibleColumns(allSelected ? PINNED_COLUMNS : COLUMNS)}
                                className="text-[9px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded transition-colors"
                              >
                                {allSelected ? 'Unselect All' : 'Select All'}
                              </button>
                            );
                          })()}
                          <button
                            onClick={() => setVisibleColumns(PINNED_COLUMNS)}
                            className="text-[9px] font-bold text-slate-500 hover:text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded transition-colors"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        {COLUMNS.filter(col => !PINNED_COLUMNS.includes(col)).map(col => {
                          const isVisible = visibleColumns.includes(col);
                          return (
                            <button
                              key={col}
                              onClick={() => {
                                setVisibleColumns(prev =>
                                  isVisible ? prev.filter(c => c !== col) : [...prev, col]
                                );
                              }}
                              className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors",
                                isVisible ? "bg-slate-50 text-slate-900" : "text-slate-500 hover:bg-slate-50/50"
                              )}
                            >
                              {col}
                              <div className={cn(
                                "w-3.5 h-3.5 rounded border transition-all flex items-center justify-center",
                                isVisible ? "bg-slate-900 border-slate-900" : "border-slate-300"
                              )}>
                                {isVisible && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-sm font-medium text-slate-500">Fetching latest pricing...</p>
          </div>
        ) : error ? (
          <div className="py-24 text-center">
            <p className="text-sm font-medium text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-xs font-bold text-slate-900 underline underline-offset-4"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 h-10">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {COLUMNS.map((col) => {
                      if (!visibleColumns.includes(col)) return null;
                      return (
                        <motion.th
                          key={col}
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className={cn(
                            "px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap",
                            col === 'Price' ? "text-right z-30" : "overflow-hidden"
                          )}
                        >
                          {col === 'Price' ? (
                            <div className="relative inline-block text-right">
                              <button
                                onClick={() => setIsPriceHistoryOpen(!isPriceHistoryOpen)}
                                className={cn(
                                  "flex items-center gap-1.5 transition-colors ml-auto px-2 py-1 rounded-md",
                                  isPriceHistoryOpen ? "text-blue-600 bg-blue-50" : "hover:text-slate-600"
                                )}
                              >
                                Price
                                <ChevronDown className={cn("w-3 h-3 transition-transform", isPriceHistoryOpen && "rotate-180")} />
                              </button>

                              <AnimatePresence>
                                {isPriceHistoryOpen && (
                                  <>
                                    <div className="fixed inset-0 z-30" onClick={() => setIsPriceHistoryOpen(false)} />
                                    <motion.div
                                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                      drag
                                      dragMomentum={false}
                                      className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 overflow-hidden cursor-default"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-slate-100/50 transition-colors">
                                        <div className="flex items-center gap-2">
                                          <GripVertical className="w-3 h-3 text-slate-400" />
                                          <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Version History</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-[9px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm italic">Draggable</span>
                                          <button
                                            onClick={() => setIsPriceHistoryOpen(false)}
                                            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                                          >
                                            <span className="sr-only">Close</span>
                                            <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                      <div className="max-h-[400px] overflow-y-auto p-2 space-y-3">
                                        {Object.entries(groupedVersions).sort(([y1], [y2]) => Number(y2) - Number(y1)).map(([year, months]) => {
                                          const isYearExpanded = expandedYears.includes(Number(year));
                                          return (
                                            <div key={year} className="bg-slate-50/30 rounded-lg overflow-hidden border border-transparent hover:border-slate-100 transition-all">
                                              <button
                                                onClick={() => toggleYear(Number(year))}
                                                className="w-full flex items-center justify-between pl-4 pr-3 py-2.5 text-xs font-bold text-slate-800 hover:text-slate-950 transition-colors"
                                              >
                                                <span className="flex items-center gap-2">
                                                  <ChevronRight className={cn("w-3 h-3 text-slate-400 transition-transform", isYearExpanded && "rotate-90")} />
                                                  {year}
                                                </span>
                                                <span className="text-[9px] text-slate-400 font-bold bg-white px-1 rounded border border-slate-100">
                                                  {Object.values(months).flat().length} Versions
                                                </span>
                                              </button>

                                              <AnimatePresence>
                                                {isYearExpanded && (
                                                  <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: "auto" }}
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden bg-white/50"
                                                  >
                                                    <div className="px-1 pb-1 space-y-1.5">
                                                      {Object.entries(months).map(([month, MonthVersions]) => {
                                                        const monthKey = `${year}-${month}`;
                                                        const isMonthExpanded = expandedMonths.includes(monthKey);
                                                        return (
                                                          <div key={month} className="rounded-lg overflow-hidden border border-slate-50">
                                                            <button
                                                              onClick={() => toggleMonth(monthKey)}
                                                              className="w-full flex items-center justify-between pl-12 pr-3 py-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-800 hover:bg-slate-50/50 transition-colors"
                                                            >
                                                              <span className="flex items-center gap-1.5">
                                                                <ChevronRight className={cn("w-2.5 h-2.5 text-slate-400 transition-transform", isMonthExpanded && "rotate-90")} />
                                                                {month}
                                                              </span>
                                                            </button>

                                                            <AnimatePresence>
                                                              {isMonthExpanded && (
                                                                <motion.div
                                                                  initial={{ height: 0 }}
                                                                  animate={{ height: "auto" }}
                                                                  exit={{ height: 0 }}
                                                                  className="overflow-hidden"
                                                                >
                                                                  <div className="p-1 space-y-1">
                                                                    {MonthVersions.map((v) => (
                                                                      <button
                                                                        key={v.id}
                                                                        onClick={() => {
                                                                          setSelectedVersionId(v.id);
                                                                          setIsPriceHistoryOpen(false);
                                                                        }}
                                                                        className={cn(
                                                                          "w-full text-left pl-20 pr-3 py-2 rounded-lg text-xs transition-all relative group",
                                                                          selectedVersionId === v.id
                                                                            ? "bg-slate-900 text-white font-bold shadow-md shadow-slate-200"
                                                                            : "text-slate-800 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100"
                                                                        )}
                                                                      >
                                                                        <div className="flex items-center justify-between">
                                                                          <span>{v.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                                                          {selectedVersionId === v.id && (
                                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                                                          )}
                                                                        </div>
                                                                      </button>
                                                                    ))}
                                                                  </div>
                                                                </motion.div>
                                                              )}
                                                            </AnimatePresence>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            col
                          )}
                        </motion.th>
                      );
                    })}
                  </AnimatePresence>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors h-14">
                    <AnimatePresence mode="popLayout" initial={false}>
                      {COLUMNS.map((col) => {
                        if (!visibleColumns.includes(col)) return null;
                        return (
                          <motion.td
                            key={`${item.id}-${col}`}
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className={cn(
                              "px-6 py-3 whitespace-nowrap overflow-hidden",
                              col === 'Price' ? "text-right" : ""
                            )}
                          >
                            {(() => {
                              switch (col) {
                                case 'S.No': return <span className="text-sm font-medium text-slate-400">{item.id}</span>;
                                case 'Item Code': return (
                                  <span className="text-sm font-bold text-slate-900 font-mono tracking-tight group-hover:text-blue-600 transition-colors">
                                    {item.code}
                                  </span>
                                );
                                case 'Product': return <span className="text-sm text-slate-500">{item.product}</span>;
                                case 'Type': return <span className="text-sm text-slate-500">{item.type}</span>;
                                case 'Clear Opening': return <span className="text-sm text-slate-500">{item.opening}</span>;
                                case 'Clear Height': return <span className="text-sm text-slate-500">{item.height}</span>;
                                case 'Door type': return <span className="text-sm text-slate-500">{item.doorType}</span>;
                                case 'Fire rated code': return (
                                  <span className="text-xs font-bold text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
                                    {item.fireRating}
                                  </span>
                                );
                                case 'Panel Type': return <span className="text-sm text-slate-500">{item.panelType}</span>;
                                case 'Frame Size': return <span className="text-sm text-slate-500">{item.frameSize}</span>;
                                case 'Finish': return <span className="text-sm text-slate-500">{item.finish}</span>;
                                case 'Grade': return <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.grade}</span>;
                                case 'Price': return (
                                  <div className="flex flex-col items-end">
                                    <span className="text-base font-bold text-slate-900">
                                      ₹{((selectedVersion?.prices[item.id] || 0)).toLocaleString('en-IN')}
                                    </span>
                                    {selectedVersion && (
                                      <p className="inline-block text-[10px] text-blue-700 font-bold mt-1 px-1.5 py-0.5 bg-blue-50/70 rounded-md border border-blue-100/50">
                                        as of {selectedVersion.date.toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: 'short',
                                          year: selectedVersion.date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric'
                                        })}
                                      </p>
                                    )}
                                  </div>
                                );
                                default: return null;
                              }
                            })()}
                          </motion.td>
                        );
                      })}
                    </AnimatePresence>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredData.length === 0 && !error && (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-4">
              <Search className="w-6 h-6 text-slate-300" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">No matches found</h4>
            <p className="text-xs text-slate-500 mt-1">Try refining your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};
