// Integrated astrological dataset with archetypal mappings
export default {
  planets: [
    {
      name: "Sun",
      archetype_name: "The Core Self",
      archetype_figure_name: "The Radiant One",
      essence: "Vital force, consciousness, creative power",
      visual_elements: ["golden glow", "radiant sphere", "crown"],
      shadow_aspects: ["ego inflation", "arrogance", "domination"],
      light_aspects: ["authenticity", "creativity", "leadership"],
      color: "#FFD700",
      keywords: ["identity", "vitality", "purpose", "authority"]
    },
    {
      name: "Moon",
      archetype_name: "The Inner World",
      archetype_figure_name: "The Nurturer",
      essence: "Emotions, instinct, subconscious patterns",
      visual_elements: ["silver crescent", "flowing water", "maternal embrace"],
      shadow_aspects: ["moodiness", "dependency", "emotional reactivity"],
      light_aspects: ["empathy", "intuition", "receptivity"],
      color: "#C0C0C0",
      keywords: ["feelings", "memory", "comfort", "instinct"]
    },
    {
      name: "Mercury",
      archetype_name: "The Messenger",
      archetype_figure_name: "The Communicator",
      essence: "Thought, communication, connection",
      visual_elements: ["winged sandals", "swirling words", "crossroads"],
      shadow_aspects: ["overthinking", "gossip", "scattered focus"],
      light_aspects: ["clarity", "wit", "adaptability"],
      color: "#FFA500",
      keywords: ["intellect", "speech", "learning", "curiosity"]
    },
    {
      name: "Venus",
      archetype_name: "The Aesthetic",
      archetype_figure_name: "The Lover",
      essence: "Beauty, love, harmony, values",
      visual_elements: ["rose petals", "mirror", "golden scales"],
      shadow_aspects: ["vanity", "superficiality", "possessiveness"],
      light_aspects: ["appreciation", "grace", "connection"],
      color: "#FF69B4",
      keywords: ["love", "beauty", "pleasure", "relationship"]
    },
    {
      name: "Mars",
      archetype_name: "The Drive",
      archetype_figure_name: "The Warrior",
      essence: "Action, desire, courage, assertion",
      visual_elements: ["sword", "flame", "red banner"],
      shadow_aspects: ["aggression", "impulsiveness", "anger"],
      light_aspects: ["courage", "passion", "initiative"],
      color: "#FF0000",
      keywords: ["action", "desire", "courage", "competition"]
    },
    {
      name: "Jupiter",
      archetype_name: "The Expander",
      archetype_figure_name: "The Sage",
      essence: "Growth, wisdom, expansion, opportunity",
      visual_elements: ["lightning bolt", "throne", "cornucopia"],
      shadow_aspects: ["excess", "overconfidence", "wastefulness"],
      light_aspects: ["generosity", "optimism", "wisdom"],
      color: "#4169E1",
      keywords: ["expansion", "luck", "wisdom", "abundance"]
    },
    {
      name: "Saturn",
      archetype_name: "The Teacher",
      archetype_figure_name: "The Elder",
      essence: "Structure, discipline, responsibility, time",
      visual_elements: ["hourglass", "stone", "mountain"],
      shadow_aspects: ["rigidity", "fear", "limitation"],
      light_aspects: ["mastery", "integrity", "wisdom"],
      color: "#4B0082",
      keywords: ["discipline", "structure", "time", "mastery"]
    },
    {
      name: "Uranus",
      archetype_name: "The Revolutionary",
      archetype_figure_name: "The Awakener",
      essence: "Innovation, freedom, sudden change",
      visual_elements: ["lightning", "broken chains", "spiral"],
      shadow_aspects: ["chaos", "rebellion", "detachment"],
      light_aspects: ["innovation", "liberation", "genius"],
      color: "#00FFFF",
      keywords: ["change", "innovation", "freedom", "awakening"]
    },
    {
      name: "Neptune",
      archetype_name: "The Mystic",
      archetype_figure_name: "The Dreamer",
      essence: "Transcendence, spirituality, imagination",
      visual_elements: ["mist", "ocean depths", "veil"],
      shadow_aspects: ["illusion", "escapism", "confusion"],
      light_aspects: ["compassion", "inspiration", "unity"],
      color: "#9370DB",
      keywords: ["spirituality", "imagination", "compassion", "dissolution"]
    },
    {
      name: "Pluto",
      archetype_name: "The Transformer",
      archetype_figure_name: "The Phoenix",
      essence: "Transformation, power, death and rebirth",
      visual_elements: ["phoenix", "underground", "volcanic fire"],
      shadow_aspects: ["obsession", "control", "destruction"],
      light_aspects: ["regeneration", "empowerment", "depth"],
      color: "#800020",
      keywords: ["transformation", "power", "intensity", "rebirth"]
    }
  ],
  signs: [
    {
      name: "Aries",
      archetype_name: "The Pioneer",
      fusion_label: "Seed of Flame",
      element: "Fire",
      modality: "Cardinal",
      polarity: "Yang",
      essence: "Initiating action, raw courage, new beginnings",
      visual_mappings: {
        shape: "sharp angles, upward thrusts",
        motion: "explosive, direct",
        texture: "rough, energetic",
        palette: "bright reds, oranges",
        rhythm: "staccato, urgent"
      },
      keywords: ["initiative", "courage", "independence", "impulse"],
      color: "#FF0000"
    },
    {
      name: "Taurus",
      archetype_name: "The Builder",
      fusion_label: "Body of Soil",
      element: "Earth",
      modality: "Fixed",
      polarity: "Yin",
      essence: "Grounded stability, sensual pleasure, material form",
      visual_mappings: {
        shape: "rounded, solid forms",
        motion: "slow, deliberate",
        texture: "smooth, tactile",
        palette: "earth tones, greens",
        rhythm: "steady, sustained"
      },
      keywords: ["stability", "sensuality", "persistence", "value"],
      color: "#228B22"
    },
    {
      name: "Gemini",
      archetype_name: "The Messenger",
      fusion_label: "Breath of Stories",
      element: "Air",
      modality: "Mutable",
      polarity: "Yang",
      essence: "Curiosity, communication, mental agility",
      visual_mappings: {
        shape: "dual forms, intersections",
        motion: "quick, darting",
        texture: "light, airy",
        palette: "yellows, light blues",
        rhythm: "varied, playful"
      },
      keywords: ["communication", "versatility", "curiosity", "duality"],
      color: "#FFFF00"
    },
    {
      name: "Cancer",
      archetype_name: "The Nurturer",
      fusion_label: "Shell of Waters",
      element: "Water",
      modality: "Cardinal",
      polarity: "Yin",
      essence: "Emotional depth, protection, care and nurturing",
      visual_mappings: {
        shape: "curved, protective shells",
        motion: "ebbing, flowing",
        texture: "soft, yielding",
        palette: "silvers, blues",
        rhythm: "tidal, cyclical"
      },
      keywords: ["nurturing", "emotion", "protection", "family"],
      color: "#87CEEB"
    },
    {
      name: "Leo",
      archetype_name: "The Performer",
      fusion_label: "Eye of the Sun",
      element: "Fire",
      modality: "Fixed",
      polarity: "Yang",
      essence: "Creative expression, radiant confidence, heart-centered power",
      visual_mappings: {
        shape: "radial, sun-like",
        motion: "expansive, dramatic",
        texture: "bright, warm",
        palette: "golds, oranges",
        rhythm: "bold, theatrical"
      },
      keywords: ["creativity", "confidence", "generosity", "drama"],
      color: "#FFD700"
    },
    {
      name: "Virgo",
      archetype_name: "The Craftsperson",
      fusion_label: "Hand of Healing",
      element: "Earth",
      modality: "Mutable",
      polarity: "Yin",
      essence: "Precision, service, analytical refinement",
      visual_mappings: {
        shape: "detailed, geometric",
        motion: "careful, meticulous",
        texture: "fine, organized",
        palette: "earth tones, muted greens",
        rhythm: "methodical, exact"
      },
      keywords: ["analysis", "service", "perfection", "health"],
      color: "#8B4513"
    },
    {
      name: "Libra",
      archetype_name: "The Diplomat",
      fusion_label: "Bridge of Winds",
      element: "Air",
      modality: "Cardinal",
      polarity: "Yang",
      essence: "Balance, relationship, aesthetic harmony",
      visual_mappings: {
        shape: "symmetrical, balanced",
        motion: "graceful, balanced",
        texture: "refined, elegant",
        palette: "pastels, pinks, blues",
        rhythm: "harmonious, measured"
      },
      keywords: ["balance", "harmony", "partnership", "justice"],
      color: "#FFC0CB"
    },
    {
      name: "Scorpio",
      archetype_name: "The Alchemist",
      fusion_label: "Root of Night",
      element: "Water",
      modality: "Fixed",
      polarity: "Yin",
      essence: "Depth, transformation, hidden power",
      visual_mappings: {
        shape: "penetrating, mysterious",
        motion: "intense, concentrated",
        texture: "dark, deep",
        palette: "deep reds, blacks, purples",
        rhythm: "pulsing, hypnotic"
      },
      keywords: ["transformation", "intensity", "power", "depth"],
      color: "#8B0000"
    },
    {
      name: "Sagittarius",
      archetype_name: "The Explorer",
      fusion_label: "Arrow of Dawn",
      element: "Fire",
      modality: "Mutable",
      polarity: "Yang",
      essence: "Expansion, philosophy, adventure and truth-seeking",
      visual_mappings: {
        shape: "arrows, upward arcs",
        motion: "forward, seeking",
        texture: "open, expansive",
        palette: "purples, deep blues",
        rhythm: "adventurous, free"
      },
      keywords: ["philosophy", "adventure", "optimism", "freedom"],
      color: "#4B0082"
    },
    {
      name: "Capricorn",
      archetype_name: "The Master",
      fusion_label: "Bone of Mountains",
      element: "Earth",
      modality: "Cardinal",
      polarity: "Yin",
      essence: "Ambition, structure, achievement and authority",
      visual_mappings: {
        shape: "angular, ascending",
        motion: "climbing, deliberate",
        texture: "hard, enduring",
        palette: "grays, blacks, dark greens",
        rhythm: "steady, disciplined"
      },
      keywords: ["ambition", "discipline", "responsibility", "achievement"],
      color: "#2F4F4F"
    },
    {
      name: "Aquarius",
      archetype_name: "The Visionary",
      fusion_label: "Wave of Vision",
      element: "Air",
      modality: "Fixed",
      polarity: "Yang",
      essence: "Innovation, community, future-oriented consciousness",
      visual_mappings: {
        shape: "zigzags, waves",
        motion: "erratic, electric",
        texture: "cool, crystalline",
        palette: "electric blues, silvers",
        rhythm: "syncopated, unique"
      },
      keywords: ["innovation", "community", "freedom", "progress"],
      color: "#00FFFF"
    },
    {
      name: "Pisces",
      archetype_name: "The Mystic",
      fusion_label: "Tide of Dreams",
      element: "Water",
      modality: "Mutable",
      polarity: "Yin",
      essence: "Transcendence, compassion, dissolution of boundaries",
      visual_mappings: {
        shape: "flowing, merging",
        motion: "drifting, dissolving",
        texture: "ethereal, fluid",
        palette: "sea greens, lavenders",
        rhythm: "dreamlike, fluid"
      },
      keywords: ["compassion", "imagination", "spirituality", "surrender"],
      color: "#9370DB"
    }
  ],
  houses: [
    {
      house: 1,
      name: "House of Self-Discovery & First Impressions",
      essence: "Identity, appearance, how you meet the world",
      ruler: "Mars",
      keywords: ["self", "appearance", "beginnings", "identity"],
      visual_elements: ["mirror", "dawn", "threshold"],
      color: "#FF6B6B",
      themes: ["first impressions", "physical body", "persona"]
    },
    {
      house: 2,
      name: "House of Values & Material Security",
      essence: "Resources, possessions, self-worth, values",
      ruler: "Venus",
      keywords: ["resources", "values", "security", "possessions"],
      visual_elements: ["treasure chest", "earth", "coins"],
      color: "#4ECDC4",
      themes: ["material security", "talents", "self-worth"]
    },
    {
      house: 3,
      name: "House of Communication & Immediate Environment",
      essence: "Communication, siblings, short journeys, learning",
      ruler: "Mercury",
      keywords: ["communication", "learning", "siblings", "neighbors"],
      visual_elements: ["roads", "books", "messenger"],
      color: "#FFE66D",
      themes: ["daily interactions", "early education", "local travel"]
    },
    {
      house: 4,
      name: "House of Home & Emotional Foundation",
      essence: "Home, family, roots, inner emotional security",
      ruler: "Moon",
      keywords: ["home", "family", "roots", "foundation"],
      visual_elements: ["house", "roots", "hearth"],
      color: "#95E1D3",
      themes: ["ancestry", "private life", "emotional security"]
    },
    {
      house: 5,
      name: "House of Expressive Joy & Inner Child",
      essence: "Creativity, romance, pleasure, children",
      ruler: "Sun",
      keywords: ["creativity", "joy", "romance", "children"],
      visual_elements: ["stage", "heart", "playground"],
      color: "#F38181",
      themes: ["creative expression", "love affairs", "recreation"]
    },
    {
      house: 6,
      name: "House of Service & Daily Rituals",
      essence: "Work, health, routines, service to others",
      ruler: "Mercury",
      keywords: ["health", "work", "service", "routines"],
      visual_elements: ["tools", "garden", "altar"],
      color: "#AA96DA",
      themes: ["daily habits", "wellness", "skill development"]
    },
    {
      house: 7,
      name: "House of Partnership & the Other",
      essence: "Relationships, marriage, partnerships, open enemies",
      ruler: "Venus",
      keywords: ["partnership", "marriage", "contracts", "others"],
      visual_elements: ["scales", "ring", "bridge"],
      color: "#FCBAD3",
      themes: ["one-on-one relationships", "collaborations", "projections"]
    },
    {
      house: 8,
      name: "House of Transformation & Shared Resources",
      essence: "Death, rebirth, shared resources, intimacy",
      ruler: "Pluto",
      keywords: ["transformation", "intimacy", "death", "regeneration"],
      visual_elements: ["phoenix", "depths", "key"],
      color: "#A8D8EA",
      themes: ["psychological depth", "inheritance", "occult"]
    },
    {
      house: 9,
      name: "House of Philosophy & Distant Horizons",
      essence: "Higher learning, travel, philosophy, belief systems",
      ruler: "Jupiter",
      keywords: ["philosophy", "travel", "wisdom", "expansion"],
      visual_elements: ["compass", "mountain", "temple"],
      color: "#FFAAA5",
      themes: ["higher education", "foreign cultures", "spirituality"]
    },
    {
      house: 10,
      name: "House of Calling & Public Legacy",
      essence: "Career, reputation, public image, life purpose",
      ruler: "Saturn",
      keywords: ["career", "reputation", "ambition", "authority"],
      visual_elements: ["crown", "summit", "monument"],
      color: "#FF8B94",
      themes: ["professional life", "social status", "achievements"]
    },
    {
      house: 11,
      name: "House of Community & Future Vision",
      essence: "Friends, groups, hopes, wishes, social causes",
      ruler: "Uranus",
      keywords: ["friendship", "community", "hopes", "innovation"],
      visual_elements: ["network", "stars", "circle"],
      color: "#C7CEEA",
      themes: ["collective goals", "social networks", "ideals"]
    },
    {
      house: 12,
      name: "House of Transcendence & Hidden Realms",
      essence: "Subconscious, spirituality, isolation, hidden enemies",
      ruler: "Neptune",
      keywords: ["subconscious", "spirituality", "solitude", "transcendence"],
      visual_elements: ["mist", "sanctuary", "veil"],
      color: "#B4A7D6",
      themes: ["inner work", "spiritual practices", "letting go"]
    }
  ],
  aspects_library: {
    conjunction: {
      name: "Conjunction",
      angle: 0,
      orb: 8,
      quality: "Fusion",
      keywords: ["union", "blending", "intensity", "focus"],
      color: "#FFFFFF",
      description: "Planets merge energies, creating powerful synthesis"
    },
    sextile: {
      name: "Sextile",
      angle: 60,
      orb: 6,
      quality: "Opportunity",
      keywords: ["harmony", "talent", "ease", "cooperation"],
      color: "#00FF00",
      description: "Harmonious flow, natural talents and opportunities"
    },
    square: {
      name: "Square",
      angle: 90,
      orb: 8,
      quality: "Tension",
      keywords: ["challenge", "friction", "growth", "action"],
      color: "#FF0000",
      description: "Dynamic tension that motivates change and action"
    },
    trine: {
      name: "Trine",
      angle: 120,
      orb: 8,
      quality: "Flow",
      keywords: ["ease", "gifts", "blessing", "creativity"],
      color: "#FFD700",
      description: "Effortless flow of energy, natural talents"
    },
    opposition: {
      name: "Opposition",
      angle: 180,
      orb: 8,
      quality: "Polarity",
      keywords: ["awareness", "balance", "projection", "integration"],
      color: "#FF00FF",
      description: "Awareness through contrast, seeking balance"
    }
  }
};