export const CUSTOMERS = ['Independent', 'Otis', 'Kone', 'TKEI', 'Mitsubishi', 'Schindler'];

export const COLUMNS = [
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

export const PINNED_COLUMNS = ["S.No", "Item Code", "Price"];

export const MOCK_PRICING_DATA = [
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

import mitsubishiMaterialData from './mitsubishiMaterialData.json';
import otisMaterialData from './otisMaterialData.json';

export const MITSUBISHI_MATERIAL_INDEXES = mitsubishiMaterialData.materials;
export const OTIS_MATERIAL_INDEXES = otisMaterialData.materials;

export const MITSUBISHI_REFERENCE_INDEX = mitsubishiMaterialData.referencePrices;
export const OTIS_REFERENCE_INDEX = otisMaterialData.referencePrices;

export const MITSUBISHI_DEFAULT_NEW_INDEX = mitsubishiMaterialData.defaultNewPrices;
export const OTIS_DEFAULT_NEW_INDEX = otisMaterialData.defaultNewPrices;

export const CENTER_OPENING_WEIGHTS = [
  { w: 700, c1: '39.19', c2: '32.21', c3: '8.39', c4: '14.5', c5: '6.98' },
  { w: 800, c1: '41.34', c2: '34.26', c3: '9.70', c4: '15.5', c5: '7.08' },
  { w: 900, c1: '43.49', c2: '36.31', c3: '11.01', c4: '16.6', c5: '7.18' },
  { w: 1000, c1: '45.64', c2: '38.36', c3: '12.33', c4: '17.6', c5: '7.28' },
  { w: 1100, c1: '', c2: '', c3: '', c4: '', c5: '' },
  { w: 1200, c1: '', c2: '', c3: '', c4: '', c5: '' },
];

export const TELESCOPIC_OPENING_WEIGHTS = [
  { w: 700, c1: '41.99', c2: '33.96', c3: '8.39', c4: '18.3', c5: '8.03' },
  { w: 800, c1: '44.14', c2: '36.01', c3: '9.70', c4: '18.9', c5: '8.13' },
  { w: 900, c1: '46.29', c2: '38.06', c3: '11.01', c4: '19.5', c5: '8.23' },
  { w: 1000, c1: '48.44', c2: '40.11', c3: '12.33', c4: '20.1', c5: '8.33' },
  { w: 1100, c1: '', c2: '', c3: '', c4: '', c5: '' },
  { w: 1200, c1: '', c2: '', c3: '', c4: '', c5: '' },
];

export const OTIS_CENTER_OPENING_WEIGHTS = [
  { w: 700, c1: '52.82', c2: '47.12', c3: '7.02', c4: '5.7' },
  { w: 800, c1: '56.66', c2: '50.86', c3: '8.04', c4: '5.8' },
  { w: 900, c1: '60.26', c2: '54.41', c3: '8.89', c4: '5.85' },
  { w: 1000, c1: '68.62', c2: '62.72', c3: '9.74', c4: '5.9' },
  { w: 1100, c1: '', c2: '', c3: '', c4: '' },
  { w: 1200, c1: '', c2: '', c3: '', c4: '' },
];

export const OTIS_TELESCOPIC_OPENING_WEIGHTS = [
  { w: 700, c1: '57.55', c2: '49.75', c3: '7.02', c4: '7.8' },
  { w: 800, c1: '61.22', c2: '53.19', c3: '8.04', c4: '8.03' },
  { w: 900, c1: '64.82', c2: '56.61', c3: '8.89', c4: '8.21' },
  { w: 1000, c1: '73.04', c2: '64.73', c3: '9.74', c4: '8.31' },
  { w: 1100, c1: '', c2: '', c3: '', c4: '' },
  { w: 1200, c1: '', c2: '', c3: '', c4: '' },
];

export const getMockVersions = (mockData) => {
  return [
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
};
