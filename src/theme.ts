export type ThemeMode =
  | "introvert"
  | "extrovert"
  | "adventure"
  | "romantic"
  | "luxury"
  | "healing"
  | "nightlife"
  | "spiritual"
  | "photographer"
  | "standard";

export interface ThemeConfig {
  mode: ThemeMode;
  name: string;
  tagline: string;
  
  // Layout and Backgrounds
  background: string;       // Tailwind background classes
  canvasOverlay: string;    // Interactive background meshes / gradients
  cardStyle: string;        // Component border & backdrop styling
  cardHover: string;        // Hover transformations
  
  // Interactive Colors & Highlights
  accent: string;           // Core hex color (e.g., "#818cf8")
  accentLighter: string;    // Core lighter flavor (e.g., "#a5b4fc")
  textAccent: string;       // Tailwind accent text (e.g., "text-indigo-400")
  bgAccent: string;         // Tailwind accent bg (e.g., "bg-indigo-600")
  glowClass: string;        // Text / Icon / Border glow
  buttonStyle: string;      // Themed action buttons
  buttonGlow: string;       // Button hover glow effects
  
  // Map Styling customization
  mapPathColor: string;     // Color of animated route polylines
  mapMarkerGlow: string;    // Custom map marker colors / glow classes
  mapBgStyle: string;       // Style profile for the custom canvas map
  
  // Particles & Atmospheric Lights
  particles: string[];      // Floating bubble/light colors
  lightingEffectCount: number; // Number of floating background light blobs
  lightingColors: string[]; // Colors for full-viewport aurora lights

  // Fine Typography adjustments
  headingWeight: string;   // font-black, font-bold, font-semibold
  fontClass: string;        // Custom tracking/font adjustments
  densitySpacing: string;   // Tight index or cozy index spacing adjustments

  // Motion physics
  transitionDuration: number; // Animated transitions timing (e.g. 0.4s to 1.5s)
  transitionEase: number[]; // Framer Motion ease curves (cubic beziers)
}

