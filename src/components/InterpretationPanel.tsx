import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, BookOpen, Stars } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import type { PlanetPlacementInterpretation, AspectInterpretation } from '../utils/interpretationGenerator';

interface InterpretationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  planetInterpretations: PlanetPlacementInterpretation[];
  aspectInterpretations: AspectInterpretation[];
}

export default function InterpretationPanel({
  isOpen,
  onClose,
  planetInterpretations,
  aspectInterpretations,
}: InterpretationPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-gradient-to-br from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-xl border-l border-white/10 z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Sparkles className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h2 className="text-white">Your Cosmic Blueprint</h2>
                  <p className="text-sm text-white/60">Personalized astrological interpretations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="placements" className="h-[calc(100%-88px)]">
              <TabsList className="w-full justify-start border-b border-white/10 rounded-none bg-transparent p-0 h-auto">
                <TabsTrigger
                  value="placements"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-400 data-[state=active]:bg-transparent bg-transparent text-white/60 data-[state=active]:text-white px-6 py-3"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Planet Placements
                  <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-200 border-purple-400/30">
                    {planetInterpretations.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="aspects"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-400 data-[state=active]:bg-transparent bg-transparent text-white/60 data-[state=active]:text-white px-6 py-3"
                >
                  <Stars className="w-4 h-4 mr-2" />
                  Aspects
                  <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-200 border-purple-400/30">
                    {aspectInterpretations.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Planet Placements Tab */}
              <TabsContent value="placements" className="h-[calc(100%-60px)] mt-0">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-4">
                    {planetInterpretations.map((interp, index) => (
                      <motion.div
                        key={`${interp.planetName}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                          <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                              <span className="text-purple-300">{interp.planetName}</span>
                              <span className="text-white/40">in</span>
                              <span className="text-blue-300">{interp.signName}</span>
                              <span className="text-white/40">•</span>
                              <span className="text-sm text-white/60">House {interp.houseNumber}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-white/80 leading-relaxed italic">
                              {interp.interpretation}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}

                    {planetInterpretations.length === 0 && (
                      <div className="text-center py-12">
                        <Sparkles className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">No planet placements available</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Aspects Tab */}
              <TabsContent value="aspects" className="h-[calc(100%-60px)] mt-0">
                <ScrollArea className="h-full">
                  <div className="p-6 space-y-4">
                    {aspectInterpretations.map((interp, index) => (
                      <motion.div
                        key={`${interp.planet1}-${interp.planet2}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-white flex items-center gap-2">
                                <span className="text-purple-300">{interp.planet1}</span>
                                <span className="text-white/40">{interp.aspectType}</span>
                                <span className="text-blue-300">{interp.planet2}</span>
                              </CardTitle>
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${interp.aspectType === 'Conjunction' ? 'border-gray-400/50 text-gray-300' : ''}
                                  ${interp.aspectType === 'Sextile' ? 'border-green-400/50 text-green-300' : ''}
                                  ${interp.aspectType === 'Square' ? 'border-red-400/50 text-red-300' : ''}
                                  ${interp.aspectType === 'Trine' ? 'border-blue-400/50 text-blue-300' : ''}
                                  ${interp.aspectType === 'Opposition' ? 'border-orange-400/50 text-orange-300' : ''}
                                `}
                              >
                                {interp.aspectType}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-white/80 leading-relaxed italic">
                              {interp.interpretation}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}

                    {aspectInterpretations.length === 0 && (
                      <div className="text-center py-12">
                        <Stars className="w-12 h-12 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40">No aspects detected</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
