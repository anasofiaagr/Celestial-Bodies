// Fluid Astrology — sentence styles + hoverable variables
export default {
  version: "1.0",
  description: "Fluid Astrology — sentence styles + hoverable variables",
  placeholder_schema: {
    "planet.name": {
      path: "planets[].name",
      hover: {
        title: "Planet",
        summary_from: ["planets[].archetype_name", "planets[].essence"],
        fallback: "Mover of a specific energy through your chart."
      }
    },
    "planet.archetype_name": {
      path: "planets[].archetype_name",
      hover: {
        title: "Planet Archetype",
        summary_from: ["planets[].why", "planets[].fluid_qualities"],
        fallback: "Core function this planet performs."
      }
    },
    "planet.archetype_figure_name": {
      path: "planets[].archetype_figure_name",
      hover: {
        title: "Figure",
        summary_from: ["planets[].archetype_name"],
        fallback: "Mythic role used as a lens."
      }
    },
    "planet.essence": {
      path: "planets[].essence",
      hover: {
        title: "Essence",
        summary_from: ["planets[].why"],
        fallback: "Condensed function of the planet."
      }
    },
    "planet.visual_elements.0": {
      path: "planets[].visual_elements[0]",
      hover: {
        title: "Planet Visual",
        summary_from: ["planets[].visual_elements"],
        fallback: "Sensory cue for rendering."
      }
    },
    "sign.name": {
      path: "signs[].name",
      hover: {
        title: "Sign",
        summary_from: ["signs[].archetype_name", "signs[].expressions"],
        fallback: "The atmospheric quality the planet passes through."
      }
    },
    "sign.archetype_name": {
      path: "signs[].archetype_name",
      hover: {
        title: "Sign Archetype",
        summary_from: ["signs[].expressions", "signs[].shadows"],
        fallback: "Energetic posture of the sign."
      }
    },
    "sign.element": {
      path: "signs[].element",
      hover: {
        title: "Element",
        summary_from: ["elements[sign.element].fluid_qualities"],
        fallback: "Elemental tone of the sign."
      }
    },
    "sign.visual_mappings.shape": {
      path: "signs[].visual_mappings.shape",
      hover: {
        title: "Shape",
        summary_from: ["visual_mapping_library.shapes[*].notes"],
        fallback: "Geometric gesture for this sign."
      }
    },
    "sign.visual_mappings.motion": {
      path: "signs[].visual_mappings.motion",
      hover: {
        title: "Motion",
        summary_from: ["visual_mapping_library.motions[*].notes"],
        fallback: "Kinetic quality used in animation."
      }
    },
    "sign.visual_mappings.texture": {
      path: "signs[].visual_mappings.texture",
      hover: {
        title: "Texture",
        summary_from: ["visual_mapping_library.textures[*].notes"],
        fallback: "Surface feel of the sign."
      }
    },
    "sign.visual_mappings.palette": {
      path: "signs[].visual_mappings.palette",
      hover: {
        title: "Palette",
        summary_from: ["visual_mapping_library.palettes[*].notes"],
        fallback: "Color family associated to the sign."
      }
    },
    "sign.visual_mappings.rhythm": {
      path: "signs[].visual_mappings.rhythm",
      hover: {
        title: "Rhythm",
        summary_from: ["visual_mapping_library.rhythms[*].notes"],
        fallback: "Temporal patterning for transitions."
      }
    },
    "house.name": {
      path: "houses[].name",
      hover: {
        title: "House Field",
        summary_from: ["houses[].essence", "houses[].keywords"],
        fallback: "Life area where things unfold."
      }
    },
    "house.essence": {
      path: "houses[].essence",
      hover: {
        title: "House Essence",
        summary_from: ["houses[].keywords"],
        fallback: "The quality of attention in this area."
      }
    },
    "house.visual_elements.0": {
      path: "houses[].visual_elements[0]",
      hover: {
        title: "House Visual",
        summary_from: ["houses[].visual_elements"],
        fallback: "Scenic cue for the house environment."
      }
    },
    "aspect.type": {
      path: "aspects[].type",
      hover: {
        title: "Aspect",
        summary_from: ["aspects_library[aspect.type].relationship_type", "aspects_library[aspect.type].fluid_dynamics"],
        fallback: "Relational angle between planets."
      }
    },
    "aspect.color": {
      path: "aspects_library[aspect.type].color",
      hover: {
        title: "Aspect Color",
        summary_from: ["aspects_library[aspect.type].visual_elements"],
        fallback: "UI cue for aspect lines."
      }
    }
  },
  templates: [
    {
      id: "onboarding_invite_01",
      context: "onboarding",
      placement: "center_overlay",
      weights: 1,
      text: "Your chart won't tell you who you are. It will trace patterns of attention in time, so you can decide what to do with them.",
      variables: []
    },
    {
      id: "onboarding_invite_02",
      context: "onboarding",
      placement: "center_overlay",
      weights: 1,
      text: "We'll map how planets move through fields of life. No verdicts—just language for what you already feel.",
      variables: []
    },
    {
      id: "spiral_main_01",
      context: "spiral_overview",
      placement: "spiral_main_card",
      weights: 3,
      text: "Across this spiral, {{planet.archetype_figure_name}} carries {{planet.essence}} through {{house.name}}, coloured by the tone of {{sign.archetype_name}}.",
      variables: [
        "planet.archetype_figure_name",
        "planet.essence",
        "house.name",
        "sign.archetype_name"
      ]
    },
    {
      id: "spiral_main_02",
      context: "spiral_overview",
      placement: "spiral_main_card",
      weights: 2,
      text: "{{planet.name}} moves as {{planet.archetype_figure_name}} in {{house.name}}—an area shaped by {{house.essence}} and tinted with {{sign.name}}'s way of being.",
      variables: [
        "planet.name",
        "planet.archetype_figure_name",
        "house.name",
        "house.essence",
        "sign.name"
      ]
    },
    {
      id: "spiral_main_03_soft",
      context: "spiral_overview",
      placement: "spiral_main_card",
      weights: 2,
      text: "Here, {{planet.archetype_name}} meets {{sign.archetype_name}} inside {{house.name}}. Think of it less as a rule and more as a mood your life keeps returning to.",
      variables: [
        "planet.archetype_name",
        "sign.archetype_name",
        "house.name"
      ]
    },
    {
      id: "house_ring_01",
      context: "house_ring_caption",
      placement: "house_layer_label",
      weights: 3,
      text: "Where {{house.essence}} quietly shapes your days.",
      variables: ["house.essence"]
    },
    {
      id: "house_ring_02",
      context: "house_ring_caption",
      placement: "house_layer_label",
      weights: 2,
      text: "{{house.name}} — the field where this part of your story keeps unfolding.",
      variables: ["house.name"]
    },
    {
      id: "house_ring_03",
      context: "house_ring_caption",
      placement: "house_layer_label",
      weights: 2,
      text: "A ring of {{house.essence}}, returning in different seasons of your life.",
      variables: ["house.essence"]
    },
    {
      id: "house_focus_01",
      context: "house_focus",
      placement: "side_panel",
      weights: 3,
      text: "In {{house.name}}, attention turns to {{house.essence}}. Here {{planet.archetype_figure_name}} brings its {{planet.essence}}, filtered through {{sign.archetype_name}}'s way of moving.",
      variables: [
        "house.name",
        "house.essence",
        "planet.archetype_figure_name",
        "planet.essence",
        "sign.archetype_name"
      ]
    },
    {
      id: "house_focus_02_grounded",
      context: "house_focus",
      placement: "side_panel",
      weights: 2,
      text: "{{house.name}} is the part of life where {{house.essence}} becomes real. {{planet.name}} here suggests this field is stirred by {{planet.essence}} and coloured by {{sign.name}}.",
      variables: [
        "house.name",
        "house.essence",
        "planet.name",
        "planet.essence",
        "sign.name"
      ]
    },
    {
      id: "house_focus_03_reflective",
      context: "house_focus",
      placement: "side_panel",
      weights: 2,
      text: "Notice how {{house.essence}} shows up around you. When {{planet.archetype_figure_name}} visits {{house.name}} through {{sign.name}}, this part of life asks for your conscious participation.",
      variables: [
        "house.essence",
        "planet.archetype_figure_name",
        "house.name",
        "sign.name"
      ]
    },
    {
      id: "planet_focus_01",
      context: "planet_focus",
      placement: "planet_panel",
      weights: 3,
      text: "{{planet.archetype_figure_name}} carries the work of {{planet.essence}}. In {{sign.name}}, it takes on {{sign.archetype_name}}'s tone, then pours itself into {{house.name}}.",
      variables: [
        "planet.archetype_figure_name",
        "planet.essence",
        "sign.name",
        "sign.archetype_name",
        "house.name"
      ]
    },
    {
      id: "planet_focus_02_sensory",
      context: "planet_focus",
      placement: "planet_panel",
      weights: 2,
      text: "Imagine {{planet.name}} as {{planet.visual_elements.0}}. Moving through {{sign.name}}, it adopts a {{sign.visual_mappings.texture}} feel and a {{sign.visual_mappings.motion}} rhythm while working inside {{house.name}}.",
      variables: [
        "planet.name",
        "planet.visual_elements.0",
        "sign.name",
        "sign.visual_mappings.texture",
        "sign.visual_mappings.motion",
        "house.name"
      ]
    },
    {
      id: "planet_focus_03_reflective",
      context: "planet_focus",
      placement: "planet_panel",
      weights: 2,
      text: "When you meet {{planet.archetype_name}} in {{house.name}}, you meet a part of yourself learning {{house.essence}} in {{sign.name}}'s language.",
      variables: [
        "planet.archetype_name",
        "house.name",
        "house.essence",
        "sign.name"
      ]
    },
    {
      id: "visual_fusion_01",
      context: "visual_overlay",
      placement: "spiral_corner_caption",
      weights: 2,
      text: "{{planet.visual_elements.0}} drifts across {{house.visual_elements.0}} while {{sign.visual_mappings.palette}} holds the colours and {{sign.visual_mappings.rhythm}} sets the tempo.",
      variables: [
        "planet.visual_elements.0",
        "house.visual_elements.0",
        "sign.visual_mappings.palette",
        "sign.visual_mappings.rhythm"
      ]
    },
    {
      id: "aspect_constellation_01",
      context: "constellation_view",
      placement: "constellation_overlay",
      weights: 3,
      text: "Each line lit in {{aspect.color}} marks an aspect—a specific angle of conversation between planets. This chart favours learning through {{aspect.type}} energy.",
      variables: [
        "aspect.color",
        "aspect.type"
      ]
    },
    {
      id: "aspect_constellation_02",
      context: "constellation_view",
      placement: "constellation_overlay",
      weights: 2,
      text: "Aspects in {{aspect.color}} sketch out your private constellation: points of ease, friction, and breakthrough traced by {{aspect.type}} patterns.",
      variables: [
        "aspect.color",
        "aspect.type"
      ]
    },
    {
      id: "reflective_prompt_01",
      context: "any",
      placement: "sidebar_prompt",
      weights: 2,
      text: "How does {{planet.name}} feel when it moves through the landscape of {{house.name}} with {{sign.name}} as its accent?",
      variables: [
        "planet.name",
        "house.name",
        "sign.name"
      ]
    },
    {
      id: "reflective_prompt_02",
      context: "any",
      placement: "sidebar_prompt",
      weights: 2,
      text: "If {{planet.archetype_name}} could speak from {{house.name}}, what story about {{house.essence}} would it tell in {{sign.archetype_name}}'s voice?",
      variables: [
        "planet.archetype_name",
        "house.name",
        "house.essence",
        "sign.archetype_name"
      ]
    },
    {
      id: "synthesis_poem_01",
      context: "constellation_share",
      placement: "share_poem",
      weights: 1,
      text: "Rings of {{house.essence}}, voices of {{planet.archetype_name}}, tones of {{sign.archetype_name}}—together they sketch the moving outline of a self that never stops changing.",
      variables: [
        "house.essence",
        "planet.archetype_name",
        "sign.archetype_name"
      ]
    },
    // Additional Planet Focus templates
    {
      id: "planet_focus_04_question",
      context: "planet_focus",
      placement: "planet_panel",
      weights: 2,
      text: "What happens when {{planet.essence}} meets {{sign.element}}'s way of being inside {{house.name}}?",
      variables: [
        "planet.essence",
        "sign.element",
        "house.name"
      ]
    },
    {
      id: "planet_focus_05_poetic",
      context: "planet_focus",
      placement: "planet_panel",
      weights: 1,
      text: "{{planet.visual_elements.0}} dances through {{house.name}}, wearing {{sign.visual_mappings.texture}} textures and speaking {{planet.archetype_name}}'s language.",
      variables: [
        "planet.visual_elements.0",
        "house.name",
        "sign.visual_mappings.texture",
        "planet.archetype_name"
      ]
    },
    // Chart synthesis templates
    {
      id: "spiral_synthesis_01",
      context: "spiral_overview",
      placement: "spiral_main_card",
      weights: 2,
      text: "This chart weaves {{planet.archetype_figure_name}} through {{house.name}}, where {{sign.visual_mappings.rhythm}} rhythm pulses and {{sign.element}} breathes.",
      variables: [
        "planet.archetype_figure_name",
        "house.name",
        "sign.visual_mappings.rhythm",
        "sign.element"
      ]
    },
    // Aspect-focused templates
    {
      id: "aspect_constellation_03_deep",
      context: "constellation_view",
      placement: "constellation_overlay",
      weights: 2,
      text: "When {{aspect.type}} connects planets, it creates {{aspect.color}} pathways—invitations to see how different parts of you are already in conversation.",
      variables: [
        "aspect.type",
        "aspect.color"
      ]
    },
    // House ring captions - more variety
    {
      id: "house_ring_04_visual",
      context: "house_ring_caption",
      placement: "house_layer_label",
      weights: 2,
      text: "Visualize {{house.visual_elements.0}} as the setting—this is where {{house.essence}} happens.",
      variables: [
        "house.visual_elements.0",
        "house.essence"
      ]
    },
    {
      id: "house_ring_05_intimate",
      context: "house_ring_caption",
      placement: "house_layer_label",
      weights: 1,
      text: "{{house.name}}—notice how this theme keeps returning, asking for your attention.",
      variables: [
        "house.name"
      ]
    },
    // More house focus templates
    {
      id: "house_focus_04_layered",
      context: "house_focus",
      placement: "side_panel",
      weights: 2,
      text: "Layer by layer, {{house.name}} reveals itself. With {{planet.archetype_figure_name}} present and {{sign.archetype_name}} as atmosphere, {{house.essence}} becomes your daily practice.",
      variables: [
        "house.name",
        "planet.archetype_figure_name",
        "sign.archetype_name",
        "house.essence"
      ]
    },
    {
      id: "house_focus_05_sensory",
      context: "house_focus",
      placement: "side_panel",
      weights: 1,
      text: "Picture {{house.visual_elements.0}}. That's the scene. Now imagine {{planet.visual_elements.0}} moving through it with {{sign.visual_mappings.motion}} motion.",
      variables: [
        "house.visual_elements.0",
        "planet.visual_elements.0",
        "sign.visual_mappings.motion"
      ]
    },
    // Visual overlay - more cinematic
    {
      id: "visual_fusion_02_motion",
      context: "visual_overlay",
      placement: "spiral_corner_caption",
      weights: 2,
      text: "Watch as {{sign.visual_mappings.motion}} motion carries {{planet.name}} through the {{sign.visual_mappings.shape}} geometry of {{sign.name}}.",
      variables: [
        "sign.visual_mappings.motion",
        "planet.name",
        "sign.visual_mappings.shape",
        "sign.name"
      ]
    },
    {
      id: "visual_fusion_03_textural",
      context: "visual_overlay",
      placement: "spiral_corner_caption",
      weights: 1,
      text: "{{sign.visual_mappings.texture}} surfaces, {{sign.visual_mappings.palette}} hues, {{sign.visual_mappings.rhythm}} pacing—this is how {{planet.archetype_name}} expresses through {{sign.archetype_name}}.",
      variables: [
        "sign.visual_mappings.texture",
        "sign.visual_mappings.palette",
        "sign.visual_mappings.rhythm",
        "planet.archetype_name",
        "sign.archetype_name"
      ]
    },
    // More reflective prompts
    {
      id: "reflective_prompt_03_noticing",
      context: "any",
      placement: "sidebar_prompt",
      weights: 2,
      text: "Notice when {{house.essence}} calls your attention. How does {{planet.archetype_name}} show up in those moments?",
      variables: [
        "house.essence",
        "planet.archetype_name"
      ]
    },
    {
      id: "reflective_prompt_04_integration",
      context: "any",
      placement: "sidebar_prompt",
      weights: 1,
      text: "How might {{planet.essence}} and {{house.essence}} collaborate when filtered through {{sign.name}}'s lens?",
      variables: [
        "planet.essence",
        "house.essence",
        "sign.name"
      ]
    },
    // Constellation share - poetic synthesis
    {
      id: "synthesis_poem_02",
      context: "constellation_share",
      placement: "share_poem",
      weights: 1,
      text: "Your chart: where {{planet.archetype_figure_name}} walks through {{house.name}}, where {{aspect.type}} lines connect what seemed separate, where {{sign.archetype_name}} colors everything you touch.",
      variables: [
        "planet.archetype_figure_name",
        "house.name",
        "aspect.type",
        "sign.archetype_name"
      ]
    },
    {
      id: "synthesis_poem_03",
      context: "constellation_share",
      placement: "share_poem",
      weights: 1,
      text: "Not a map of who you are, but a language for noticing: {{planet.essence}} meeting {{house.essence}}, {{aspect.type}} creating dialogue, {{sign.element}} breathing through it all.",
      variables: [
        "planet.essence",
        "house.essence",
        "aspect.type",
        "sign.element"
      ]
    }
  ],
  ui_hints: {
    hover_interaction: {
      mode: "tooltip",
      trigger: "hover",
      delay_ms: 120,
      placement: "auto",
      style: {
        bg: "rgba(6,6,12,0.88)",
        border: "1px solid rgba(255,255,255,0.12)",
        shadow: "0 12px 40px rgba(0,0,0,0.45)",
        backdropBlur: "12px",
        textColor: "#EFEFF6"
      }
    },
    highlight_interaction: {
      mode: "onHover",
      textStyle: {
        color: "currentColor",
        underline: true,
        underlineOffset: 3
      },
      glow: {
        enabled: true,
        color_from_data: true,
        fallback_color: "#9B5DE5"
      }
    }
  },
  rendering_rules: {
    variable_color_binding: [
      { when: "planet", color_from: "house.color" },
      { when: "aspect", color_from: "aspects_library[aspect.type].color" },
      { when: "sign", color_from: "sign.visual_mappings.palette" }
    ],
    fallbacks: {
      missing_path: "—",
      empty_list_joiner: ", "
    }
  }
};