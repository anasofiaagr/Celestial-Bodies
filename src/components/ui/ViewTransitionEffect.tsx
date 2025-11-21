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

interface ViewTransitionEffectProps {
  trigger: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export function ViewTransitionEffect({ 
  trigger, 
  intensity = 'medium' 
}: ViewTransitionEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    const particleCount = intensity === 'low' ? 30 : intensity === 'medium' ? 50 : 80;
    const colors = [
      'rgba(167, 139, 250, 0.8)',
      'rgba(199, 175, 255, 0.7)',
      'rgba(139, 92, 246, 0.6)',
      'rgba(168, 85, 247, 0.7)',
    ];

    // Create particles from center outward
    const newParticles = Array.from({ length: particleCount }, (_, i) => {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = 100 + Math.random() * 200;
      
      return {
        id: Date.now() + i + Math.random() * 1000,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 3,
        velocityX: Math.cos(angle) * distance,
        velocityY: Math.sin(angle) * distance,
      };
    });

    setParticles(newParticles);

    // Clean up after animation
    setTimeout(() => {
      setParticles([]);
    }, 1500);
  }, [trigger, intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
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
              boxShadow: `0 0 8px ${particle.color}`,
            }}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: particle.velocityX,
              y: particle.velocityY,
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Ripple effect for mode changes
interface RippleEffectProps {
  trigger: boolean;
  color?: string;
}

export function RippleEffect({ trigger, color = 'rgba(167, 139, 250, 0.3)' }: RippleEffectProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      setTimeout(() => setShow(false), 1500);
    }
  }, [trigger]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[55] flex items-center justify-center">
      <motion.div
        className="absolute rounded-full border-2"
        style={{
          borderColor: color,
          width: 100,
          height: 100,
        }}
        initial={{
          scale: 0,
          opacity: 0.8,
        }}
        animate={{
          scale: 20,
          opacity: 0,
        }}
        transition={{
          duration: 1.2,
          ease: 'easeOut',
        }}
      />
      <motion.div
        className="absolute rounded-full border"
        style={{
          borderColor: color,
          width: 100,
          height: 100,
        }}
        initial={{
          scale: 0,
          opacity: 0.6,
        }}
        animate={{
          scale: 25,
          opacity: 0,
        }}
        transition={{
          duration: 1.5,
          ease: 'easeOut',
          delay: 0.1,
        }}
      />
    </div>
  );
}
