import React, { useState } from "react";
import { Compass, Clock, MapPin, Sparkles, ChevronDown, ChevronUp, Landmark, Route } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ItineraryDay } from "../types";
import { useAppTheme } from "../context/ThemeContext";

interface ItineraryViewerProps {
  itineraryDays: ItineraryDay[];
  showChronologicalPath?: boolean;
  onToggleChronologicalPath?: () => void;
}

export default function ItineraryViewer({
  itineraryDays,
  showChronologicalPath = false,
  onToggleChronologicalPath,
}: ItineraryViewerProps) {
  const [activeDayIdx, setActiveDayIdx] = useState<number>(0);
  const { theme } = useAppTheme();

  return (
    <div id="itinerary-detail-view" className="bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header and Day Selector */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100/60 pb-5">
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Chronological Engine
          </span>
          <h3 className="font-sans font-semibold text-lg text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" style={{ color: theme.accent }} />
            Day-by-Day Travel Itinerary
          </h3>
          <p className="text-xs text-slate-500 font-sans">
            Carefully paced travel plan covering the must-see spots, sights, and hidden gems.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Day selection buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {itineraryDays.map((day, idx) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayIdx(idx)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold font-sans transition-all shrink-0 border cursor-pointer ${
                  activeDayIdx === idx
                    ? "bg-slate-950 text-white border-slate-950 shadow-sm shadow-slate-950/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-100"
                }`}
                style={{
                  borderColor: activeDayIdx === idx ? theme.accent : undefined,
                  boxShadow: activeDayIdx === idx ? `0 0 10px ${theme.accent}33` : undefined,
                }}
              >
                Day {day.dayNumber}
              </button>
            ))}
          </div>

          {onToggleChronologicalPath && (
            <button
              onClick={onToggleChronologicalPath}
              className={`px-4 py-2 rounded-2xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center gap-2 border cursor-pointer shrink-0 ${
                showChronologicalPath
                  ? "bg-slate-950 text-white border-slate-950 shadow-sm shadow-slate-950/20"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-100"
              }`}
              style={{
                borderColor: showChronologicalPath ? theme.accent : undefined,
                color: showChronologicalPath ? theme.accent : undefined,
                boxShadow: showChronologicalPath ? `0 0 12px ${theme.accent}25` : undefined,
              }}
            >
              <Route className="w-4 h-4 animate-pulse stroke-[2.5]" style={{ color: showChronologicalPath ? theme.accent : undefined }} />
              {showChronologicalPath ? "🔌 Drawing Active" : "✍️ Draw Route Path"}
            </button>
          )}
        </div>
      </div>

      {/* Main active day renderer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDayIdx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Day Title & Summary banner */}
          <div className="p-4 bg-indigo-50/35 border border-indigo-100/30 rounded-2xl flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl font-mono font-bold text-xs">
              Day {itineraryDays[activeDayIdx].dayNumber}
            </div>
            <div>
              <h4 className="font-sans font-semibold text-slate-900 text-sm">
                {itineraryDays[activeDayIdx].title}
              </h4>
              <p className="text-[11px] text-slate-500 font-sans">
                A gorgeous selection of local activities structured to maximize enjoyment and pacing.
              </p>
            </div>
          </div>

          {/* Activities Timeline */}
          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-[1.5px] before:bg-slate-100">
            {itineraryDays[activeDayIdx].activities.map((activity, actIdx) => (
              <div key={actIdx} className="flex gap-4 relative">
                {/* Timeline node */}
                <div className="w-7 h-7 bg-white border border-slate-200 shadow-3xs rounded-full flex items-center justify-center shrink-0 z-10 text-[10px] font-mono font-semibold text-slate-500">
                  {actIdx + 1}
                </div>

                {/* Activity Detail Card */}
                <div className="flex-1 bg-white border border-slate-50 rounded-2xl p-4 space-y-2 hover:border-indigo-100/40 hover:shadow-3xs transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-600">
                        {activity.time}
                      </span>
                    </div>

                    {activity.estimatedCost && (
                      <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/30 px-2.5 py-0.5 rounded-md">
                        Est: {activity.estimatedCost}
                      </span>
                    )}
                  </div>

                  <h5 className="font-sans font-semibold text-slate-900 text-sm">
                    {activity.title}
                  </h5>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">
                    {activity.description}
                  </p>

                  {/* Human-like Tactical Details Badge Matrix */}
                  {(activity.idealHour || activity.crowdLevel || activity.fatigueLevel || activity.walkingDistance || activity.transportOption) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activity.idealHour && (
                        <span className="px-2 py-0.5 bg-indigo-50/70 text-indigo-700 border border-indigo-100/35 rounded-lg font-mono text-[9px] leading-none flex items-center gap-1">
                          ⏱️ {activity.idealHour}
                        </span>
                      )}
                      {activity.crowdLevel && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100/35 rounded-lg text-[9px] leading-none flex items-center gap-1">
                          👥 {activity.crowdLevel} Crowds
                        </span>
                      )}
                      {activity.fatigueLevel && (
                        <span className={`px-2 py-0.5 border rounded-lg text-[9px] leading-none flex items-center gap-1 ${
                          activity.fatigueLevel === "High" ? "bg-red-50 text-red-700 border-red-100/35" :
                          activity.fatigueLevel === "Moderate" ? "bg-orange-50 text-orange-700 border-orange-100/35" :
                          "bg-green-50 text-green-700 border-green-100/35"
                        }`}>
                          🏃 Fatigue: {activity.fatigueLevel}
                        </span>
                      )}
                      {activity.walkingDistance && (
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-150 rounded-lg font-mono text-[9px] leading-none flex items-center gap-1">
                          🚶 {activity.walkingDistance}
                        </span>
                      )}
                      {activity.transportOption && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100/40 rounded-lg text-[9px] leading-none flex items-center gap-1">
                          🚇 {activity.transportOption}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contextual Tips and Secret Attractions box */}
                  {(activity.localTips || activity.photographySpot || activity.nearbyRestSpot || activity.hiddenAttraction) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5 pt-2.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-150">
                      {activity.localTips && (
                        <div className="text-[10px] text-slate-500 leading-snug">
                          <strong className="text-slate-800">💡 Local Tip:</strong> {activity.localTips}
                        </div>
                      )}
                      {activity.photographySpot && (
                        <div className="text-[10px] text-slate-500 leading-snug">
                          <strong className="text-slate-800">📷 Photo Spot:</strong> {activity.photographySpot}
                        </div>
                      )}
                      {activity.nearbyRestSpot && (
                        <div className="text-[10px] text-slate-500 leading-snug">
                          <strong className="text-slate-800">☕ Café / Rest:</strong> {activity.nearbyRestSpot}
                        </div>
                      )}
                      {activity.hiddenAttraction && (
                        <div className="text-[10px] text-indigo-600 leading-snug">
                          <strong className="text-indigo-800">🔮 Secret Gem:</strong> {activity.hiddenAttraction}
                        </div>
                      )}
                    </div>
                  )}

                  {activity.location && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono pt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Basic local recommendation help tip */}
      <div className="text-[11px] text-slate-400 leading-snug pt-3 border-t border-slate-100/60 font-light flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span><strong>Pro Tip:</strong> Click the lodging, dining, or chemist directions above to preview geographical review stats ahead of time!</span>
      </div>

    </div>
  );
}
