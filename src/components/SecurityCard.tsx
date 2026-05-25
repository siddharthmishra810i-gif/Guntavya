import React, { useState, useEffect, useMemo } from "react";
import { ShieldCheck, ShieldAlert, Phone, MapPin, BadgeAlert, Coins, Sparkles, Building2, AlertTriangle, HelpCircle, Check } from "lucide-react";
import { motion } from "motion/react";
import { SecurityIndex, EmergencyContacts } from "../types";
import { useAppTheme } from "../context/ThemeContext";
import { ThemeCard } from "./ThemeDecorators";

interface SecurityCardProps {
  securityIndex: SecurityIndex;
  emergencyContacts: EmergencyContacts;
  destination: string;
  scamAlerts?: { title: string; description: string; severity: string }[];
  womenSafety?: { safeDistricts: string[]; dangerousDistricts: string[]; verifiedTips: string[]; emergencyHelpline: string };
}

export default function SecurityCard({ 
  securityIndex, 
  emergencyContacts, 
  destination,
  scamAlerts = [],
  womenSafety
}: SecurityCardProps) {
  const { theme } = useAppTheme();
  const isSafe = securityIndex.score.toLowerCase().includes("safe") || 
                 (parseInt(securityIndex.score.match(/\d+/)?.[0] || "100") > 70);

  // STORAGE KEYS
  const situStorageKey = useMemo(() => {
    return `situ_reg_v2_${(destination || "default").toLowerCase().replace(/\s+/g, "_")}`;
  }, [destination]);

  const lawsStorageKey = useMemo(() => {
    return `local_laws_v2_${(destination || "default").toLowerCase().replace(/\s+/g, "_")}`;
  }, [destination]);

  // STATES
  const [regForm, setRegForm] = useState({
    fullName: "",
    passportNum: "",
    localHotel: "",
    emergencyContact: ""
  });

  interface SituReg {
    fullName: string;
    passportNum: string;
    localHotel: string;
    emergencyContact: string;
    registeredAt: string;
    lastCheckIn: string;
  }

  const [situRegistration, setSituRegistration] = useState<SituReg | null>(null);
  const [acknowledgedLaws, setAcknowledgedLaws] = useState<Record<string, boolean>>({});

  // LOAD STATE ON MOUNT
  useEffect(() => {
    if (situStorageKey) {
      const saved = localStorage.getItem(situStorageKey);
      if (saved) {
        try { setSituRegistration(JSON.parse(saved)); } catch (e) { console.error(e); }
      } else {
        setSituRegistration(null);
      }
    }
  }, [situStorageKey]);

  useEffect(() => {
    if (lawsStorageKey) {
      const saved = localStorage.getItem(lawsStorageKey);
      if (saved) {
        try { setAcknowledgedLaws(JSON.parse(saved)); } catch (e) { console.error(e); }
      } else {
        setAcknowledgedLaws({});
      }
    }
  }, [lawsStorageKey]);

  // LAWS LIST BY DESTINATION
  const localLawsList = useMemo(() => {
    const dest = (destination || "").toLowerCase();
    
    const standardLaws = [
      { id: "law_passport", title: "Carry physical passport or original government ID credentials at all times", fine: "Penalty: Consular check / detainment custody risk" },
      { id: "law_dress", title: "Observe conservative clothing codes in religious baseline landmarks", fine: "Fine: Denied entrance to site premises" },
      { id: "law_drone", title: "Avoid operating drones near municipal structures without explicit local flyers permit", fine: "Rule: Equipment impoundment & civil ticket" },
      { id: "law_litter", title: "Do not throw waste on pavements (use color separation repositories)", fine: "Fine: $150 immediate sanitation penalty" }
    ];

    if (dest.includes("kyoto") || dest.includes("japan") || dest.includes("tokyo")) {
      return [
        { id: "jp_gion", title: "Never record pictures/videos on private lanes in historic Gion district", fine: "Fine: ¥10,000 regulatory caution fee" },
        { id: "jp_eat", title: "Avoid eating, drinking, or smoking cigarettes while walking on public streets", fine: "Rule: Highly offensive conduct warning" },
        { id: "jp_train", title: "Engage 'Manner Mode' (silent mode) on mobiles inside trains/metro trains", fine: "Etiquette: Train corridor quietness rules" },
        { id: "jp_trash", title: "Pack and carry home personal recycling waste (public bins do not exist)", fine: "Rule: Environmental circular waste compliance" }
      ];
    }

    if (dest.includes("singapore")) {
      return [
        { id: "sg_gum", title: "Never purchase, import, or use chewing gums outside of medical prescriptions", fine: "Fine: Up to S$1,000 civil charge" },
        { id: "sg_litter", title: "Spitting, littering, or smoking under corridors is extremely illegal", fine: "Fine: S$1,000 immediate custom ticket" },
        { id: "sg_walk", title: "Strictly cross at zebra grids (jaywalking triggers immediate charges)", fine: "Fine: S$200 first offense spot charge" },
        { id: "sg_wifi", title: "Never connect to unregistered, open commercial local hot-spot networks", fine: "Fine: Classified under malicious cyber-breach acts" }
      ];
    }

    if (dest.includes("roma") || dest.includes("italy")) {
      return [
        { id: "it_picnic", title: "Do not carry open picnics, eat, or sit on classical historic marble steps", fine: "Fine: €250 municipal monuments preservation fee" },
        { id: "it_tickets", title: "Validate physical paper travel cards before stepping inside trains or metro routes", fine: "Fine: €50 immediate inspector controller bill" },
        { id: "it_dress", title: "Keep raw shoulders, torso, and knees covered inside holy basilic churches", fine: "Rule: Enforced deny of transit entrance" },
        { id: "it_fountain", title: "Do not dip feet or swim inside public historic fountains (e.g. Fontana di Trevi)", fine: "Fine: Highly critical €500 ticket" }
      ];
    }

    if (dest.includes("iceland") || dest.includes("reykjavik")) {
      return [
        { id: "is_drive", title: "Never drive off-road or steer onto non-designated volcanic ash paths", fine: "Fine: Heavy volcanic ecosystem degradation fee (Up to S$5,000)" },
        { id: "is_lights", title: "Engage automobile headlights 24 hours constant (even at bright noon)", fine: "Rule: Mandatory high-hazard road security protocol" },
        { id: "is_thermal", title: "Take a thorough hot shower naked with soap prior to taking hot thermal pool baths", fine: "Rule: Strict volcanic hot spring sanitization rules" },
        { id: "is_water", title: "Drink directly from the pure cold kitchen taps (do not waste funds on bottled water)", fine: "Advice: Eco sustainability directive" }
      ];
    }

    return standardLaws;
  }, [destination]);

  // EVENT HANDLERS
  const handleRegisterDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.passportNum) return;
    
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const registrationDetails: SituReg = {
      ...regForm,
      registeredAt: nowStr,
      lastCheckIn: `Registered successfully at ${nowStr}`
    };

    setSituRegistration(registrationDetails);
    localStorage.setItem(situStorageKey, JSON.stringify(registrationDetails));
    
    // Clear form
    setRegForm({
      fullName: "",
      passportNum: "",
      localHotel: "",
      emergencyContact: ""
    });
  };

  const handlePingStatus = () => {
    if (!situRegistration) return;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = {
      ...situRegistration,
      lastCheckIn: `Safety confirmed at ${nowStr}`
    };
    setSituRegistration(updated);
    localStorage.setItem(situStorageKey, JSON.stringify(updated));
  };

  const handleDeleteRegistration = () => {
    setSituRegistration(null);
    localStorage.removeItem(situStorageKey);
  };

  const toggleLawAcknowledgement = (id: string) => {
    const updated = {
      ...acknowledgedLaws,
      [id]: !acknowledgedLaws[id]
    };
    setAcknowledgedLaws(updated);
    localStorage.setItem(lawsStorageKey, JSON.stringify(updated));
  };

  const complianceCount = useMemo(() => {
    return localLawsList.filter(law => !!acknowledgedLaws[law.id]).length;
  }, [localLawsList, acknowledgedLaws]);

  return (
    <div id="security-analysis-section" className={`space-y-6 ${theme.fontClass}`}>
      
      {/* Top row: General Safety index */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Safety Score and Context concerns */}
        <div className="md:col-span-7">
          <ThemeCard className="p-6 space-y-5 h-full">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  Situational Registry
                </span>
                <h3 className="font-sans font-semibold text-lg text-slate-100 flex items-center gap-2">
                  {isSafe ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-400" />
                  )}
                  Safety & Situational Index
                </h3>
                <p className="text-xs text-slate-400 leading-normal">Live synthesized safety parameters, warning logs, and security recommendations</p>
              </div>

              <div className="text-right">
                <span className={`inline-block text-xs font-semibold font-mono tracking-wider uppercase px-3 py-1.5 rounded-2xl ${
                  isSafe 
                    ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/40" 
                    : "bg-amber-950/40 text-amber-400 border border-amber-900/40"
                }`}>
                  {securityIndex.score}
                </span>
              </div>
            </div>

            {/* Dynamic Security Concerns */}
            <div className="space-y-3">
              <h4 className="font-sans font-medium text-slate-200 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                Active Warning Logs & Concerns
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {securityIndex.concerns.map((concern, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx}
                    className="p-3 bg-rose-950/10 border border-white/5 rounded-2xl text-xs text-slate-300 flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1" />
                    <span>{concern}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Safety Actions & Guidance */}
            <div className="space-y-3 pt-2">
              <h4 className="font-sans font-medium text-slate-200 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Precautions & Safety Protocols
              </h4>
              <ul className="space-y-2">
                {securityIndex.safetyTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-slate-400 flex items-start gap-2 leading-relaxed">
                    <span className="font-mono text-emerald-400 font-bold">0{idx + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ThemeCard>
        </div>

        {/* Emergency Helpline Connections */}
        <div className="md:col-span-5 col-span-1">
          <ThemeCard className="p-6 flex flex-col justify-between h-full">
            <div className="space-y-5">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  Local Registry
                </span>
                <h3 className="font-sans font-semibold text-lg text-slate-100 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-rose-500 animate-pulse" />
                  Emergency Dial Center
                </h3>
                <p className="text-xs text-slate-400">Essential rescue and local dispatch channels live link ready</p>
              </div>

              <div className="divide-y divide-slate-800/60">
                {/* Police */}
                <div className="py-3 flex items-center justify-between gap-4 first:pt-0">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-rose-950 text-rose-400 rounded-xl border border-rose-900/40">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">Police Department</h4>
                      <p className="text-[9px] text-slate-500 font-mono">Emergency Police Dispatch</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${emergencyContacts.police}`}
                    className="text-xs font-mono font-bold text-rose-400 bg-rose-950/50 px-3 py-1.5 rounded-xl border border-rose-900/30 hover:bg-rose-900/40 transition-colors"
                  >
                    {emergencyContacts.police}
                  </a>
                </div>

                {/* Ambulance */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-teal-950 text-teal-400 rounded-xl border border-teal-900/40">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">Ambulance Service</h4>
                      <p className="text-[9px] text-slate-400 font-mono">Immediate Medical Aid</p>
                    </div>
                  </div>
                  <a
                    href={`tel:${emergencyContacts.ambulance}`}
                    className="text-xs font-mono font-bold text-teal-400 bg-teal-950/50 px-3 py-1.5 rounded-xl border border-teal-900/30 hover:bg-teal-900/40 transition-colors"
                  >
                    {emergencyContacts.ambulance}
                  </a>
                </div>

                {/* Fire */}
                {emergencyContacts.fireDept && (
                  <div className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-orange-950 text-orange-400 rounded-xl border border-orange-900/40">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-100">Fire Rescue</h4>
                        <p className="text-[9px] text-slate-400 font-mono">Fire Hydrant Response</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${emergencyContacts.fireDept}`}
                      className="text-xs font-mono font-bold text-orange-400 bg-orange-950/50 px-3 py-1.5 rounded-xl border border-orange-900/30 hover:bg-orange-900/40 transition-colors"
                    >
                      {emergencyContacts.fireDept}
                    </a>
                  </div>
                )}
              </div>

              {/* Embassy & Travel Advice Details */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[10px] font-semibold text-slate-400 font-mono uppercase tracking-wide flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  Consular & Embassy Protocols
                </span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans font-light">
                  {emergencyContacts.embassyInfo}
                </p>
              </div>
            </div>
          </ThemeCard>
        </div>
      </div>

      {/* Advanced safety panels row (Scams & Women safety mode) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Scam alerts warnings console */}
        <ThemeCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-500" /> SCAM & FRAUD RADAR
            </h4>
            <span className="text-[9px] font-mono text-slate-500">Color-coded warning matrix</span>
          </div>

          <div className="space-y-3">
            {scamAlerts.length > 0 ? (
              scamAlerts.map((scam, i) => {
                const severeColor = scam.severity === "high" 
                  ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                  : scam.severity === "medium"
                    ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-300";
                return (
                  <div key={i} className={`p-3 border rounded-xl space-y-1 ${severeColor}`}>
                    <div className="flex justify-between items-center text-[10px] uppercase font-mono font-black">
                      <span className="flex items-center gap-1">⚠️ {scam.title}</span>
                      <span className="px-1.5 py-0.5 bg-black/30 rounded">{scam.severity} RISK</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-85">{scam.description}</p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 bg-white/[0.01] rounded-xl border border-white/5 text-center text-slate-500 text-xs font-mono">
                No acute scams reported for this sector. Always cross-examine local transport taxi rates.
              </div>
            )}
          </div>
        </ThemeCard>

        {/* Women safety Mode panel */}
        {womenSafety ? (
          <ThemeCard className="p-6 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-pink-400 flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-pink-400" /> WOMEN SAFETY ASSISTANT ACTIVE
              </h4>
              <span className="text-[9px] font-mono text-slate-500 uppercase">Verified districts log</span>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                <div className="bg-emerald-950/30 border border-emerald-900/30 p-3 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-400 block text-[10px] font-mono uppercase tracking-wider">Safe Neighborhoods</span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc pl-3">
                    {womenSafety.safeDistricts.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>

                <div className="bg-rose-950/30 border border-rose-900/30 p-3 rounded-xl space-y-1">
                  <span className="font-bold text-rose-400 block text-[10px] font-mono uppercase tracking-wider">Exercise High Caution</span>
                  <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc pl-3">
                    {(womenSafety.dangerousDistricts || []).map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-pink-400 mb-1">Accommodation & Transport Tips</span>
                <ul className="text-xs text-slate-300 space-y-1 pl-3 list-decimal leading-relaxed">
                  {womenSafety.verifiedTips.map((tip, i) => <li key={i}>{tip}</li>)}
                </ul>
              </div>

              <div className="p-3 bg-pink-500/5 border border-pink-500/20 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase text-pink-400 block font-bold">Women Helpline</span>
                  <span className="text-xs text-slate-300 font-sans leading-none">Emergency dedicated rescue & dispatch</span>
                </div>
                <a
                  href={`tel:${womenSafety.emergencyHelpline}`}
                  className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-mono font-bold shadow-md transition-colors"
                >
                  📞 {womenSafety.emergencyHelpline}
                </a>
              </div>
            </div>
          </ThemeCard>
        ) : (
          <ThemeCard className="p-6 flex flex-col justify-center items-center text-center text-slate-500 text-xs font-mono">
            <HelpCircle className="w-8 h-8 text-pink-500/30 mb-2" />
            <span>Generate an advanced travel plan to populate the female security indicators console.</span>
          </ThemeCard>
        )}
      </div>

      {/* Interactive Local Regulations & Situational Registry row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-3">
        
        {/* CARD 1: Interactive Situational Passport Registry (Situ Register) */}
        <div>
          <ThemeCard className="p-6 space-y-4 h-full">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Embassy Liaison
                </span>
                <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-slate-300 flex items-center gap-2">
                  <Building2 className="w-4.5 h-4.5 text-indigo-400" style={{ color: theme.accent }} /> SITUATIONAL REGISTRY
                </h4>
              </div>
              <span className="text-[9px] font-mono text-slate-500">Consular Emergency Log</span>
            </div>

            {/* Form and info */}
            {situRegistration ? (
              <div className="p-4 bg-emerald-950/20 border border-emerald-500/25 rounded-2xl space-y-3.5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono leading-none font-bold uppercase rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Registered & Active
                  </span>
                  <span className="text-[8px] font-mono text-slate-500">ID: SEC-REG-{destination.substring(0,3).toUpperCase()}-{(parseInt(situRegistration.passportNum?.replace(/\D/g, "") || "4281") % 10000)}</span>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                    <span className="text-slate-500">Traveler Name:</span>
                    <span className="font-bold text-slate-200">{situRegistration.fullName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                    <span className="text-slate-500">Document / ID:</span>
                    <span className="font-mono text-slate-300">•••• ••• {situRegistration.passportNum?.slice(-4) || "8821"}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                    <span className="text-slate-500">Local stay/Hotel:</span>
                    <span className="text-slate-200 truncate max-w-[180px]">{situRegistration.localHotel}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/[0.03] pb-1.5">
                    <span className="text-slate-500">Emergency Contact:</span>
                    <span className="text-slate-300 font-mono">{situRegistration.emergencyContact || "Embassy Line"}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                    <span>Last check status:</span>
                    <span className="font-mono text-emerald-400 font-medium">{situRegistration.lastCheckIn || "Registered successfully"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={handlePingStatus}
                    className="py-1 px-3 bg-emerald-800/20 hover:bg-emerald-800/40 text-emerald-400 text-[10px] font-bold font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 border border-emerald-500/20 cursor-pointer"
                  >
                    📍 Send Safety Ping
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteRegistration}
                    className="py-1 px-2.5 bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 text-[10px] font-bold font-mono uppercase rounded-xl transition-all border border-rose-950/60 cursor-pointer text-center"
                  >
                    De-register
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterDetails} className="space-y-4 bg-slate-900/30 border border-slate-900 p-4.5 rounded-2xl relative font-sans">
                <span className="block text-[9px] font-mono uppercase tracking-widest text-indigo-400 font-bold mb-1" style={{ color: theme.accent }}>Simulated Emergency Registration</span>
                
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={regForm.fullName}
                        onChange={e => setRegForm({...regForm, fullName: e.target.value})}
                        className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700/85 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Passport / ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. US99381A"
                        value={regForm.passportNum}
                        onChange={e => setRegForm({...regForm, passportNum: e.target.value})}
                        className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700/85 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Local Stay / Hotel</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ritz-Carlton"
                        value={regForm.localHotel}
                        onChange={e => setRegForm({...regForm, localHotel: e.target.value})}
                        className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700/85 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">Emergency Contact</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jane (+1)"
                        value={regForm.emergencyContact}
                        onChange={e => setRegForm({...regForm, emergencyContact: e.target.value})}
                        className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700/85 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-white text-xs font-bold font-mono uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md mt-1.5 flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: theme.accent }}
                  >
                    🛡️ Secure Liaison Registration
                  </button>
                </div>
              </form>
            )}

            <p className="text-[10px] text-slate-500 leading-normal font-mono">
              * Submitting logs your coordinates directly inside the local browser security storage to mock embassy-level traveler trace protection.
            </p>
          </ThemeCard>
        </div>

        {/* CARD 2: Interactive Local Regulations Compliance Checklist (Local Regs) */}
        <div>
          <ThemeCard className="p-6 space-y-4 h-full">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
                  Legal Codex
                </span>
                <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" /> LOCAL CIVIL REGULATIONS
                </h4>
              </div>
              <span className="text-[9px] font-mono text-slate-500">Legal awareness tracker</span>
            </div>

            {/* Compliance progress bar */}
            <div className="p-3.5 bg-slate-900/30 border border-slate-900 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Regulations compliance</span>
                <span className="font-bold text-emerald-400 font-sans">
                  {complianceCount} of {localLawsList.length} Acknowledged
                </span>
              </div>
              
              {/* progress line */}
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-white/[0.03]">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${(complianceCount / (localLawsList.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Checklist of regulations */}
            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
              {localLawsList.map((law) => {
                const isAcknowledged = !!acknowledgedLaws[law.id];
                return (
                  <button
                    key={law.id}
                    type="button"
                    onClick={() => toggleLawAcknowledgement(law.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex gap-3 items-start cursor-pointer transition-all ${
                      isAcknowledged
                        ? "bg-slate-950/40 border-emerald-500/20 text-slate-400 opacity-80"
                        : "bg-slate-950/60 border-slate-900 hover:border-slate-800 hover:bg-slate-950/80 text-slate-200"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isAcknowledged
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "border-slate-700 bg-transparent"
                    }`}>
                      {isAcknowledged && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    <div className="min-w-0 flex-1 leading-snug">
                      <p className={`text-xs font-bold font-sans ${isAcknowledged ? "line-through text-slate-500" : "text-slate-100"}`}>
                        {law.title}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{law.fine}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-500 leading-normal font-mono">
              * Check elements to certify awareness compliance. Failing can produce penalties, holds, or local precinct tickets in {destination || "target territory"}.
            </p>
          </ThemeCard>
        </div>
      </div>
    </div>
  );
}
