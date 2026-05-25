import React, { useState } from "react";
import { Languages, Volume2, Copy, Search, Send, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TranslationPhrase, TranslationResponse } from "../types";

interface TranslationHelperProps {
  localPhrases: TranslationPhrase[];
  targetLanguage: string;
}

export default function TranslationHelper({ localPhrases, targetLanguage }: TranslationHelperProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [customText, setCustomText] = useState("");
  const [translating, setTranslating] = useState(false);
  const [customTranslation, setCustomTranslation] = useState<TranslationResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCustom, setCopiedCustom] = useState(false);

  const categories = ["all", "greetings", "dining", "shopping", "medical", "emergency"];

  const filteredPhrases = localPhrases.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category?.toLowerCase() === activeCategory;
    const matchesSearch =
      p.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.local.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.pronunciation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTranslateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    setTranslating(true);
    setCustomTranslation(null);

    try {
      const response = await fetch("/api/translate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customText, targetLanguage }),
      });
      if (!response.ok) {
        throw new Error("Translation request failed");
      }
      const data: TranslationResponse = await response.json();
      setCustomTranslation(data);
    } catch (error) {
      console.error(error);
    } finally {
      setTranslating(false);
    }
  };

  const copyToClipboard = (text: string, index: number | "custom") => {
    navigator.clipboard.writeText(text);
    if (index === "custom") {
      setCopiedCustom(true);
      setTimeout(() => setCopiedCustom(false), 2000);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Convert text to speech using Web Speech API if supported
  const speakText = (text: string, langCode: string) => {
    if ("speechSynthesis" in window) {
      // Create a clean utterance
      const utterance = new SpeechSynthesisUtterance(text);
      // Try resolving voice based on target language name
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => 
        v.lang.toLowerCase().includes(langCode.toLowerCase()) || 
        v.name.toLowerCase().includes(targetLanguage.toLowerCase())
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.rate = 0.85; // Slightly slower for better pronunciation comprehension
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="translation-helper-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Translation Dictionary & Quick Search */}
      <div className="lg:col-span-7 bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-sans font-semibold text-lg text-slate-900 flex items-center gap-2">
              <Languages className="w-5 h-5 text-emerald-600" />
              Essential Quick Phrases
            </h3>
            <p className="text-xs text-slate-500">Useful phrases translated to Local Language</p>
          </div>
          <span className="text-xs font-mono font-medium px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            {targetLanguage}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search words, English phrase, or pronunciation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100/80 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-slate-800 transition-all font-sans"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 scrollbar-none snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all shrink-0 snap-start ${
                activeCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List of Phrases */}
        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {filteredPhrases.length > 0 ? (
              filteredPhrases.map((phrase, idx) => (
                <motion.div
                  layout
                  key={phrase.english + idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3.5 bg-white border border-slate-50/80 hover:border-slate-100 rounded-2xl flex items-center justify-between gap-4 transition-all hover:shadow-xs group"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-xs font-mono font-medium px-2 py-0.5 bg-slate-50 text-slate-500 rounded-md border border-slate-100 mr-2 uppercase">
                      {phrase.category || "General"}
                    </span>
                    <h4 className="font-sans font-medium text-slate-800 text-sm">{phrase.english}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-emerald-700 text-sm tracking-wide">{phrase.local}</p>
                      <span className="text-xs text-slate-400 font-mono">({phrase.pronunciation})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => speakText(phrase.local, targetLanguage)}
                      title="Speak pronunciation"
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(phrase.local, idx)}
                      title="Copy local phrase"
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all relative"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 text-center text-slate-400 text-sm font-sans"
              >
                No phrases match your criteria
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Voice/Text Custom Translator */}
      <div className="lg:col-span-5 bg-white/70 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <h3 className="font-sans font-semibold text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              Custom Quick Translator
            </h3>
            <p className="text-xs text-slate-500">Need specific words? Translate any custom phrase on the go.</p>
          </div>

          <form onSubmit={handleTranslateCustom} className="space-y-3">
            <div className="relative">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={`Type custom English terms to translate into ${targetLanguage || "local language"}...`}
                rows={3}
                className="w-full p-4 bg-slate-50 border border-slate-100/80 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-slate-800 transition-all font-sans resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={translating || !customText.trim()}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-medium text-sm rounded-2xl transition-all shadow-sm shadow-emerald-600/10 flex items-center justify-center gap-2"
            >
              {translating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Translate to {targetLanguage}
                </>
              )}
            </button>
          </form>

          {/* Translation Result Card */}
          <AnimatePresence mode="wait">
            {customTranslation && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 bg-gradient-to-br from-emerald-50/40 to-teal-50/20 border border-emerald-100/60 rounded-2xl space-y-3.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-md">
                      Translation Result
                    </span>
                    <p className="text-xs text-slate-500 italic mt-1 font-sans">"{customText}"</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => speakText(customTranslation.translatedText, targetLanguage)}
                      className="p-2 bg-white border border-emerald-100/40 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-all shadow-2xs"
                      title="Speak Translation"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(customTranslation.translatedText, "custom")}
                      className="p-2 bg-white border border-emerald-100/40 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-all shadow-2xs"
                      title="Copy"
                    >
                      {copiedCustom ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xl font-bold text-slate-950 font-sans tracking-wide">
                    {customTranslation.translatedText}
                  </div>
                  <div className="text-xs text-emerald-800 font-mono bg-emerald-50/50 px-3 py-1.5 rounded-xl inline-block border border-emerald-100/30">
                    Phonetic: <span className="font-semibold">{customTranslation.pronunciation}</span>
                  </div>
                </div>

                {customTranslation.notes && (
                  <div className="text-xs text-slate-600 bg-white/65 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-medium text-slate-800 block mb-0.5">Usage Tip:</span>
                    {customTranslation.notes}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Informational tip at bottom */}
        <div className="text-[11px] text-slate-400 mt-6 pt-3 border-t border-slate-100/60 leading-relaxed">
          💡 <strong>Speaker Tip:</strong> Play the pronunciation helpers or copy and paste local characters into taxi screens or checkout queues. Language barriers disappear!
        </div>
      </div>
    </div>
  );
}
