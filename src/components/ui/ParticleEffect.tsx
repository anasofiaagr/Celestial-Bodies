import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
}

interface ParticleEffectProps {
  trigger: boolean;
  x: number;
  y: number;
  count?: number;
  colors?: string[];
  spread?: number;
}

export function ParticleEffect({
  trigger,
  x,
  y,
  count = 15,
  colors = ['rgba(167, 139, 250, 1)', 'rgba(199, 175, 255, 1)', 'rgba(139, 92, 246, 1)'],
  spread = 80
}: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i + Math.random() * 1000,
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
        velocityX: (Math.random() - 0.5) * spread,
        velocityY: -20 - Math.random() * 40
      }));

      setParticles(prev => [...prev, ...newParticles]);

      // Clean up after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1000);
    }
  }, [trigger, x, y, count, colors, spread]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, ${particle.color}, transparent)`,
              boxShadow: `0 0 6px ${particle.color}`
            }}
            initial={{
              opacity: 1,
              scale: 1
            }}
            animate={{
              x: particle.velocityX,
              y: particle.velocityY,
              opacity: 0,
              scale: 0
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8 + Math.random() * 0.3,
              ease: 'easeOut'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook for cursor particle trail
export function useCursorParticles(enabled: boolean = true, throttle: number = 50) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [lastEmit, setLastEmit] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastEmit < throttle) return;

      setLastEmit(now);

      const newParticle: Particle = {
        id: now + Math.random(),
        x: e.clientX,
        y: e.clientY,
        color: Math.random() > 0.5 ? 'rgba(167, 139, 250, 0.6)' : 'rgba(199, 175, 255, 0.6)',
        size: 2 + Math.random() * 2,
        velocityX: (Math.random() - 0.5) * 20,
        velocityY: (Math.random() - 0.5) * 20
      };

      setParticles(prev => [...prev, newParticle]);

      // Clean up
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, lastEmit, throttle]);

  return particles;
}

// Component for cursor trail
export function CursorParticleTrail({ enabled = true }: { enabled?: boolean }) {
  const particles = useCursorParticles(enabled, 50);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, ${particle.color}, transparent)`,
              boxShadow: `0 0 4px ${particle.color}`
            }}
            initial={{
              opacity: 0.8,
              scale: 1
            }}
            animate={{
              x: particle.velocityX,
              y: particle.velocityY,
              opacity: 0,
              scale: 0
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: 'easeOut'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
