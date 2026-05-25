import React, { useState, useEffect, useMemo } from "react";
import { 
  Compass, ShieldCheck, MapPin, Languages, Phone, Wallet, 
  Bookmark, BookOpen, Trash2, Sparkles, Loader2, ChevronRight, 
  HelpCircle, Calendar, Plane, AlertTriangle, ArrowRight, Heart,
  Activity, CloudRain, Footprints, FileText, Trophy, Eye, User, Anchor, Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ItineraryData } from "./types";
import CostAndBudgetCard from "./components/CostAndBudgetCard";
import SecurityCard from "./components/SecurityCard";
import AccommodationsAndPlaces from "./components/AccommodationsAndPlaces";
import ItineraryViewer from "./components/ItineraryViewer";
import TranslationHelper from "./components/TranslationHelper";
import DestinationGallery from "./components/DestinationGallery";
import SmartMapBox from "./components/SmartMapBox";

// Advanced custom components
import ExpenseTracker from "./components/ExpenseTracker";
import TravelPassport from "./components/TravelPassport";
import OfflineEmergency from "./components/OfflineEmergency";
import AIAssistantChat from "./components/AIAssistantChat";
import { useAppTheme } from "./context/ThemeContext";
import { ThemeLoader, ThemeAtmosphereBackground } from "./components/ThemeDecorators";

