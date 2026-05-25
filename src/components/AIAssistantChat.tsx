import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantChatProps {
  destination: string;
  personality: string;
}

export default function AIAssistantChat({ destination, personality = "Standard" }: AIAssistantChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: `Hi there! I'm your Smart Voyage AI companion. Ask me anything about local dining, safety tips, hidden gems, or weather-adaptive routes in **${destination || "your target destination"}**!` }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sending) return;

    const userMsg = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: messages,
          destination,
          personality
        })
      });

      if (!response.ok) {
        throw new Error("Chat failed to consult. Check connectivity.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "⚠️ Sorry, my synaptic flight telemetry has stalled. Check your internet connection or verify your API keys." }
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating capsule trigger button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            layoutId="chat-capsule"
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white flex items-center justify-center shadow-xl cursor-pointer relative group border border-indigo-400/20"
          >
            <MessageSquare className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Actual Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="chat-capsule"
            className="w-[340px] sm:w-[400px] h-[500px] bg-slate-950/95 border border-slate-800/80 rounded-3xl overflow-hidden flex flex-col shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
          >
            {/* Header section with high-tech status */}
            <div className="p-4 bg-gradient-to-r from-indigo-900/60 to-purple-950/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-500/15 rounded-lg text-indigo-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100 font-sans tracking-tight">Voyage Assistant capsule</h4>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">{personality} Companion Active</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message streams render */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.role === "user" 
                      ? "bg-indigo-600 text-white rounded-tr-none font-medium shadow-md"
                      : "bg-slate-900/80 text-slate-200 rounded-tl-none border border-slate-800 shadow-sm"
                  }`}>
                    {m.role === "assistant" && idx === 0 ? (
                      <p dangerouslySetInnerHTML={{ __html: m.content }} />
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl rounded-tl-none p-3.5 text-xs text-slate-400 flex items-center gap-2 shadow-inner">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Gemini is compiling advice...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input message form footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800/60 flex items-center gap-2">
              <input
                type="text"
                required
                placeholder={`Ask about ${destination || "dining, hidden spots, transport"}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={sending || !inputValue.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
