import React, { useState } from "react";
import { Award, Camera, Plus, Map, BookOpen, Quote, ShieldAlert, Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TimelineEvent {
  id: string;
  time: string;
  location: string;
  note: string;
  moodIndex: "😊" | "😮" | "❤️" | "😴" | "🚶";
}

interface TravelPassportProps {
  destination: string;
  country: string;
}

export default function TravelPassport({ destination, country }: TravelPassportProps) {
  const [stamps, setStamps] = useState<string[]>([
    "🇯🇵 KYOTO", "🇮🇸 REYKJAVIK", "🇮🇹 ROMA"
  ]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    { id: "1", time: "Day 1 09:30 AM", location: "Grand Entryway", note: "Watched the sunrise overlooking the old castle. Stunning quiet light.", moodIndex: "❤️" },
    { id: "2", time: "Day 2 02:15 PM", location: "Traditional Bistro", note: "Discovered a cozy local shop down a narrow alley. Extraordinary traditional soup.", moodIndex: "😊" }
  ]);
  const [newNote, setNewNote] = useState("");
  const [newLoc, setNewLoc] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newMood, setNewMood] = useState<TimelineEvent["moodIndex"]>("😊");

  // Simple simulated stamp for CURRENT destination
  const hasCurrentStamp = stamps.includes(`${country.substring(0, 2).toUpperCase()} ${destination.toUpperCase()}`);

  const handleClaimStamp = () => {
    const stampText = `${country.substring(0, 2).toUpperCase()} ${destination.toUpperCase()}`;
    if (stamps.includes(stampText)) return;
    setStamps([...stamps, stampText]);
  };

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !newLoc.trim()) return;
    const event: TimelineEvent = {
      id: Date.now().toString(),
      time: newTime || "Day 1 12:00 PM",
      location: newLoc,
      note: newNote,
      moodIndex: newMood
    };
    setTimeline([event, ...timeline]);
    setNewNote("");
    setNewLoc("");
    setNewTime("");
  };

  const achievements = [
    { name: "Pioneer Trailblazer", desc: "First generated Custom AI Dossier", icon: Trophy, unlocked: true },
    { name: "Culture Seeker", desc: "Practiced 6 local language pronunciations", icon: Award, unlocked: stamps.length >= 1 },
    { name: "Safety General", desc: "Secured emergency contact lines in offline storage", icon: Trophy, unlocked: stamps.length >= 3 },
    { name: "Eco Guardian", desc: "Achieved sustainable travel score above 75", icon: Sparkles, unlocked: true }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
      
      {/* Visual Stamps & Certifications */}
      <div className="lg:col-span-5 space-y-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">Digital Passport Stamps</h3>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {stamps.map((stamp, idx) => (
            <motion.div
              key={stamp}
              whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 3 : -3 }}
              className="aspect-square bg-slate-900 border border-indigo-950 border-dashed rounded-full flex flex-col items-center justify-center p-3 relative shadow-md group overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-all" />
              <div className="w-16 h-16 border border-indigo-500/20 rounded-full flex flex-col items-center justify-center border-dashed relative z-10 text-center">
                <span className="text-[14px] leading-none mb-1">✈️</span>
                <span className="text-[9px] font-mono font-black text-indigo-400 leading-none tracking-widest uppercase block max-w-full truncate">{stamp}</span>
                <span className="text-[7px] font-mono text-slate-500 mt-1 uppercase">UNLOCKED</span>
              </div>
            </motion.div>
          ))}

          {/* Claim Current stamp button if not registered */}
          {!hasCurrentStamp && (
            <motion.button
              onClick={handleClaimStamp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="aspect-square border border-indigo-600/30 border-dashed bg-indigo-950/25 rounded-full flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all hover:bg-indigo-950/45 group"
            >
              <span className="text-lg animate-bounce duration-1000">📥</span>
              <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest mt-1 group-hover:text-white transition-all">Claim Stamp</span>
              <span className="text-[8px] text-slate-500 font-sans mt-0.5 max-w-[80px] leading-tight block">{destination}</span>
            </motion.button>
          )}
        </div>

        {/* Travel Achievements progress */}
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl space-y-3 mt-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> achievements
            </span>
            <span className="text-[9px] font-mono text-slate-500">
              {achievements.filter(a => a.unlocked).length} / {achievements.length}
            </span>
          </div>
          <div className="space-y-2">
            {achievements.map((item) => (
              <div key={item.name} className="flex items-start gap-2.5 p-2 bg-slate-950/40 rounded-xl border border-slate-900">
                <item.icon className={`w-4 h-4 shrink-0 mt-0.5 ${item.unlocked ? "text-amber-500" : "text-slate-600"}`} />
                <div className="min-w-0">
                  <h4 className={`text-[11px] font-bold ${item.unlocked ? "text-slate-200" : "text-slate-500"}`}>{item.name}</h4>
                  <p className="text-[9px] text-slate-500 truncate leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Timeline & Journaling */}
      <div className="lg:col-span-7 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold font-mono tracking-widest uppercase text-slate-400 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-indigo-400" /> memory timeline & notes
            </h4>
            <span className="text-[9px] font-mono text-slate-500">chronological memories</span>
          </div>

          {/* Quick timeline form */}
          <form onSubmit={handleAddTimeline} className="space-y-2.5 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Day / Time (e.g. Day 1 2:30 PM)"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="text-[11px] px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              <input
                type="text"
                required
                placeholder="Location / Spot"
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
                className="text-[11px] px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <textarea
              required
              rows={2}
              placeholder="Record a journal entry, sensory note or local memory..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-snug font-sans resize-none"
            />

            <div className="flex justify-between items-center pt-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-mono">Current Mood:</span>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
                  {(["😊", "😮", "❤️", "😴", "🚶"] as TimelineEvent["moodIndex"][]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setNewMood(m)}
                      className={`w-5 h-5 flex items-center justify-center text-xs rounded transition-all cursor-pointer ${
                        newMood === m ? "bg-indigo-600/60 scale-110" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold font-mono tracking-wider uppercase flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Log memory
              </button>
            </div>
          </form>

          {/* Sequential Timeline List */}
          <div className="space-y-4 pl-3 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-indigo-950/70 max-h-[220px] overflow-y-auto pr-1 mt-4">
            <AnimatePresence>
              {timeline.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="relative pl-7 space-y-1 group"
                >
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-950 border border-indigo-900/60 flex items-center justify-center text-xs relative z-10 font-mono shadow-sm group-hover:scale-110 transition-transform">
                    {event.moodIndex}
                  </div>
                  
                  <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-3 hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                      <span className="text-slate-400 font-bold">{event.time}</span>
                      <span>@{event.location}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">{event.note}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  );
}
