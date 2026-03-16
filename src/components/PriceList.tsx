import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Download, Upload, MoreHorizontal, Filter, Info, Loader2 } from 'lucide-react';
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
  price: number;
}

const COLUMNS = [
  "S.No",
  "Item Code",
  "Product",
  "Type",
  "Opening",
  "Height",
  "Door",
  "Fire",
  "Panel",
  "Frame",
  "Finish",
  "Grade",
  "Price"
];

export const PriceList: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(CUSTOMERS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        const mockData: PriceItem[] = [
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

        setData(mockData);
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

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-light text-slate-900 tracking-tight">Price Management</h2>
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
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className={cn("text-xl font-light tracking-tight", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[400px] relative">
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
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/20">
                <Upload className="w-3.5 h-3.5" />
                Upload Data
              </button>
            )}
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all">
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
                <tr className="border-b border-slate-50">
                  {COLUMNS.map((col, idx) => (
                    <th 
                      key={idx} 
                      className={cn(
                        "px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap",
                        col === 'Price' ? "text-right" : ""
                      )}
                    >
                      {col}
                    </th>
                  ))}
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredData.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5 text-sm font-medium text-slate-400">{item.id}</td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-bold text-slate-900 font-mono tracking-tight group-hover:text-blue-600 transition-colors">{item.code}</span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{item.product}</td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-full",
                        item.type === 'Standard' ? "text-blue-500 bg-blue-50" : item.type === 'Premium' ? "text-amber-500 bg-amber-50" : "text-emerald-500 bg-emerald-50"
                      )}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">{item.opening}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{item.height}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{item.doorType}</td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded">
                        {item.fireRating}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-500">{item.panelType}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{item.frameSize}</td>
                    <td className="px-6 py-5 text-sm text-slate-500">{item.finish}</td>
                    <td className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.grade}</td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-base font-bold text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="p-1.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all text-slate-300 hover:text-slate-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
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
