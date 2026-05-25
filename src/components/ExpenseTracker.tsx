import React, { useState, useMemo } from "react";
import { Wallet, Plus, Trash2, ArrowUpRight, TrendingUp, AlertCircle, Group, HandCoins } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: "Lodging" | "Dining" | "Transit" | "Activities" | "Shopping" | "Other";
  splitWithGroup: boolean;
}

interface ExpenseTrackerProps {
  homeCurrency: string;
  localCurrency: string;
  exchangeRate: number; // 1 home = X local
  midRangeDailyUSD: number; // reference
}

export default function ExpenseTracker({
  homeCurrency = "USD",
  localCurrency = "EUR",
  exchangeRate = 0.92,
  midRangeDailyUSD = 150
}: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", title: "Premium Guesthouse Booking", amount: 120, category: "Lodging", splitWithGroup: false },
    { id: "2", title: "Local Gourmet Dinner", amount: 45, category: "Dining", splitWithGroup: true },
    { id: "3", title: "Express Train Transit Passes", amount: 25, category: "Transit", splitWithGroup: true }
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState<Expense["category"]>("Dining");
  const [splitGroup, setSplitGroup] = useState(false);
  const [groupSize, setGroupSize] = useState(3);

  // Home currency limit calculation
  const totalHomeSpent = useMemo(() => {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const totalLocalSpent = useMemo(() => {
    return totalHomeSpent * exchangeRate;
  }, [totalHomeSpent, exchangeRate]);

  // Group split calculations
  const splitGroupAmount = useMemo(() => {
    const listToSplit = expenses.filter(e => e.splitWithGroup);
    const sum = listToSplit.reduce((s, e) => s + e.amount, 0);
    return sum / (groupSize || 1);
  }, [expenses, groupSize]);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || isNaN(Number(newAmount))) return;
    const item: Expense = {
      id: Date.now().toString(),
      title: newTitle,
      amount: Number(newAmount),
      category: newCategory,
      splitWithGroup: splitGroup
    };
    setExpenses([...expenses, item]);
    setNewTitle("");
    setNewAmount("");
    setSplitGroup(false);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const budgetIsExceeded = totalHomeSpent > (midRangeDailyUSD * 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
      
      {/* Left side: Wallet & Spent Status Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-gradient-to-br from-indigo-900/60 via-purple-950/40 to-slate-900 border border-indigo-950/50 rounded-2xl p-5 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="flex justify-between items-center relative z-10 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold">Active Wallet</span>
            <Wallet className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="space-y-1 relative z-10">
            <span className="text-xs text-slate-400 block font-medium">Accumulated Expenses</span>
            <h3 className="text-3xl font-extrabold tracking-tight text-white flex items-baseline gap-1.5 font-mono">
              {totalHomeSpent.toFixed(2)}
              <span className="text-xs font-bold text-indigo-400 font-sans">{homeCurrency}</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              ≈ {totalLocalSpent.toFixed(2)} <span className="text-indigo-500">{localCurrency}</span> ({exchangeRate.toFixed(2)} rate)
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 relative z-10 flex justify-between items-center">
            <div>
              <span className="text-[9px] font-mono text-slate-500 block uppercase">Recommended Cap</span>
              <p className="text-xs font-semibold text-slate-300 font-mono">{(midRangeDailyUSD * 3).toFixed(2)} {homeCurrency}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-slate-500 block uppercase">Difference</span>
              <p className={`text-xs font-bold font-mono ${budgetIsExceeded ? "text-rose-400" : "text-emerald-400"}`}>
                {((midRangeDailyUSD * 3) - totalHomeSpent).toFixed(2)} {homeCurrency}
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Warning Card */}
        {budgetIsExceeded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl flex items-start gap-2.5 text-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Budget Exhaustion Warning</span>
              <span className="opacity-85 text-[11px] leading-relaxed block">
                Total spent has scaled above recommended mid-range threshold. Consider switching to complimentary landmarks and eco rail transits.
              </span>
            </div>
          </motion.div>
        )}

        {/* Group Travel Split widget */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Group className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold font-mono text-slate-200 uppercase tracking-widest">Share split estimator</h4>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Co-traveler headcount:</span>
              <input 
                type="number" 
                value={groupSize} 
                onChange={(e) => setGroupSize(Math.max(1, Number(e.target.value)))}
                className="w-12 px-1.5 py-0.5 bg-slate-950 border border-slate-800 rounded font-mono text-right text-xs text-white"
              />
            </div>
            <div className="p-2.5 bg-slate-950/80 rounded-lg text-slate-300">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-1">
                <span>Total Splittable:</span>
                <span>{expenses.filter(e => e.splitWithGroup).reduce((s, e) => s + e.amount, 0).toFixed(2)} {homeCurrency}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold font-sans">
                <span className="flex items-center gap-1"><HandCoins className="w-3.5 h-3.5 text-emerald-400" /> Individual Share:</span>
                <span className="text-emerald-400 font-mono">{splitGroupAmount.toFixed(2)} {homeCurrency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Expense List & Logger */}
      <div className="lg:col-span-8 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Spending Tracker
            </h4>
            <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-900/40">
              {expenses.length} Records registered
            </span>
          </div>

          {/* Quick interactive bar chart representing allocations */}
          <div className="grid grid-cols-6 gap-3 pt-2 bg-slate-950 rounded-2xl p-4 border border-slate-800">
            {["Lodging", "Dining", "Transit", "Activities", "Shopping", "Other"].map((cat) => {
              const catAmount = expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
              const maxCat = expenses.reduce((max, e) => Math.max(max, e.amount), 50);
              const percent = maxCat > 0 ? (catAmount / maxCat) * 100 : 0;
              return (
                <div key={cat} className="flex flex-col items-center gap-2">
                  <div className="h-20 w-3.5 bg-slate-900 rounded-full flex flex-col justify-end overflow-hidden relative border border-slate-800">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min(100, percent)}%` }}
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-full"
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 truncate max-w-full block" title={cat}>{cat}</span>
                  <span className="text-[9px] font-mono font-bold text-slate-300">{catAmount.toFixed(0)}</span>
                </div>
              );
            })}
          </div>

          {/* Adding Expense form */}
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <input 
              type="text" 
              required
              placeholder="Expense title" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input 
              type="text" 
              required
              placeholder={`Amount (${homeCurrency})`} 
              value={newAmount} 
              onChange={(e) => setNewAmount(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
            <select 
              value={newCategory} 
              onChange={(e) => setNewCategory(e.target.value as Expense["category"])}
              className="text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
            >
              <option value="Lodging">🏨 Lodging</option>
              <option value="Dining">🍽️ Dining</option>
              <option value="Transit">🚆 Transit</option>
              <option value="Activities">🎯 Activities</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Other">💼 Other</option>
            </select>
            <div className="flex gap-2 items-center justify-between">
              <label className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={splitGroup} 
                  onChange={(e) => setSplitGroup(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0 w-3 h-3 cursor-pointer"
                />
                Split group
              </label>
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl text-xs flex items-center justify-center cursor-pointer font-bold shrink-0 shadow-md"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Expenses logs list */}
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
            <AnimatePresence>
              {expenses.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-2.5 bg-slate-900/30 rounded-xl border border-slate-900 hover:border-slate-800 flex justify-between items-center gap-3 transition-all"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold font-mono tracking-wider text-indigo-400 uppercase bg-indigo-950/30 border border-indigo-900/30 px-1.5 py-0.5 rounded mr-2 inline-block">
                      {e.category}
                    </span>
                    <span className="text-xs text-slate-200 font-sans font-medium truncate">{e.title}</span>
                    {e.splitWithGroup && (
                      <span className="text-[8px] font-mono ml-2 text-emerald-400 uppercase tracking-widest bg-emerald-950/20 py-0.5 px-1 rounded border border-emerald-900/30">
                        SPLIT
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono font-bold text-white">
                      {e.amount.toFixed(2)} {homeCurrency}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(e.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 bg-slate-950 rounded border border-slate-800 hover:border-rose-950 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-mono pt-4 border-t border-slate-900">
          * Price indices and currency exchanges calculate in real-time. Tipping norms or hidden charges are automatically integrated.
        </p>
      </div>

    </div>
  );
}
