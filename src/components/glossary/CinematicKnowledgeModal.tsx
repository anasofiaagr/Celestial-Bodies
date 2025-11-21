import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Edit2, Save } from 'lucide-react';
import type { GlossaryItem, GlossaryCategory } from '../../contexts/GlossaryContext';
import { useGlossary } from '../../contexts/GlossaryContext';

interface CinematicKnowledgeModalProps {
  item: GlossaryItem | null;
  category: GlossaryCategory | null;
  index: number | null;
  color: string;
  onClose: () => void;
}

export function CinematicKnowledgeModal({ item, category, index, color, onClose }: CinematicKnowledgeModalProps) {
  const { updateUserDefinition } = useGlossary();
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [userDefText, setUserDefText] = useState('');

  useEffect(() => {
    if (item) {
      setUserDefText(item.user_definition || '');
    }
  }, [item]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!item || !category || index === null) return null;

  const handleSaveUserDef = () => {
    updateUserDefinition(category, index, userDefText);
    setIsEditingUser(false);
  };

  // Determine what to display based on category
  const displayName = 
    category === 'planets' 
      ? item.archetype_name || item.name || item.term || 'Item'
      : category === 'zodiac_signs'
        ? item.fusion_label || item.name || item.term || 'Item'
        : item.name || item.term || 'Item';
  
  const subtitle = 
    category === 'planets' 
      ? item.name // Show "Neptune" under "The Dreamer"
      : category === 'zodiac_signs'
        ? item.name // Show "Pisces" under "Tide of Dreams"
        : null;
  
  const archetypeName = item.archetype_name || item.archetype_figure_name || '';
  const fusionLabel = item.fusion_label || '';
  const traditionalName = item.traditional_name || item.traditional_equivalent || '';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Dimmed background */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Knowledge Sheet */}
        <motion.div
          className="relative max-w-3xl w-[90%] max-h-[85vh] overflow-y-auto rounded-2xl p-8 border border-white/20 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}05, rgba(0,0,0,0.6))`,
            backdropFilter: 'blur(20px)',
          }}
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>

          {/* Header */}
          <div className="mb-6 border-b border-white/10 pb-4">
            <h2 className="text-white mb-2" style={{ fontFamily: 'var(--font-body)', fontSize: '2rem', fontWeight: 500 }}>{displayName}</h2>
            {subtitle && (
              <div className="text-sm text-white/70 italic mb-1">{subtitle}</div>
            )}
            {traditionalName && (
              <div className="text-xs text-white/40 mt-1">Traditional: {traditionalName}</div>
            )}
          </div>

          {/* Essence */}
          {item.essence && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Essence</h3>
              <p className="text-white/80 leading-relaxed">{item.essence}</p>
            </section>
          )}

          {/* Keywords */}
          {item.keywords && item.keywords.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {item.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs text-white/70 border border-white/20"
                    style={{ background: `${color}15` }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Origin Notes */}
          {item.origin_notes && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Origin Notes</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.origin_notes}</p>
            </section>
          )}

          {/* Crosscultural Resonances */}
          {item.crosscultural_resonances && item.crosscultural_resonances.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Crosscultural Resonances
              </h3>
              <ul className="space-y-1">
                {item.crosscultural_resonances.map((res, i) => (
                  <li key={i} className="text-white/70 text-sm flex items-start">
                    <span className="mr-2 text-white/40">•</span>
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Queer Theory Links */}
          {item.queer_theory_links && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Queer Theory Links
              </h3>
              <p className="text-white/75 leading-relaxed text-sm italic">{item.queer_theory_links}</p>
            </section>
          )}

          {/* Design Logic */}
          {item.design_logic && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Design Logic</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.design_logic}</p>
            </section>
          )}

          {/* Project Rationale */}
          {item.project_rationale && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>
                Project Rationale
              </h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.project_rationale}</p>
            </section>
          )}

          {/* Element (for zodiac signs) */}
          {item.element && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Element</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.element}</p>
            </section>
          )}

          {/* Modality (for zodiac signs) */}
          {item.modality && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Modality</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.modality}</p>
            </section>
          )}

          {/* Polarity (for zodiac signs) */}
          {item.polarity && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Polarity</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.polarity}</p>
            </section>
          )}

          {/* Description (for aspects, interface concepts, view modes) */}
          {item.description && !item.essence && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Description</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.description}</p>
            </section>
          )}

          {/* Angle & Orb (for aspects) */}
          {item.angle !== undefined && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Angle & Orb</h3>
              <p className="text-white/75 leading-relaxed text-sm">
                {item.angle}° (Orb: {item.orb}°)
              </p>
            </section>
          )}

          {/* Traditional Equivalent (for interface concepts) */}
          {item.traditional_equivalent && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Traditional Equivalent</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.traditional_equivalent}</p>
            </section>
          )}

          {/* Examples (for interface concepts) */}
          {item.examples && item.examples.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Examples</h3>
              <ul className="space-y-1">
                {item.examples.map((ex, i) => (
                  <li key={i} className="text-white/70 text-sm flex items-start">
                    <span className="mr-2 text-white/40">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Context (for interface concepts) */}
          {item.context && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Context</h3>
              <p className="text-white/75 leading-relaxed text-sm italic">{item.context}</p>
            </section>
          )}

          {/* Philosophy (for interface concepts like Fluid Astrology) */}
          {item.philosophy && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Philosophy</h3>
              <p className="text-white/75 leading-relaxed text-sm italic">{item.philosophy}</p>
            </section>
          )}

          {/* Also Known As */}
          {item.also_known_as && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Also Known As</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.also_known_as}</p>
            </section>
          )}

          {/* Technical Detail (for technical terms) */}
          {item.technical_detail && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Technical Detail</h3>
              <p className="text-white/75 leading-relaxed text-sm font-mono text-xs">{item.technical_detail}</p>
            </section>
          )}

          {/* Purpose (for view modes) */}
          {item.purpose && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Purpose</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.purpose}</p>
            </section>
          )}

          {/* UI Elements (for view modes) */}
          {item.ui_elements && item.ui_elements.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>UI Elements</h3>
              <div className="flex flex-wrap gap-2">
                {item.ui_elements.map((elem, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-xs text-white/70 border border-white/20"
                    style={{ background: `${color}15` }}
                  >
                    {elem}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Usage (for poetic vocabulary) */}
          {item.usage && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Usage</h3>
              <p className="text-white/75 leading-relaxed text-sm italic">{item.usage}</p>
            </section>
          )}

          {/* Archetype Figure Name (for planets) */}
          {item.archetype_figure_name && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Archetypal Figure</h3>
              <p className="text-white/75 leading-relaxed text-sm">{item.archetype_figure_name}</p>
            </section>
          )}

          {/* Fusion Label (for zodiac signs) */}
          {item.fusion_label && (
            <section className="mb-6">
              <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2" style={{ fontFamily: 'var(--font-body)' }}>Fusion Label</h3>
              <p className="text-white/75 leading-relaxed text-sm italic" style={{ color: color }}>
                {item.fusion_label}
              </p>
            </section>
          )}

          {/* Star decoration */}
          <div className="flex justify-center mt-8">
            <div className="w-16 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}