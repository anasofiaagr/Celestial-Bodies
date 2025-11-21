// CelestialButton.tsx
// Standardized button component for Celestial Bodies app

import { motion, AnimatePresence } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface CelestialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  fullWidth?: boolean;
  particleEffect?: boolean; // Enable particle effects
}

export function CelestialButton({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  children,
  fullWidth = false,
  className = '',
  disabled = false,
  particleEffect = true,
  ...props
}: CelestialButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastEmitTime = useRef(0);
  
  // Emit particles on hover
  useEffect(() => {
    if (!isHovered || !particleEffect || disabled) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastEmitTime.current < 100) return; // Throttle
      
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const edgePoints = [
          { x: rect.left + Math.random() * rect.width, y: rect.top },
          { x: rect.left + Math.random() * rect.width, y: rect.bottom },
          { x: rect.left, y: rect.top + Math.random() * rect.height },
          { x: rect.right, y: rect.top + Math.random() * rect.height },
        ];
        
        const point = edgePoints[Math.floor(Math.random() * edgePoints.length)];
        
        const newParticles = Array.from({ length: 2 }, (_, i) => ({
          id: Date.now() + i + Math.random(),
          x: point.x,
          y: point.y,
        }));
        
        setParticles(prev => [...prev, ...newParticles]);
        lastEmitTime.current = now;
        
        // Cleanup
        setTimeout(() => {
          setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
        }, 1000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isHovered, particleEffect, disabled]);
  
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center gap-2.5 rounded-2xl font-medium transition-all duration-300 backdrop-blur-xl border relative overflow-hidden group';
  
  // Size variants
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  // Variant styles
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(109, 40, 217, 0.2))',
      border: 'rgba(139, 92, 246, 0.4)',
      color: 'rgba(255, 255, 255, 0.95)',
      hoverBackground: 'linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(109, 40, 217, 0.3))',
      shadow: '0 8px 32px rgba(139, 92, 246, 0.25)',
      hoverShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
      particleColor: 'rgba(167, 139, 250, 1)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.15)',
      color: 'rgba(255, 255, 255, 0.85)',
      hoverBackground: 'rgba(255, 255, 255, 0.1)',
      shadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      hoverShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
      particleColor: 'rgba(199, 175, 255, 0.8)',
    },
    ghost: {
      background: 'rgba(0, 0, 0, 0.3)',
      border: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.7)',
      hoverBackground: 'rgba(255, 255, 255, 0.08)',
      shadow: 'none',
      hoverShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
      particleColor: 'rgba(167, 139, 250, 0.6)',
    },
    danger: {
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15))',
      border: 'rgba(239, 68, 68, 0.5)',
      color: 'rgba(252, 165, 165, 1)',
      hoverBackground: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.25))',
      shadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
      hoverShadow: '0 12px 40px rgba(239, 68, 68, 0.5)',
      particleColor: 'rgba(252, 165, 165, 0.8)',
    },
  };
  
  const styles = variantStyles[variant];
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <>
      {/* Particle effects */}
      {particleEffect && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <AnimatePresence>
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: 3,
                  height: 3,
                  background: `radial-gradient(circle, ${styles.particleColor}, transparent)`,
                  boxShadow: `0 0 6px ${styles.particleColor}`
                }}
                initial={{
                  opacity: 1,
                  scale: 1
                }}
                animate={{
                  y: particle.y - 40 - Math.random() * 20,
                  x: particle.x + (Math.random() - 0.5) * 40,
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
      )}
      
      <motion.button
        ref={buttonRef}
        className={`${baseStyles} ${sizeStyles[size]} ${widthClass} ${className}`}
        style={{
          background: styles.background,
          borderColor: styles.border,
          color: styles.color,
          boxShadow: styles.shadow,
          fontFamily: 'var(--font-body)',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={!disabled ? { 
          scale: 1.02,
          boxShadow: styles.hoverShadow,
          background: styles.hoverBackground,
        } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2 }}
        disabled={disabled}
        {...props}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2.5">
          {Icon && iconPosition === 'left' && (
            <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} group-hover:scale-110 transition-transform`} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'} group-hover:scale-110 transition-transform`} />
          )}
        </span>
      </motion.button>
    </>
  );
}