export const THEME_CONFIGS: Record<ThemeMode, ThemeConfig> = {
  introvert: {
    mode: "introvert",
    name: "Cozy Solitude",
    tagline: "Calm, minimal, soft quietude for self-reflection & slow pacing.",
    background: "bg-gradient-to-tr from-[#0e1026] via-[#16133a] to-[#251245] text-slate-100",
    canvasOverlay: "bg-radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.2),rgba(15,18,36,0.3))",
    cardStyle: "bg-slate-900/40 backdrop-blur-xl border border-indigo-950/40 rounded-3xl",
    cardHover: "hover:border-indigo-800/40 hover:-translate-y-0.5",
    accent: "#818cf8",
    accentLighter: "#c7d2fe",
    textAccent: "text-indigo-300",
    bgAccent: "bg-indigo-600/70",
    glowClass: "drop-shadow-[0_0_12px_rgba(129,140,248,0.4)]",
    buttonStyle: "bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-200 border border-indigo-800/50",
    buttonGlow: "shadow-[0_0_12px_rgba(129,140,248,0.15)]",
    mapPathColor: "#818cf8",
    mapMarkerGlow: "rgba(129,140,248,0.4)",
    mapBgStyle: "topological-soft",
    particles: ["rgba(129,140,248,0.3)", "rgba(165,180,252,0.2)"],
    lightingEffectCount: 3,
    lightingColors: ["from-indigo-500/20 via-purple-500/15 to-transparent", "from-indigo-600/15 via-blue-500/10 to-transparent", "from-pink-500/10 to-transparent"],
    headingWeight: "font-semibold tracking-tight",
    fontClass: "font-sans leading-relaxed tracking-normal",
    densitySpacing: "space-y-4",
    transitionDuration: 1.2,
    transitionEase: [0.25, 0.8, 0.25, 1], // Slow elegant spring-like ease
  },
  extrovert: {
    mode: "extrovert",
    name: "Electric Pulse",
    tagline: "High energy, rich interaction, dynamic neon & responsive sparks.",
    background: "bg-gradient-to-br from-[#2a083d] via-[#1c0024] to-[#510432] text-[#ffeef4]",
    canvasOverlay: "bg-radial-gradient(ellipse_at_bottom_left,rgba(244,63,94,0.35),rgba(20,5,30,0.45))",
    cardStyle: "bg-[#180a25]/60 border border-pink-500/25 rounded-3xl",
    cardHover: "hover:border-pink-500/60 hover:-translate-y-1.5 hover:shadow-[0_8px_30px_rgb(244,63,94,0.15)]",
    accent: "#f43f5e",
    accentLighter: "#fda4af",
    textAccent: "text-pink-400",
    bgAccent: "bg-pink-600",
    glowClass: "drop-shadow-[0_0_15px_rgba(244,63,94,0.75)]",
    buttonStyle: "bg-gradient-to-r from-pink-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-bold",
    buttonGlow: "shadow-[0_0_20px_rgba(244,63,94,0.4)]",
    mapPathColor: "#f43f5e",
    mapMarkerGlow: "rgba(244,63,94,0.6)",
    mapBgStyle: "neon-vibrant",
    particles: ["rgba(244,63,94,0.45)", "rgba(245,158,11,0.35)", "rgba(236,72,153,0.4)"],
    lightingEffectCount: 4,
    lightingColors: ["from-pink-500/25 via-red-500/20 to-transparent", "from-amber-500/20 to-transparent", "from-rose-500/25 via-purple-500/15 to-transparent"],
    headingWeight: "font-black tracking-normal uppercase italic",
    fontClass: "font-display leading-snug tracking-wider",
    densitySpacing: "space-y-7",
    transitionDuration: 0.45,
    transitionEase: [0.175, 0.885, 0.32, 1.275], // High-speed bouncy ease
  },
  adventure: {
    mode: "adventure",
    name: "Wild Frontier",
    tagline: "Rugged contrasts, deep survival alerts, and forest exploration gears.",
    background: "bg-gradient-to-tr from-[#041a0e] via-[#082a17] to-[#123d24] text-[#effbea]",
    canvasOverlay: "bg-radial-gradient(circle_at_center,rgba(16,185,129,0.22),rgba(5,11,7,0.3))",
    cardStyle: "bg-emerald-950/30 border border-emerald-900/40 rounded-3xl",
    cardHover: "hover:border-emerald-500/50 hover:bg-emerald-950/45 hover:-translate-y-1",
    accent: "#10b981",
    accentLighter: "#6ee7b7",
    textAccent: "text-emerald-400",
    bgAccent: "bg-emerald-600",
    glowClass: "drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]",
    buttonStyle: "bg-emerald-900 text-emerald-100 font-semibold border border-emerald-700/60 hover:bg-emerald-800",
    buttonGlow: "shadow-[0_0_15px_rgba(16,185,129,0.25)]",
    mapPathColor: "#059669",
    mapMarkerGlow: "rgba(16,185,129,0.45)",
    mapBgStyle: "terrain-rugged",
    particles: ["rgba(16,185,129,0.3)", "rgba(52,211,153,0.25)"],
    lightingEffectCount: 3,
    lightingColors: ["from-emerald-500/25 via-teal-500/20 to-transparent", "from-teal-600/20 via-yellow-500/10 to-transparent", "from-emerald-400/15 to-transparent"],
    headingWeight: "font-extrabold tracking-tight uppercase",
    fontClass: "font-sans tracking-wide leading-relaxed",
    densitySpacing: "space-y-6",
    transitionDuration: 0.75,
    transitionEase: [0.19, 1, 0.22, 1], // Smooth progressive deceleration
  },
  romantic: {
    mode: "romantic",
    name: "Sunset Harmony",
    tagline: "Dreamy tones, starry gradients, and poetic candlelit recommendations.",
    background: "bg-gradient-to-br from-[#3b0c22] via-[#20030f] to-[#51062b] text-[#ffdbe7]",
    canvasOverlay: "bg-radial-gradient(ellipse_at_top,rgba(219,39,119,0.25),rgba(251,113,133,0.15))",
    cardStyle: "bg-[#180613]/55 border border-pink-700/25 rounded-3xl backdrop-blur-lg",
    cardHover: "hover:border-pink-500 hover:shadow-[0_10px_35px_rgba(219,39,119,0.12)] hover:-translate-y-1",
    accent: "#db2777",
    accentLighter: "#f472b6",
    textAccent: "text-rose-400",
    bgAccent: "bg-rose-600",
    glowClass: "drop-shadow-[0_0_15px_rgba(219,39,119,0.65)]",
    buttonStyle: "bg-gradient-to-tr from-pink-600/90 to-rose-500/90 hover:from-pink-500 hover:to-rose-400 text-white font-medium",
    buttonGlow: "shadow-[0_0_18px_rgba(219,39,119,0.3)]",
    mapPathColor: "#db2777",
    mapMarkerGlow: "rgba(219,39,119,0.5)",
    mapBgStyle: "sunset-dream",
    particles: ["rgba(219,39,119,0.35)", "rgba(251,113,133,0.3)", "rgba(129,140,248,0.25)"],
    lightingEffectCount: 4,
    lightingColors: ["from-pink-500/30 via-rose-500/20 to-transparent", "from-purple-500/20 via-orange-500/15 to-transparent", "from-rose-600/20 to-transparent"],
    headingWeight: "font-bold tracking-tight",
    fontClass: "font-display font-light text-rose-50/95 leading-relaxed",
    densitySpacing: "space-y-5.5",
    transitionDuration: 1.0,
    transitionEase: [0.4, 0, 0.2, 1], // Fluid cinematic curve
  },
  luxury: {
    mode: "luxury",
    name: "Golden Meridian",
    tagline: "Glossy obsidian overlays, pure polished serif elegance, and golden aura indicators.",
    background: "bg-gradient-to-tr from-[#161208] via-[#080808] to-[#2c200c] text-[#fbf6ec]",
    canvasOverlay: "bg-radial-gradient(circle_at_top_right,rgba(234,179,8,0.12),rgba(0,0,0,0))",
    cardStyle: "bg-black/80 backdrop-blur-2xl border border-yellow-600/30 rounded-3xl shadow-[inset_0_1px_rgba(255,255,255,0.05)]",
    cardHover: "hover:border-yellow-500/60 hover:shadow-[0_0_40px_rgba(234,179,8,0.08)] hover:-translate-y-1",
    accent: "#eab308",
    accentLighter: "#fef08a",
    textAccent: "text-amber-400",
    bgAccent: "bg-yellow-600",
    glowClass: "drop-shadow-[0_0_15px_rgba(234,179,8,0.7)]",
    buttonStyle: "bg-[#111111] hover:bg-neutral-900 text-amber-400 font-semibold border border-yellow-500/40 uppercase tracking-widest",
    buttonGlow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]",
    mapPathColor: "#ca8a04",
    mapMarkerGlow: "rgba(234,179,8,0.4)",
    mapBgStyle: "golden-glass",
    particles: ["rgba(234,179,8,0.3)", "rgba(253,224,71,0.2)"],
    lightingEffectCount: 3,
    lightingColors: ["from-yellow-400/20 via-amber-500/15 to-transparent", "from-yellow-600/15 via-orange-500/10 to-transparent", "from-zinc-100/10 to-transparent"],
    headingWeight: "font-light tracking-[0.12em] font-sans uppercase",
    fontClass: "font-sans leading-relaxed tracking-wider",
    densitySpacing: "space-y-6",
    transitionDuration: 0.9,
    transitionEase: [0.22, 1, 0.36, 1], // Highly controlled premium deceleration
  },
  healing: {
    mode: "healing",
    name: "Aura Oasis",
    tagline: "Pastel therapeutic waves, organic moss cues, and slow diaphragmatic transitions.",
    background: "bg-gradient-to-br from-[#0c2226] via-[#051113] to-[#1d3536] text-[#eef7f8]",
    canvasOverlay: "bg-radial-gradient(circle_at_center,rgba(45,212,191,0.22),rgba(11,16,17,0.3))",
    cardStyle: "bg-teal-950/20 backdrop-blur-xl border border-teal-900/35 rounded-3xl",
    cardHover: "hover:border-teal-500/30 hover:bg-teal-950/30 hover:-translate-y-0.5",
    accent: "#2dd4bf",
    accentLighter: "#99f6e4",
    textAccent: "text-teal-400",
    bgAccent: "bg-teal-600",
    glowClass: "drop-shadow-[0_0_12px_rgba(45,212,191,0.45)]",
    buttonStyle: "bg-teal-950/60 hover:bg-teal-950 border border-teal-800/40 text-teal-300 font-medium",
    buttonGlow: "shadow-[0_0_15px_rgba(45,212,191,0.2)]",
    mapPathColor: "#0d9488",
    mapMarkerGlow: "rgba(45,212,191,0.4)",
    mapBgStyle: "topological-soft-green",
    particles: ["rgba(45,212,191,0.35)", "rgba(153,246,228,0.25)", "rgba(129,140,248,0.25)"],
    lightingEffectCount: 3,
    lightingColors: ["from-teal-400/25 via-emerald-400/20 to-transparent", "from-sky-400/20 via-indigo-500/15 to-transparent", "from-teal-500/15 to-transparent"],
    headingWeight: "font-medium tracking-wide",
    fontClass: "font-sans leading-relaxed tracking-normal text-[14px]",
    densitySpacing: "space-y-4.5",
    transitionDuration: 1.4,
    transitionEase: [0.32, 0.94, 0.6, 1], // Calm wave ease
  },
  nightlife: {
    mode: "nightlife",
    name: "Cyber Tokyo",
    tagline: "Cyberpunk strobe pulses, dark neon grids, and intense sensory hot spots.",
    background: "bg-gradient-to-tr from-[#1b0338] via-[#04010a] to-[#3d056b] text-[#f2e7ff]",
    canvasOverlay: "bg-radial-gradient(ellipse_at_top,rgba(168,85,247,0.25),rgba(4,1,10,0.4))",
    cardStyle: "bg-purple-950/30 backdrop-blur-xl border border-fuchsia-500/25 rounded-3xl",
    cardHover: "hover:border-fuchsia-500/55 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:-translate-y-1.5",
    accent: "#a855f7",
    accentLighter: "#e9d5ff",
    textAccent: "text-purple-400",
    bgAccent: "bg-fuchsia-600",
    glowClass: "drop-shadow-[0_0_15px_rgba(168,85,247,0.85)]",
    buttonStyle: "bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 text-white font-bold border border-fuchsia-400/30",
    buttonGlow: "shadow-[0_0_25px_rgba(168,85,247,0.55)]",
    mapPathColor: "#c084fc",
    mapMarkerGlow: "rgba(168,85,247,0.6)",
    mapBgStyle: "dark-neon-grid",
    particles: ["rgba(168,85,247,0.45)", "rgba(236,72,153,0.35)", "rgba(6,182,212,0.35)"],
    lightingEffectCount: 5,
    lightingColors: ["from-purple-500/30 via-fuchsia-500/25 to-transparent", "from-cyan-500/25 via-blue-500/20 to-transparent", "from-fuchsia-600/25 to-transparent"],
    headingWeight: "font-black tracking-[0.05em] uppercase font-mono italic",
    fontClass: "font-mono leading-normal tracking-wide",
    densitySpacing: "space-y-6.5",
    transitionDuration: 0.5,
    transitionEase: [0.1, 0.9, 0.2, 1], // Quick snaps
  },
  spiritual: {
    mode: "spiritual",
    name: "Cosmic Dharma",
    tagline: "Earthy sepia tones, terracotta gradients, and slow celestial ripples.",
    background: "bg-gradient-to-br from-[#33170a] via-[#0f0805] to-[#4f1e07] text-[#f8ede4]",
    canvasOverlay: "bg-radial-gradient(circle_at_top,rgba(249,115,22,0.18),rgba(11,7,4,0.3))",
    cardStyle: "bg-orange-950/15 backdrop-blur-2xl border border-orange-900/30 rounded-3xl",
    cardHover: "hover:border-orange-500/50 hover:bg-orange-950/25 hover:-translate-y-1",
    accent: "#ea580c",
    accentLighter: "#ffedd5",
    textAccent: "text-orange-400",
    bgAccent: "bg-orange-600",
    glowClass: "drop-shadow-[0_0_12px_rgba(249,115,22,0.45)]",
    buttonStyle: "bg-orange-950 text-orange-200 border border-orange-800 rounded-2xl hover:bg-orange-900",
    buttonGlow: "shadow-[0_0_15px_rgba(249,115,22,0.18)]",
    mapPathColor: "#ea580c",
    mapMarkerGlow: "rgba(249,115,22,0.35)",
    mapBgStyle: "earthy-stone",
    particles: ["rgba(249,115,22,0.35)", "rgba(253,186,116,0.25)", "rgba(120,113,108,0.25)"],
    lightingEffectCount: 3,
    lightingColors: ["from-orange-500/25 via-amber-600/20 to-transparent", "from-stone-500/15 via-amber-500/10 to-transparent", "from-orange-600/20 to-transparent"],
    headingWeight: "font-medium tracking-tight",
    fontClass: "font-sans leading-relaxed tracking-normal font-light",
    densitySpacing: "space-y-5",
    transitionDuration: 1.1,
    transitionEase: [0.25, 1, 0.5, 1], // Steady breathing flow ease
  },
  photographer: {
    mode: "photographer",
    name: "Cinematic Reel",
    tagline: "High contrast dark lens, spotlight drop shadows, and dramatic depth of field.",
    background: "bg-gradient-to-br from-[#121217] via-[#030303] to-[#242433] text-[#f3f4f6]",
    canvasOverlay: "bg-radial-gradient(circle_at_center,rgba(255,255,255,0.1),rgba(3,3,3,0))",
    cardStyle: "bg-[#0d0d0d] border border-neutral-800 rounded-3xl relative shadow-[0_12px_40px_rgba(0,0,0,0.6)]",
    cardHover: "hover:border-neutral-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:-translate-y-1",
    accent: "#ffffff",
    accentLighter: "#d1d5db",
    textAccent: "text-zinc-100",
    bgAccent: "bg-white text-black",
    glowClass: "drop-shadow-[0_0_10px_rgba(255,255,255,0.65)]",
    buttonStyle: "bg-white text-black hover:bg-neutral-200 uppercase tracking-widest font-bold font-mono",
    buttonGlow: "shadow-[0_0_15px_rgba(255,255,255,0.25)]",
    mapPathColor: "#ffffff",
    mapMarkerGlow: "rgba(255,255,255,0.55)",
    mapBgStyle: "cinematic-exposure",
    particles: ["rgba(255,255,255,0.3)", "rgba(156,163,175,0.15)"],
    lightingEffectCount: 3,
    lightingColors: ["from-white/10 via-zinc-400/10 to-transparent", "from-zinc-100/5 to-transparent", "from-zinc-900/60 to-transparent"],
    headingWeight: "font-extrabold tracking-[-0.03em] font-sans",
    fontClass: "font-sans tracking-wide leading-relaxed font-normal",
    densitySpacing: "space-y-6",
    transitionDuration: 0.8,
    transitionEase: [0.16, 1, 0.3, 1], // Perfect camera lens shutter deceleration
  },
  standard: {
    mode: "standard",
    name: "Aero Flight",
    tagline: "Standard corporate slate colors, precise lines, and default booking trackers.",
    background: "bg-gradient-to-tr from-[#0e0f33] via-[#050614] to-[#1e1445] text-slate-100",
    canvasOverlay: "bg-radial-gradient(ellipse_at_top,rgba(99,102,241,0.22),transparent)",
    cardStyle: "bg-slate-900/35 border border-slate-900 rounded-3xl",
    cardHover: "hover:border-slate-800 hover:-translate-y-0.5",
    accent: "#6366f1",
    accentLighter: "#818cf8",
    textAccent: "text-indigo-400",
    bgAccent: "bg-indigo-600",
    glowClass: "drop-shadow-[0_0_10px_rgba(99,102,241,0.45)]",
    buttonStyle: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold",
    buttonGlow: "shadow-[0_0_12px_rgba(99,102,241,0.2)]",
    mapPathColor: "#6366f1",
    mapMarkerGlow: "rgba(99,102,241,0.35)",
    mapBgStyle: "topological-default",
    particles: ["rgba(99,102,241,0.3)", "rgba(129,140,248,0.2)"],
    lightingEffectCount: 3,
    lightingColors: ["from-indigo-500/20 via-pink-500/15 to-transparent", "from-blue-500/15 to-transparent", "from-indigo-600/15 to-transparent"],
    headingWeight: "font-bold tracking-tight",
    fontClass: "font-sans leading-relaxed tracking-normal",
    densitySpacing: "space-y-5",
    transitionDuration: 0.7,
    transitionEase: [0.25, 0.1, 0.25, 1],
  },
};