export default function App() {
  const { theme, personality, setPersonality, mood, setMood } = useAppTheme();
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [hgMode, setHgMode] = useState(false); // Hidden Gems mode
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Loaded itinerary state
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  
  // Saved plans in localstorage
  const [savedPlans, setSavedPlans] = useState<{ id: string; name: string; country: string; days: number; data: ItineraryData }[]>([]);
  const [activeTab, setActiveTab] = useState<
    "itinerary" | "accommodations" | "safety" | "translations" | "expenses" | "passport" | "eco" | "offline"
  >("itinerary");

  const [showChronologicalPath, setShowChronologicalPath] = useState(false);
  const [checkedPackingItems, setCheckedPackingItems] = useState<Record<string, boolean>>({});

  const packingLocalStorageKey = useMemo(() => {
    if (!itinerary) return "";
    return `packing_list_v2_${itinerary.destination.toLowerCase().replace(/\s+/g, "_")}`;
  }, [itinerary]);

  useEffect(() => {
    if (packingLocalStorageKey) {
      const saved = localStorage.getItem(packingLocalStorageKey);
      if (saved) {
        try {
          setCheckedPackingItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse packing list state", e);
          setCheckedPackingItems({});
        }
      } else {
        setCheckedPackingItems({});
      }
    } else {
      setCheckedPackingItems({});
    }
  }, [packingLocalStorageKey]);

  const togglePackingItem = (item: string) => {
    setCheckedPackingItems((prev) => {
      const updated = { ...prev, [item]: !prev[item] };
      if (packingLocalStorageKey) {
        localStorage.setItem(packingLocalStorageKey, JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Popular quick tags
  const popularSpots = [
    { name: "Kyoto", flag: "🇯🇵" },
    { name: "Reykjavik", flag: "🇮🇸" },
    { name: "Rome", flag: "🇮🇹" },
    { name: "Oaxaca", flag: "🇲🇽" },
    { name: "Bali", flag: "🇮🇩" },
    { name: "Cairo", flag: "🇪🇬" }
  ];

  const personalityTypes = [
    "Adventure Seeker", "Luxury Traveler", "Backpacker", "Introvert", 
    "Extrovert", "Foodie", "Spiritual Traveler", "Photographer"
  ];

  const moodPills = [
    "Healing & Quiet", "Chaos & Intense Nightlife", "Gourmet Culinary", 
    "Nature Escape", "Historic Mystery", "Romantic Retreat"
  ];

  // Load saved plans on mount
  useEffect(() => {
    const plansJson = localStorage.getItem("travel_planner_saved_plans");
    if (plansJson) {
      try {
        setSavedPlans(JSON.parse(plansJson));
      } catch (e) {
        console.error("Error reading saved plans", e);
      }
    }
  }, []);

  // Sync saved plans to localstorage
  const savePlanToStorage = (updatedList: typeof savedPlans) => {
    setSavedPlans(updatedList);
    localStorage.setItem("travel_planner_saved_plans", JSON.stringify(updatedList));
  };

  const handleSaveCurrentPlan = () => {
    if (!itinerary) return;
    const isAlreadySaved = savedPlans.some(p => p.name.toLowerCase() === itinerary.destination.toLowerCase());
    if (isAlreadySaved) return;

    const newPlanEntry = {
      id: Date.now().toString(),
      name: itinerary.destination,
      country: itinerary.country,
      days: itinerary.itineraryDays.length,
      data: itinerary
    };
    
    savePlanToStorage([...savedPlans, newPlanEntry]);
  };

  const handleDeletePlan = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPlans.filter(p => p.id !== id);
    savePlanToStorage(updated);
  };

  const handleLoadSavedPlan = (planData: ItineraryData) => {
    setItinerary(planData);
    setDestination(planData.destination);
    setDuration(planData.itineraryDays.length);
    setActiveTab("itinerary");
  };

  // Modern loaders state sequence
  const loadingPhrases = [
    "Analyzing selected personality travel metrics...",
    "Injecting local Hidden Gems vector directories...",
    "Compiling weather-adaptive active protocols...",
    "Scanning local region tourist fraud and scams alerts...",
    "Fleshing out secure women-friendly zone lists...",
    "Estimating environmental footprint and transit options...",
    "Gleaning local language speech aid transcripts..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingPhrases.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setLoading(true);
    setError(null);
    setItinerary(null);
    setLoadingStep(0);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          destination, 
          days: duration,
          personality,
          mood, 
          exploreMode: hgMode ? "local" : "standard"
        }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Failed to make itinerary. Check server connections.");
      }

      const data: ItineraryData = await response.json();
      setItinerary(data);
      setActiveTab("itinerary");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected network state occurred. Try again soon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-row min-h-screen transition-all duration-1000 ${theme.background} font-sans overflow-x-hidden relative selection:bg-indigo-600/30 selection:text-indigo-200`}>
      
      {/* Dynamic atmospheric background with floating particles/gradients */}
      <ThemeAtmosphereBackground />
      
      {/* Sleek Left Mini-Sidebar */}
      <aside className="w-20 bg-slate-950/80 border-r border-slate-900 flex flex-col items-center py-8 justify-between text-white hidden md:flex shrink-0 z-20 backdrop-blur-xl">
        <div className="flex flex-col items-center space-y-10 w-full">
          <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-2xl flex items-center justify-center font-display font-black text-xl shadow-lg rotate-3 hover:rotate-0 transition-transform cursor-pointer relative group">
            V
            <div className="absolute inset-0 bg-indigo-400/25 rounded-2xl blur group-hover:opacity-100 transition-opacity opacity-50" />
          </div>
          <nav className="flex flex-col space-y-6">
            <button 
              onClick={() => { if (itinerary) setActiveTab("itinerary"); }}
              disabled={!itinerary}
              title="Voyage Itinerary"
              className={`p-3 rounded-xl transition-all ${
                activeTab === "itinerary" && itinerary
                  ? `bg-slate-900 shadow-inner border border-white/5`
                  : "hover:bg-slate-900 text-slate-400 opacity-65 disabled:opacity-20 disabled:hover:bg-transparent"
              }`}
              style={{ color: activeTab === "itinerary" && itinerary ? theme.accent : undefined }}
            >
              <Compass className="w-5.5 h-5.5" />
            </button>
            <button 
              onClick={() => { if (itinerary) setActiveTab("accommodations"); }}
              disabled={!itinerary}
              title="Lodging & Restaurants"
              className={`p-3 rounded-xl transition-all ${
                activeTab === "accommodations" && itinerary
                  ? `bg-slate-900 shadow-inner border border-white/5`
                  : "hover:bg-slate-900 text-slate-400 opacity-65 disabled:opacity-20 disabled:hover:bg-transparent"
              }`}
              style={{ color: activeTab === "accommodations" && itinerary ? theme.accent : undefined }}
            >
              <BookOpen className="w-5.5 h-5.5" />
            </button>
            <button 
              onClick={() => { if (itinerary) setActiveTab("safety"); }}
              disabled={!itinerary}
              title="Safety & Fraud Index"
              className={`p-3 rounded-xl transition-all ${
                activeTab === "safety" && itinerary
                  ? `bg-slate-900 shadow-inner border border-white/5`
                  : "hover:bg-slate-900 text-slate-400 opacity-65 disabled:opacity-20 disabled:hover:bg-transparent"
              }`}
              style={{ color: activeTab === "safety" && itinerary ? theme.accent : undefined }}
            >
              <ShieldCheck className="w-5.5 h-5.5" />
            </button>
            <button 
              onClick={() => { if (itinerary) setActiveTab("expenses"); }}
              disabled={!itinerary}
              title="Wallet & Expense splits"
              className={`p-3 rounded-xl transition-all ${
                activeTab === "expenses" && itinerary
                  ? `bg-slate-900 shadow-inner border border-white/5`
                  : "hover:bg-slate-900 text-slate-400 opacity-65 disabled:opacity-20 disabled:hover:bg-transparent"
              }`}
              style={{ color: activeTab === "expenses" && itinerary ? theme.accent : undefined }}
            >
              <Wallet className="w-5.5 h-5.5" />
            </button>
            <button 
              onClick={() => { if (itinerary) setActiveTab("passport"); }}
              disabled={!itinerary}
              title="Digital Travel Passport"
              className={`p-3 rounded-xl transition-all ${
                activeTab === "passport" && itinerary
                  ? `bg-slate-900 shadow-inner border border-white/5`
                  : "hover:bg-slate-900 text-slate-400 opacity-65 disabled:opacity-20 disabled:hover:bg-transparent"
              }`}
              style={{ color: activeTab === "passport" && itinerary ? theme.accent : undefined }}
            >
              <Trophy className="w-5.5 h-5.5" />
            </button>
            <button 
              onClick={() => { if (itinerary) setActiveTab("eco"); }}
              disabled={!itinerary}
              title="Carbon footprint mode"
              className={`p-3 rounded-xl transition-all ${
                activeTab === "eco" && itinerary
                  ? `bg-slate-900 shadow-inner border border-white/5`
                  : "hover:bg-slate-900 text-slate-400 opacity-65 disabled:opacity-20 disabled:hover:bg-transparent"
              }`}
              style={{ color: activeTab === "eco" && itinerary ? theme.accent : undefined }}
            >
              <Footprints className="w-5.5 h-5.5" />
            </button>
            <button 
              onClick={() => { if (itinerary) setActiveTab("offline"); }}
              disabled={!itinerary}
              title="Offline safe status"
              className={`p-3 rounded-xl transition-all ${
                activeTab === "offline" && itinerary
                  ? `bg-slate-900 shadow-inner border border-white/5`
                  : "hover:bg-slate-900 text-slate-400 opacity-65 disabled:opacity-20 disabled:hover:bg-transparent"
              }`}
              style={{ color: activeTab === "offline" && itinerary ? theme.accent : undefined }}
            >
              <FileText className="w-5.5 h-5.5" />
            </button>
          </nav>
        </div>

        {/* Status safe indicator */}
        <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs text-rose-500 shadow-md">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
        </div>
      </aside>

      {/* Main content body wrap */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sleek Layout Top Header */}
        <header className="h-20 bg-slate-950/40 border-b border-slate-900/80 px-4 sm:px-8 flex items-center justify-between z-10 shrink-0 backdrop-blur-md">
          <div className="flex items-center flex-1 max-w-xl">
            <h1 className="font-display font-medium text-base text-slate-200 tracking-tight flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-indigo-500 shrink-0" />
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-indigo-300">
                SMART VOYAGE AI
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 border-l border-slate-800 pl-2.5 font-light">
                Global Travel Intelligence Cockpit
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">AI CORE STATUS</p>
              <p className="text-xs font-semibold text-emerald-400 flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                ACTIVE LOGS ONLINE
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 font-light hidden lg:inline">Engine: Gemini 3.5</span>
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 font-sans shadow-lg uppercase">
                {itinerary ? itinerary.country.substring(0, 2) : "AI"}
              </div>
            </div>
          </div>
        </header>

        {/* Inner Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* Welcome Dashboard banner */}
          <div className="p-6 bg-slate-950 text-white rounded-3xl relative overflow-hidden shadow-2xl border border-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/20 via-slate-950/80 to-slate-950 pointer-events-none" />
            <div className="space-y-1 relative z-10">
              <span className="text-[9px] font-mono tracking-widest text-indigo-400 font-bold block uppercase bg-indigo-950/50 w-fit px-2 py-0.5 rounded border border-indigo-900/30 mb-1.5">
                Next-Gen Travel Operating System
              </span>
              <h2 className="font-display font-black text-2xl tracking-normal text-slate-150">
                Explore, Calibrate & Safe-Pass Globally
              </h2>
              <p className="text-xs text-slate-400 font-light font-sans max-w-2xl leading-relaxed">
                Connect your travel personality and flight desires to compile deep, detailed dossiers. Features built-in live weather substitution rules, environmental footprint logs, fraud indices, and safe isolation triggers.
              </p>
            </div>
          </div>

          {/* Advanced Vibe & Theme Calibration Controller (Interactive Toolbar) */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-4 sm:p-5 backdrop-blur-md space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5" style={{ color: theme.accent }} />
                <h3 className="font-display font-black text-xs uppercase tracking-wider text-slate-100 font-mono">
                  Interactive Emotion & Vibe Calibration Toolbar
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-light">
                Switch profiles to live-transform environmental lights, card styles, and map glows. Current: <strong style={{ color: theme.accent }} className="animate-pulse">{theme.name} ({theme.tagline})</strong>
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {[
                { name: "Cozy solitude", value: "Slow Solo Traveler", vibe: "Healing & Quiet", color: "#818cf8", label: "Introvert" },
                { name: "Neon vibes", value: "Lively Extrovert", vibe: "Chaos & Intense Nightlife", color: "#e11d48", label: "Extrovert" },
                { name: "Wild Ascent", value: "Adventure Seeker", vibe: "Nature Escape", color: "#10b981", label: "Adventure" },
                { name: "Sunset Warmth", value: "Romantic Partner", vibe: "Romantic Retreat", color: "#fb7185", label: "Romantic" },
                { name: "Elite Prestige", value: "Luxury Elite Traveler", vibe: "Gourmet Culinary", color: "#f59e0b", label: "Luxury" },
                { name: "Starlight lens", value: "Photographer Lens", vibe: "Historic Mystery", color: "#a855f7", label: "Shutter" },
              ].map((item) => {
                const isSelected = personality === item.value && mood === item.vibe;
                return (
                  <motion.button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setPersonality(item.value);
                      setMood(item.vibe);
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3.5 py-2 rounded-2xl border text-xs font-semibold font-sans flex items-center gap-2 cursor-pointer transition-all ${
                      isSelected 
                        ? "text-white bg-slate-950/90 shadow-lg" 
                        : "bg-slate-950/30 text-slate-400 hover:text-slate-100 hover:bg-slate-950/60 border-white/5"
                    }`}
                    style={{
                      borderColor: isSelected ? item.color : undefined,
                      boxShadow: isSelected ? `0 0 15px ${item.color}40` : undefined,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-ping absolute" style={{ backgroundColor: item.color, display: isSelected ? "block" : "none", width: "6px", height: "6px" }} />
                    <span className="w-1.5 h-1.5 rounded-full relative z-10" style={{ backgroundColor: item.color }} />
                    <span className="capitalize">{item.name}</span>
                    <span className="text-[7px] tracking-wider opacity-60 px-1.5 py-0.2 rounded font-mono uppercase bg-white/5 text-slate-300">
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Form and bookmarks split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Custom configure card */}
            <div className="lg:col-span-8 bg-slate-900/35 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-5 backdrop-blur-md">
              <h3 className="font-display font-semibold text-sm text-slate-200 flex items-center gap-2 uppercase tracking-wider font-mono">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Dossier Configuration Controls
              </h3>

              <form onSubmit={handlePlanSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  
                  {/* Where input */}
                  <div className="sm:col-span-8 space-y-1.5">
                    <label htmlFor="destination-input" className="block text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wide">
                      Target Destination
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="destination-input"
                        type="text"
                        required
                        placeholder="e.g., Kyoto, Reykjavik, Oaxaca, Bali, Rome..."
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-slate-200 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Duration tracker */}
                  <div className="sm:col-span-4 space-y-1.5">
                    <label htmlFor="duration-select" className="block text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wide">
                      Timeframe duration
                    </label>
                    <select
                      id="duration-select"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-slate-200 transition-all font-sans"
                    >
                      <option value={3}>3 Days - Fast Voyage</option>
                      <option value={5}>5 Days - Standard Voyage</option>
                      <option value={7}>7 Days - Deep Exploration</option>
                    </select>
                  </div>
                </div>

                {/* Travel Personality Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wide">
                      Traveler Personality
                    </label>
                    <select
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-slate-200 transition-all font-sans"
                    >
                      {personalityTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wide">
                      Trip Mood Prompt / Vibe
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Quiet contemplation, chaos and intense food..."
                      value={mood}
                      onChange={(e) => setMood(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-slate-200 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Quick mood pills tags */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mr-1 self-center">vibe recommendations:</span>
                  {moodPills.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      className={`text-[10px] px-2.5 py-1 rounded-xl transition-all font-sans border cursor-pointer ${
                        mood === m 
                          ? "bg-indigo-950 border-indigo-700 text-indigo-300"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Popular Tags & Hidden Gems Mode */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  
                  {/* Quick spots */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block mr-1">Hotspots:</span>
                    {popularSpots.map((spot) => (
                      <button
                        key={spot.name}
                        type="button"
                        onClick={() => setDestination(spot.name)}
                        className="px-2.5 py-1 bg-slate-950 hover:bg-slate-900 text-slate-300 rounded-xl text-[11px] transition-all border border-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>{spot.flag}</span>
                        <span>{spot.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Hidden Gems Toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none bg-slate-950 p-2.5 rounded-xl border border-slate-800 hover:border-indigo-950 transition-all shrink-0">
                    <input 
                      type="checkbox" 
                      checked={hgMode} 
                      onChange={(e) => setHgMode(e.target.checked)}
                      className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                    />
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-200 block font-mono text-[10px] uppercase tracking-wider">Explore Like A Local</span>
                    </div>
                  </label>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      COMPILING FLIGHT AND METEOR METRICS...
                    </>
                  ) : (
                    <>
                      <Compass className="w-4.5 h-4.5 animate-pulse text-indigo-200" />
                      FORGE ADVANCED Dossier
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Bookmarks bar */}
            <div className="lg:col-span-4 bg-slate-900/35 border border-slate-900 rounded-3xl p-6 shadow-xl flex flex-col justify-between self-stretch h-full min-h-[300px] backdrop-blur-md">
              <div className="space-y-4">
                <h3 className="font-display font-semibold text-xs text-slate-300 uppercase tracking-widest flex items-center gap-2 font-mono">
                  <Bookmark className="w-4 h-4 text-indigo-400" />
                  Offline Dossier Vault
                </h3>

                <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 scrollbar-thin">
                  {savedPlans.length > 0 ? (
                    savedPlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => handleLoadSavedPlan(plan.data)}
                        className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all group"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="font-sans font-semibold text-slate-200 text-xs truncate">
                            {plan.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {plan.country} • {plan.days} Days
                          </p>
                        </div>

                        <button
                          onClick={(e) => handleDeletePlan(plan.id, e)}
                          title="Purge dossier entry"
                          className="p-1.5 text-slate-600 hover:text-rose-400 bg-slate-900 hover:bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-800 transition-all shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-10 font-mono">
                      Vault is empty. Forge a dossier to populate offline anchors.
                    </p>
                  )}
                </div>
              </div>

              <div className="text-[10px] text-slate-500 mt-6 pt-3 border-t border-slate-800/60 leading-relaxed font-mono">
                ⚡ Synced profiles reside locally within sandbox browser localStorage blocks.
              </div>
            </div>

          </div>

          {/* Errors section */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 bg-rose-950/20 border border-rose-900/30 rounded-3xl flex items-start gap-3.5 text-xs text-rose-300 shadow-xl"
              >
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block text-rose-400">Tactical Flight Telemetry Disrupted</span>
                  <span className="leading-relaxed block">{error}</span>
                  {error.includes("GEMINI_API_KEY") && (
                    <span className="block mt-2 pt-2 border-t border-rose-900/30 text-rose-400">
                      💡 Ensure you have typed the <strong>GEMINI_API_KEY</strong> inside your Settings Secrets tab on the platform.
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading display */}
          <AnimatePresence>
            {loading && (
              <ThemeLoader phrases={loadingPhrases} activeStep={loadingStep} />
            )}
          </AnimatePresence>

          {/* Active generated report content */}
          <AnimatePresence>
            {itinerary && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {itinerary.isQuotaFallback && (
                  <div className="bg-amber-950/40 border border-amber-500/30 text-amber-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="p-2 bg-amber-900/40 border border-amber-500/20 rounded-xl shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold uppercase tracking-wider font-mono text-amber-500">
                        Smart Simulation Mode Enabled
                      </p>
                      <p className="text-[11px] text-slate-300 leading-normal max-w-3xl">
                        The collective Gemini API free-tier quota is currently exhausted (429 Rate Limit).
                        Applying a highly specialized offline regional simulation index for <strong>{itinerary.destination}</strong> instead.
                        All interactive checklist systems, regulations compliance guides, translation suites, and local emergency registries remain fully operational below.
                      </p>
                    </div>
                  </div>
                )}

                {/* Visual Banner for target destination */}
                <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 shadow-2xl border border-slate-900">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/30 via-slate-950/80 to-slate-950 pointer-events-none" />

                  <div className="space-y-2 relative z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-black bg-indigo-950 px-2 py-0.5 rounded border border-indigo-900/30">
                        {personality} DOSSIER ACTIVE
                      </span>
                      {itinerary.weatherSim && (
                        <span className="text-[9px] font-mono uppercase text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-900/30 flex items-center gap-1">
                          <CloudRain className="w-3 h-3" /> Forecast: {itinerary.weatherSim.activeForecast}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-baseline gap-2.5">
                      <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-slate-100">
                        {itinerary.destination}
                      </h2>
                      <span className="text-[10px] font-mono font-bold text-slate-400 px-2.5 py-0.5 bg-slate-900 rounded-md border border-slate-800">
                        {itinerary.country}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-light font-sans max-w-2xl leading-relaxed">
                      Optimal climate timeframe: <strong className="text-indigo-400 font-bold">{itinerary.bestTimeToVisit}</strong>. Language spectrum: {itinerary.language}.
                    </p>

                    {itinerary.personalityAdvice && (
                      <p className="text-[11px] font-sans italic text-slate-400 p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 max-w-3xl leading-relaxed mt-2">
                        🌟 <strong>AI Custom Curates:</strong> {itinerary.personalityAdvice}
                      </p>
                    )}
                  </div>

                  <div className="relative z-10 shrink-0">
                    <button
                      onClick={handleSaveCurrentPlan}
                      disabled={savedPlans.some(p => p.name.toLowerCase() === itinerary.destination.toLowerCase())}
                      className="px-4.5 py-3.5 bg-slate-900 hover:bg-slate-850 disabled:bg-emerald-900/30 disabled:text-emerald-400 disabled:border-emerald-950 disabled:cursor-default text-white text-xs uppercase tracking-widest font-bold rounded-xl flex items-center gap-2.5 border border-slate-800 transition-all shadow-md cursor-pointer"
                    >
                      {savedPlans.some(p => p.name.toLowerCase() === itinerary.destination.toLowerCase()) ? (
                        <>
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          Dossier Anchored
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4 text-indigo-400" />
                          Vault dossier
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Costs & seasonal metrics */}
                <CostAndBudgetCard 
                  budget={itinerary.budget}
                  flightCosts={itinerary.flightCosts}
                  bestTimeToVisit={itinerary.bestTimeToVisit}
                />

                {/* Destination Gallery Spotlight */}
                <DestinationGallery 
                  destination={itinerary.destination}
                  country={itinerary.country}
                />

                {/* Spatial Map coordinate Planner Grid */}
                <SmartMapBox 
                  destination={itinerary.destination}
                  country={itinerary.country}
                  accommodations={itinerary.accommodations}
                  restaurants={itinerary.amenities.restaurants}
                  itineraryDays={itinerary.itineraryDays}
                  showChronologicalPath={showChronologicalPath}
                />

                {/* Futuristic Tabs Selection strip */}
                <div className="flex border-b border-slate-900 overflow-x-auto scrollbar-none gap-1 bg-slate-950 px-4 rounded-t-3xl border border-slate-900">
                  <button
                    onClick={() => setActiveTab("itinerary")}
                    className={`py-4 px-3 text-xs font-bold capitalize font-mono tracking-wider transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
                      activeTab === "itinerary"
                        ? "border-indigo-600 text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    🗺️ Itinerary Outlines ({duration} Days)
                  </button>
                  <button
                    onClick={() => setActiveTab("accommodations")}
                    className={`py-4 px-3 text-xs font-bold capitalize font-mono tracking-wider transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
                      activeTab === "accommodations"
                        ? "border-indigo-600 text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    🏨 Lodging & Places
                  </button>
                  <button
                    onClick={() => setActiveTab("safety")}
                    className={`py-4 px-3 text-xs font-bold capitalize font-mono tracking-wider transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
                      activeTab === "safety"
                        ? "border-indigo-600 text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    🛡️ Safety & Scams index
                  </button>
                  <button
                    onClick={() => setActiveTab("expenses")}
                    className={`py-4 px-3 text-xs font-bold capitalize font-mono tracking-wider transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
                      activeTab === "expenses"
                        ? "border-indigo-600 text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    💸 Spent & Wallet Tracker
                  </button>
                  <button
                    onClick={() => setActiveTab("passport")}
                    className={`py-4 px-3 text-xs font-bold capitalize font-mono tracking-wider transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
                      activeTab === "passport"
                        ? "border-indigo-600 text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    📇 passport & timeline
                  </button>
                  <button
                    onClick={() => setActiveTab("eco")}
                    className={`py-4 px-3 text-xs font-bold capitalize font-mono tracking-wider transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
                      activeTab === "eco"
                        ? "border-indigo-600 text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    🔋 Eco modes
                  </button>
                  <button
                    onClick={() => setActiveTab("offline")}
                    className={`py-4 px-3 text-xs font-bold capitalize font-mono tracking-wider transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
                      activeTab === "offline"
                        ? "border-indigo-600 text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    📋 Offline Shield
                  </button>
                  <button
                    onClick={() => setActiveTab("translations")}
                    className={`py-4 px-3 text-xs font-bold capitalize font-mono tracking-wider transition-all border-b-2 shrink-0 flex items-center gap-1.5 ${
                      activeTab === "translations"
                        ? "border-indigo-600 text-indigo-400"
                        : "border-transparent text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    🗣️ Speak helper
                  </button>
                </div>

                {/* Display correct tab */}
                <div className="mt-0">
                  {activeTab === "itinerary" && (
                    <div className="space-y-4">
                      {/* Weather adaptive warning panel */}
                      {itinerary.weatherSim && (
                        <div className="p-4 bg-teal-950/30 border border-teal-900/30 rounded-2xl flex items-start gap-3 text-xs text-teal-300">
                          <CloudRain className="w-5 h-5 text-teal-400 shrink-0 mt-0.5 animate-bounce" />
                          <div className="space-y-1">
                            <span className="font-bold block">Smart Weather Adaptation Engine Loaded</span>
                            <span className="leading-relaxed opacity-90 block">
                              Current Weather Forecast is <strong>{itinerary.weatherSim.activeForecast}</strong>. 
                              {itinerary.weatherSim.alertMessage && <span className="text-amber-400"> Warning: {itinerary.weatherSim.alertMessage}.</span>} 
                              Substitute bad climate outdoors with our alternate weather recommendation: <span className="text-emerald-400 italic">"{itinerary.weatherSim.outdoorAlternativeTips}"</span>
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Standard packing advisor preview */}
                      {itinerary.packingList && (
                        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3.5">
                          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                            <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2">
                              <Sparkles className="w-4.5 h-4.5" style={{ color: theme.accent }} /> Interactive Packing Checklist
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400">
                              {Object.values(checkedPackingItems).filter(Boolean).length} / {itinerary.packingList.length} packed
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {itinerary.packingList.map((pack, idx) => {
                              const isChecked = !!checkedPackingItems[pack.item];
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => togglePackingItem(pack.item)}
                                  className={`p-3 bg-slate-950/60 rounded-xl border text-left cursor-pointer transition-all duration-300 flex gap-2.5 items-start relative ${
                                    isChecked
                                      ? "border-emerald-600/30 text-slate-400 opacity-60 shadow-sm"
                                      : "border-slate-900 hover:border-slate-800 hover:bg-slate-950/80 text-slate-200"
                                  }`}
                                >
                                  {/* Custom Checkbox circle */}
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isChecked
                                      ? "bg-emerald-600 border-emerald-500 text-white"
                                      : "border-slate-700 bg-transparent"
                                  }`}>
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>

                                  <div className="space-y-1 overflow-hidden">
                                    <span className="px-1.5 py-0.5 bg-indigo-950/50 text-[9px] font-mono font-bold uppercase rounded block w-fit"
                                      style={{ color: isChecked ? '#94a3b8' : theme.accentLighter }}
                                    >
                                      {pack.category}
                                    </span>
                                    <span className={`font-bold block text-xs leading-tight transition-all truncate text-ellipsis ${
                                      isChecked ? "line-through text-slate-500" : "text-slate-100"
                                    }`}>
                                      {pack.item}
                                    </span>
                                    <span className={`text-[11px] leading-snug block transition-all ${
                                      isChecked ? "text-slate-600 font-light" : "text-slate-400"
                                    }`}>
                                      {pack.whyNeeded}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <ItineraryViewer 
                        itineraryDays={itinerary.itineraryDays} 
                        showChronologicalPath={showChronologicalPath}
                        onToggleChronologicalPath={() => setShowChronologicalPath(!showChronologicalPath)}
                      />
                    </div>
                  )}

                  {activeTab === "accommodations" && (
                    <div className="space-y-4">
                      {/* Price Alerts and booking drop windows */}
                      {itinerary.priceAlerts && (
                        <div className="p-4 bg-indigo-950/30 border border-indigo-900/30 rounded-2xl flex items-start gap-3.5 text-xs text-indigo-400">
                          <Plane className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <span className="font-bold text-slate-200 block">Flight & Hotel Price Trend algorithms</span>
                            <span className="leading-relaxed opacity-90 block">
                              Pricing trend forecast: <strong className="text-indigo-400">{itinerary.priceAlerts.priceTrend}</strong>. Optimal buying window: <strong className="text-emerald-400">{itinerary.priceAlerts.bestBookingWindow}</strong>.
                            </span>
                            <div className="pt-2 text-[11px] text-slate-400">
                              💡 Potential discounts index: {(itinerary.priceAlerts.potentialDeals || []).join(" // ")}
                            </div>
                          </div>
                        </div>
                      )}

                      <AccommodationsAndPlaces 
                        accommodations={itinerary.accommodations}
                        amenities={itinerary.amenities}
                        destination={itinerary.destination}
                      />
                    </div>
                  )}

                  {activeTab === "safety" && (
                    <SecurityCard 
                      securityIndex={itinerary.securityIndex}
                      emergencyContacts={itinerary.emergencyContacts}
                      destination={itinerary.destination}
                      scamAlerts={itinerary.scamAlerts}
                      womenSafety={itinerary.womenSafety}
                    />
                  )}

                  {activeTab === "expenses" && (
                    <ExpenseTracker 
                      homeCurrency="USD"
                      localCurrency={itinerary.budget.currency}
                      exchangeRate={1.08}
                      midRangeDailyUSD={150}
                    />
                  )}

                  {activeTab === "passport" && (
                    <TravelPassport 
                      destination={itinerary.destination}
                      country={itinerary.country}
                    />
                  )}

                  {activeTab === "eco" && (
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl space-y-6">
                      <div className="flex items-center gap-2.5 justify-between">
                        <div className="flex items-center gap-2">
                          <Footprints className="w-5 h-5 text-emerald-400" />
                          <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-300">Eco-Score & Carbon Emissions mode</h4>
                        </div>
                        <span className="text-[10px] font-mono uppercase text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/40">Active carbon metrics</span>
                      </div>

                      {itinerary.carbonTrack ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Emisssions dashboard progress */}
                          <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl relative overflow-hidden">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-2 font-bold">Estimated trip carbon score</span>
                            
                            <div className="flex items-baseline gap-2 mb-4">
                              <h3 className="text-3xl font-extrabold font-mono text-slate-100">{itinerary.carbonTrack.estimatedCo2Kg}</h3>
                              <span className="text-xs text-slate-500 font-mono">CO2-Equivalent Kg</span>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                                <span>Sustainable Rating Score:</span>
                                <span className="text-emerald-400 font-bold">{itinerary.carbonTrack.sustainableScore} / 100</span>
                              </div>
                              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-600 to-indigo-500 rounded-full" 
                                  style={{ width: `${itinerary.carbonTrack.sustainableScore}%` }} 
                                />
                              </div>
                            </div>
                          </div>

                          {/* Sustainable transit routes ideas */}
                          <div className="p-5 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-3">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block font-bold">Eco Travel substitute ideas</span>
                            <div className="space-y-2">
                              {itinerary.carbonTrack.greenTips.map((tip, idx) => (
                                <div key={idx} className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
                                  <span className="text-emerald-400 mt-0.5 font-bold font-mono">🌱</span>
                                  <span>{tip}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="p-12 text-center text-slate-500 text-xs font-mono">Carbon indicators are unavailable for standard dossiers.</div>
                      )}
                    </div>
                  )}

                  {activeTab === "offline" && (
                    <OfflineEmergency 
                      destination={itinerary.destination}
                      country={itinerary.country}
                      emergencyContacts={itinerary.emergencyContacts}
                      localPhrases={itinerary.translationPhrases}
                    />
                  )}

                  {activeTab === "translations" && (
                    <div className="space-y-4">
                      {itinerary.visaAndDocs && (
                        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3 mb-4">
                          <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-300 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-400" /> Visa & Critical Documents Assistant
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                            <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                              <span className="text-[10px] font-mono text-slate-500 uppercase font-black block">Visa Requirement Status</span>
                              <p className="text-slate-300 font-bold leading-normal">{itinerary.visaAndDocs.visaRequired}</p>
                            </div>
                            <div className="p-3 bg-slate-950 rounded-xl space-y-1">
                              <span className="text-[10px] font-mono text-slate-500 uppercase font-black block">Passport Validity Bracket</span>
                              <p className="text-slate-300 font-bold leading-normal">{itinerary.visaAndDocs.passportValidity}</p>
                            </div>
                          </div>
                          {itinerary.visaAndDocs.vaccinations && itinerary.visaAndDocs.vaccinations.length > 0 && (
                            <div className="pt-2 text-xs text-slate-400">
                              ⚠️ <strong>Vaccinations checklist:</strong> {itinerary.visaAndDocs.vaccinations.join(", ")}
                            </div>
                          )}
                        </div>
                      )}

                      <TranslationHelper 
                        localPhrases={itinerary.translationPhrases}
                        targetLanguage={itinerary.language}
                      />
                    </div>
                  )}
                </div>

                {/* AIAssistant floating chat capsule integrated */}
                <AIAssistantChat destination={itinerary.destination} personality={personality} />

              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* Brand footer inside */}
        <footer className="mt-auto text-center text-slate-500 text-xs py-10 border-t border-slate-900 font-sans space-y-1.5 bg-slate-950/20">
          <p className="flex items-center justify-center gap-1.5 text-slate-400">
            Smart Voyage AI Operating System is dynamically optimized. Powered by <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> and active generative models.
          </p>
          <p className="text-[9px] font-mono text-slate-600">
            Telemetry standard: SECURE-OS-FLIGHT // Sandbox Preview Module
          </p>
        </footer>

      </div>
    </div>
  );
}
