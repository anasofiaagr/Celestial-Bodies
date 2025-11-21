import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationSearch } from './LocationSearch';
import { ArrowLeft } from 'lucide-react';
import { CelestialButton } from './ui/CelestialButton';

interface OnboardingFlowProps {
  onComplete: (birthData: {
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
  }) => void;
  initialData?: any;
}

type Step = 'name' | 'year' | 'month' | 'day' | 'time' | 'location' | 'complete';

// Magical typing animation component
function MagicalText({ text, onComplete, delay = 0 }: { text: string; onComplete?: () => void; delay?: number }) {
  const words = text.split(' ');
  const [visibleWords, setVisibleWords] = useState(0);

  useEffect(() => {
    setVisibleWords(0);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleWords((prev) => {
          if (prev >= words.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 150); // 150ms per word

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, words.length]);

  // Call onComplete when all words are visible (in a separate effect)
  useEffect(() => {
    if (visibleWords >= words.length && onComplete) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [visibleWords, words.length, onComplete]);

  return (
    <span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={i < visibleWords ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// Animated placeholder component
function AnimatedPlaceholder({ text }: { text: string }) {
  const chars = text.split('');
  
  return (
    <span className="absolute left-0 top-4 pointer-events-none text-white/20">
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4,
            delay: i * 0.03,
            ease: 'easeOut'
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// Loading Screen with star dust dissolve effect
function LoadingScreen() {
  const [dustParticles, setDustParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  
  useEffect(() => {
    // Generate burst of dust particles periodically
    const interval = setInterval(() => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i + Math.random() * 1000,
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
      }));
      
      setDustParticles(prev => [...prev, ...newParticles]);
      
      // Remove particles after animation
      setTimeout(() => {
        setDustParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 2000);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      key="complete"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 1.2, exit: { duration: 1.5, ease: [0.19, 1, 0.22, 1] } }}
      className="fixed inset-0 bg-black flex items-center justify-center"
    >
      {/* Black background with subtle gradient - matching onboarding */}
      <div className="absolute inset-0 bg-black">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(167, 139, 250, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10 text-center space-y-8">
        {/* Pulsing central glow */}
        <motion.div
          className="relative mx-auto"
          style={{ width: '200px', height: '200px' }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(167, 139, 250, 0.3) 40%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(167, 139, 250, 0.8) 0%, rgba(139, 92, 246, 0.4) 30%, transparent 60%)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5
            }}
          />
        </motion.div>
        
        {/* Star dust particles */}
        {dustParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 1,
              width: 2 + Math.random() * 4,
              height: 2 + Math.random() * 4,
            }}
            animate={{
              x: particle.x + (Math.random() - 0.5) * 300,
              y: particle.y + (Math.random() - 0.5) * 300,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5 + Math.random() * 0.5,
              ease: 'easeOut'
            }}
            style={{
              background: `radial-gradient(circle, ${
                Math.random() > 0.5 ? 'rgba(167, 139, 250, 1)' : 'rgba(199, 175, 255, 1)'
              }, transparent)`,
              boxShadow: '0 0 8px rgba(167, 139, 250, 0.8)',
            }}
          />
        ))}
        
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10"
        >
          <motion.h1
            className="text-white"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 300,
              letterSpacing: '0.02em',
              lineHeight: 1.4
            }}
            animate={{
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            Generating your cosmic spiral...
          </motion.h1>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function OnboardingFlow({ onComplete, initialData }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<Step>('name');
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [timezone, setTimezone] = useState('UTC');

  // Auto-focus refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);
  const monthInputRef = useRef<HTMLInputElement>(null);
  const dayInputRef = useRef<HTMLInputElement>(null);
  const hourInputRef = useRef<HTMLInputElement>(null);

  // Reset input visibility when step changes
  useEffect(() => {
    setShowInput(false);
  }, [currentStep]);

  // Auto-load shared data if provided
  useEffect(() => {
    if (initialData && initialData.name) {
      // Populate all fields with shared data
      setName(initialData.name);
      setYear(initialData.year.toString());
      setMonth(initialData.month.toString());
      setDay(initialData.day.toString());
      setHour(initialData.hour.toString());
      setMinute(initialData.minute.toString());
      setLocation(`${initialData.city}, ${initialData.nation}`);
      setLatitude(initialData.latitude);
      setLongitude(initialData.longitude);
      setTimezone(initialData.timezone);
      
      // Auto-submit after a brief delay to show the loading screen
      setTimeout(() => {
        setCurrentStep('complete');
        setTimeout(() => {
          onComplete({
            name: initialData.name,
            year: initialData.year,
            month: initialData.month,
            day: initialData.day,
            hour: initialData.hour,
            minute: initialData.minute,
            location: `${initialData.city}, ${initialData.nation}`,
            city: initialData.city,
            nation: initialData.nation,
            latitude: initialData.latitude,
            longitude: initialData.longitude,
            timezone: initialData.timezone,
          });
        }, 2000);
      }, 1000);
    }
  }, [initialData]);

  // Auto-focus when input appears
  useEffect(() => {
    if (showInput) {
      const timeout = setTimeout(() => {
        if (currentStep === 'name') nameInputRef.current?.focus();
        else if (currentStep === 'year') yearInputRef.current?.focus();
        else if (currentStep === 'month') monthInputRef.current?.focus();
        else if (currentStep === 'day') dayInputRef.current?.focus();
        else if (currentStep === 'time') hourInputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [showInput, currentStep]);

  const goBack = () => {
    const stepOrder: Step[] = ['name', 'year', 'month', 'day', 'time', 'location'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, nextStep: Step, value: string) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      setCurrentStep(nextStep);
    }
  };

  const handleTimeKeyPress = (e: React.KeyboardEvent, currentField: 'hour' | 'minute') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentField === 'hour' && hour.trim()) {
        // Move to minute field
        document.getElementById('minute-input')?.focus();
      } else if (currentField === 'minute' && minute.trim()) {
        // Move to next step
        setCurrentStep('location');
      }
    }
  };

  const handleLocationSelect = (locationData: {
    name: string;
    city: string;
    nation: string;
    lat: number;
    lon: number;
    timezone: string;
  }) => {
    setLocation(locationData.name);
    setLatitude(locationData.lat);
    setLongitude(locationData.lon);
    setTimezone(locationData.timezone);
    
    setTimeout(() => {
      setCurrentStep('complete');
      setTimeout(() => {
        onComplete({
          name,
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day),
          hour: parseInt(hour),
          minute: parseInt(minute),
          location: locationData.name,
          city: locationData.city,
          nation: locationData.nation,
          latitude: locationData.lat,
          longitude: locationData.lon,
          timezone: locationData.timezone,
        });
      }, 800);
    }, 300);
  };

  const getStepNumber = (step: Step): number => {
    const steps: Step[] = ['name', 'year', 'month', 'day', 'time', 'location', 'complete'];
    return steps.indexOf(step) + 1;
  };

  const totalSteps = 6;
  const progress = (getStepNumber(currentStep) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />

      {/* Back button */}
      {currentStep !== 'name' && currentStep !== 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2"
        >
          <CelestialButton
            onClick={goBack}
            variant="ghost"
            size="lg"
            icon={ArrowLeft}
            iconPosition="left"
          >
            Go Back
          </CelestialButton>
        </motion.div>
      )}

      {/* Step counter */}
      <motion.div
        className="fixed top-8 right-8 text-white/40 text-sm tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {getStepNumber(currentStep)} / {totalSteps}
      </motion.div>

      {/* Main content */}
      <div className="w-full max-w-3xl px-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Name */}
          {currentStep === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  className="text-violet-400 text-sm tracking-widest uppercase mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Question 1
                </motion.div>
                <h1 className="text-5xl md:text-6xl text-white mb-2 min-h-[4rem]">
                  <MagicalText text="Who are you?" onComplete={() => setShowInput(true)} delay={300} />
                </h1>
              </div>

              <AnimatePresence>
                {showInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'year', name)}
                      placeholder="Type your name..."
                      className="w-full bg-transparent border-b-2 border-white/20 focus:border-violet-400 text-white text-3xl md:text-4xl py-4 outline-none transition-all duration-300 placeholder:text-white/20"
                      autoComplete="off"
                    />
                    <motion.div
                      className="text-white/40 text-sm mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Press <span className="text-violet-400">Enter ↵</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Step 2: Year */}
          {currentStep === 'year' && (
            <motion.div
              key="year"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  className="text-fuchsia-400 text-sm tracking-widest uppercase mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Question 2
                </motion.div>
                <h1 className="text-5xl md:text-6xl text-white mb-2 min-h-[4rem]">
                  <MagicalText text="When were you born?" onComplete={() => setShowInput(true)} delay={300} />
                </h1>
                <motion.p
                  className="text-white/60 text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  Let's start with the year
                </motion.p>
              </div>

              <AnimatePresence>
                {showInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <input
                      ref={yearInputRef}
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, 'month', year)}
                      placeholder="YYYY"
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full bg-transparent border-b-2 border-white/20 focus:border-fuchsia-400 text-white text-3xl md:text-4xl py-4 outline-none transition-all duration-300 placeholder:text-white/20"
                      autoComplete="off"
                    />
                    <motion.div
                      className="text-white/40 text-sm mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Press <span className="text-fuchsia-400">Enter ↵</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Step 3: Month */}
          {currentStep === 'month' && (
            <motion.div
              key="month"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  className="text-pink-400 text-sm tracking-widest uppercase mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Question 2
                </motion.div>
                <h1 className="text-5xl md:text-6xl text-white mb-2 min-h-[4rem]">
                  <MagicalText text="And the month?" onComplete={() => setShowInput(true)} delay={300} />
                </h1>
                <motion.p
                  className="text-white/60 text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  Year: {year}
                </motion.p>
              </div>

              <AnimatePresence>
                {showInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <input
                      ref={monthInputRef}
                      type="text"
                      inputMode="numeric"
                      value={month}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
                          setMonth(val);
                        }
                      }}
                      onKeyPress={(e) => handleKeyPress(e, 'day', month)}
                      placeholder="MM"
                      maxLength={2}
                      className="w-full bg-transparent border-b-2 border-white/20 focus:border-pink-400 text-white text-3xl md:text-4xl py-4 outline-none transition-all duration-300 placeholder:text-white/20"
                      autoComplete="off"
                    />
                    <motion.div
                      className="text-white/40 text-sm mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Press <span className="text-pink-400">Enter ↵</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Step 4: Day */}
          {currentStep === 'day' && (
            <motion.div
              key="day"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  className="text-rose-400 text-sm tracking-widest uppercase mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Question 2
                </motion.div>
                <h1 className="text-5xl md:text-6xl text-white mb-2 min-h-[4rem]">
                  <MagicalText text="What day?" onComplete={() => setShowInput(true)} delay={300} />
                </h1>
                <motion.p
                  className="text-white/60 text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {year}/{month}
                </motion.p>
              </div>

              <AnimatePresence>
                {showInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <input
                      ref={dayInputRef}
                      type="text"
                      inputMode="numeric"
                      value={day}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 31)) {
                          setDay(val);
                        }
                      }}
                      onKeyPress={(e) => handleKeyPress(e, 'time', day)}
                      placeholder="DD"
                      maxLength={2}
                      className="w-full bg-transparent border-b-2 border-white/20 focus:border-rose-400 text-white text-3xl md:text-4xl py-4 outline-none transition-all duration-300 placeholder:text-white/20"
                      autoComplete="off"
                    />
                    <motion.div
                      className="text-white/40 text-sm mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Press <span className="text-rose-400">Enter ↵</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Step 5: Time */}
          {currentStep === 'time' && (
            <motion.div
              key="time"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  className="text-orange-400 text-sm tracking-widest uppercase mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Question 3
                </motion.div>
                <h1 className="text-5xl md:text-6xl text-white mb-2 min-h-[4rem]">
                  <MagicalText text="At what time?" onComplete={() => setShowInput(true)} delay={300} />
                </h1>
                <motion.p
                  className="text-white/60 text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  {month}/{day}/{year}
                </motion.p>
              </div>

              <AnimatePresence>
                {showInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-white/40 text-sm mb-2 block">Hour (0-23)</label>
                      <input
                        ref={hourInputRef}
                        type="text"
                        inputMode="numeric"
                        value={hour}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 23)) {
                            setHour(val);
                          }
                        }}
                        onKeyPress={(e) => handleTimeKeyPress(e, 'hour')}
                        placeholder="HH"
                        maxLength={2}
                        className="w-full bg-transparent border-b-2 border-white/20 focus:border-orange-400 text-white text-3xl md:text-4xl py-4 outline-none transition-all duration-300 placeholder:text-white/20"
                        autoComplete="off"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white/40 text-sm mb-2 block">Minute (0-59)</label>
                      <input
                        id="minute-input"
                        type="text"
                        inputMode="numeric"
                        value={minute}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
                            setMinute(val);
                          }
                        }}
                        onKeyPress={(e) => handleTimeKeyPress(e, 'minute')}
                        placeholder="MM"
                        maxLength={2}
                        className="w-full bg-transparent border-b-2 border-white/20 focus:border-amber-400 text-white text-3xl md:text-4xl py-4 outline-none transition-all duration-300 placeholder:text-white/20"
                        autoComplete="off"
                      />
                    </div>

                    <motion.div
                      className="text-white/40 text-sm mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Press <span className="text-amber-400">Enter ↵</span> to continue
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Step 6: Location */}
          {currentStep === 'location' && (
            <motion.div
              key="location"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div>
                <motion.div
                  className="text-cyan-400 text-sm tracking-widest uppercase mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Question 4
                </motion.div>
                <h1 className="text-5xl md:text-6xl text-white mb-2 min-h-[4rem]">
                  <MagicalText text="Where were you born?" onComplete={() => setShowInput(true)} delay={300} />
                </h1>
                <motion.p
                  className="text-white/60 text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  {month}/{day}/{year} at {hour}:{minute?.toString().padStart(2, '0')}
                </motion.p>
              </div>

              <AnimatePresence>
                {showInput && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LocationSearch onLocationSelect={handleLocationSelect} />
                    <motion.div
                      className="text-white/40 text-sm mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Type a city name and select from the list
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Complete */}
          {currentStep === 'complete' && (
            <LoadingScreen />
          )}
        </AnimatePresence>
      </div>

      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}