export function getThemeByVibe(personality: string, mood: string): ThemeConfig {
  const normPers = personality.trim().toLowerCase();
  const normMood = mood.trim().toLowerCase();

  // 1. Highest priority: explicit mood matching
  if (normMood.includes("romantic") || normMood.includes("sunset") || normMood.includes("couple")) {
    return THEME_CONFIGS.romantic;
  }
  if (normMood.includes("nightlife") || normMood.includes("chaos") || normMood.includes("club") || normMood.includes("rave") || normMood.includes("cyber") || normMood.includes("dark")) {
    return THEME_CONFIGS.nightlife;
  }
  if (normMood.includes("healing") || normMood.includes("quiet") || normMood.includes("peaceful") || normMood.includes("calm") || normMood.includes("retreat")) {
    return THEME_CONFIGS.healing;
  }
  if (normMood.includes("nature") || normMood.includes("adventure") || normMood.includes("rugged") || normMood.includes("hike") || normMood.includes("mountain")) {
    return THEME_CONFIGS.adventure;
  }

  // 2. Personality-based matches
  if (normPers.includes("introvert") || normPers.includes("slow") || normPers.includes("solo")) {
    return THEME_CONFIGS.introvert;
  }
  if (normPers.includes("extrovert") || normPers.includes("party") || normPers.includes("lively")) {
    return THEME_CONFIGS.extrovert;
  }
  if (normPers.includes("adventure") || normPers.includes("seeker") || normPers.includes("trek") || normPers.includes("survivor")) {
    return THEME_CONFIGS.adventure;
  }
  if (normPers.includes("luxury") || normPers.includes("premium") || normPers.includes("elite")) {
    return THEME_CONFIGS.luxury;
  }
  if (normPers.includes("spiritual") || normPers.includes("pilgrim") || normPers.includes("zen")) {
    return THEME_CONFIGS.spiritual;
  }
  if (normPers.includes("photographer") || normPers.includes("lens") || normPers.includes("shutter")) {
    return THEME_CONFIGS.photographer;
  }
  if (normPers.includes("foodie") || normPers.includes("culinary") || normPers.includes("gourmet")) {
    return THEME_CONFIGS.romantic; // Map foodie to Sunset Warm Romantic vibe
  }
  if (normPers.includes("backpacker")) {
    return THEME_CONFIGS.introvert; // Map backpacker to low-end cozy blue/lavender solitude
  }

  return THEME_CONFIGS.standard;
}
