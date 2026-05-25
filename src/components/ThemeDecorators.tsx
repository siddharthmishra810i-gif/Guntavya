import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppTheme } from "../context/ThemeContext";
import { Sparkles, Compass, Shield, Heart, Eye, Star, Zap, Globe, Loader2 } from "lucide-react";

/**
 * 1. ThemeAtmosphereBackground
 * Renders dynamic animated mesh gradients, floating stellar particles, and moving auroras
 * that adapt color and speed perfectly based on the active personality theme.
 */
export function ThemeAtmosphereBackground() {
  const { theme } = useAppTheme();

  // Create deterministic static coordinates for the particle floating layers to avoid mismatch re-renders
  const particlesList = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 20 + 20 / (theme.mode === "extrovert" || theme.mode === "nightlife" ? 2.5 : 0.8),
      color: theme.particles[i % theme.particles.length],
    }));
  }, [theme.mode, theme.particles]);

  const lightBlobs = useMemo(() => {
    return Array.from({ length: theme.lightingEffectCount }).map((_, i) => ({
      id: i,
      left: `${(i * 45 + 15) % 100}%`,
      top: `${(i * 35 + 20) % 100}%`,
      scale: Math.random() * 0.4 + 0.8,
      duration: Math.random() * 15 + 15,
      direction: i % 2 === 0 ? 1 : -1,
    }));
  }, [theme.lightingEffectCount]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Mesh auroras gradient layer */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={theme.mode}
          className={`absolute inset-0 transition-all duration-1000 ${theme.background}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Floating high-definition color lights blobs */}
      <div className="absolute inset-0 z-1 opacity-[0.65]">
        {lightBlobs.map((blob, idx) => {
          const colorClass = theme.lightingColors[idx % theme.lightingColors.length] || "from-indigo-950/20 to-transparent";
          return (
            <motion.div
              key={`${theme.mode}-blob-${blob.id}`}
              className={`absolute w-[45rem] h-[45rem] rounded-full bg-gradient-to-br ${colorClass} blur-[120px]`}
              style={{
                left: blob.left,
                top: blob.top,
              }}
              animate={{
                x: [0, 50 * blob.direction, -30 * blob.direction, 0],
                y: [0, -40 * blob.direction, 60 * blob.direction, 0],
                scale: [blob.scale, blob.scale * 1.25, blob.scale * 0.85, blob.scale],
              }}
              transition={{
                duration: blob.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Cozy grid overlay for technical mode styling */}
      {(theme.mode === "nightlife" || theme.mode === "luxury" || theme.mode === "standard") && (
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 z-1" 
        />
      )}

      {/* Floating Stardust particles layer */}
      <div className="absolute inset-0 z-2 overflow-hidden">
        {particlesList.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
            animate={{
              y: ["0px", "-200px", "100px", "0px"],
              x: ["0px", "50px", "-40px", "0px"],
              opacity: [0.15, 0.75, 0.3, 0.15],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 2. ThemeCard
 * Interactive, layered glassmorphic frame wrapping child inputs or visual sections.
 * Adapts styling, glowing accent borders, shadows, and hover dynamics based on active theme physics.
 */
export function ThemeCard({
  children,
  className = "",
  id = "",
  animateEntrance = true,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  animateEntrance?: boolean;
  delay?: number;
}) {
  const { theme } = useAppTheme();

  const elementContent = (
    <div
      id={id || undefined}
      className={`relative overflow-hidden transition-all duration-500 shadow-md ${theme.cardStyle} ${theme.cardHover} ${className}`}
    >
      {/* Corner neon-glow indicators for cyberpunk and extrovert matching layouts */}
      {(theme.mode === "nightlife" || theme.mode === "extrovert") && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-30 text-pink-500 animate-pulse" />
      )}
      {theme.mode === "luxury" && (
        <div className="absolute top-0 right-0 w-[45px] h-[45px] border-t border-r border-[#eab308]/20 pointer-events-none rounded-tr-3xl" />
      )}
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );

  if (animateEntrance) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: theme.transitionDuration,
          ease: theme.transitionEase,
          delay,
        }}
        className="w-full h-full"
      >
        {elementContent}
      </motion.div>
    );
  }

  return elementContent;
}

/**
 * 3. ThemeButton
 * Customized action triggers that glow, burst, or pulse, aligned with the traveler's personality.
 */
export function ThemeButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  id = "",
}: {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  id?: string;
}) {
  const { theme } = useAppTheme();

  return (
    <motion.button
      id={id || undefined}
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1.0 : 1.025 }}
      whileTap={{ scale: disabled ? 1.0 : 0.985 }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className={`px-6 py-3.5 text-xs font-mono font-bold tracking-widest uppercase rounded-2xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all relative group overflow-hidden ${theme.buttonStyle} ${theme.buttonGlow} ${className}`}
    >
      {/* Button glass highlight shimmer */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-white/20 group-hover:bg-white/35 transition-all duration-300" />
      <span className="absolute inset-0 bg-white/[0.03] group-hover:bg-white/[0.08] pointer-events-none transition-all" />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

/**
 * 4. ThemeLoader
 * Displays personalized loading states. Takes loading captions and delivers custom animations.
 */
export function ThemeLoader({ phrases, activeStep }: { phrases: string[]; activeStep: number }) {
  const { theme } = useAppTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`py-12 sm:py-20 text-center space-y-8 ${theme.cardStyle} p-8 shadow-2xl relative overflow-hidden max-w-2xl mx-auto border-dashed`}
    >
      {/* Dynamic ambient halo backdrops */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-[90px] opacity-25 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors"
        style={{ backgroundColor: theme.accent }}
      />

      {/* Real personalized layout selector */}
      <div className="relative inline-block">
        {theme.mode === "healing" || theme.mode === "introvert" ? (
          // Slow organic breathing pulse loader
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.95, 0.3],
            }}
            transition={{
              duration: 3.0,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-16 h-16 rounded-full border border-teal-500/40 flex items-center justify-center bg-teal-950/20"
          >
            <div className="w-8 h-8 rounded-full bg-teal-400/30 blur-xs" />
          </motion.div>
        ) : theme.mode === "extrovert" || theme.mode === "nightlife" ? (
          // Intense neon strobe ring loader
          <div className="relative w-16 h-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-t-2 border-b-2 border-fuchsia-500 border-l-2 border-r-transparent shadow-[0_0_15px_rgba(244,63,94,0.6)]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-r-2 border-l-2 border-cyan-400 border-t-2 border-b-transparent"
            />
          </div>
        ) : theme.mode === "adventure" ? (
          // Rugged emerald compass radar scan
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Compass className="w-10 h-10 text-emerald-400 animate-spin" style={{ animationDuration: "3s" }} />
            <motion.div
              animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 2.0, repeat: Infinity }}
              className="absolute inset-0 rounded-full border border-emerald-500/45"
            />
          </div>
        ) : theme.mode === "luxury" ? (
          // Polished tracing gold stroke lock
          <div className="relative w-16 h-16 flex items-center justify-center border border-yellow-500/30 rounded-2xl bg-black/60 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <motion.div
              animate={{ rotate: [0, 45, 90, 180, 270, 360] }}
              transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 border-t border-b border-yellow-500 rounded"
            />
            <Star className="w-4 h-4 text-yellow-500 absolute" />
          </div>
        ) : theme.mode === "photographer" ? (
          // Camera aperture focus bracket lens
          <div className="relative w-16 h-16 flex items-center justify-center border-2 border-neutral-600 rounded-full">
            <Eye className="w-7 h-7 text-white animate-pulse" />
            <motion.span 
              className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-white"
              animate={{ scale: [1, 1.15, 1] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.span 
              className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-white"
              animate={{ scale: [1, 1.15, 1] }} 
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        ) : (
          // Standard modern travel compass animation
          <div className="relative w-16 h-16 flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin opacity-45" />
            <Compass className="w-6 h-6 text-indigo-300 absolute" />
          </div>
        )}
      </div>

      <div className="space-y-3.5 z-10 relative">
        <h3 className="font-display font-bold text-slate-100 text-lg uppercase tracking-widest flex items-center justify-center gap-2">
          {theme.mode === "introvert" && <Heart className="w-4 h-4 text-indigo-400 fill-indigo-400" />}
          {theme.mode === "extrovert" && <Zap className="w-4 h-4 text-pink-500 fill-pink-500" />}
          {theme.mode === "luxury" && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          {theme.mode === "adventure" && <Globe className="w-4 h-4 text-emerald-400" />}
          
          COMPILED IN TOPO-{theme.name.toUpperCase()} MODE
        </h3>
        
        <p className="text-sm italic opacity-80 font-sans tracking-wide">
          "{theme.tagline}"
        </p>

        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl max-w-md mx-auto">
          <p className="text-xs text-slate-300 font-mono tracking-wide animate-pulse">
            {phrases[activeStep] || "Scanning strategic coordinate logs..."}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * 5. ThemeSectionTitle
 * Fully themed title blocks matching visual density and font weights requested.
 */
export function ThemeSectionTitle({
  title,
  subtitle,
  icon: IconComponent,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
}) {
  const { theme } = useAppTheme();

  return (
    <div className={`space-y-1.5 pb-2 border-b border-white/[0.04] mb-4 ${theme.fontClass}`}>
      <div className="flex items-center gap-2.5">
        {IconComponent && (
          <div className={`p-2 rounded-xl bg-white/[0.02] border border-white/10 ${theme.textAccent} ${theme.glowClass}`}>
            <IconComponent className="w-4.5 h-4.5" />
          </div>
        )}
        <h3 className={`${theme.headingWeight} text-sm text-slate-100`}>
          {title}
        </h3>
      </div>
      {subtitle && (
        <p className="text-[11.5px] text-slate-400 font-light pl-0.5 leading-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
