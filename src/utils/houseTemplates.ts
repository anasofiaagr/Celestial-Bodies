import { Template } from './SentenceEngine';

export const houseTemplates: Template[] = [
  {
    "id": "house_focus_primary_01",
    "context": "house_focus",
    "role": "primary",
    "weights": 4,
    "text": "This layer, {{house.name}}, holds your life around {{house.essence}}, where experiences of {{house.keywords.0}} and {{house.keywords.1}} keep returning in new forms.",
    "variables": [
      "house.name",
      "house.essence",
      "house.keywords.0",
      "house.keywords.1"
    ]
  },
  {
    "id": "house_focus_primary_02",
    "context": "house_focus",
    "role": "primary",
    "weights": 3,
    "text": "When {{house.name}} lights up, attention turns toward {{house.essence}}—how you move through {{house.keywords.0}} and {{house.keywords.1}} in your own way.",
    "variables": [
      "house.name",
      "house.essence",
      "house.keywords.0",
      "house.keywords.1"
    ]
  },
  {
    "id": "house_focus_primary_03_visual",
    "context": "house_focus",
    "role": "primary",
    "weights": 2,
    "text": "Think of {{house.name}} as a field where life gathers: a scene like {{house.visual_elements.0}}, tinted by {{sign.name}} at the threshold.",
    "variables": ["house.name", "house.visual_elements.0", "sign.name"]
  },

  {
    "id": "house_focus_cue_01_mood",
    "context": "house_focus",
    "role": "cue",
    "weights": 3,
    "text": "The mood of this layer is {{house.essence}}.",
    "variables": ["house.essence"]
  },
  {
    "id": "house_focus_cue_02_keywords",
    "context": "house_focus",
    "role": "cue",
    "weights": 3,
    "text": "Here, life keeps circling themes of {{house.keywords.0}}, {{house.keywords.1}}, and {{house.keywords.2}}.",
    "variables": ["house.keywords.0", "house.keywords.1", "house.keywords.2"]
  },
  {
    "id": "house_focus_cue_03_sign_threshold",
    "context": "house_focus",
    "role": "cue",
    "weights": 2,
    "text": "{{sign.name}} sits at the doorway, flavoring this house with {{sign.fusion_label}}.",
    "variables": ["sign.name", "sign.fusion_label"]
  },
  {
    "id": "house_focus_cue_04_visual",
    "context": "house_focus",
    "role": "cue",
    "weights": 2,
    "text": "Visually, imagine {{house.visual_elements.0}} washed in {{sign.visual_mappings.palette}} tones, moving with {{sign.visual_mappings.rhythm}}.",
    "variables": [
      "house.visual_elements.0",
      "sign.visual_mappings.palette",
      "sign.visual_mappings.rhythm"
    ]
  },
  {
    "id": "house_focus_cue_05_question",
    "context": "house_focus",
    "role": "cue",
    "weights": 2,
    "text": "What is quietly shifting in your {{house.keywords.0}} when this house is activated?",
    "variables": ["house.keywords.0"]
  },
  
  // Additional house layer sentences
  {
    "id": "house_focus_primary_04",
    "context": "house_focus",
    "role": "primary",
    "weights": 4,
    "text": "{{house.name}} is where {{house.essence}} unfolds—a space colored by {{sign.name}}, holding themes of {{house.keywords.0}} and {{house.keywords.1}}.",
    "variables": ["house.name", "house.essence", "sign.name", "house.keywords.0", "house.keywords.1"]
  },
  {
    "id": "house_focus_primary_05",
    "context": "house_focus",
    "role": "primary",
    "weights": 3,
    "text": "In this layer, {{sign.name}} shapes how you approach {{house.essence}}—moving through {{house.keywords.0}}, {{house.keywords.1}}, and {{house.keywords.2}}.",
    "variables": ["sign.name", "house.essence", "house.keywords.0", "house.keywords.1", "house.keywords.2"]
  },
  {
    "id": "house_focus_primary_06",
    "context": "house_focus",
    "role": "primary",
    "weights": 3,
    "text": "{{house.name}} holds the space where {{house.essence}} becomes visible, filtering through {{sign.fusion_label}}.",
    "variables": ["house.name", "house.essence", "sign.fusion_label"]
  },
  {
    "id": "house_focus_primary_07",
    "context": "house_focus",
    "role": "primary",
    "weights": 2,
    "text": "Picture {{house.visual_elements.0}} moving with the rhythm of {{sign.name}}—this is {{house.name}}, a field of {{house.essence}}.",
    "variables": ["house.visual_elements.0", "sign.name", "house.name", "house.essence"]
  },
  {
    "id": "house_focus_primary_08",
    "context": "house_focus",
    "role": "primary",
    "weights": 3,
    "text": "This house returns you to questions of {{house.keywords.0}} and {{house.keywords.1}}, painted in {{sign.visual_mappings.palette}} tones.",
    "variables": ["house.keywords.0", "house.keywords.1", "sign.visual_mappings.palette"]
  }
];