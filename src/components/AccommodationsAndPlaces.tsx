import React from "react";
import { Bed, MapPin, Search, Star, MessageSquareCode, UtensilsCrossed, Pill, ExternalLink, Activity } from "lucide-react";
import { Accommodation, Amenities } from "../types";

interface AccommodationsAndPlacesProps {
  accommodations: Accommodation[];
  amenities: Amenities;
  destination: string;
}

import { useAppTheme } from "../context/ThemeContext";
import { ThemeCard } from "./ThemeDecorators";

export default function AccommodationsAndPlaces({ accommodations, amenities, destination }: AccommodationsAndPlacesProps) {
  const { theme } = useAppTheme();
  
  // Custom Maps deep-links
  const getMapsQueryUrl = (query: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + " " + destination)}`;
  };

  const getGeneralSearchUrl = (category: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(category + " " + destination)}`;
  };

  return (
    <div id="accommodations-amenities-section" className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${theme.fontClass}`}>
      
      {/* Recommended Accommodations & Lodging */}
      <div className="lg:col-span-7">
        <ThemeCard className="p-6 space-y-5 h-full">
        <div>
          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">
            Stay Directory
          </span>
          <h3 className="font-sans font-semibold text-lg text-slate-150 flex items-center gap-2">
            <Bed className={`w-5 h-5 ${theme.textAccent} ${theme.glowClass}`} />
            Lodging & Accommodations
          </h3>
          <p className="text-xs text-slate-400">
            Handpicked stays for different traveler styles. Click search to see real reviews on Google Maps.
          </p>
        </div>

        {/* Accommodations map */}
        <div className="space-y-4">
          {accommodations.map((lodging, idx) => (
            <div
              key={idx}
              className="p-4 bg-white/[0.015] border border-white/5 hover:border-white/15 rounded-2xl space-y-2.5 transition-all group"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] ${theme.textAccent} bg-white/[0.04] font-semibold px-2 py-0.5 rounded-md uppercase border border-white/5`}>
                      {lodging.type}
                    </span>
                    <h4 className="font-sans font-semibold text-slate-200 text-sm">{lodging.name}</h4>
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold font-mono">
                    Estimated Price: {lodging.approxPricePerNight}
                  </div>
                </div>

                {/* Google Maps search lookup */}
                <a
                  href={getMapsQueryUrl(lodging.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl border border-white/10 transition-all shrink-0`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  View actual reviews
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">{lodging.description}</p>
              
              {/* Intelligent Lodging Vitals */}
              {(lodging.nearestMetro || lodging.noiseLevel || lodging.walkabilityScore || lodging.internetSpeed || lodging.digitalNomadFriendliness || lodging.groupSuitability) && (
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {lodging.nearestMetro && (
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-[10px] leading-none">
                      🚇 Metro: {lodging.nearestMetro}
                    </span>
                  )}
                  {lodging.walkabilityScore !== undefined && (
                    <span className="px-2 py-0.5 bg-white/[0.02] text-slate-300 border border-white/10 rounded-lg font-mono text-[10px] leading-none">
                      🚶 Walkability: {lodging.walkabilityScore}/100
                    </span>
                  )}
                  {lodging.noiseLevel && (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg text-[10px] leading-none">
                      🔊 Noise: {lodging.noiseLevel}
                    </span>
                  )}
                  {lodging.digitalNomadFriendliness && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-[10px] leading-none flex items-center gap-1 font-semibold">
                      💻 Nomad Match: {lodging.digitalNomadFriendliness} {lodging.internetSpeed ? `(${lodging.internetSpeed})` : ""}
                    </span>
                  )}
                  {lodging.groupSuitability && (
                    <span className="px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg text-[10px] leading-none">
                      👥 Groups: {lodging.groupSuitability}
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                {lodging.whyStay && (
                  <div className="p-2 bg-white/[0.01] border border-white/5 rounded-xl space-y-0.5">
                    <span className="font-semibold text-slate-300 block">Why Stay Here:</span>
                    <span className="text-slate-400 leading-tight block">{lodging.whyStay}</span>
                  </div>
                )}
                {lodging.reviewSnippet && (
                  <div className="p-2 bg-white/[0.01] border border-white/5 rounded-xl space-y-0.5">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> Traveler Review:
                    </span>
                    <span className="text-slate-400 leading-tight italic block">"{lodging.reviewSnippet}"</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick External Map Hub Links */}
        <div className="pt-2 bg-white/[0.01] p-3 rounded-2xl border border-white/5 space-y-2">
          <span className={`text-[10px] font-mono font-bold ${theme.textAccent} uppercase tracking-wider block`}>
            Custom Map Explorers:
          </span>
          <div className="flex flex-wrap gap-2">
            <a
              href={getGeneralSearchUrl("cheap hostels")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-300 hover:text-white bg-slate-950 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              🛌 Explore Hostels & Dorms <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={getGeneralSearchUrl("boutique hotels")}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-300 hover:text-white bg-slate-950 border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md"
            >
              🏨 Luxury stays <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </ThemeCard>
    </div>

      {/* Suggested Restaurants & Chemists */}
      <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
        
        {/* Restaurants section */}
        <ThemeCard className="p-6 space-y-4">
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Food Registry
            </span>
            <h3 className="font-sans font-semibold text-slate-200 text-sm flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
              Suggested Dining Spots
            </h3>
          </div>

          <div className="space-y-3">
            {amenities.restaurants ? (
              amenities.restaurants.map((place, idx) => (
                <div key={idx} className="p-3 bg-white/[0.015] border border-white/5 rounded-2xl flex flex-col justify-between gap-1 hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-200">{place.name}</h4>
                    <span className="text-[10.5px] font-mono text-emerald-400 font-semibold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                      {place.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{place.description}</p>
                  
                  {/* Intelligent Culinary Scores */}
                  {(place.touristTrapProbability !== undefined || place.authenticLocalScore !== undefined || place.reservationSuggested !== undefined || place.waitingTimeNormal) && (
                    <div className="flex flex-wrap gap-1 mt-1.5 mb-1 bg-white/[0.01] p-2 rounded-xl border border-white/5">
                      {place.authenticLocalScore !== undefined && (
                        <span className="px-2 py-0.5 bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 rounded text-[9px] font-mono leading-none flex items-center gap-0.5">
                          ⭐ Authenticity: {place.authenticLocalScore}%
                        </span>
                      )}
                      {place.touristTrapProbability !== undefined && (
                        <span className={`px-2 py-0.5 border rounded text-[9px] font-mono leading-none flex items-center gap-0.5 ${
                          place.touristTrapProbability.toLowerCase().includes("high") || place.touristTrapProbability.toLowerCase().includes("risk") || parseFloat(place.touristTrapProbability) > 50
                            ? "bg-rose-950/20 text-rose-400 border-rose-900/30" 
                            : "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                        }`}>
                          🚨 Trap Prob: {place.touristTrapProbability}
                        </span>
                      )}
                      {place.reservationSuggested !== undefined && (
                        <span className="px-2 py-0.5 bg-white/[0.02] text-slate-300 border border-white/5 rounded text-[9px] leading-none flex items-center gap-0.5">
                          🎟️ {place.reservationSuggested ? "Res. Suggested" : "Walk-ins Welcome"}
                        </span>
                      )}
                      {place.waitingTimeNormal && (
                        <span className="px-2 py-0.5 bg-amber-950/20 text-amber-400 border border-amber-900/30 rounded text-[9px] leading-none flex items-center gap-1">
                          👥 Wait: {place.waitingTimeNormal}
                        </span>
                      )}
                    </div>
                  )}

                  {place.averageCost && (
                    <div className="text-[10px] text-slate-500 italic mt-1 font-mono">
                      Cost estimate: {place.averageCost}
                    </div>
                  )}
                  <a
                    href={getMapsQueryUrl(place.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-400 font-medium hover:underline flex items-center gap-1 mt-1 shrink-0"
                  >
                    View menu & reviews <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Loading dining spots...</p>
            )}
          </div>

          <a
            href={getGeneralSearchUrl("top restaurants local food")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/30 border border-emerald-900/20 rounded-xl text-xs font-medium block text-center transition-all"
          >
            🍕 Search nearby dining hubs in Maps
          </a>
        </ThemeCard>

        {/* Chemist / Pharmacy directory */}
        <ThemeCard className="p-6 space-y-4">
          <div>
            <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">
              Medical Registry
            </span>
            <h3 className="font-sans font-semibold text-slate-200 text-sm flex items-center gap-2">
              <Pill className="w-4 h-4 text-rose-400" />
              Local Chemist Shops
            </h3>
          </div>

          <div className="space-y-3">
            {amenities.chemists ? (
              amenities.chemists.map((chem, idx) => (
                <div key={idx} className="p-3 bg-white/[0.015] border border-white/5 rounded-2xl space-y-1 hover:border-rose-500/30 transition-all">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-200">
                    <span>{chem.name}</span>
                  </div>
                  {chem.address && <p className="text-[10px] text-slate-500 font-mono">{chem.address}</p>}
                  <p className="text-[11px] text-slate-400 leading-snug italic">"{chem.notes}"</p>
                  <a
                    href={getMapsQueryUrl(chem.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-rose-400 font-medium hover:underline flex items-center gap-1 pt-1 shrink-0"
                  >
                    Find directions <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">Locating pharmacies...</p>
            )}
          </div>

          <a
            href={getGeneralSearchUrl("pharmacy chemist emergency shop")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-rose-950/30 text-rose-400 hover:bg-rose-900/30 border border-rose-900/20 rounded-xl text-xs font-medium block text-center transition-all"
          >
            🏥 Find all nearby open chemist shops
          </a>
        </ThemeCard>

      </div>

    </div>
  );
}
