import {
  ChartProvider,
  useChart,
} from "./contexts/ChartContext";
import { GlossaryProvider } from "./contexts/GlossaryContext";
import Onboarding from "./components/Onboarding";
import OnboardingFlow from "./components/OnboardingFlow";
import SpiralVisualization from "./components/SpiralVisualization";
import { CursorParticleTrail } from "./components/ui/ParticleEffect";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Additional Three.js warning suppression (also in index.html)
// This catches any warnings that slip through
if (typeof console !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args: any[]) => {
    const message = String(args[0] || '');
    // Suppress Three.js multiple instances warnings
    if (message.includes('Three') || message.includes('three') || 
        message.includes('WARNING') || message.includes('Multiple instances')) {
      return;
    }
    originalWarn.apply(console, args);
  };
  
  console.error = (...args: any[]) => {
    const message = String(args[0] || '');
    // Suppress Three.js multiple instances errors and duplicate key warnings
    if (message.includes('Three') || message.includes('three') || 
        message.includes('WARNING') || message.includes('Multiple instances') ||
        message.includes('Encountered two children with the same key')) {
      return;
    }
    originalError.apply(console, args);
  };
}

function AppContent() {
  const { chart, loading, setSubject, clearChart } = useChart();
  const [sharedData, setSharedData] = useState<any>(null);
  const [showSharedMessage, setShowSharedMessage] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Handle restart - reset everything
  const handleRestart = () => {
    clearChart();
    setHasSeenOnboarding(false);
    setSharedData(null);
    setShowSharedMessage(false);
  };

  // Check for URL parameters (shared link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    
    console.log('🔗 Checking for shared link parameters...');
    console.log('   URL params:', window.location.search);
    console.log('   Name found:', name);
    
    if (name) {
      // Parse all the parameters
      const sharedBirthData = {
        name,
        year: parseInt(params.get('year') || ''),
        month: parseInt(params.get('month') || ''),
        day: parseInt(params.get('day') || ''),
        hour: parseInt(params.get('hour') || ''),
        minute: parseInt(params.get('minute') || ''),
        city: params.get('city') || '',
        nation: params.get('nation') || '',
        latitude: parseFloat(params.get('lat') || ''),
        longitude: parseFloat(params.get('lon') || ''),
        timezone: params.get('tz') || '',
      };
      
      console.log('✅ Shared birth data parsed:', sharedBirthData);
      
      setSharedData(sharedBirthData);
      setShowSharedMessage(true);
      
      // Skip onboarding and go directly to visualization
      setHasSeenOnboarding(true);
      
      // Automatically load the chart from shared data
      console.log('📡 Setting subject to trigger chart fetch...');
      setSubject({
        name: sharedBirthData.name,
        year: sharedBirthData.year,
        month: sharedBirthData.month,
        day: sharedBirthData.day,
        hour: sharedBirthData.hour,
        minute: sharedBirthData.minute,
        city: sharedBirthData.city,
        nation: sharedBirthData.nation,
        latitude: sharedBirthData.latitude,
        longitude: sharedBirthData.longitude,
        timezone: sharedBirthData.timezone,
      });
      
      // Clear URL parameters after loading
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Auto-close message after 5 seconds
      setTimeout(() => {
        setShowSharedMessage(false);
      }, 5000);
    } else {
      console.log('❌ No shared link parameters found');
    }
  }, [setSubject]);

  const handleOnboardingComplete = (birthData: {
    name: string;
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    location: string;
    city: string;
    nation: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }) => {
    // Convert to AstroSubject format
    setSubject({
      name: birthData.name,
      year: birthData.year,
      month: birthData.month,
      day: birthData.day,
      hour: birthData.hour,
      minute: birthData.minute,
      city: birthData.city,
      nation: birthData.nation,
      latitude: birthData.latitude,
      longitude: birthData.longitude,
      timezone: birthData.timezone,
    });
    
    // Clear URL parameters after loading
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  // Show onboarding if no chart exists
  if (!chart && !loading) {
    // First show conceptual onboarding
    if (!hasSeenOnboarding) {
      return (
        <Onboarding onComplete={() => setHasSeenOnboarding(true)} />
      );
    }
    
    // Then show birth data collection
    return (
      <>
        {/* Shared Link Welcome Message */}
        <AnimatePresence>
          {showSharedMessage && sharedData && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl backdrop-blur-xl border-2"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.15))',
                borderColor: 'rgba(168, 85, 247, 0.4)',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
              }}
            >
              <p className="text-white text-center">
                ✨ <strong>{sharedData.name}</strong> shared their unique 3D constellation with you!
                <br />
                <span className="text-purple-300 text-sm">Create your own below ⬇️</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <OnboardingFlow 
          onComplete={handleOnboardingComplete}
          initialData={sharedData}
        />
      </>
    );
  }

  // Show main spiral visualization once chart is loaded
  return (
    <>
      {/* Shared Link Welcome Message (on visualization) */}
      <AnimatePresence>
        {showSharedMessage && sharedData && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-8 py-4 rounded-2xl backdrop-blur-xl border-2"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.15))',
              borderColor: 'rgba(168, 85, 247, 0.4)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
            }}
          >
            <p className="text-white text-center">
              ✨ Viewing <strong>{sharedData.name}'s</strong> unique constellation!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <SpiralVisualization onRestart={handleRestart} />
      <CursorParticleTrail />
    </>
  );
}

export default function App() {
  return (
    <ChartProvider>
      <GlossaryProvider>
        <AppContent />
      </GlossaryProvider>
    </ChartProvider>
  );
}