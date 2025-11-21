// LocationSearch.tsx
// Location search component with autocomplete using OpenStreetMap Nominatim

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { searchLocation, getCityName, getCountryCode, guessTimezone, type GeocodingResult } from "../utils/geocoding";

interface LocationSearchProps {
  onLocationSelect: (location: {
    name: string;
    city: string;
    nation: string;
    lat: number;
    lon: number;
    timezone: string;
  }) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchId, setSearchId] = useState(0); // Add unique search ID
  const debounceTimeout = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    // Debounce search
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const locations = await searchLocation(query);
        setResults(locations);
        setSelectedIndex(0);
        setSearchId(Date.now()); // Update search ID
      } catch (error) {
        console.error("Location search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (location: GeocodingResult) => {
    const city = getCityName(location);
    const nation = getCountryCode(location);
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    const timezone = guessTimezone(lat, lon);
    
    onLocationSelect({
      name: location.display_name,
      city,
      nation,
      lat,
      lon,
      timezone,
    });
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a city name..."
        className="w-full bg-transparent border-b-2 border-white/20 focus:border-cyan-400 text-white text-3xl md:text-4xl py-4 outline-none transition-all duration-300 placeholder:text-white/20"
        autoComplete="off"
      />

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-4 text-cyan-400"
          >
            <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </motion.div>
        )}

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-6 max-h-80 overflow-y-auto backdrop-blur-2xl bg-black/40 border border-white/10 rounded-2xl shadow-2xl"
          >
            {results.map((location, index) => {
              // Create a truly unique key using searchId and index to guarantee uniqueness
              const uniqueKey = `loc-${searchId}-${index}`;
              
              return (
                <motion.button
                  key={uniqueKey}
                  onClick={() => handleSelect(location)}
                  className={`w-full text-left px-6 py-4 transition-all duration-200 ${
                    index === selectedIndex
                      ? "bg-cyan-500/20 border-l-4 border-cyan-400"
                      : "hover:bg-white/5 border-l-4 border-transparent"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="text-white text-lg">
                    {getCityName(location)}
                  </div>
                  <div className="text-white/50 text-sm mt-1">
                    {location.display_name}
                  </div>
                  <div className="text-cyan-400/70 text-xs mt-1">
                    {guessTimezone(parseFloat(location.lat), parseFloat(location.lon))}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {query.length >= 2 && results.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-white/40 text-sm"
        >
          No locations found. Try a different search.
        </motion.div>
      )}

      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-white/30 text-xs"
        >
          Use <span className="text-cyan-400">↑↓</span> to navigate, <span className="text-cyan-400">Enter ↵</span> to select
        </motion.div>
      )}
    </div>
  );
}