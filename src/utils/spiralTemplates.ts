import { Template } from './SentenceEngine';

export const spiralTemplates: Template[] = [
  {
    "id": "spiral_overview_master_01",
    "context": "spiral_overview",
    "role": "primary",
    "weights": 4,
    "text": "Your spiral leans toward {{chart.dominant_element}}—a body moving through the world in {{chart.dominant_element_phrase}}. Most of your story gathers in {{chart.primary_cluster_house.name}}, where {{chart.signature_planet.archetype_figure_name}} moves through {{chart.signature_sign.name}} under a web of {{chart.aspect_mood}}.",
    "variables": [
      "chart.dominant_element",
      "chart.dominant_element_phrase",
      "chart.primary_cluster_house.name",
      "chart.signature_planet.archetype_figure_name",
      "chart.signature_sign.name",
      "chart.aspect_mood"
    ]
  },

  {
    "id": "spiral_overview_master_02",
    "context": "spiral_overview",
    "role": "primary",
    "weights": 3,
    "text": "This chart speaks in {{chart.dominant_element}} tones and {{chart.dominant_mode}} motion: {{chart.dominant_mode_phrase}}. Around {{chart.primary_cluster_house.name}}, {{chart.signature_planet.archetype_figure_name}} in {{chart.signature_sign.name}} keeps returning as a recurring scene.",
    "variables": [
      "chart.dominant_element",
      "chart.dominant_mode",
      "chart.dominant_mode_phrase",
      "chart.primary_cluster_house.name",
      "chart.signature_planet.archetype_figure_name",
      "chart.signature_sign.name"
    ]
  },

  {
    "id": "spiral_overview_master_03",
    "context": "spiral_overview",
    "role": "primary",
    "weights": 2,
    "text": "Seen as a spiral, your chart is a weaving of {{chart.dominant_element}} and {{chart.dominant_mode}}: planets crowding into {{chart.primary_cluster_house.name}}, led by {{chart.signature_planet.archetype_figure_name}} in {{chart.signature_sign.name}}. The aspect lines trace a pattern of {{chart.aspect_keywords.0}}.",
    "variables": [
      "chart.dominant_element",
      "chart.dominant_mode",
      "chart.primary_cluster_house.name",
      "chart.signature_planet.archetype_figure_name",
      "chart.signature_sign.name",
      "chart.aspect_keywords.0"
    ]
  }
];