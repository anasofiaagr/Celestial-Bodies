import { motion, AnimatePresence } from 'motion/react';
import { getHouseName } from '../utils/fluidAstrologyMappings';
import integratedDataset from '../data/newest_integrated_dataset';
import { useGlossary } from '../contexts/GlossaryContext';
import { HOUSE_COLORS } from './Spiral';

interface HouseLayerOverlayProps {
  layerIndex: number | null;
  isVisible: boolean;
}

export function HouseLayerOverlay({ layerIndex, isVisible }: HouseLayerOverlayProps) {
  if (!isVisible || layerIndex === null) return null;

  const { glossaryData } = useGlossary();
  const houseData = integratedDataset.houses[layerIndex];
  // Use the glossary house name instead of the fluid astrology mapping
  const glossaryHouses = glossaryData.houses as any[];
  const glossaryHouse = glossaryHouses?.[layerIndex];
  const houseName = glossaryHouse?.name || getHouseName(layerIndex);
  const keywords = houseData?.keywords || [];
  const houseColor = HOUSE_COLORS[layerIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* House Name with Color - Bottom Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="fixed bottom-8 left-8 z-20 pointer-events-none flex items-center gap-3"
          >
            {/* Color Indicator Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-4 h-4 rounded-full"
              style={{
                backgroundColor: houseColor,
                boxShadow: `0 0 20px ${houseColor}80, 0 0 40px ${houseColor}40`,
              }}
            />
            {/* House Name */}
            <div 
              className="text-lg font-light tracking-wide drop-shadow-lg max-w-md"
              style={{
                color: houseColor,
                textShadow: `0 0 20px ${houseColor}60`,
              }}
            >
              {houseName}
            </div>
          </motion.div>

          {/* Keywords - Bottom Center (slightly right of house name) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/3 z-20 pointer-events-none"
          >
            <div className="text-white/70 text-base font-light drop-shadow-lg">
              {keywords.join(', ')}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}