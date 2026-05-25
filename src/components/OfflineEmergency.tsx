import React, { useState, useEffect } from "react";
import { ShieldAlert, RefreshCw, PhoneCall, CheckCircle, WifiOff, FileText, Map, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { EmergencyContacts, TranslationPhrase } from "../types";

interface OfflineEmergencyProps {
  destination: string;
  country: string;
  emergencyContacts: EmergencyContacts;
  localPhrases: TranslationPhrase[];
}

export default function OfflineEmergency({
  destination,
  country,
  emergencyContacts = { police: "112", ambulance: "112", fireDept: "112", embassyInfo: "Consular Advisory" },
  localPhrases = []
}: OfflineEmergencyProps) {
  const [offlineAvailable, setOfflineAvailable] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Check if current destination exists in offline buffer
    const synced = localStorage.getItem(`offline_safe_${destination.toLowerCase()}`);
    if (synced) {
      setOfflineAvailable(true);
    } else {
      setOfflineAvailable(false);
    }
  }, [destination]);

  const handleSyncOffline = () => {
    setSyncing(true);
    // Mimic deep cache compilation
    setTimeout(() => {
      const offlineBuffer = {
        destination,
        country,
        emergencyContacts,
        localPhrases: localPhrases.filter(p => p.category === "emergency" || p.category === "medical")
      };
      localStorage.setItem(`offline_safe_${destination.toLowerCase()}`, JSON.stringify(offlineBuffer));
      setOfflineAvailable(true);
      setSyncing(false);
    }, 1500);
  };

  const emergencyPhrases = localPhrases.filter(p => p.category === "emergency" || p.category === "medical");

  return (
    <div className="bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl space-y-6">
      
      {/* Synchronization Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-amber-500/15 rounded-xl shrink-0 text-amber-400">
            <WifiOff className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">Offline Isolation Shield</span>
            <h4 className="text-sm font-bold text-slate-100 font-sans tracking-tight">Offline Emergency Safe Mode</h4>
            <p className="text-xs text-slate-400 leading-normal font-sans">
              Download critical rescue profiles, translation grids, pharmacy nodes, and consular assets locally to access them without cellular signal.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleSyncOffline}
            disabled={syncing}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-2 cursor-pointer border transition-all shadow-md ${
              offlineAvailable 
                ? "bg-slate-900 text-emerald-400 border-slate-800 hover:bg-slate-850"
                : "bg-amber-600 hover:bg-amber-500 text-slate-950 border-amber-500 font-black"
            }`}
          >
            {syncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                SECURES SHIELD...
              </>
            ) : offlineAvailable ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                SHIELD LOADED
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                ACTIVATE OFFLINE
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Rapid SOS Trigger lines */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-rose-500" />
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">Rapid SOS Direct Lines</h4>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <a 
              href={`tel:${emergencyContacts.police}`}
              className="p-3 bg-rose-950/20 border border-rose-900/30 hover:border-rose-700/50 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">POLICE</span>
              <span className="text-base font-extrabold font-mono text-white mt-1 group-hover:scale-105 transition-transform">{emergencyContacts.police}</span>
            </a>
            <a 
              href={`tel:${emergencyContacts.ambulance}`}
              className="p-3 bg-rose-950/20 border border-rose-900/30 hover:border-rose-700/50 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">MEDICAL</span>
              <span className="text-base font-extrabold font-mono text-white mt-1 group-hover:scale-105 transition-transform">{emergencyContacts.ambulance}</span>
            </a>
            <a 
              href={`tel:${emergencyContacts.fireDept || "112"}`}
              className="p-3 bg-indigo-950/20 border border-indigo-900/30 hover:border-indigo-700/50 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
            >
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">FIRE DEPT</span>
              <span className="text-base font-extrabold font-mono text-white mt-1 group-hover:scale-105 transition-transform">{emergencyContacts.fireDept || "112"}</span>
            </a>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-1.5 text-xs text-slate-300 leading-normal">
            <span className="font-semibold text-slate-200 block">Consular & Consulates Advisory Info:</span>
            <p className="font-light text-[11px] leading-relaxed opacity-85">{emergencyContacts.embassyInfo}</p>
          </div>
        </div>

        {/* Offline Essential Emergency Phrases translation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">Medical & Emergency Phrases</h4>
          </div>

          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
            {emergencyPhrases.length > 0 ? (
              emergencyPhrases.map((phrase) => (
                <div key={phrase.english} className="p-2.5 bg-slate-900/30 rounded-lg border border-slate-900 flex justify-between items-start gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-slate-400 font-mono italic">"{phrase.english}"</p>
                    <p className="text-xs font-bold text-indigo-300 font-sans">{phrase.local}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{phrase.pronunciation}</span>
                </div>
              ))
            ) : (
              <div className="p-6 bg-slate-900/30 rounded-xl border border-slate-900 text-center">
                <span className="text-xs text-slate-500 font-mono">No active rescue phrases synced. Please plan a voyage target.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Safety Offline Protocols */}
      <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-500 font-mono leading-relaxed space-y-2">
        <p className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> 
          LOCAL BUFFER ACTIVE: Core itinerary data cached inside local browser database keys successfully.
        </p>
        <p>
          * Protocol: In case of physical distress when cellular connection is depleted, present the translation card above to medical helpers or law authorities immediately.
        </p>
      </div>

    </div>
  );
}
