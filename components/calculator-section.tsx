'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Columns, 
  Square, 
  Palette, 
  ArrowRight, 
  Check, 
  Plus, 
  Trash2, 
  Search,
  Layers,
  Upload,
  Moon,
  Sun,
  Maximize2,
  Info,
  ChevronDown,
  Printer,
  Download,
  X,
  PlusCircle,
  HelpCircle,
  FileText,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useCart } from '@/contexts/cart-context';

// --- Theme & Mock Data ---
const MOCK_PRODUCTS = [
  { id: 1, name: "Marble Elegance", category: "Floor", price: 450, size: "600x600", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=80" },
  { id: 2, name: "Slate Grey", category: "Outdoor", price: 320, size: "300x600", image: "https://images.unsplash.com/photo-1590274853856-f22d5ee3d228?w=600&q=80" },
];

const ROOM_TYPES = ["Bathroom", "Kitchen", "Living Room", "Bedroom", "Outdoor", "Commercial"];
const SPACE_TYPES = ["Floor", "Wall", "Backsplash", "Shower", "Feature Wall"];
const TILE_PRESETS = [
  { label: "300x300 mm", w: 300, l: 300 },
  { label: "600x600 mm", w: 600, l: 600 },
  { label: "600x1200 mm", w: 600, l: 1200 },
  { label: "Custom", w: 0, l: 0 }
];

// --- Minimalist Components ---
type SectionTitleProps = { children: React.ReactNode; subtitle?: string };
const SectionTitle = ({ children, subtitle }: SectionTitleProps) => (
  <div className="mb-12">
    <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-black dark:text-white mb-4">
      {children}
    </h2>
    {subtitle && <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl font-light italic">{subtitle}</p>}
  </div>
);

type MinimalCardProps = { children: React.ReactNode; className?: string; noPadding?: boolean };
const MinimalCard = ({ children, className = "", noPadding = false }: MinimalCardProps) => (
  <div className={`bg-white dark:bg-black border border-slate-200 dark:border-white/10 ${noPadding ? '' : 'p-8'} transition-colors duration-500 ${className}`}>
    {children}
  </div>
);

type AnimatedCounterProps = { value: number|string; suffix?: string; decimals?: number };
const AnimatedCounter = ({ value, suffix = "", decimals = 0 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(String(value)) || 0;
    const timer = setInterval(() => {
      start += (end - start) * 0.2;
      if (Math.abs(end - start) < 0.01) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
};

// --- Professional Tile Calculator Component ---

const TileCalculatorPro = () => {
  const { items: cartItems } = useCart();
  // Area State (Multi-room support)
  const [rooms, setRooms] = useState([{ id: 1, name: 'Living Room', length: 5, width: 4, unit: 'Feet' }]);
  const [cuttings, setCuttings] = useState<{id: number; name: string; area: number}[]>([]);
  // Tile selection state
  const tileOptions = cartItems.length > 0 ? cartItems : MOCK_PRODUCTS;
  const [selectedTileId, setSelectedTileId] = useState(tileOptions[0]?.id || '');
  const selectedTile = tileOptions.find(t => t.id === selectedTileId) || tileOptions[0];

  // Configuration State (Matching Requested Naming)
  const [roomType, setRoomType] = useState<string>(ROOM_TYPES[0]);
  const [spaceType, setSpaceType] = useState<string>(SPACE_TYPES[0]);
  const [tilePreset, setTilePreset] = useState<{label: string; w: number; l: number}>(TILE_PRESETS[1]);
  const [customWidth, setCustomWidth] = useState<string>('600');
  const [customLength, setCustomLength] = useState<string>('600');
  const [waste, setWaste] = useState<string>('10');
  const [skirting, setSkirting] = useState<string>('5');

  // Cutting modal state
  const [showCuttingModal, setShowCuttingModal] = useState(false);
  const [newCuttingArea, setNewCuttingArea] = useState('');
  const [newCuttingName, setNewCuttingName] = useState('Opening');

  const addRoom = () => setRooms([...rooms, { id: Date.now(), name: `Area ${rooms.length + 1}`, length: 0, width: 0, unit: 'Feet' }]);
  const removeRoom = (id: number) => rooms.length > 1 && setRooms(rooms.filter(r => r.id !== id));
  
  // Add cutting with user input
  const addCutting = () => setShowCuttingModal(true);
  const confirmAddCutting = () => {
    const area = parseFloat(newCuttingArea);
    if (!isNaN(area) && area > 0) {
      setCuttings([...cuttings, { id: Date.now(), name: newCuttingName, area }]);
      setShowCuttingModal(false);
      setNewCuttingArea('');
      setNewCuttingName('Opening');
    }
  };
  const removeCutting = (id: number) => setCuttings(cuttings.filter(c => c.id !== id));
  const updateCuttingArea = (id: number, value: string) => {
    setCuttings(cuttings.map(c => c.id === id ? { ...c, area: parseFloat(value) || 0 } : c));
  };
  const updateCuttingName = (id: number, value: string) => {
    setCuttings(cuttings.map(c => c.id === id ? { ...c, name: value } : c));
  };

  const updateRoom = (id: number, field: string, value: string) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const results = useMemo(() => {
    // 1. Calculate Gross Area in Sq Ft
    const totalAreaSqFt = rooms.reduce((acc, curr) => {
      const l = parseFloat(String(curr.length)) || 0;
      const w = parseFloat(String(curr.width)) || 0;
      // Note: In a full version, we'd convert units here if curr.unit === 'Meters'
      const area = curr.unit === 'Meters' ? (l * w) * 10.764 : (l * w);
      return acc + area;
    }, 0);

    // 2. Subtract Cuttings
    const totalCuttings = cuttings.reduce((acc, curr) => acc + (parseFloat(String(curr.area)) || 0), 0);
    const netAreaSqFt = Math.max(0, totalAreaSqFt - totalCuttings);
    const netAreaSqM = netAreaSqFt / 10.764;

    // 3. Tile Size Calculation (mm to m)
    let tL, tW;
    if (tilePreset.label === 'Custom') {
      tL = (parseFloat(customLength) || 0) / 1000;
      tW = (parseFloat(customWidth) || 0) / 1000;
    } else {
      tL = tilePreset.l / 1000;
      tW = tilePreset.w / 1000;
    }
    const tileAreaSqM = (tL * tW) || 1;

    // 4. Quantity with Reserve (Wastage + Skirting)
    const baseTiles = Math.ceil(netAreaSqM / tileAreaSqM);
    const wasteTiles = Math.ceil(baseTiles * ((parseFloat(waste) || 0) / 100));
    const skirtingTiles = Math.ceil(baseTiles * ((parseFloat(skirting) || 0) / 100));
    const totalTilesRequired = baseTiles + wasteTiles + skirtingTiles;

    // 5. Financials
    const tileCost = totalTilesRequired * (selectedTile?.price || 0);
    return { netAreaSqFt, netAreaSqM, baseTiles, totalTilesRequired, tileCost, totalCuttings };
  }, [rooms, cuttings, tilePreset, customLength, customWidth, waste, skirting, selectedTile]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative overflow-hidden" style={{minHeight:'100%'}}>
      {/* Subtle gradient/texture background for calculator zone */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Soft gold/blue gradient and faint marble texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc] via-[#e9e4d5]/70 to-[#dbeafe]/60 dark:from-[#18181b] dark:via-[#23232a]/80 dark:to-[#1e293b]/70" style={{mixBlendMode:'soft-light'}} />
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'url("https://www.transparenttextures.com/patterns/marble.png")', backgroundSize:'400px 400px', mixBlendMode:'overlay'}} />
      </div>
      {/* Input Workspace */}
      <div className="lg:col-span-7 space-y-16 relative z-10">
        
        {/* Step 1: Context */}
        <section className="space-y-8">
          <SectionTitle subtitle="Define your project scope and architectural context.">Room / Space Type</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Room Type *</label>
              <select 
                className="w-full bg-transparent border-b border-slate-300 dark:border-white/20 py-4 font-serif text-xl outline-none focus:border-black dark:focus:border-white transition-all appearance-none"
                value={roomType}
                onChange={e => setRoomType(e.target.value)}
              >
                {ROOM_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Space Type *</label>
              <select 
                className="w-full bg-transparent border-b border-slate-300 dark:border-white/20 py-4 font-serif text-xl outline-none focus:border-black dark:focus:border-white transition-all appearance-none"
                value={spaceType}
                onChange={e => setSpaceType(e.target.value)}
              >
                {SPACE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Step 2: Area Geometry */}
        <section className="space-y-8">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Area to be Covered</h3>
          {rooms.map((room, idx) => (
            <div key={room.id} className="relative bg-gradient-to-br from-white/90 via-[#f7f6f3]/80 to-[#e0e7ef]/70 dark:from-[#23232a]/80 dark:via-[#18181b]/90 dark:to-[#1e293b]/80 border border-slate-200 dark:border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-lg ring-1 ring-[#e5c990]/10">
              <div className="flex-1 flex flex-col gap-2 relative">
                {/* Floating Area Name Label with premium accent */}
                <span className="absolute -top-5 left-0 z-10 px-5 py-2 rounded-full bg-gradient-to-r from-[#f7e9c4]/80 via-white/90 to-[#e0e7ef]/80 dark:from-[#23232a]/80 dark:via-[#18181b]/90 dark:to-[#1e293b]/80 text-[#bfa14a] dark:text-[#e5c990] text-xs font-bold shadow-md border border-[#e5c990]/30 dark:border-[#bfa14a]/30 pointer-events-none select-none transition-all" style={{backdropFilter:'blur(4px)'}}>
                  AREA NAME
                </span>
                <input
                  id={`room-name-${room.id}`}
                  type="text"
                  value={room.name}
                  onChange={e => updateRoom(room.id, 'name', e.target.value)}
                  className="w-full bg-transparent border-b border-[#e5c990]/40 dark:border-[#bfa14a]/30 py-2 font-serif text-2xl outline-none placeholder:text-slate-400 mt-2 focus:border-[#bfa14a] dark:focus:border-[#e5c990]"
                  placeholder="e.g. Living Room"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 mb-1 ml-1" htmlFor={`room-length-${room.id}`}>Length</label>
                <input
                  id={`room-length-${room.id}`}
                  type="number"
                  value={room.length}
                  onChange={e => updateRoom(room.id, 'length', e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 py-2 font-serif text-2xl outline-none"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 mb-1 ml-1" htmlFor={`room-width-${room.id}`}>Width</label>
                <input
                  id={`room-width-${room.id}`}
                  type="number"
                  value={room.width}
                  onChange={e => updateRoom(room.id, 'width', e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 py-2 font-serif text-2xl outline-none"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 mb-1 ml-1" htmlFor={`room-unit-${room.id}`}>Unit</label>
                <select
                  id={`room-unit-${room.id}`}
                  value={room.unit}
                  onChange={e => updateRoom(room.id, 'unit', e.target.value)}
                  className="w-full bg-transparent border-b border-slate-300 py-2 font-serif text-2xl outline-none appearance-none pr-8"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="Feet">Feet</option>
                  <option value="Meters">Meters</option>
                </select>
              </div>
              {rooms.length > 1 && (
                <button onClick={() => removeRoom(room.id)} className="absolute top-4 right-4 text-xs text-slate-400 hover:text-red-500 font-bold">Remove</button>
              )}
            </div>
          ))}
          <button onClick={addRoom} className="mt-2 text-xs font-bold flex items-center gap-1 hover:underline"><Plus size={14} /> Add More Area</button>
        </section>

        {/* Step 3: Tile Specifications */}
        <section className="space-y-8">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Tile Selection & Size</h3>
          <div className="space-y-8">
            <label className="text-xs font-bold text-slate-400 mb-1 ml-1" htmlFor="tile-select">Select Tile from Cart</label>
            <div className="relative">
              <select
                id="tile-select"
                value={selectedTileId}
                onChange={e => setSelectedTileId(Number(e.target.value))}
                className="w-full bg-gradient-to-br from-slate-900/80 to-slate-800/60 dark:from-white/5 dark:to-white/0 border border-slate-200 dark:border-white/10 rounded-2xl p-6 pl-24 font-serif text-2xl outline-none appearance-none pr-8"
                style={{ backgroundImage: 'none' }}
              >
                {tileOptions.length === 0 ? (
                  <option value="">No tiles in cart</option>
                ) : (
                  tileOptions.map(tile => (
                    <option key={tile.id} value={tile.id}>
                      {tile.name}
                      {('size' in tile && tile.size) ? ` (${tile.size})` : ''} - ₹{tile.price} / unit
                    </option>
                  ))
                )}
              </select>
              {selectedTile && (
                <img src={selectedTile.image} alt={selectedTile.name} className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 object-cover rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black" />
              )}
            </div>
          </div>
        </section>

        {/* Step 4: Settings */}
        <section className="space-y-8">
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Additional Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Waste & Reserve (%)</label>
              <input type="number" value={waste} onChange={e => setWaste(e.target.value)} className="w-full bg-transparent border-b border-slate-300 py-2 font-serif text-2xl outline-none" />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Skirting Addition (%)</label>
              <input type="number" value={skirting} onChange={e => setSkirting(e.target.value)} className="w-full bg-transparent border-b border-slate-300 py-2 font-serif text-2xl outline-none" />
            </div>
          </div>
        </section>

        {/* Step 5: Cuttings */}
        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Cuttings & Deductions</h3>
            <button onClick={addCutting} className="text-xs font-bold flex items-center gap-1 hover:underline"><Plus size={14} /> Add Cutting</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {cuttings.length === 0 ? (
               <div className="col-span-2 py-8 border border-dashed border-slate-200 dark:border-white/10 text-center text-xs opacity-40 uppercase tracking-widest">No cuttings added</div>
             ) : (
               cuttings.map(c => (
                 <div key={c.id} className="p-4 border border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/30 dark:bg-white/5 rounded-lg">
                   <div>
                     <input 
                       type="text" 
                       value={c.name} 
                       onChange={e => updateCuttingName(c.id, e.target.value)}
                       className="text-[10px] font-bold opacity-60 uppercase bg-transparent border-b border-slate-200 dark:border-white/10 mb-1 outline-none w-24" 
                       style={{fontSize:'11px'}}
                     />
                     <input 
                       type="number" 
                       value={c.area} 
                       onChange={e => updateCuttingArea(c.id, e.target.value)}
                       className="font-serif bg-transparent border-b border-slate-200 dark:border-white/10 outline-none w-20" 
                       style={{fontSize:'15px'}}
                     /> <span className="text-xs opacity-50">sq.ft</span>
                   </div>
                   <button onClick={() => removeCutting(c.id)} className="text-slate-300 hover:text-red-500"><X size={14} /></button>
                 </div>
               ))
             )}
          </div>
          {/* Cutting Modal */}
          {showCuttingModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-black p-8 rounded-xl shadow-xl w-full max-w-xs space-y-6 border border-slate-200 dark:border-white/10">
                <h4 className="text-lg font-serif mb-2">Add Cutting</h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-60">Cutting Name</label>
                  <input type="text" value={newCuttingName} onChange={e => setNewCuttingName(e.target.value)} className="w-full border-b border-slate-200 dark:border-white/10 bg-transparent py-2 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold opacity-60">Area (sq.ft)</label>
                  <input type="number" value={newCuttingArea} onChange={e => setNewCuttingArea(e.target.value)} className="w-full border-b border-slate-200 dark:border-white/10 bg-transparent py-2 outline-none" />
                </div>
                <div className="flex gap-4 mt-4">
                  <button onClick={confirmAddCutting} className="flex-1 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-bold">Add</button>
                  <button onClick={()=>setShowCuttingModal(false)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-black dark:text-white rounded-lg font-bold">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Cutting Modal */}
        {showCuttingModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white dark:bg-black rounded-lg shadow-lg p-6 max-w-sm w-full"
            >
              <h3 className="text-lg font-serif mb-4">Add Cutting / Opening</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 block mb-2">Name</label>
                  <input 
                    type="text" 
                    value={newCuttingName} 
                    onChange={e => setNewCuttingName(e.target.value)}
                    className="w-full bg-transparent border-b border-slate-300 py-2 font-serif text-xl outline-none" 
                    placeholder="Opening"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 block mb-2">Area (sq ft)</label>
                  <input 
                    type="number" 
                    value={newCuttingArea} 
                    onChange={e => setNewCuttingArea(e.target.value)}
                    className="w-full bg-transparent border-b border-slate-300 py-2 font-serif text-xl outline-none" 
                    placeholder="1.5"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button 
                  onClick={() => setShowCuttingModal(false)} 
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmAddCutting} 
                  className="px-4 py-2 text-sm font-bold bg-black text-white rounded-lg hover:scale-105 transition-transform"
                >
                  Add Cutting
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Sticky Report Panel */}
      <div className="lg:col-span-5">
        <div className="sticky top-12 space-y-8">
          <MinimalCard className="border-l-4 border-l-black dark:border-l-white">
            <div className="flex justify-between items-start mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400 mb-2">Project Estimate</p>
                <h3 className="text-4xl font-serif">Bill of Materials</h3>
              </div>
              <button className="p-3 bg-black text-white dark:bg-white dark:text-black rounded-full hover:scale-110 transition-transform">
                <Printer size={18} />
              </button>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/10 pb-6">
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Net Coverage Area</span>
                <span className="text-4xl font-serif"><AnimatedCounter value={results.netAreaSqFt} decimals={1} /> <span className="text-sm italic">sq ft</span></span>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="opacity-50">Base Tile Requirement</span>
                    <span className="font-serif font-bold"><AnimatedCounter value={results.baseTiles} /> pcs</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="opacity-50">Reserve (Wastage + Skirting)</span>
                    <span className="font-serif"><AnimatedCounter value={results.totalTilesRequired - results.baseTiles} /> pcs</span>
                 </div>
                 <div className="flex justify-between text-sm pt-4 border-t border-slate-50 dark:border-white/5">
                    <span className="font-bold">Total Requirement</span>
                    <span className="text-2xl font-serif font-bold underline decoration-1 underline-offset-8 decoration-slate-300">
                      <AnimatedCounter value={results.totalTilesRequired} /> <span className="text-xs">Units</span>
                    </span>
                 </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 p-8 mt-12">
                 <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-2">Estimated Investment</p>
                 <p className="text-6xl font-serif tracking-tighter">₹<AnimatedCounter value={results.tileCost} /></p>
                 <div className="mt-4 flex gap-4 text-[10px] font-bold opacity-30 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Layers size={10} /> {results.netAreaSqM.toFixed(1)} m²</span>
                    <span className="flex items-center gap-1"><Box size={10} /> ~{Math.ceil(results.totalTilesRequired/8)} Boxes</span>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-100 dark:border-white/10 pb-6">
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">Total Tiles Needed</span>
                  <span className="text-4xl font-serif font-bold"><AnimatedCounter value={results.totalTilesRequired} /> pcs</span>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-50 mb-1">Total Price</span>
                  <span className="text-4xl font-serif font-bold">₹<AnimatedCounter value={results.tileCost} /></span>
                </div>
              </div>

              <button className="w-full py-5 bg-black text-white dark:bg-white dark:text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-slate-800 transition-colors">
                Generate Detailed Estimate
              </button>
            </div>
          </MinimalCard>

          {/* Info Section */}
          <MinimalCard className="mt-8">
            <h3 className="text-lg font-serif mb-4">How to Use</h3>
            <ol className="list-decimal list-inside mb-4 text-sm font-light space-y-2 opacity-70">
              <li>Select room and space types for context.</li>
              <li>Add multiple areas if covering multiple floors or rooms.</li>
              <li>Input tile dimensions and custom reserve settings.</li>
              <li>Add cuttings for fixed cabinetry or architectural obstacles.</li>
            </ol>
            <p className="text-xs text-slate-500 italic">Need structural assistance? Contact our engineering team.</p>
          </MinimalCard>
        </div>
      </div>
    </div>
  );
};

const ProductCompare = () => {
  const [selectedIds, setSelectedIds] = useState([1, 2]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-white/10 border border-slate-200 dark:border-white/10">
        {MOCK_PRODUCTS.map(product => (
          <div 
            key={product.id}
            onClick={() => !selectedIds.includes(product.id) && selectedIds.length < 3 && setSelectedIds([...selectedIds, product.id])}
            className={`group relative bg-white dark:bg-black p-6 cursor-pointer transition-all ${selectedIds.includes(product.id) ? 'opacity-40 grayscale pointer-events-none' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
          >
            <img src={product.image} className="w-full aspect-square object-cover mb-4" />
            <h4 className="font-serif text-lg">{product.name}</h4>
            <p className="text-xs tracking-widest uppercase text-slate-400 mt-1">₹{product.price} / m²</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {MOCK_PRODUCTS.filter(p => selectedIds.includes(p.id)).map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <MinimalCard noPadding className="relative overflow-hidden group">
                <button 
                  onClick={() => setSelectedIds(selectedIds.filter(id => id !== product.id))}
                  className="absolute top-4 right-4 z-10 p-2 bg-black text-white dark:bg-white dark:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="aspect-[4/5]">
                  <img src={product.image} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-400">Selection {idx + 1}</span>
                      <h4 className="text-2xl font-serif mt-1">{product.name}</h4>
                    </div>
                  </div>
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="opacity-50">Base Price</span>
                      <span className="font-serif">₹{product.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-50">Dimensions</span>
                      <span className="font-serif">{product.size} mm</span>
                    </div>
                  </div>
                </div>
              </MinimalCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const { theme, setTheme } = useTheme();

  const tabs = [
    { id: 'calculator', name: 'Calculator', icon: Calculator, subtitle: 'Site-engineer grade accuracy for real-world projects.' },
    { id: 'compare', name: 'Compare', icon: Columns, subtitle: 'Architectural selection for visual excellence.' },
    { id: 'estimator', name: 'Estimator', icon: Square, subtitle: 'Macro-spatial planning and area modeling.' },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 font-sans p-6 md:p-12 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Nav */}
        <nav className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-24 border-b border-slate-100 dark:border-white/5 pb-12">
          <div className="space-y-1">
            <h1 className="text-3xl font-serif tracking-tighter">Hotle Tile Studio</h1>
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-400">Professional Engineering Suite</p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex gap-1 bg-slate-50 dark:bg-white/5 p-1 rounded-full overflow-x-auto no-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all flex-shrink-0 ${activeTab === tab.id ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-slate-400 hover:text-black dark:hover:text-white'}`}
                >
                  {tab.id}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-3 border border-slate-200 dark:border-white/20 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </nav>

        {/* Content Section */}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Remove calculator heading: do not render SectionTitle for calculator tab */}
              <div className="mt-12">
                {activeTab === 'calculator' && <TileCalculatorPro />}
                {activeTab === 'compare' && <><SectionTitle subtitle={currentTab?.subtitle ?? ''}>{currentTab?.name ?? ''}</SectionTitle><ProductCompare /></>}
                {activeTab === 'estimator' && <><SectionTitle subtitle={currentTab?.subtitle ?? ''}>{currentTab?.name ?? ''}</SectionTitle><div className="py-24 border border-dashed border-slate-200 dark:border-white/10 text-center uppercase tracking-[0.4em] text-xs opacity-40">Estimator Module Loading...</div></>}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Minimal Footer */}
        <footer className="mt-48 flex flex-col md:flex-row justify-between gap-12 border-t border-slate-100 dark:border-white/10 pt-12 pb-24">
          <div className="md:w-1/3">
            <h4 className="text-xl font-serif mb-4">Precision Engineering</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-light">Engineered to minimize waste and provide construction-ready documentation for commercial and residential tiling.</p>
          </div>
          <div className="flex gap-24">
             <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-6">Documentation</p>
                <ul className="space-y-2 text-sm">
                  <li className="hover:underline cursor-pointer">Project Planning</li>
                  <li className="hover:underline cursor-pointer">Technical Guides</li>
                </ul>
             </div>
             <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-6">Support</p>
                <ul className="space-y-2 text-sm">
                  <li className="hover:underline cursor-pointer">Calculation Audit</li>
                  <li className="hover:underline cursor-pointer">Material Sourcing</li>
                </ul>
             </div>
          </div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,900;1,6..96,400&family=Inter:wght@300;400;700;900&display=swap');
        
        :root {
          --font-serif: 'Bodoni Moda', serif;
          --font-sans: 'Inter', sans-serif;
        }

        .font-serif { font-family: var(--font-serif); }
        .font-sans { font-family: var(--font-sans); }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right center;
          background-size: 1.5em;
        }

        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
      `}</style>
    </div>
  );
}