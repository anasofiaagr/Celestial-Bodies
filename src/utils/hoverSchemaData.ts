// hoverSchemaData.ts
// Placeholder schema for variable resolution and hover tooltips

export const PLACEHOLDER_SCHEMA = {
  "planet.name": {
    path: "planets[].name",
    hover: {
      title: "Planet",
      summary_from: ["planets[].archetype_name", "planets[].essence"],
      fallback: "A messenger of a particular energy in your chart."
    }
  },

  "house.keywords.0": {
    path: "houses[].keywords[0]",
    hover: {
      title: "House Theme",
      summary_from: ["houses[].keywords"],
      fallback: "One of the core life themes that shows up in this house."
    }
  },
  "house.keywords.1": {
    path: "houses[].keywords[1]",
    hover: {
      title: "House Theme",
      summary_from: ["houses[].keywords"],
      fallback: "Another facet of what this house is about in everyday life."
    }
  },
  "house.keywords.2": {
    path: "houses[].keywords[2]",
    hover: {
      title: "House Theme",
      summary_from: ["houses[].keywords"],
      fallback: "An additional storyline that tends to gather in this house."
    }
  },

  "house.visual_elements.0": {
    path: "houses[].visual_elements[0]",
    hover: {
      title: "House Visual",
      summary_from: ["houses[].visual_elements"],
      fallback: "A scenic image that hints at how this house might feel."
    }
  },

  "aspect.from.planet.name": {
    path: "aspects[].from.planet_name",
    hover: {
      title: "Planet (From)",
      summary_from: ["planets[].archetype_name", "planets[].essence"],
      fallback: "One of the planets participating in this relationship."
    }
  },
  "aspect.to.planet.name": {
    path: "aspects[].to.planet_name",
    hover: {
      title: "Planet (To)",
      summary_from: ["planets[].archetype_name", "planets[].essence"],
      fallback: "The other planet involved in this aspect."
    }
  },

  "aspects_library[aspect.type].relationship_type": {
    path: "aspects_library[aspect.type].relationship_type",
    hover: {
      title: "Aspect Relationship",
      summary_from: ["aspects_library[aspect.type].fluid_dynamics"],
      fallback: "The kind of conversation this angle creates between planets."
    }
  },
  "aspects_library[aspect.type].keywords.0": {
    path: "aspects_library[aspect.type].keywords[0]",
    hover: {
      title: "Aspect Mood",
      summary_from: ["aspects_library[aspect.type].keywords"],
      fallback: "A key word for how this aspect tends to feel."
    }
  },
  "aspects_library[aspect.type].keywords.1": {
    path: "aspects_library[aspect.type].keywords[1]",
    hover: {
      title: "Aspect Mood",
      summary_from: ["aspects_library[aspect.type].keywords"],
      fallback: "Another word that hints at the emotional tone of this aspect."
    }
  },

  "planet.archetype_figure_name": {
    path: "planets[].archetype_figure_name",
    hover: {
      title: "Archetype",
      summary_from: ["planets[].archetype_name", "planets[].why"],
      fallback: "The mythic figure this planet embodies."
    }
  },

  "planet.essence": {
    path: "planets[].essence",
    hover: {
      title: "Essence",
      summary_from: ["planets[].why"],
      fallback: "The core function this planet performs."
    }
  },

  "planet.archetype_name": {
    path: "planets[].archetype_name",
    hover: {
      title: "Archetype Name",
      summary_from: ["planets[].essence"],
      fallback: "The archetypal role of this planet."
    }
  },

  "planet.visual_elements.0": {
    path: "planets[].visual_elements[0]",
    hover: {
      title: "Visual Element",
      summary_from: ["planets[].visual_elements"],
      fallback: "A visual metaphor for this planet."
    }
  },

  "planet.keywords.0": {
    path: "planets[].keywords[0]",
    hover: {
      title: "Planet Keyword",
      summary_from: ["planets[].keywords"],
      fallback: "A key theme for this planet's energy."
    }
  },

  "planet.keywords.1": {
    path: "planets[].keywords[1]",
    hover: {
      title: "Planet Keyword",
      summary_from: ["planets[].keywords"],
      fallback: "Another facet of this planet's expression."
    }
  },

  "planet.keywords.2": {
    path: "planets[].keywords[2]",
    hover: {
      title: "Planet Keyword",
      summary_from: ["planets[].keywords"],
      fallback: "Additional theme in this planet's repertoire."
    }
  },

  "sign.name": {
    path: "signs[].name",
    hover: {
      title: "Sign",
      summary_from: ["signs[].fusion_label", "signs[].archetype_name"],
      fallback: "Atmosphere or lens the planet moves through."
    }
  },

  "sign.archetype_name": {
    path: "signs[].archetype_name",
    hover: {
      title: "Sign Archetype",
      summary_from: ["signs[].fusion_label"],
      fallback: "The archetypal essence of this sign."
    }
  },

  "sign.fusion_label": {
    path: "signs[].fusion_label",
    hover: {
      title: "Fusion Label",
      summary_from: ["signs[].essence"],
      fallback: "A poetic name for this sign's unique essence."
    }
  },

  "sign.essence": {
    path: "signs[].essence",
    hover: {
      title: "Sign Essence",
      summary_from: ["signs[].keywords"],
      fallback: "The core quality and energy of this sign."
    }
  },

  "sign.element": {
    path: "signs[].element",
    hover: {
      title: "Element",
      summary_from: ["signs[].element"],
      fallback: "The elemental quality of this sign."
    }
  },

  "sign.visual_mappings.motion": {
    path: "signs[].visual_mappings.motion",
    hover: {
      title: "Motion",
      summary_from: ["visual_mapping_library.motions[*].notes"],
      fallback: "Movement quality associated with this sign."
    }
  },

  "sign.visual_mappings.texture": {
    path: "signs[].visual_mappings.texture",
    hover: {
      title: "Texture",
      summary_from: ["visual_mapping_library.textures[*].notes"],
      fallback: "Surface feeling or tactile quality of the sign."
    }
  },

  "sign.visual_mappings.palette": {
    path: "signs[].visual_mappings.palette",
    hover: {
      title: "Palette",
      summary_from: ["visual_mapping_library.palettes[*].notes"],
      fallback: "Color palette of this sign."
    }
  },

  "sign.visual_mappings.rhythm": {
    path: "signs[].visual_mappings.rhythm",
    hover: {
      title: "Rhythm",
      summary_from: ["visual_mapping_library.rhythms[*].notes"],
      fallback: "Rhythmic quality of this sign."
    }
  },

  "house.name": {
    path: "houses[].name",
    hover: {
      title: "House Field",
      summary_from: ["houses[].essence", "houses[].keywords"],
      fallback: "Area of life where this story unfolds."
    }
  },

  "house.essence": {
    path: "houses[].essence",
    hover: {
      title: "House Essence",
      summary_from: ["houses[].keywords"],
      fallback: "The core experience of this life area."
    }
  },

  "chart.dominant_element": {
    path: "chart_summary.dominant_element",
    hover: {
      title: "Dominant Element",
      summary_from: ["chart_summary.dominant_element_phrase"],
      fallback: "The element that appears most often across your main placements."
    }
  },
  "chart.dominant_element_phrase": {
    path: "chart_summary.dominant_element_phrase",
    hover: {
      title: "Element Tone",
      summary_from: ["chart_summary.dominant_element_phrase"],
      fallback: "A short way of describing how this element tends to move through you."
    }
  },
  "chart.dominant_mode": {
    path: "chart_summary.dominant_mode",
    hover: {
      title: "Dominant Mode",
      summary_from: ["chart_summary.dominant_mode_phrase"],
      fallback: "Whether your chart leans more toward beginning (Cardinal), sustaining (Fixed), or adapting (Mutable)."
    }
  },
  "chart.dominant_mode_phrase": {
    path: "chart_summary.dominant_mode_phrase",
    hover: {
      title: "Mode Tone",
      summary_from: ["chart_summary.dominant_mode_phrase"],
      fallback: "How your chart tends to initiate, hold, or shift energy."
    }
  },

  "chart.primary_cluster_house.name": {
    path: "chart_summary.primary_cluster_house.name",
    hover: {
      title: "House Cluster",
      summary_from: ["chart_summary.primary_cluster_house.essence", "chart_summary.primary_cluster_house.keywords"],
      fallback: "The house where many of your planets gather, making this life area especially charged."
    }
  },

  "chart.signature_planet.name": {
    path: "chart_summary.signature_planet.name",
    hover: {
      title: "Signature Planet",
      summary_from: ["chart_summary.signature_planet.archetype_name", "chart_summary.signature_planet.essence"],
      fallback: "A planet that acts as a main character in this chart."
    }
  },
  "chart.signature_planet.archetype_figure_name": {
    path: "chart_summary.signature_planet.archetype_figure_name",
    hover: {
      title: "Planet Figure",
      summary_from: ["chart_summary.signature_planet.archetype_name"],
      fallback: "The mythic figure this planet plays in your story."
    }
  },

  "chart.signature_sign.name": {
    path: "chart_summary.signature_sign.name",
    hover: {
      title: "Signature Sign",
      summary_from: ["chart_summary.signature_sign.archetype_name", "chart_summary.signature_sign.expressions"],
      fallback: "The sign whose style colors your signature planet."
    }
  },

  "chart.aspect_mood": {
    path: "chart_summary.aspect_mood",
    hover: {
      title: "Aspect Mood",
      summary_from: ["chart_summary.aspect_keywords"],
      fallback: "A felt tone of how your planets tend to relate: harmonious, tense, experimental, or mixed."
    }
  },
  "chart.aspect_keywords.0": {
    path: "chart_summary.aspect_keywords[0]",
    hover: {
      title: "Aspect Keyword",
      summary_from: ["chart_summary.aspect_keywords"],
      fallback: "One word for the overall feel of your aspect web."
    }
  },

  "aspect.type": {
    path: "aspects[].type",
    hover: {
      title: "Aspect Type",
      summary_from: ["aspects[].type"],
      fallback: "The geometric angle between these planets."
    }
  },

  "aspect.color": {
    path: "aspects[].color",
    hover: {
      title: "Aspect Color",
      summary_from: ["aspects[].color"],
      fallback: "Visual color representing this aspect."
    }
  }
} as const;