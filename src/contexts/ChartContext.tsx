// ChartContext.tsx
// Global state management for birth chart data

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AstroSubject } from "../utils/AstrologyApiClient";
import type { EnrichedChart } from "../utils/ChartEnricher";
import { fetchBirthChart } from "../utils/AstrologyApiClient";
import { enrichBirthChart } from "../utils/ChartEnricher";

export type ChartContextValue = {
  subject: AstroSubject | null;
  chart: EnrichedChart | null;
  loading: boolean;
  error: string | null;
  setSubject: (s: AstroSubject | null) => void;
  refreshChart: () => Promise<void>;
  clearChart: () => void;
};

const ChartContext = createContext<ChartContextValue | undefined>(undefined);

export function ChartProvider({ children }: { children: ReactNode }) {
  const [subject, setSubject] = useState<AstroSubject | null>(null);
  const [chart, setChart] = useState<EnrichedChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshChart = async () => {
    if (!subject) {
      setError("No subject data available");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Log the subject data being sent to API
      console.log('🌍 Birth Data Being Sent to API:');
      console.log('  📅 Date:', `${subject.year}-${subject.month}-${subject.day}`);
      console.log('  🕐 Time:', `${subject.hour}:${subject.minute.toString().padStart(2, '0')}`);
      console.log('  📍 Location:', subject.city, subject.nation);
      console.log('  🌐 Coordinates:', `${subject.latitude.toFixed(4)}°, ${subject.longitude.toFixed(4)}°`);
      console.log('  ⏰ Timezone:', subject.timezone);
      console.log('  🏠 House System:', subject.houses_system_identifier || 'P (Placidus)');
      
      // Fetch from API
      const apiChart = await fetchBirthChart(subject);
      
      // Enrich with local dataset
      const enrichedChart = enrichBirthChart(apiChart, subject);
      
      console.log('✨ Enriched chart data:', {
        planets: enrichedChart.planets.map(p => ({
          name: p.planet.name,
          sign: p.sign.name,
          house: p.house.house,
          degree: p.api.degree,
          houseId: p.api.house_id
        })),
        aspects: enrichedChart.aspects.map(a => ({
          type: a.api.type,
          from: a.from.planet.name,
          to: a.to.planet.name,
          angle: a.api.angle,
          orb: a.api.orb
        }))
      });
      setChart(enrichedChart);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      
      // Don't log quota errors to console - we show a nice UI for those
      if (!errorMessage.includes('quota') && !errorMessage.includes('429')) {
        console.error("Chart fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChart = () => {
    setSubject(null);
    setChart(null);
    setError(null);
  };

  // Auto-fetch when subject changes
  useEffect(() => {
    if (subject) {
      refreshChart();
    } else {
      setChart(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const value: ChartContextValue = {
    subject,
    chart,
    loading,
    error,
    setSubject,
    refreshChart,
    clearChart,
  };

  return <ChartContext.Provider value={value}>{children}</ChartContext.Provider>;
}

/**
 * Hook to access chart context
 */
export function useChart(): ChartContextValue {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within ChartProvider");
  }
  return context;
}