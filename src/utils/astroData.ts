// Astrological dataset exported as TypeScript
// This data is used for generating personalized interpretations

export const astroData = {
  data: {
    planets: [
      {
        name: "Sun",
        glyph: "☉",
        archetype_name: "Core Self & Vital Expression",
        archetype_figure_name: "The Hero",
        position: { sign: "Aries", degree: 10, house: 1 },
        essence: "vitality, core self",
        why: "central organizing principle of identity and purpose.",
        traditional_associations: [
          {
            culture: "Western",
            association:
              "Vitality, ego, self-expression, the hero",
          },
          {
            culture: "Vedic",
            association: "Soul, authority, the father (Surya)",
          },
          {
            culture: "Chinese",
            association: "Yang energy, the active principle",
          },
        ],
        fluid_qualities: [
          "Radiating energy",
          "Core essence",
          "Illumination",
          "Warmth",
          "Centrality",
        ],
        reflective_questions: [
          "How does your inner light want to shine?",
          "What energizes your core being?",
          "Where do you feel most radiant?",
        ],
        visual_elements: [
          "Morphing warm gradients",
          "Radiating patterns",
          "Pulsing light forms",
          "Fluid gold and amber movements",
        ],
      },
      {
        name: "Moon",
        glyph: "☾",
        archetype_name: "Emotional Body & Inner Needs",
        archetype_figure_name: "The Mother",
        position: { sign: "Taurus", degree: 20, house: 2 },
        essence: "emotion, memory",
        why: "inner tide that holds instinct and feeling.",
        traditional_associations: [
          {
            culture: "Western",
            association:
              "Emotions, intuition, the unconscious, the mother",
          },
          {
            culture: "Vedic",
            association:
              "The mind, feelings, the public (Chandra)",
          },
        ],
        fluid_qualities: [
          "Cyclical flow",
          "Internal rhythms",
          "Receptivity",
          "Embodied memory",
          "Intuitive knowing",
        ],
        reflective_questions: [
          "What is the rhythm of your inner tide today?",
          "What does your intuition feel like, before it becomes a thought?",
          "What memories are living in your body?",
        ],
        visual_elements: [
          "Soft, glowing light",
          "Shifting pearlescent textures",
          "Liquid silver forms",
          "Ebbing and flowing patterns",
        ],
      },
      {
        name: "Mercury",
        glyph: "☿",
        archetype_name: "Mind & Communication",
        archetype_figure_name: "The Messenger",
        position: { sign: "Aries", degree: 15, house: 1 },
        essence: "language, thought",
        why: "messenger that connects symbols, minds, and meaning.",
        traditional_associations: [
          {
            culture: "Western",
            association:
              "Communication, intellect, reason, the messenger (Hermes)",
          },
          {
            culture: "Vedic",
            association:
              "Intelligence, speech, analytics (Budha)",
          },
        ],
        fluid_qualities: [
          "The bridge between worlds",
          "Translator of symbols",
          "Fluid thought",
          "Adaptability",
          "Curiosity",
        ],
        reflective_questions: [
          "What message needs to travel between different parts of your world?",
          "What new language is needed for an old feeling?",
          "How can you hold two truths at once?",
        ],
        visual_elements: [
          "Interwoven lines of light",
          "Shifting geometric patterns",
          "Liquid metal movements",
          "Transparent, overlapping layers",
        ],
      },
      {
        name: "Venus",
        glyph: "♀",
        archetype_name: "Attraction & Relational Harmony",
        archetype_figure_name: "The Lover",
        position: { sign: "Cancer", degree: 15, house: 4 },
        essence: "attraction, value",
        why: "principle of resonance, desire, beauty, and belonging.",
        traditional_associations: [
          {
            culture: "Western",
            association:
              "Love, beauty, harmony, art, the lover (Aphrodite)",
          },
          {
            culture: "Vedic",
            association:
              "Pleasure, beauty, sensuality (Shukra)",
          },
        ],
        fluid_qualities: [
          "Relational energy",
          "Attraction",
          "Resonance",
          "Aesthetic sense",
          "Value creation",
        ],
        reflective_questions: [
          "What do you find beautiful that defies convention?",
          "How do you create connection beyond traditional models?",
          "What do you truly value, and how do you embody that value?",
        ],
        visual_elements: [
          "Harmonious color gradients",
          "Symmetrical patterns that gently break",
          "Soft, flowing forms",
          "Copper and green palettes",
        ],
      },
      {
        name: "Mars",
        glyph: "♂",
        archetype_name: "Directed Energy & Desire",
        archetype_figure_name: "The Warrior",
        position: { sign: "Leo", degree: 25, house: 5 },
        essence: "will, action",
        why: "cutting, driving force that asserts motion.",
        traditional_associations: [
          {
            culture: "Western",
            association:
              "Action, desire, aggression, the warrior (Ares)",
          },
          {
            culture: "Vedic",
            association: "Energy, action, courage (Mangala)",
          },
        ],
        fluid_qualities: [
          "Focused energy",
          "Catalytic impulse",
          "Severing force",
          "Will to act",
          "Drive",
        ],
        reflective_questions: [
          "Where is your focused energy needed most right now?",
          "What must be cut away for a new path to form?",
          "How does the impulse to act feel in your body?",
        ],
        visual_elements: [
          "Sharp, radiating lines that soften",
          "Glitching red-orange gradients",
          "Emergent patterns",
          "Focused points of intense light",
        ],
      },
    ],
    signs: [
      {
        name: "Aries",
        element: "Fire",
        glyph: "♈",
        visual_mappings: {
          shape: "flare",
          motion: "surge",
          texture: "spark",
          palette: "fire",
          rhythm: "pulse",
        },
        cross_cultural_archetypes: [
          { culture: "Western", archetype: "The Warrior" },
        ],
        expressions: [
          "Initiating force",
          "Pioneering impulse",
          "Spark of creation",
          "Emergent energy",
        ],
        shadows: ["Impulsiveness", "Aggression", "Impatience"],
        reflective_questions: [
          "Where does your initiating energy want to flow?",
          "What new beginnings are calling to you?",
        ],
        visual_elements: [
          "Glitching red-orange gradients",
          "Sharp, dynamic forms",
          "Pulsing, emergent patterns",
        ],
      },
      {
        name: "Taurus",
        element: "Earth",
        glyph: "♉",
        visual_mappings: {
          shape: "orb",
          motion: "stillness",
          texture: "earth",
          palette: "earth",
          rhythm: "stillness",
        },
        cross_cultural_archetypes: [
          { culture: "Western", archetype: "The Builder" },
        ],
        expressions: [
          "Grounded presence",
          "Sensory richness",
          "Embodied value",
          "Steadfast devotion",
        ],
        shadows: [
          "Stubbornness",
          "Possessiveness",
          "Resistance to change",
        ],
        reflective_questions: [
          "What does it feel like to be truly rooted?",
          "How do you honor pleasure and embodiment?",
        ],
        visual_elements: [
          "Rich, textured surfaces",
          "Slow, deliberate animations",
          "Earthy color palettes",
        ],
      },
      {
        name: "Gemini",
        element: "Air",
        glyph: "♊",
        visual_mappings: {
          shape: "glyph",
          motion: "oscillate",
          texture: "mirror_texture",
          palette: "air",
          rhythm: "strobe",
        },
        cross_cultural_archetypes: [
          {
            culture: "Western",
            archetype: "The Jester/The Messenger",
          },
        ],
        expressions: [
          "Dynamic interplay",
          "Holding multiplicity",
          "Curious inquiry",
          "Weaving connections",
        ],
        shadows: [
          "Volatility",
          "Superficiality",
          "Inconsistency",
        ],
        reflective_questions: [
          "How many different people can you be today?",
          "What happens when you hold two opposing ideas as true?",
        ],
        visual_elements: [
          "Interwoven, shifting patterns",
          "Paired or mirrored forms",
          "Light, airy visuals",
        ],
      },
      {
        name: "Cancer",
        element: "Water",
        glyph: "♋",
        visual_mappings: {
          shape: "orb",
          motion: "tide",
          texture: "liquid",
          palette: "water",
          rhythm: "tide",
        },
        cross_cultural_archetypes: [
          { culture: "Western", archetype: "The Nurturer" },
        ],
        expressions: [
          "Protective care",
          "Emotional depth",
          "Ancestral memory",
          "Creating sanctuary",
        ],
        shadows: ["Clinginess", "Moodiness", "Defensiveness"],
        reflective_questions: [
          "What does home feel like in your body?",
          "How do you protect what is tender?",
        ],
        visual_elements: [
          "Flowing, wave-like forms",
          "Soft, nurturing colors",
          "Gentle, rhythmic movements",
        ],
      },
      {
        name: "Leo",
        element: "Fire",
        glyph: "♌",
        visual_mappings: {
          shape: "flare",
          motion: "surge",
          texture: "spark",
          palette: "fire",
          rhythm: "pulse",
        },
        cross_cultural_archetypes: [
          { culture: "Western", archetype: "The Sovereign" },
        ],
        expressions: [
          "Radiant expression",
          "Generous heart",
          "Creative play",
          "Bold authenticity",
        ],
        shadows: ["Arrogance", "Drama", "Need for validation"],
        reflective_questions: [
          "Where does your inner sun want to shine?",
          "What would you create if no one was watching?",
        ],
        visual_elements: [
          "Bold, dramatic visuals",
          "Gold and warm tones",
          "Playful, celebratory animations",
        ],
      },
      {
        name: "Virgo",
        element: "Earth",
        glyph: "♍",
        visual_mappings: {
          shape: "grid",
          motion: "march",
          texture: "stone",
          palette: "earth",
          rhythm: "march",
        },
        cross_cultural_archetypes: [
          {
            culture: "Western",
            archetype: "The Craftsman/The Healer",
          },
        ],
        expressions: [
          "Intentional refinement",
          "Analytical process",
          "Devoted service",
          "Integrative healing",
        ],
        shadows: ["Perfectionism", "Criticism", "Anxiety"],
        reflective_questions: [
          "What small detail, if changed, would transform the whole?",
          "What needs to be broken down before it can be healed?",
        ],
        visual_elements: [
          "Intricate, detailed patterns",
          "Precise, geometric forms",
          "Earthy, muted colors",
        ],
      },
      {
        name: "Libra",
        element: "Air",
        glyph: "♎",
        visual_mappings: {
          shape: "mirror",
          motion: "breath",
          texture: "silk",
          palette: "air",
          rhythm: "breath",
        },
        cross_cultural_archetypes: [
          {
            culture: "Western",
            archetype: "The Judge/The Diplomat",
          },
        ],
        expressions: [
          "Dynamic equilibrium",
          "Holding contradiction",
          "Creating harmony",
          "Relational artistry",
        ],
        shadows: [
          "Indecisiveness",
          "People-pleasing",
          "Avoidance of conflict",
        ],
        reflective_questions: [
          "How can you find balance in asymmetry?",
          "What new beauty is created when 'opposite' textures are combined?",
        ],
        visual_elements: [
          "Symmetrical forms with intentional disruptions",
          "Harmonious, blended color palettes",
          "Graceful, balanced movements",
        ],
      },
      {
        name: "Scorpio",
        element: "Water",
        glyph: "♏",
        visual_mappings: {
          shape: "spiral",
          motion: "stillness",
          texture: "smoke",
          palette: "night",
          rhythm: "tide",
        },
        cross_cultural_archetypes: [
          {
            culture: "Western",
            archetype: "The Actor/The Sorcerer",
          },
        ],
        expressions: [
          "Profound transformation",
          "Depth psychology",
          "Radical honesty",
          "Reclaiming power",
        ],
        shadows: ["Cruelty", "Power-hunger", "Secretiveness"],
        reflective_questions: [
          "What is your relationship with the parts of yourself you keep hidden?",
          "What power is found in deep transformation?",
        ],
        visual_elements: [
          "Forms emerging from darkness",
          "Intense, contrasting colors",
          "Layers that conceal and reveal",
        ],
      },
      {
        name: "Sagittarius",
        element: "Fire",
        glyph: "♐",
        visual_mappings: {
          shape: "flare",
          motion: "surge",
          texture: "spark",
          palette: "fire",
          rhythm: "pulse",
        },
        cross_cultural_archetypes: [
          { culture: "Western", archetype: "The Explorer" },
        ],
        expressions: [
          "Expanding horizons",
          "Quest for meaning",
          "Optimistic vision",
          "Philosophical inquiry",
        ],
        shadows: ["Recklessness", "Dogmatism", "Restlessness"],
        reflective_questions: [
          "What horizon calls to you?",
          "How do you find meaning in the journey?",
        ],
        visual_elements: [
          "Expansive, open visuals",
          "Dynamic movement",
          "Bright, optimistic colors",
        ],
      },
      {
        name: "Capricorn",
        element: "Earth",
        glyph: "♑",
        visual_mappings: {
          shape: "grid",
          motion: "march",
          texture: "stone",
          palette: "earth",
          rhythm: "march",
        },
        cross_cultural_archetypes: [
          { culture: "Western", archetype: "The Elder" },
        ],
        expressions: [
          "Strategic mastery",
          "Patient discipline",
          "Earned authority",
          "Structural integrity",
        ],
        shadows: ["Rigidity", "Coldness", "Workaholism"],
        reflective_questions: [
          "What are you building that will outlast you?",
          "How do you balance ambition with compassion?",
        ],
        visual_elements: [
          "Strong, architectural forms",
          "Dark, sophisticated colors",
          "Steady, purposeful animations",
        ],
      },
      {
        name: "Aquarius",
        element: "Air",
        glyph: "♒",
        visual_mappings: {
          shape: "glyph",
          motion: "oscillate",
          texture: "mirror_texture",
          palette: "air",
          rhythm: "strobe",
        },
        cross_cultural_archetypes: [
          {
            culture: "Western",
            archetype: "The Revolutionary",
          },
        ],
        expressions: [
          "Innovative thinking",
          "Collective consciousness",
          "Humanitarian vision",
          "Individual freedom",
        ],
        shadows: [
          "Detachment",
          "Rebellion for its own sake",
          "Aloofness",
        ],
        reflective_questions: [
          "What future are you calling into being?",
          "How do you honor both individuality and community?",
        ],
        visual_elements: [
          "Futuristic, tech-inspired visuals",
          "Electric blues and silvers",
          "Unexpected, inventive patterns",
        ],
      },
      {
        name: "Pisces",
        element: "Water",
        glyph: "♓",
        visual_mappings: {
          shape: "spiral",
          motion: "tide",
          texture: "liquid",
          palette: "water",
          rhythm: "tide",
        },
        cross_cultural_archetypes: [
          {
            culture: "Western",
            archetype: "The Mystic/The Dreamer",
          },
        ],
        expressions: [
          "Boundless compassion",
          "Artistic vision",
          "Spiritual surrender",
          "Collective feeling",
        ],
        shadows: ["Escapism", "Martyrdom", "Confusion"],
        reflective_questions: [
          "Where do you end and the rest of the world begin?",
          "What does your imagination offer as a space of refuge and resistance?",
        ],
        visual_elements: [
          "Fluid, dissolving forms",
          "Dream-like, watercolor textures",
          "Soft, blended visuals",
        ],
      },
    ],
    houses: [
      {
        house: 1,
        essence: "self, emergence",
        ruler: "Mars",
        keywords: [
          "identity",
          "self",
          "beginnings",
          "appearance",
        ],
        visual_elements: [
          "Rising sun motif",
          "Circular frame",
          "Soft light palette",
        ],
      },
      {
        house: 2,
        essence: "body, resources",
        ruler: "Venus",
        keywords: [
          "values",
          "resources",
          "security",
          "material",
        ],
        visual_elements: [
          "Stone pillar",
          "Earthy textures",
          "Warm colors",
        ],
      },
      {
        house: 3,
        essence: "mind, communication",
        ruler: "Mercury",
        keywords: [
          "communication",
          "learning",
          "siblings",
          "environment",
        ],
        visual_elements: [
          "Open book",
          "Flowing lines",
          "Network grid",
        ],
      },
      {
        house: 4,
        essence: "home, roots",
        ruler: "Moon",
        keywords: ["home", "family", "roots", "foundation"],
        visual_elements: [
          "Cozy hearth",
          "Ancestral home",
          "Warm hues",
        ],
      },
      {
        house: 5,
        essence: "expression, play",
        ruler: "Sun",
        keywords: ["creativity", "play", "love", "children"],
        visual_elements: [
          "Theater stage",
          "Joyful colors",
          "Playful shapes",
        ],
      },
      {
        house: 6,
        essence: "craft, service",
        ruler: "Mercury",
        keywords: ["work", "routine", "health", "service"],
        visual_elements: [
          "Tool icons",
          "Daily calendar",
          "Earthy green palette",
        ],
      },
      {
        house: 7,
        essence: "relationship, mirror",
        ruler: "Venus",
        keywords: [
          "partnerships",
          "balance",
          "negotiation",
          "cooperation",
        ],
        visual_elements: [
          "Balanced scales",
          "Joined hands",
          "Dual imagery",
        ],
      },
      {
        house: 8,
        essence: "transformation, intimacy",
        ruler: "Pluto",
        keywords: [
          "transformation",
          "intimacy",
          "shared resources",
          "rebirth",
        ],
        visual_elements: [
          "Spiral galaxy",
          "Shadowy clasp",
          "Deep crimson tone",
        ],
      },
      {
        house: 9,
        essence: "meaning, journey",
        ruler: "Jupiter",
        keywords: [
          "philosophy",
          "travel",
          "education",
          "expansion",
        ],
        visual_elements: [
          "Open road",
          "Globe",
          "Expansive sky",
        ],
      },
      {
        house: 10,
        essence: "legacy, structure",
        ruler: "Saturn",
        keywords: [
          "career",
          "status",
          "ambition",
          "public image",
        ],
        visual_elements: [
          "Mountain peak",
          "Architectural form",
          "Majestic horizon",
        ],
      },
      {
        house: 11,
        essence: "future, collective",
        ruler: "Uranus",
        keywords: [
          "community",
          "friends",
          "ideals",
          "aspiration",
        ],
        visual_elements: [
          "Network web",
          "Starlit sky",
          "Cool blue light",
        ],
      },
      {
        house: 12,
        essence: "unconscious, dissolution",
        ruler: "Neptune",
        keywords: [
          "subconscious",
          "solitude",
          "compassion",
          "mystery",
        ],
        visual_elements: [
          "Foggy landscape",
          "Dreamy clouds",
          "Pastel watercolor",
        ],
      },
    ],
  },
  aspects: [
    {
      type: "Conjunction",
      orb: 5.0,
      from: "Sun",
      to: "Mercury",
      visual: { color: "#888888", style: "solid" },
      essence: "fusion",
      fluid_dynamics: [
        "Blending of energies",
        "Concentrated focus",
        "Amplification",
        "New synthesis",
      ],
      reflective_questions: [
        "How might these combined energies express themselves in your life?",
        "What new possibilities emerge from this fusion?",
      ],
      visual_elements: [
        "Overlapping, translucent forms",
        "Blended color gradients",
        "Merging boundaries",
      ],
    },
    {
      type: "Sextile",
      orb: 3.0,
      from: "Venus",
      to: "Jupiter",
      visual: { color: "#00FF00", style: "dashed" },
      essence: "opportunity",
      fluid_dynamics: [
        "Flowing collaboration",
        "Gentle innovation",
        "Subtle potential",
      ],
      reflective_questions: [
        "What hidden opportunities can you nurture through this connection?",
        "What small effort could unlock something larger?",
      ],
      visual_elements: [
        "Star-like bursts",
        "Light bridging lines",
        "Subtle color shifts",
      ],
    },
    {
      type: "Square",
      orb: 8.0,
      from: "Saturn",
      to: "Pluto",
      visual: { color: "#FF0000", style: "solid" },
      essence: "friction",
      fluid_dynamics: [
        "Generative conflict",
        "Catalyst for action",
        "Revealing blockages",
      ],
      reflective_questions: [
        "Where do you feel this dynamic tension in your life?",
        "What new action could this friction inspire?",
      ],
      visual_elements: [
        "Dissonant colors",
        "Sharp angles",
        "Interrupted animations",
        "Glitched patterns",
      ],
    },
    {
      type: "Trine",
      orb: 15.0,
      from: "Sun",
      to: "Mars",
      visual: { color: "#0000FF", style: "solid" },
      essence: "harmony",
      fluid_dynamics: [
        "Natural synergy",
        "Inherent talents",
        "Ease of expression",
      ],
      reflective_questions: [
        "Where does this sense of ease and flow manifest in your life?",
        "How can you lean into this natural harmony?",
      ],
      visual_elements: [
        "Symmetrical patterns",
        "Smooth transitions",
        "Harmonious color palettes",
      ],
    },
    {
      type: "Opposition",
      orb: 12.0,
      from: "Sun",
      to: "Saturn",
      visual: { color: "#FFA500", style: "dashed" },
      essence: "polarity",
      fluid_dynamics: ["Push-pull of forces", "Mirror tension"],
      reflective_questions: [
        "How do you integrate these opposing needs in your life?",
      ],
      visual_elements: [
        "Contrasting color schemes",
        "Balanced yin-yang patterns",
      ],
    },
  ],
} as const;