import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function ProjectDocumentation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0a1f] via-[#1a0b2e] to-[#000000] text-white p-12">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* Header */}
        <header className="text-center space-y-6 pt-12">
          <h1 className="text-7xl tracking-tight bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 bg-clip-text text-transparent">
            Celestial Bodies
          </h1>
          <p className="text-purple-300/70 text-xl">
            A Poetic Journey Through Personal Cosmology
          </p>
        </header>

        {/* 1. SUMMARY / NARRATIVE STATEMENT */}
        <section className="space-y-8">
          <div className="border-l-4 border-purple-500/50 pl-8">
            <h2 className="text-5xl mb-6 text-purple-200">
              01 — Narrative Statement
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 bg-white/5 backdrop-blur-sm rounded-2xl p-10 border border-purple-500/20">
            
            <div className="space-y-4">
              <h3 className="text-2xl text-purple-300">The Project</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                Celestial Bodies is an interactive 3D natal chart visualization that reimagines astrology as a living, evolving poetic artifact. Rather than reducing individuals to fixed archetypes, it presents birth charts as a 12-layer helical spiral—a cosmic topography where planets orbit through houses, aspects connect distant energies, and the entire structure breathes with subtle motion. Users enter their birth data and receive not predictions, but reflections: personalized poetic sentences that speak to potentials, tensions, and the ineffable qualities of being born at a specific moment in time.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl text-purple-300">The User</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                Our users are seekers—people drawn to astrology not for deterministic answers, but for language and imagery that helps them see themselves differently. They're aesthetically sensitive, intellectually curious, and skeptical of reductive personality frameworks. They want tools for self-reflection that honor complexity, ambiguity, and poetic truth over literal interpretation. They appreciate design that feels considered, atmosphere that invites contemplation, and text that reads like literature rather than algorithmic output.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl text-purple-300">The Experience</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                The experience is one of slow revelation. Users begin by entering their birth details through a minimal, atmospheric onboarding flow. Then they're presented with their chart—not as a static wheel, but as a rotating 3D spiral that invites exploration from multiple perspectives. Each view mode (Spiral, House, Planet, Constellation, Evolving) offers a different lens: the Spiral View provides one holistic sentence, House View contextualizes energies by life domain, Planet View offers intimate micro-narratives, Constellation View shows pure relational geometry, and Evolving View suggests the chart as process rather than fixed state. Users can download high-resolution constellation maps—beautiful artifacts they'd want to print and keep.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl text-purple-300">Why This Visual Direction</h3>
              <p className="text-lg text-white/80 leading-relaxed">
                The visual language—soft cosmic gradients, slow orbital motion, glowing aspect lines, poetic typography—creates an atmosphere of contemplation rather than consumption. The 3D spiral structure makes the abstract concrete: houses aren't just numbered sections but actual layers of a helix that you can orbit around. Aspect lines aren't tabular data but visible threads connecting distant planets. The color palette (deep space purples, subtle golds, ethereal blues) evokes night sky observation, ancient astronomy, and the liminal space between science and poetry. Motion is restrained and purposeful—the spiral rotates slowly, particles drift gently, transitions fade rather than snap—because the experience should feel meditative, not gamified. Typography ranges from whisper-thin to emphatic, mirroring the way astrological language itself moves between suggestion and significance. Everything serves the core idea: <span className="text-purple-300 italic">your birth chart is not a diagnosis; it's a constellation of possibilities, and this tool helps you see it as art.</span>
              </p>
            </div>
          </div>
        </section>

        {/* 2. MOODBOARD */}
        <section className="space-y-8">
          <div className="border-l-4 border-purple-500/50 pl-8">
            <h2 className="text-5xl mb-6 text-purple-200">
              02 — Moodboard
            </h2>
            <p className="text-xl text-purple-300/70">
              The tone of the experience, at a glance.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Row 1: Cosmic & Contemplative */}
            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80"
                alt="Deep space nebula with purple and blue hues"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-purple-200">
                Cosmic Depth
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80"
                alt="Starry night sky with Milky Way"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-purple-200">
                Stellar Navigation
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=80"
                alt="Spiral galaxy in deep space"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-purple-200">
                Spiral Structure
              </div>
            </div>

            {/* Row 2: Poetic & Minimal */}
            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1451847251646-8a6c0dd1510c?w=800&q=80"
                alt="Geometric light rays through darkness"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-purple-200">
                Geometric Poetry
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80"
                alt="Minimalist night landscape"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-purple-200">
                Contemplative Space
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80"
                alt="Flowing abstract light"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-purple-200">
                Fluid Motion
              </div>
            </div>

            {/* Row 3: Connections & Artifacts */}
            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
                alt="Network of connected nodes"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-purple-200">
                Relational Geometry
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80"
                alt="Ancient astronomical charts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-purple-200">
                Archival Quality
              </div>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden border border-purple-500/30 group">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&q=80"
                alt="Soft glowing orbs in space"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-sm text-purple-200">
                Luminous Presence
              </div>
            </div>
          </div>

          {/* Mood Keywords */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                'Contemplative', 'Cinematic', 'Poetic', 'Liminal',
                'Ethereal', 'Precise', 'Intimate', 'Cosmic',
                'Non-deterministic', 'Relational', 'Slow', 'Luminous'
              ].map((keyword) => (
                <div 
                  key={keyword}
                  className="px-6 py-3 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200"
                >
                  {keyword}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. DESIGN SYSTEM SUMMARY */}
        <section className="space-y-12 pb-20">
          <div className="border-l-4 border-purple-500/50 pl-8">
            <h2 className="text-5xl mb-6 text-purple-200">
              03 — Design System
            </h2>
          </div>

          {/* Color Palette */}
          <div className="space-y-6">
            <h3 className="text-3xl text-purple-300">Color Palette</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Deep Space Backgrounds */}
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-gradient-to-br from-[#0f0a1f] via-[#1a0b2e] to-[#000000] border border-purple-500/30" />
                <div className="text-sm">
                  <div className="text-purple-200">Deep Space</div>
                  <div className="text-purple-400/60 font-mono text-xs">#0f0a1f → #000000</div>
                </div>
              </div>

              {/* Purple Primary */}
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-purple-500 border border-purple-400/50" />
                <div className="text-sm">
                  <div className="text-purple-200">Primary Glow</div>
                  <div className="text-purple-400/60 font-mono text-xs">#8B5CF6</div>
                </div>
              </div>

              {/* Light Purple Accent */}
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-purple-300 border border-purple-300/50" />
                <div className="text-sm">
                  <div className="text-purple-200">Accent Light</div>
                  <div className="text-purple-400/60 font-mono text-xs">#A78BFA</div>
                </div>
              </div>

              {/* Gold Highlight */}
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#F9C74F] border border-[#F9C74F]/50" />
                <div className="text-sm">
                  <div className="text-purple-200">Solar Gold</div>
                  <div className="text-purple-400/60 font-mono text-xs">#F9C74F</div>
                </div>
              </div>

              {/* House Colors Row */}
              <div className="space-y-3 col-span-2">
                <div className="h-32 rounded-xl bg-gradient-to-r from-[#F94144] via-[#F9C74F] via-[#90BE6D] via-[#577590] via-[#9B5DE5] to-[#00F5D4] border border-purple-500/30" />
                <div className="text-sm">
                  <div className="text-purple-200">12 House Gradients</div>
                  <div className="text-purple-400/60 text-xs">Reds → Yellows → Greens → Blues → Purples → Teals</div>
                </div>
              </div>

              {/* Aspect Colors */}
              <div className="space-y-3 col-span-2">
                <div className="grid grid-cols-5 gap-2 h-32">
                  <div className="rounded-lg bg-[#FFD700] border border-[#FFD700]/50" title="Conjunction" />
                  <div className="rounded-lg bg-[#00C4CC] border border-[#00C4CC]/50" title="Sextile" />
                  <div className="rounded-lg bg-[#4CAF50] border border-[#4CAF50]/50" title="Trine" />
                  <div className="rounded-lg bg-[#D72638] border border-[#D72638]/50" title="Square" />
                  <div className="rounded-lg bg-[#3F51B5] border border-[#3F51B5]/50" title="Opposition" />
                </div>
                <div className="text-sm">
                  <div className="text-purple-200">5 Aspect Types</div>
                  <div className="text-purple-400/60 text-xs">Conjunction, Sextile, Trine, Square, Opposition</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 border-l-4 border-purple-500/50 p-6 rounded-r-xl">
              <p className="text-purple-200/80 italic">
                <span className="text-purple-300 not-italic">Justification:</span> The color palette evokes deep space observation—dark, nearly black backgrounds create a sense of vastness and contemplation, while purple serves as the primary accent (blending the warmth of red with the depth of blue, suggesting both emotion and intellect). The 12 house colors create a visible spectrum around the spiral, making each life domain immediately recognizable. Aspect colors use high-contrast hues (gold, teal, green, red, blue) so relational lines are instantly distinguishable. This supports the experience by making the abstract (houses, aspects) visually concrete while maintaining an atmospheric, non-clinical tone.
              </p>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-6">
            <h3 className="text-3xl text-purple-300">Typography + Hierarchy</h3>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-10 border border-purple-500/20 space-y-8">
              <div className="space-y-2">
                <div className="text-6xl">Celestial Bodies</div>
                <div className="text-sm text-purple-400/60">Heading 1 — Default font, 4xl–6xl, tracking-tight</div>
              </div>

              <div className="space-y-2">
                <div className="text-4xl text-purple-200">Spiral View — House of Emergence</div>
                <div className="text-sm text-purple-400/60">Heading 2 — Default font, 2xl–4xl, medium weight</div>
              </div>

              <div className="space-y-2">
                <div className="text-2xl text-purple-300">12 Aspects • 10 Bodies</div>
                <div className="text-sm text-purple-400/60">Heading 3 — Default font, xl–2xl, subtle color</div>
              </div>

              <div className="space-y-2">
                <div className="text-lg">
                  You carry <span className="text-[#F9C74F]">luminous autonomy</span>, shaped by{' '}
                  <span className="text-[#F94144]">urgent motion</span>, moving through{' '}
                  <span className="text-[#90BE6D]">grounded rhythms</span>.
                </div>
                <div className="text-sm text-purple-400/60">Body Text — Default font, base–lg, normal weight, inline color tokens</div>
              </div>

              <div className="space-y-2">
                <div className="text-base" style={{ fontWeight: 300 }}>
                  A tender accumulation where presence gathers, slowly, like morning light on still water.
                </div>
                <div className="text-sm text-purple-400/60">Poetic Narrative — Light weight (300), base size, soft white</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-purple-400/70 uppercase tracking-wide">
                  Spiral View
                </div>
                <div className="text-sm text-purple-400/60">UI Labels — Small, uppercase, wide tracking, muted</div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-purple-500/60 font-mono">
                  API: natal-aspects-data • Status: Connected
                </div>
                <div className="text-sm text-purple-400/60">System Text — Extra small, monospace, low opacity</div>
              </div>
            </div>

            <div className="bg-purple-500/10 border-l-4 border-purple-500/50 p-6 rounded-r-xl">
              <p className="text-purple-200/80 italic">
                <span className="text-purple-300 not-italic">Justification:</span> Typography creates a hierarchy of intimacy. Large headings are bold but not aggressive, establishing presence without shouting. Body text defaults to readable sizes with normal weight for scanning, but poetic sentences use light weight (300) to signal a shift in register—these are whispers, invitations to slow down. Colored inline tokens (planet names, signs, houses) create visual rhythm within sentences, making the text feel alive and layered rather than flat. Uppercase labels are used sparingly for UI chrome, staying out of the way. This typographic system supports contemplative reading: users should feel they're encountering literature, not just consuming data.
              </p>
            </div>
          </div>

          {/* Images/Videos */}
          <div className="space-y-6">
            <h3 className="text-3xl text-purple-300">Images / Videos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h4 className="text-xl text-purple-200">Constellation Downloads</h4>
                <div className="aspect-square bg-gradient-to-br from-[#0f0a1f] via-[#1a0b2e] to-[#000000] rounded-lg border border-purple-500/30 flex items-center justify-center">
                  <div className="text-center text-purple-300/50 text-sm">
                    2048×2048px<br/>High-Res Artifact
                  </div>
                </div>
                <p className="text-sm text-purple-300/70">
                  Downloadable constellation maps with real chart data, aspect lines, planet positions, and poetic sentences. Print-worthy quality (2048×2048px).
                </p>
              </div>

              <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h4 className="text-xl text-purple-200">No Stock Photography</h4>
                <div className="aspect-square bg-black/50 rounded-lg border border-purple-500/30 flex items-center justify-center">
                  <div className="text-center text-purple-300/50 text-sm">
                    Generated<br/>Visuals Only
                  </div>
                </div>
                <p className="text-sm text-purple-300/70">
                  No generic imagery. All visuals are generated: 3D spiral structures, particle systems, gradient backgrounds, geometric aspect lines.
                </p>
              </div>
            </div>

            <div className="bg-purple-500/10 border-l-4 border-purple-500/50 p-6 rounded-r-xl">
              <p className="text-purple-200/80 italic">
                <span className="text-purple-300 not-italic">Justification:</span> We avoid stock photography entirely because the experience should feel singular and generated, not assembled from generic parts. Every visual element—the 3D spiral, the aspect lines, the particle field, the constellation maps—is unique to each chart. The downloadable artifacts are designed to be print-worthy, something users would frame or save, reinforcing the idea that their chart is a bespoke art object. This supports the core experience: you're not consuming content; you're witnessing something being created specifically for you.
              </p>
            </div>
          </div>

          {/* Icons/Shapes */}
          <div className="space-y-6">
            <h3 className="text-3xl text-purple-300">Icons / Shapes Style</h3>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-10 border border-purple-500/20">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                {/* Example icons/shapes */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-2 border-purple-400/50 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                  </div>
                  <div className="text-xs text-purple-400/70 text-center">Planet Node</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" className="stroke-purple-400/70" strokeWidth="2" fill="none">
                      <path d="M4 24 L44 24" />
                      <path d="M12 16 L12 32" />
                      <path d="M36 16 L36 32" />
                    </svg>
                  </div>
                  <div className="text-xs text-purple-400/70 text-center">Frame Brackets</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 48 48" className="stroke-[#4CAF50]" strokeWidth="2.5" fill="none">
                      <path d="M8 24 L40 24" opacity="0.8" />
                    </svg>
                  </div>
                  <div className="text-xs text-purple-400/70 text-center">Aspect Line</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="2" fill="#A78BFA" opacity="0.3" />
                      <circle cx="12" cy="12" r="1.5" fill="#A78BFA" opacity="0.5" />
                      <circle cx="36" cy="36" r="1" fill="#A78BFA" opacity="0.4" />
                      <circle cx="30" cy="15" r="1.2" fill="#A78BFA" opacity="0.3" />
                    </svg>
                  </div>
                  <div className="text-xs text-purple-400/70 text-center">Particles</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-transparent" />
                  <div className="text-xs text-purple-400/70 text-center">Panels</div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <div className="text-2xl text-purple-400/50">◯</div>
                  </div>
                  <div className="text-xs text-purple-400/70 text-center">Minimal Icons</div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-purple-500/20 text-sm text-purple-300/70">
                <span className="text-purple-200">Style:</span> Geometric, line-based, subtle. Circles, lines, and simple bracket shapes. No complex illustrations or filled icons. Lucide React for any UI icons (minimal use).
              </div>
            </div>

            <div className="bg-purple-500/10 border-l-4 border-purple-500/50 p-6 rounded-r-xl">
              <p className="text-purple-200/80 italic">
                <span className="text-purple-300 not-italic">Justification:</span> The icon language is minimal and geometric because the 3D spiral itself is the primary visual element—everything else should recede. Circles represent planets and nodes (echoing astronomical imagery), thin lines represent connections and structure, simple brackets frame content without competing for attention. No filled icons or complex illustrations that would feel "designed" in a heavy-handed way. This restraint supports the experience by keeping focus on the chart itself: the UI is a frame, not the subject.
              </p>
            </div>
          </div>

          {/* Interactions */}
          <div className="space-y-6">
            <h3 className="text-3xl text-purple-300">Interaction Types</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 space-y-3">
                <h4 className="text-xl text-purple-200">Orbital Camera Control</h4>
                <p className="text-sm text-purple-300/70">
                  Click and drag to rotate the 3D spiral. Scroll to zoom in/out. Smooth damping and auto-rotation when idle.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 space-y-3">
                <h4 className="text-xl text-purple-200">View Mode Toggle</h4>
                <p className="text-sm text-purple-300/70">
                  Buttons to switch between Spiral, House, Planet, Constellation, and Evolving views. Smooth transitions between states.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 space-y-3">
                <h4 className="text-xl text-purple-200">House/Planet Selection</h4>
                <p className="text-sm text-purple-300/70">
                  Click houses (rings) or planets (nodes) to isolate and read contextual sentences. Highlight on hover, glow on select.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 space-y-3">
                <h4 className="text-xl text-purple-200">Artifact Download</h4>
                <p className="text-sm text-purple-300/70">
                  Generate and download high-res constellation map (2048×2048px PNG). Renders with exact chart data and poetic text overlay.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 space-y-3">
                <h4 className="text-xl text-purple-200">Onboarding Flow</h4>
                <p className="text-sm text-purple-300/70">
                  Multi-step form for birth data entry. Autocomplete for location (OpenStreetMap Nominatim API). Minimal validation, soft errors.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 space-y-3">
                <h4 className="text-xl text-purple-200">Particle Interactions</h4>
                <p className="text-sm text-purple-300/70">
                  Ambient particles drift slowly, react subtly to mouse position in select areas. Non-intrusive atmospheric enhancement.
                </p>
              </div>
            </div>

            <div className="bg-purple-500/10 border-l-4 border-purple-500/50 p-6 rounded-r-xl">
              <p className="text-purple-200/80 italic">
                <span className="text-purple-300 not-italic">Justification:</span> Interactions are deliberate and spacious. Orbital controls invite exploration without feeling like a game—you're observing a model, not manipulating a toy. View mode toggles are present but not aggressive; the default Spiral View is often enough. Clicking houses and planets reveals depth on demand rather than overwhelming users upfront. The download feature transforms ephemeral screen content into a keepable artifact, reinforcing the idea that this chart has weight and permanence. Particles respond to presence but don't demand attention. All interactions support slow, contemplative engagement: the app rewards patience and curiosity rather than frantic clicking.
              </p>
            </div>
          </div>

          {/* Motion/Transitions */}
          <div className="space-y-6">
            <h3 className="text-3xl text-purple-300">Motion / Transitions / Sound</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-lg text-purple-200">Slow Auto-Rotation</h4>
                    <p className="text-sm text-purple-300/70">
                      The 3D spiral rotates slowly when idle (0.5–1 rotation/minute). Creates a sense of living presence, like watching planets move.
                    </p>
                    <div className="text-xs font-mono text-purple-400/50">duration: ~60s per rotation</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg text-purple-200">Smooth Camera Damping</h4>
                    <p className="text-sm text-purple-300/70">
                      Orbital controls use damping for smooth deceleration. No snapping or jarring stops. Feels astronomical, not mechanical.
                    </p>
                    <div className="text-xs font-mono text-purple-400/50">enableDamping: true, dampingFactor: 0.05</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg text-purple-200">Fade Transitions</h4>
                    <p className="text-sm text-purple-300/70">
                      View mode changes, text updates, and panel appearances use opacity fades (300–500ms). No slides, no flips—just gentle reveals.
                    </p>
                    <div className="text-xs font-mono text-purple-400/50">transition: opacity 400ms ease-out</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg text-purple-200">Particle Drift</h4>
                    <p className="text-sm text-purple-300/70">
                      Ambient particles move with Perlin noise—organic, unpredictable, non-linear. Adds life without distraction.
                    </p>
                    <div className="text-xs font-mono text-purple-400/50">speed: 0.01–0.03, scale: 0.002</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg text-purple-200">Glow Pulsing</h4>
                    <p className="text-sm text-purple-300/70">
                      Selected planets and houses glow with subtle pulsing (2–3s cycle). Breathes rather than blinks. Suggests aliveness.
                    </p>
                    <div className="text-xs font-mono text-purple-400/50">animation: pulse 2.5s ease-in-out infinite</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg text-purple-200">No Sound (Currently)</h4>
                    <p className="text-sm text-purple-300/70">
                      Silence is intentional. The experience is contemplative, not multimedia. Future consideration: optional ambient drones or subtle tones on interaction.
                    </p>
                    <div className="text-xs font-mono text-purple-400/50">sound: none (designed silence)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-500/10 border-l-4 border-purple-500/50 p-6 rounded-r-xl">
              <p className="text-purple-200/80 italic">
                <span className="text-purple-300 not-italic">Justification:</span> Motion is restrained and purposeful. The slow auto-rotation creates ambient presence—the spiral is always subtly moving, suggesting the sky itself. Smooth damping on orbital controls makes interaction feel weighty and real, not gamified. Fade transitions keep focus on content rather than flashy effects. Particle drift adds organic life without demanding attention. Glow pulsing on selected elements breathes rather than blinks, reinforcing the "living chart" metaphor. Sound is absent by design—silence supports contemplation and avoids the "edutainment" trap. All motion serves the core experience: this is a tool for slow looking, not quick consumption. The chart unfolds at the pace of thought, not the pace of TikTok.
              </p>
            </div>
          </div>

        </section>

        {/* Footer */}
        <footer className="text-center text-purple-400/50 text-sm pb-12">
          <p>Celestial Bodies — A poetic astrology visualization tool</p>
          <p className="mt-2">Designed for contemplation, built for beauty</p>
        </footer>

      </div>
    </div>
  );
}
