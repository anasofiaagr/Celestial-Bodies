// Sentence templates for poetic astrological descriptions
export default {
  templates: [
    {
      id: "spiral_overview_01",
      context: "spiral_overview",
      template: "The cosmos weaves {{planet_essence}} through the tapestry of {{house_realm}}, dancing in the rhythm of {{sign_motion}}.",
      weight: 1,
      placeholder_schema: {
        planet_essence: {
          path: "planet.essence",
          description: "The core essence of the planet",
          hover_summary: "The fundamental nature and vital force of this celestial body"
        },
        house_realm: {
          path: "house.name",
          description: "The realm or domain of life experience",
          hover_summary: "The life arena where this energy manifests"
        },
        sign_motion: {
          path: "sign.visual_mappings.motion",
          description: "The movement quality of the sign",
          hover_summary: "The characteristic movement and expression style"
        }
      },
      metadata: {
        mood: "cosmic",
        tone: "poetic",
        imagery: "celestial"
      }
    },
    {
      id: "house_focus_01",
      context: "house_focus",
      template: "In the realm of {{house_name}}, {{archetype_figure}} brings {{essence}} through the lens of {{sign_archetype}}.",
      weight: 1,
      placeholder_schema: {
        house_name: {
          path: "house.name",
          description: "The archetypal house name",
          hover_summary: "This life domain shapes your experience",
          ui_hints: {
            style: "underline",
            color: "#FFD700"
          }
        },
        archetype_figure: {
          path: "planet.archetype_figure_name",
          description: "The archetypal figure of the planet",
          hover_summary: "The personified essence of this planetary energy"
        },
        essence: {
          path: "planet.essence",
          description: "The planet's core essence",
          hover_summary: "The fundamental quality being expressed"
        },
        sign_archetype: {
          path: "sign.archetype_name",
          description: "The sign's archetypal identity",
          hover_summary: "The mode and style of expression"
        }
      }
    },
    {
      id: "planet_focus_01",
      context: "planet_focus",
      template: "{{archetype_figure}} dwells in {{house_essence}}, expressing through {{sign_texture}} and {{sign_rhythm}}.",
      weight: 1,
      placeholder_schema: {
        archetype_figure: {
          path: "planet.archetype_figure_name",
          description: "The personified planet archetype",
          hover_summary: "The living embodiment of this cosmic force"
        },
        house_essence: {
          path: "house.essence",
          description: "The essence of the house",
          hover_summary: "The fundamental meaning of this life arena"
        },
        sign_texture: {
          path: "sign.visual_mappings.texture",
          description: "The textural quality of the sign",
          hover_summary: "The sensory quality of expression"
        },
        sign_rhythm: {
          path: "sign.visual_mappings.rhythm",
          description: "The rhythmic pattern",
          hover_summary: "The tempo and timing of manifestation"
        }
      }
    },
    {
      id: "aspect_web_01",
      context: "aspect_web",
      template: "Between {{from_archetype}} and {{to_archetype}}, a {{aspect_quality}} emerges: {{aspect_keywords}}.",
      weight: 1,
      placeholder_schema: {
        from_archetype: {
          path: "from.planet.archetype_figure_name",
          description: "The first planet in aspect",
          hover_summary: "One pole of this energetic relationship"
        },
        to_archetype: {
          path: "to.planet.archetype_figure_name",
          description: "The second planet in aspect",
          hover_summary: "The other pole of this cosmic dialogue"
        },
        aspect_quality: {
          path: "library.quality",
          description: "The nature of the aspect",
          hover_summary: "The type of energetic relationship"
        },
        aspect_keywords: {
          path: "library.keywords",
          description: "Keywords for this aspect",
          hover_summary: "Key themes of this connection"
        }
      }
    },
    {
      id: "constellation_view_01",
      context: "constellation_view",
      template: "The web of fate connects {{from_planet}} and {{to_planet}} in a dance of {{aspect_type}}.",
      weight: 1,
      placeholder_schema: {
        from_planet: {
          path: "from.planet.name",
          description: "First planet name",
          hover_summary: "The initiating energy"
        },
        to_planet: {
          path: "to.planet.name",
          description: "Second planet name",
          hover_summary: "The receiving energy"
        },
        aspect_type: {
          path: "api.type",
          description: "The aspect type",
          hover_summary: "The geometric relationship"
        }
      }
    }
  ],
  contexts: {
    spiral_overview: ["spiral_overview_01"],
    house_focus: ["house_focus_01"],
    planet_focus: ["planet_focus_01"],
    aspect_web: ["aspect_web_01"],
    constellation_view: ["constellation_view_01"]
  }
};
